import { Router, type IRouter } from "express";
import { getDepartments, createDepartment } from "../services/settings";

const router: IRouter = Router();

router.get("/departments", async (_req, res, next) => {
  try {
    const data = await getDepartments();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/departments", async (req, res, next) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      res.status(400).json({ error: "Missing name or code" });
      return;
    }
    const created = await createDepartment({ name, code });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

export default router;
