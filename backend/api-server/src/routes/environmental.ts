import { Router, type IRouter } from "express";
import { getTransactions, createTransaction, getGoals } from "../services/environmental";

const router: IRouter = Router();

router.get("/transactions", async (_req, res, next) => {
  try {
    const txs = await getTransactions();
    res.json(txs);
  } catch (err) {
    next(err);
  }
});

router.post("/transactions", async (req, res, next) => {
  try {
    const newTx = await createTransaction(req.body);
    res.status(201).json(newTx);
  } catch (err) {
    next(err);
  }
});

router.get("/goals", async (_req, res, next) => {
  try {
    const goals = await getGoals();
    res.json(goals);
  } catch (err) {
    next(err);
  }
});

export default router;
