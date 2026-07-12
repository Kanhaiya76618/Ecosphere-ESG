// Business logic for the gamification module; routes stay thin.
import { and, eq, sql } from "drizzle-orm";
import {
  db,
  badgesTable,
  challengeParticipationsTable,
  employeeBadgesTable,
  xpLedgerTable,
} from "../db";

export async function xpBalance(employeeId: number): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${xpLedgerTable.delta}), 0)::int` })
    .from(xpLedgerTable)
    .where(eq(xpLedgerTable.employeeId, employeeId));
  return row?.total ?? 0;
}

export async function completedChallengeCount(
  employeeId: number,
): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(challengeParticipationsTable)
    .where(
      and(
        eq(challengeParticipationsTable.employeeId, employeeId),
        eq(challengeParticipationsTable.approvalStatus, "approved"),
      ),
    );
  return row?.count ?? 0;
}

// Badge auto-award: evaluate every unlock rule for the employee after any XP
// change and insert missing employee_badges rows. Returns newly awarded badges.
export async function evaluateBadges(employeeId: number) {
  const [total, completed, allBadges] = await Promise.all([
    xpBalance(employeeId),
    completedChallengeCount(employeeId),
    db.select().from(badgesTable),
  ]);
  const newlyAwarded = [];
  for (const badge of allBadges) {
    const rule = badge.unlockRule;
    const unlocked =
      rule.type === "xp_total"
        ? total >= rule.threshold
        : completed >= rule.count;
    if (!unlocked) continue;
    const inserted = await db
      .insert(employeeBadgesTable)
      .values({ employeeId, badgeId: badge.id })
      .onConflictDoNothing()
      .returning();
    if (inserted.length > 0) newlyAwarded.push(badge);
  }
  return newlyAwarded;
}
