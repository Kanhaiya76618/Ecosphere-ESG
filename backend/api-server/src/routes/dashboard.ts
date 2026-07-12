import { Router, type IRouter } from "express";
import {
  getOrgESGSummary,
  getESGScoreHistory,
  getDepartmentScores,
  getRecentTransactions,
  createScoreSnapshot,
} from "../services/dashboard";
import { db, esgConfigurationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// GET ESG Summary / calculation (Prompt 2 & 3 & 12)
router.get("/summary", async (req, res, next) => {
  try {
    const deptId = req.query.departmentId ? Number(req.query.departmentId) : undefined;
    const summary = await getOrgESGSummary(deptId);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

// GET Trail score history (Prompt 1 & 6)
router.get("/history", async (req, res, next) => {
  try {
    const deptId = req.query.departmentId ? Number(req.query.departmentId) : undefined;
    const history = await getESGScoreHistory(deptId);
    res.json(history);
  } catch (err) {
    next(err);
  }
});

// GET Department rollup list (Prompt 3 & 7)
router.get("/departments", async (_req, res, next) => {
  try {
    const scores = await getDepartmentScores();
    res.json(scores);
  } catch (err) {
    next(err);
  }
});

// GET Recent Carbon Transactions (Prompt 8 & 9)
router.get("/transactions", async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 4;
    const txs = await getRecentTransactions(limit);
    res.json(txs);
  } catch (err) {
    next(err);
  }
});

// POST Manual Score snapshot run (Prompt 1)
router.post("/snapshot", async (req, res, next) => {
  try {
    const dateStr = req.body.date || new Date().toISOString().slice(0, 7); // e.g. "2026-07"
    await createScoreSnapshot(dateStr);
    res.json({ success: true, message: `Snapshot created for ${dateStr}` });
  } catch (err) {
    next(err);
  }
});

// GET Config weights (Prompt 2)
router.get("/config", async (_req, res, next) => {
  try {
    const configs = await db.select().from(esgConfigurationsTable).limit(1);
    const config = configs[0] || { envWeight: 40, socWeight: 30, govWeight: 30 };
    res.json(config);
  } catch (err) {
    next(err);
  }
});

// POST update configs (Prompt 2)
router.post("/config", async (req, res, next) => {
  try {
    const { envWeight, socWeight, govWeight } = req.body;
    const existing = await db.select().from(esgConfigurationsTable).limit(1);
    if (existing.length > 0) {
      await db.update(esgConfigurationsTable)
        .set({ envWeight, socWeight, govWeight })
        .where(eq(esgConfigurationsTable.id, existing[0].id));
    } else {
      await db.insert(esgConfigurationsTable).values({ envWeight, socWeight, govWeight });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
