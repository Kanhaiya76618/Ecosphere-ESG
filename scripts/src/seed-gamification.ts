import {
  db,
  pool,
  departmentsTable,
  employeesTable,
  challengesTable,
  challengeParticipationsTable,
  badgesTable,
  employeeBadgesTable,
  rewardsTable,
  rewardRedemptionsTable,
  xpLedgerTable,
} from "@workspace/db";

async function seed() {
  console.log("Clearing gamification tables...");
  await db.delete(rewardRedemptionsTable);
  await db.delete(employeeBadgesTable);
  await db.delete(xpLedgerTable);
  await db.delete(challengeParticipationsTable);
  await db.delete(challengesTable);
  await db.delete(badgesTable);
  await db.delete(rewardsTable);
  await db.delete(employeesTable);
  await db.delete(departmentsTable);

  console.log("Seeding departments...");
  const depts = await db
    .insert(departmentsTable)
    .values([
      { name: "IT", code: "IT" },
      { name: "HR", code: "HR" },
      { name: "Logistics", code: "LOG" },
    ])
    .returning();
  const [it, hr, log] = depts;

  console.log("Seeding employees...");
  const employees = await db
    .insert(employeesTable)
    .values([
      { name: "Rahul Sharma", email: "rahul@ecosphere.io", departmentId: it!.id },
      { name: "Aman Gupta", email: "aman@ecosphere.io", departmentId: it!.id },
      { name: "Priya Patel", email: "priya@ecosphere.io", departmentId: hr!.id, role: "manager" },
      { name: "Vikram Singh", email: "vikram@ecosphere.io", departmentId: log!.id },
      { name: "Neha Reddy", email: "neha@ecosphere.io", departmentId: log!.id },
      { name: "Sanya Mirza", email: "sanya@ecosphere.io", departmentId: hr!.id },
      { name: "Arjun Nair", email: "arjun@ecosphere.io", departmentId: it!.id },
      { name: "Kavita Iyer", email: "kavita@ecosphere.io", departmentId: log!.id },
      { name: "Dev Malhotra", email: "dev@ecosphere.io", departmentId: it!.id },
    ])
    .returning();
  const [rahul, aman, priya, vikram, neha, sanya, arjun, kavita] = employees;

  console.log("Seeding challenges...");
  const challenges = await db
    .insert(challengesTable)
    .values([
      {
        title: "Paperless Month",
        category: "environmental",
        description: "Zero printing for the entire month.",
        xp: 400,
        difficulty: "hard",
        evidenceRequired: "statement",
        status: "draft",
        deadline: new Date(Date.now() + 30 * 864e5).toISOString(),
      },
      {
        title: "Sustainability Sprint",
        category: "environmental",
        description: "Log 5 sustainable actions in a week.",
        xp: 300,
        difficulty: "medium",
        evidenceRequired: "photo",
        status: "active",
        deadline: new Date(Date.now() + 7 * 864e5).toISOString(),
      },
      {
        title: "Car-Free Week",
        category: "environmental",
        description: "Use public transport or cycle for 5 consecutive days.",
        xp: 500,
        difficulty: "hard",
        evidenceRequired: "photo",
        status: "active",
        deadline: new Date(Date.now() + 14 * 864e5).toISOString(),
      },
      {
        title: "Recycle Challenge",
        category: "environmental",
        description: "Properly sort and recycle electronic waste.",
        xp: 150,
        difficulty: "easy",
        evidenceRequired: "photo",
        status: "under_review",
        deadline: new Date(Date.now() + 3 * 864e5).toISOString(),
      },
      {
        title: "Go Green Week",
        category: "environmental",
        description: "Use public transport for 5 consecutive days.",
        xp: 500,
        difficulty: "medium",
        evidenceRequired: "photo",
        status: "completed",
        deadline: new Date(Date.now() - 10 * 864e5).toISOString(),
      },
      {
        title: "Zero Waste Lunch",
        category: "social",
        description: "Bring lunch in reusable containers for two weeks.",
        xp: 200,
        difficulty: "easy",
        evidenceRequired: "photo",
        status: "completed",
        deadline: new Date(Date.now() - 20 * 864e5).toISOString(),
      },
    ])
    .returning();
  const [, sprint, carFree, recycle, goGreen, zeroWaste] = challenges;

  console.log("Seeding participations + XP ledger...");
  // Completed challenges → approved participations + ledger entries
  const approved: {
    challengeId: number;
    employeeId: number;
    xp: number;
    proof: string;
  }[] = [
    { challengeId: goGreen!.id, employeeId: rahul!.id, xp: 500, proof: "transit-pass.jpg" },
    { challengeId: goGreen!.id, employeeId: aman!.id, xp: 500, proof: "bus-tickets.jpg" },
    { challengeId: goGreen!.id, employeeId: priya!.id, xp: 500, proof: "metro-card.jpg" },
    { challengeId: zeroWaste!.id, employeeId: rahul!.id, xp: 200, proof: "lunchbox.jpg" },
    { challengeId: zeroWaste!.id, employeeId: neha!.id, xp: 200, proof: "containers.jpg" },
    { challengeId: zeroWaste!.id, employeeId: vikram!.id, xp: 200, proof: "lunch-photo.jpg" },
    { challengeId: recycle!.id, employeeId: aman!.id, xp: 150, proof: "ewaste-bin.jpg" },
  ];
  for (const a of approved) {
    await db.insert(challengeParticipationsTable).values({
      challengeId: a.challengeId,
      employeeId: a.employeeId,
      progress: 100,
      proof: a.proof,
      approvalStatus: "approved",
      xpAwarded: a.xp,
    });
    await db.insert(xpLedgerTable).values({
      employeeId: a.employeeId,
      delta: a.xp,
      reason: "challenge_approved",
      refId: a.challengeId,
    });
  }

  // Bonus historical XP so the leaderboard has spread
  const bonuses: [number, number][] = [
    [rahul!.id, 1800],
    [aman!.id, 1450],
    [priya!.id, 1100],
    [vikram!.id, 950],
    [neha!.id, 700],
    [sanya!.id, 450],
    [arjun!.id, 300],
    [kavita!.id, 150],
  ];
  for (const [employeeId, delta] of bonuses) {
    await db.insert(xpLedgerTable).values({
      employeeId,
      delta,
      reason: "csr_activity",
      refId: null,
    });
  }

  // In-flight participations (pending review) on active/under_review challenges
  await db.insert(challengeParticipationsTable).values([
    {
      challengeId: sprint!.id,
      employeeId: sanya!.id,
      progress: 80,
      proof: "actions-log.pdf",
      approvalStatus: "pending",
    },
    {
      challengeId: sprint!.id,
      employeeId: arjun!.id,
      progress: 40,
      approvalStatus: "pending",
    },
    {
      challengeId: carFree!.id,
      employeeId: kavita!.id,
      progress: 60,
      proof: "cycle-selfie.jpg",
      approvalStatus: "pending",
    },
    {
      challengeId: recycle!.id,
      employeeId: neha!.id,
      progress: 100,
      proof: "recycling-receipt.jpg",
      approvalStatus: "pending",
    },
  ]);

  console.log("Seeding badges...");
  const badgeRows = await db
    .insert(badgesTable)
    .values([
      {
        name: "Eco Starter",
        description: "Earn your first 500 XP.",
        unlockRule: { type: "xp_total", threshold: 500 },
        icon: "Leaf",
      },
      {
        name: "Eco Warrior",
        description: "Reach 1,500 total XP.",
        unlockRule: { type: "xp_total", threshold: 1500 },
        icon: "Shield",
      },
      {
        name: "Green Hero",
        description: "Reach 3,000 total XP.",
        unlockRule: { type: "xp_total", threshold: 3000 },
        icon: "Award",
      },
      {
        name: "CSR Champion",
        description: "Complete 3 approved challenges.",
        unlockRule: { type: "challenges_completed", count: 3 },
        icon: "Heart",
      },
    ])
    .returning();

  // Retro-award badges consistent with seeded XP (mirrors runtime auto-award)
  console.log("Retro-awarding badges...");
  for (const emp of employees) {
    const ledger = await db.select().from(xpLedgerTable);
    const total = ledger
      .filter((l) => l.employeeId === emp.id)
      .reduce((s, l) => s + l.delta, 0);
    const parts = await db.select().from(challengeParticipationsTable);
    const completed = parts.filter(
      (p) => p.employeeId === emp.id && p.approvalStatus === "approved",
    ).length;
    for (const b of badgeRows) {
      const rule = b.unlockRule;
      const unlocked =
        rule.type === "xp_total"
          ? total >= rule.threshold
          : completed >= rule.count;
      if (unlocked) {
        await db
          .insert(employeeBadgesTable)
          .values({ employeeId: emp.id, badgeId: b.id })
          .onConflictDoNothing();
      }
    }
  }

  console.log("Seeding rewards...");
  await db.insert(rewardsTable).values([
    {
      name: "EcoSphere Coffee Mug",
      description: "Ceramic mug with the EcoSphere logo.",
      pointsRequired: 500,
      stock: 20,
      status: "active",
    },
    {
      name: "Amazon Voucher ($25)",
      description: "Digital gift card, delivered by email.",
      pointsRequired: 1500,
      stock: 10,
      status: "active",
    },
    {
      name: "1 Extra Paid Leave",
      description: "One additional day of paid leave.",
      pointsRequired: 3000,
      stock: 5,
      status: "active",
    },
    {
      name: "Premium Gym Membership",
      description: "3-month gym membership.",
      pointsRequired: 5000,
      stock: 0,
      status: "active",
    },
  ]);

  console.log("Seed complete.");
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
