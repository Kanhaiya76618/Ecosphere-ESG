import { db, carbonTransactionsTable, environmentalGoalsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

export async function getTransactions() {
  return db.select().from(carbonTransactionsTable).orderBy(desc(carbonTransactionsTable.createdAt));
}

export async function createTransaction(data: any) {
  const [newTx] = await db.insert(carbonTransactionsTable).values(data).returning();
  return newTx;
}

export async function getGoals() {
  return db.select().from(environmentalGoalsTable);
}
