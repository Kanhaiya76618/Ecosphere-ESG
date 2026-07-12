import { db, auditsTable, complianceIssuesTable, esgPoliciesTable, policyAcknowledgementsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

export async function getPolicies() {
  return db.select().from(esgPoliciesTable);
}

export async function getPolicyAcknowledgements() {
  return db.select().from(policyAcknowledgementsTable);
}

export async function getAudits() {
  return db.select().from(auditsTable).orderBy(desc(auditsTable.createdAt));
}

export async function createAudit(data: any) {
  const [newAudit] = await db.insert(auditsTable).values(data).returning();
  return newAudit;
}

export async function getComplianceIssues() {
  return db.select().from(complianceIssuesTable).orderBy(desc(complianceIssuesTable.createdAt));
}

export async function createComplianceIssue(data: any) {
  const [newIssue] = await db.insert(complianceIssuesTable).values(data).returning();
  return newIssue;
}
