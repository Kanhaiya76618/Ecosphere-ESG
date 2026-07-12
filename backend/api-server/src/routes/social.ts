import { Router, type IRouter } from "express";
import { getCSRParticipations, getEmployees } from "../services/social";

const router: IRouter = Router();

router.get("/participations", async (_req, res, next) => {
  try {
    const parts = await getCSRParticipations();
    res.json(parts);
  } catch (err) {
    next(err);
  }
});

router.get("/employees", async (_req, res, next) => {
  try {
    const emps = await getEmployees();
    res.json(emps);
  } catch (err) {
    next(err);
  }
});

export default router;
