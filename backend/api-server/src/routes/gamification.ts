import { Router, type IRouter } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  db,
  departmentsTable,
  employeesTable,
  challengesTable,
  challengeParticipationsTable,
  employeeBadgesTable,
  badgesTable,
  rewardsTable,
  rewardRedemptionsTable,
  xpLedgerTable,
  insertChallengeSchema,
  updateChallengeSchema,
  type ChallengeStatus,
} from "../db";
import {
  xpBalance,
  evaluateBadges,
} from "../services/gamification";
import { authenticateToken } from "./auth";

const router: IRouter = Router();

// GET current user rank (Prompt 9)
router.get("/me/rank", authenticateToken, async (req: any, res, next) => {
  try {
    const user = req.user;
    const allEmployees = await db.select().from(employeesTable).orderBy(desc(employeesTable.xp));
    const rank = allEmployees.findIndex(e => e.id === user.id) + 1;
    res.json({
      rank,
      xp: user.xp,
      level: user.level,
    });
  } catch (err) {
    next(err);
  }
});

// ---------- reference data ----------

router.get("/employees", async (_req, res) => {
  const rows = await db
    .select({
      id: employeesTable.id,
      name: employeesTable.name,
      email: employeesTable.email,
      role: employeesTable.role,
      department: departmentsTable.name,
      departmentId: employeesTable.departmentId,
    })
    .from(employeesTable)
    .innerJoin(
      departmentsTable,
      eq(employeesTable.departmentId, departmentsTable.id),
    )
    .orderBy(employeesTable.id);
  res.json(rows);
});

router.get("/employees/:id/summary", async (req, res) => {
  const employeeId = Number(req.params.id);
  const [balance, badges] = await Promise.all([
    xpBalance(employeeId),
    db
      .select({ badgeId: employeeBadgesTable.badgeId })
      .from(employeeBadgesTable)
      .where(eq(employeeBadgesTable.employeeId, employeeId)),
  ]);
  res.json({ employeeId, balance, badgeIds: badges.map((b) => b.badgeId) });
});

// ---------- challenges: CRUD + lifecycle ----------

router.get("/challenges", async (_req, res) => {
  const challenges = await db
    .select()
    .from(challengesTable)
    .orderBy(desc(challengesTable.createdAt));
  const participations = await db
    .select({
      id: challengeParticipationsTable.id,
      challengeId: challengeParticipationsTable.challengeId,
      employeeId: challengeParticipationsTable.employeeId,
      employeeName: employeesTable.name,
      progress: challengeParticipationsTable.progress,
      proof: challengeParticipationsTable.proof,
      approvalStatus: challengeParticipationsTable.approvalStatus,
      xpAwarded: challengeParticipationsTable.xpAwarded,
    })
    .from(challengeParticipationsTable)
    .innerJoin(
      employeesTable,
      eq(challengeParticipationsTable.employeeId, employeesTable.id),
    );
  res.json(
    challenges.map((c) => ({
      ...c,
      participations: participations.filter((p) => p.challengeId === c.id),
    })),
  );
});

router.post("/challenges", async (req, res) => {
  const parsed = insertChallengeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db
    .insert(challengesTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(created);
});

router.patch("/challenges/:id", async (req, res) => {
  const parsed = updateChallengeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [updated] = await db
    .update(challengesTable)
    .set(parsed.data)
    .where(eq(challengesTable.id, Number(req.params.id)))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }
  res.json(updated);
});

const VALID_TRANSITIONS: Record<ChallengeStatus, ChallengeStatus[]> = {
  draft: ["active", "archived"],
  active: ["under_review", "archived"],
  under_review: ["completed", "archived"],
  completed: ["archived"],
  archived: [],
};

