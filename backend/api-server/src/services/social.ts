import { db, challengeParticipationsTable, employeesTable } from "@workspace/db";

export async function getCSRParticipations() {
  return db.select().from(challengeParticipationsTable);
}

export async function getEmployees() {
  return db.select().from(employeesTable);
}
