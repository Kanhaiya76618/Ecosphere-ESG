import { desc } from "drizzle-orm";
import { db, reportsTable, type InsertReport } from "../db";

export async function getReports() {
  return db
    .select()
    .from(reportsTable)
    .orderBy(desc(reportsTable.createdAt));
}

export async function createReport(data: InsertReport) {
  const [report] = await db
    .insert(reportsTable)
    .values(data)
    .returning();
  return report;
}