router.post("/challenges/:id/transition", async (req, res) => {
  const target = req.body?.status as ChallengeStatus | undefined;
  if (!target || !(target in VALID_TRANSITIONS)) {
    res.status(400).json({ error: `Invalid target status: ${target}` });
    return;
  }
  const [challenge] = await db
    .select()
    .from(challengesTable)
    .where(eq(challengesTable.id, Number(req.params.id)));
  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }
  if (!VALID_TRANSITIONS[challenge.status].includes(target)) {
    res.status(400).json({
      error: `Cannot transition from "${challenge.status}" to "${target}". Allowed: ${VALID_TRANSITIONS[challenge.status].join(", ") || "none"}`,
    });
    return;
  }
  const [updated] = await db
    .update(challengesTable)
    .set({ status: target })
    .where(eq(challengesTable.id, challenge.id))
    .returning();
  res.json(updated);
});

// ---------- participations ----------

router.post("/challenges/:id/join", async (req, res) => {
  const challengeId = Number(req.params.id);
  const employeeId = Number(req.body?.employeeId);
  if (!employeeId) {
    res.status(400).json({ error: "employeeId is required" });
    return;
  }
  const [challenge] = await db
    .select()
    .from(challengesTable)
    .where(eq(challengesTable.id, challengeId));
  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }
  if (challenge.status !== "active") {
    res.status(400).json({ error: "Only active challenges can be joined" });
    return;
  }
  const inserted = await db
    .insert(challengeParticipationsTable)
    .values({ challengeId, employeeId })
    .onConflictDoNothing()
    .returning();
  if (inserted.length === 0) {
    res.status(400).json({ error: "Already joined this challenge" });
    return;
  }
  res.status(201).json(inserted[0]);
});

router.patch("/participations/:id", async (req, res) => {
  const { progress, proof } = req.body ?? {};
  const patch: Partial<{ progress: number; proof: string }> = {};
  if (progress !== undefined) {
    const p = Number(progress);
    if (Number.isNaN(p) || p < 0 || p > 100) {
      res.status(400).json({ error: "progress must be 0-100" });
      return;
    }
    patch.progress = p;
  }
  if (proof !== undefined) patch.proof = String(proof);
  if (Object.keys(patch).length === 0) {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }
  const [updated] = await db
    .update(challengeParticipationsTable)
    .set(patch)
    .where(eq(challengeParticipationsTable.id, Number(req.params.id)))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Participation not found" });
    return;
  }
  res.json(updated);
});

router.patch("/participations/:id/review", async (req, res) => {
  const decision = req.body?.decision as "approved" | "rejected" | undefined;
  if (decision !== "approved" && decision !== "rejected") {
    res.status(400).json({ error: 'decision must be "approved" or "rejected"' });
    return;
  }
  const [participation] = await db
    .select()
    .from(challengeParticipationsTable)
    .where(eq(challengeParticipationsTable.id, Number(req.params.id)));
  if (!participation) {
    res.status(404).json({ error: "Participation not found" });
    return;
  }
  if (participation.approvalStatus !== "pending") {
    res.status(400).json({ error: "Participation already reviewed" });
    return;
  }
  const [challenge] = await db
    .select()
    .from(challengesTable)
    .where(eq(challengesTable.id, participation.challengeId));
  const xp = decision === "approved" ? (challenge?.xp ?? 0) : 0;

  const [updated] = await db
    .update(challengeParticipationsTable)
    .set({ approvalStatus: decision, xpAwarded: xp })
    .where(eq(challengeParticipationsTable.id, participation.id))
    .returning();

  let newBadges: { id: number; name: string }[] = [];
  if (decision === "approved" && xp > 0) {
    await db.insert(xpLedgerTable).values({
      employeeId: participation.employeeId,
      delta: xp,
      reason: "challenge_approved",
      refId: participation.challengeId,
    });
    newBadges = await evaluateBadges(participation.employeeId);
  }
  res.json({ participation: updated, xpAwarded: xp, newBadges });
});

// ---------- badges ----------

