import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { departmentsTable } from "./gamification";

export const reportsTable = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  framework: text("framework").notNull(),
  dateRange: text("date_range").notNull(),
  pillar: text("pillar").notNull(),
  departmentId: integer("department_id")
    .references(() => departmentsTable.id),
  type: text("type").notNull(), // PDF, Excel, CSV
  size: text("size").notNull(), // e.g., "1.2 MB"
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const insertReportSchema = createInsertSchema(reportsTable).omit({
  id: true,
  createdAt: true,
});

export type Report = typeof reportsTable.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
