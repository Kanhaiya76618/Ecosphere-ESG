import {
  pgTable,
  pgEnum,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const challengeStatusEnum = pgEnum("challenge_status", [
  "draft",
  "active",
  "under_review",
  "completed",
  "archived",
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
]);

export const rewardStatusEnum = pgEnum("reward_status", [
  "active",
  "inactive",
]);

export const departmentsTable = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
});

export const employeesTable = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  departmentId: integer("department_id")
    .notNull()
    .references(() => departmentsTable.id),
  role: text("role").notNull().default("employee"),
  passwordHash: text("password_hash").notNull().default(""),
  avatarColor: text("avatar_color").notNull().default("#166534"),
  avatarInitials: text("avatar_initials").notNull().default("JD"),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  status: text("status").notNull().default("Active"),
  lastLoginDate: text("last_login_date"),
});

export const challengesTable = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull().default("environmental"),
  description: text("description").notNull().default(""),
  xp: integer("xp").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  evidenceRequired: text("evidence_required").notNull().default("photo"),
  deadline: timestamp("deadline", { withTimezone: true, mode: "string" }),
  status: challengeStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const challengeParticipationsTable = pgTable(
  "challenge_participations",
  {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id")
      .notNull()
      .references(() => challengesTable.id),
    employeeId: integer("employee_id")
      .notNull()
      .references(() => employeesTable.id),
    progress: integer("progress").notNull().default(0),
    proof: text("proof"),
    approvalStatus: approvalStatusEnum("approval_status")
      .notNull()
      .default("pending"),
    xpAwarded: integer("xp_awarded").notNull().default(0),
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("participation_unique").on(t.challengeId, t.employeeId)],
);

// unlock_rule examples:
//   {"type":"xp_total","threshold":500}
//   {"type":"challenges_completed","count":3}
export const badgesTable = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  unlockRule: jsonb("unlock_rule")
    .$type<
      | { type: "xp_total"; threshold: number }
      | { type: "challenges_completed"; count: number }
    >()
    .notNull(),
  icon: text("icon").notNull().default("Award"),
});

export const employeeBadgesTable = pgTable(
  "employee_badges",
  {
    id: serial("id").primaryKey(),
    employeeId: integer("employee_id")
      .notNull()
      .references(() => employeesTable.id),
    badgeId: integer("badge_id")
      .notNull()
      .references(() => badgesTable.id),
    awardedAt: timestamp("awarded_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("employee_badge_unique").on(t.employeeId, t.badgeId)],
);

export const rewardsTable = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  pointsRequired: integer("points_required").notNull(),
  stock: integer("stock").notNull().default(0),
  status: rewardStatusEnum("status").notNull().default("active"),
});

export const rewardRedemptionsTable = pgTable("reward_redemptions", {
  id: serial("id").primaryKey(),
  rewardId: integer("reward_id")
    .notNull()
    .references(() => rewardsTable.id),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employeesTable.id),
  pointsSpent: integer("points_spent").notNull(),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// XP balances are ALWAYS computed as SUM(delta) over this ledger.
export const xpLedgerTable = pgTable("xp_ledger", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employeesTable.id),
  delta: integer("delta").notNull(),
  reason: text("reason").notNull(),
  refId: integer("ref_id"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const insertDepartmentSchema = createInsertSchema(
  departmentsTable,
).omit({ id: true });
export const insertEmployeeSchema = createInsertSchema(employeesTable).omit({
  id: true,
});
export const insertChallengeSchema = createInsertSchema(challengesTable).omit({
  id: true,
  createdAt: true,
  status: true,
});
export const updateChallengeSchema = insertChallengeSchema.partial();
export const insertBadgeSchema = createInsertSchema(badgesTable).omit({
  id: true,
});
export const insertRewardSchema = createInsertSchema(rewardsTable).omit({
  id: true,
});

export type Department = typeof departmentsTable.$inferSelect;
export type Employee = typeof employeesTable.$inferSelect;
export type Challenge = typeof challengesTable.$inferSelect;
export type ChallengeParticipation =
  typeof challengeParticipationsTable.$inferSelect;
export type Badge = typeof badgesTable.$inferSelect;
export type EmployeeBadge = typeof employeeBadgesTable.$inferSelect;
export type Reward = typeof rewardsTable.$inferSelect;
export type RewardRedemption = typeof rewardRedemptionsTable.$inferSelect;
export type XpLedgerEntry = typeof xpLedgerTable.$inferSelect;

export type ChallengeStatus = Challenge["status"];
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