router.get("/badges", async (_req, res) => {
  const [badges, earned] = await Promise.all([
    db.select().from(badgesTable).orderBy(badgesTable.id),
    db
      .select({
        badgeId: employeeBadgesTable.badgeId,
        employeeId: employeeBadgesTable.employeeId,
        employeeName: employeesTable.name,
        awardedAt: employeeBadgesTable.awardedAt,
      })
      .from(employeeBadgesTable)
      .innerJoin(
        employeesTable,
        eq(employeeBadgesTable.employeeId, employeesTable.id),
      ),
  ]);
  res.json(
    badges.map((b) => ({
      ...b,
      earnedBy: earned.filter((e) => e.badgeId === b.id),
    })),
  );
});

// ---------- rewards ----------

router.get("/rewards", async (_req, res) => {
  const rows = await db.select().from(rewardsTable).orderBy(rewardsTable.pointsRequired);
  res.json(rows);
});

router.post("/rewards/:id/redeem", async (req, res) => {
  const employeeId = Number(req.body?.employeeId);
  if (!employeeId) {
    res.status(400).json({ error: "employeeId is required" });
    return;
  }
  const rewardId = Number(req.params.id);
  const [reward] = await db
    .select()
    .from(rewardsTable)
    .where(eq(rewardsTable.id, rewardId));
  if (!reward) {
    res.status(404).json({ error: "Reward not found" });
    return;
  }
  if (reward.status !== "active" || reward.stock <= 0) {
    res.status(400).json({ error: `"${reward.name}" is out of stock` });
    return;
  }
  const balance = await xpBalance(employeeId);
  if (balance < reward.pointsRequired) {
    res.status(400).json({
      error: `Not enough points: need ${reward.pointsRequired}, you have ${balance}`,
    });
    return;
  }
  // Guard the decrement so concurrent redemptions can't take stock below zero.
  const decremented = await db
    .update(rewardsTable)
    .set({ stock: sql`${rewardsTable.stock} - 1` })
    .where(and(eq(rewardsTable.id, rewardId), sql`${rewardsTable.stock} > 0`))
    .returning();
  if (decremented.length === 0) {
    res.status(400).json({ error: `"${reward.name}" is out of stock` });
    return;
  }
  const [redemption] = await db
    .insert(rewardRedemptionsTable)
    .values({ rewardId, employeeId, pointsSpent: reward.pointsRequired })
    .returning();
  await db.insert(xpLedgerTable).values({
    employeeId,
    delta: -reward.pointsRequired,
    reason: "reward_redeemed",
    refId: rewardId,
  });
  res.json({
    redemption,
    newBalance: balance - reward.pointsRequired,
  });
});

// ---------- leaderboards ----------

router.get("/leaderboard", async (_req, res) => {
  const employees = await db
    .select({
      id: employeesTable.id,
      name: employeesTable.name,
      department: departmentsTable.name,
      xp: sql<number>`coalesce(sum(${xpLedgerTable.delta}), 0)::int`,
    })
    .from(employeesTable)
    .innerJoin(
      departmentsTable,
      eq(employeesTable.departmentId, departmentsTable.id),
    )
    .leftJoin(xpLedgerTable, eq(xpLedgerTable.employeeId, employeesTable.id))
    .groupBy(employeesTable.id, employeesTable.name, departmentsTable.name)
    .orderBy(sql`coalesce(sum(${xpLedgerTable.delta}), 0) desc`);

  const departments = await db
    .select({
      id: departmentsTable.id,
      name: departmentsTable.name,
      xp: sql<number>`coalesce(sum(${xpLedgerTable.delta}), 0)::int`,
      members: sql<number>`count(distinct ${employeesTable.id})::int`,
    })
    .from(departmentsTable)
    .innerJoin(
      employeesTable,
      eq(employeesTable.departmentId, departmentsTable.id),
    )
    .leftJoin(xpLedgerTable, eq(xpLedgerTable.employeeId, employeesTable.id))
    .groupBy(departmentsTable.id, departmentsTable.name)
    .orderBy(sql`coalesce(sum(${xpLedgerTable.delta}), 0) desc`);

  res.json({
    employees: employees.map((e, i) => ({ ...e, rank: i + 1 })),
    departments: departments.map((d: object, i: number) => ({
      ...d,
      rank: i + 1,
    })),
  });
});

export default router;
