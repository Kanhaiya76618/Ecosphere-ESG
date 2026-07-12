import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { departmentsTable, employeesTable } from "./gamification";

// ── ESG Configurations (Weights) ─────────────────────────────────────────────
export const esgConfigurationsTable = pgTable("esg_configurations", {
  id: serial("id").primaryKey(),
  envWeight: integer("env_weight").notNull().default(40),
  socWeight: integer("soc_weight").notNull().default(30),
  govWeight: integer("gov_weight").notNull().default(30),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type ESGConfiguration = typeof esgConfigurationsTable.$inferSelect;

// ── ESG Score History snapshots ──────────────────────────────────────────────
export const esgScoreHistoryTable = pgTable("esg_score_history", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // "YYYY-MM" monthly snapshots
  environmentalScore: doublePrecision("environmental_score").notNull(),
  socialScore: doublePrecision("social_score").notNull(),
  governanceScore: doublePrecision("governance_score").notNull(),
  overallScore: doublePrecision("overall_score").notNull(),
  scope: text("scope").notNull(), // "Company-wide" | "Department"
  departmentId: integer("department_id")
    .references(() => departmentsTable.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type ESGScoreHistory = typeof esgScoreHistoryTable.$inferSelect;

// ── Environmental Goals ──────────────────────────────────────────────────────
export const environmentalGoalsTable = pgTable("environmental_goals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  metricType: text("metric_type").notNull(), // "Emissions (tCO2e)" | "Energy (kWh)" | ...
  targetValue: doublePrecision("target_value").notNull(),
  currentValue: doublePrecision("current_value").notNull(),
  progress: doublePrecision("progress").notNull(),
  unit: text("unit").notNull(),
  deadline: text("deadline").notNull(), // "YYYY-MM-DD"
  departmentId: integer("department_id")
    .references(() => departmentsTable.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type EnvironmentalGoal = typeof environmentalGoalsTable.$inferSelect;

// ── Carbon Transactions ──────────────────────────────────────────────────────
export const carbonTransactionsTable = pgTable("carbon_transactions", {
  id: serial("id").primaryKey(),
  fuelTypeId: text("fuel_type_id").notNull(),
  fuelType: text("fuel_type").notNull(),
  departmentId: integer("department_id")
    .notNull()
    .references(() => departmentsTable.id),
  quantity: doublePrecision("quantity").notNull(),
  calculatedTco2e: doublePrecision("calculated_tco2e").notNull(),
  limit: doublePrecision("limit").notNull(),
  deadline: text("deadline").notNull(),
  status: text("status").notNull(), // "On Track" | "At Risk" | "Overdue"
  sourceType: text("source_type").notNull(), // "Manual" | "Auto-calculated"
  progress: doublePrecision("progress").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type CarbonTransaction = typeof carbonTransactionsTable.$inferSelect;

// ── ESG Policies ─────────────────────────────────────────────────────────────
export const esgPoliciesTable = pgTable("esg_policies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  version: text("version").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull(), // "Draft" | "Active" | "Review" | "Retired"
  effectiveDate: text("effective_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type ESGPolicy = typeof esgPoliciesTable.$inferSelect;

// ── Policy Acknowledgements ──────────────────────────────────────────────────
export const policyAcknowledgementsTable = pgTable("policy_acknowledgements", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id")
    .notNull()
    .references(() => esgPoliciesTable.id),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employeesTable.id),
  status: text("status").notNull(), // "Acknowledged" | "Pending"
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type PolicyAcknowledgement = typeof policyAcknowledgementsTable.$inferSelect;

// ── Audits ───────────────────────────────────────────────────────────────────
export const auditsTable = pgTable("audits", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  auditor: text("auditor").notNull(),
  score: text("score").notNull(),
  status: text("status").notNull(), // "Pending" | "In Progress" | "Completed"
  reportFile: text("report_file"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type Audit = typeof auditsTable.$inferSelect;

// ── Compliance Issues ────────────────────────────────────────────────────────
export const complianceIssuesTable = pgTable("compliance_issues", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  severity: text("severity").notNull(), // "Low" | "Medium" | "High"
  departmentId: integer("department_id")
    .notNull()
    .references(() => departmentsTable.id),
  dueDate: text("due_date").notNull(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => employeesTable.id),
  description: text("description").notNull(),
  status: text("status").notNull(), // "Open" | "In Progress" | "Resolved"
  isOverdue: boolean("is_overdue").notNull().default(false),
  relatedAuditId: integer("related_audit_id")
    .references(() => auditsTable.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type ComplianceIssue = typeof complianceIssuesTable.$inferSelect;
