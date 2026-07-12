import { Router, type IRouter } from "express";
import { getReports, createReport } from "../services/reports";

const router: IRouter = Router();

router.get("/", async (_req, res, next) => {
  try {
    const data = await getReports();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/generate", async (req, res, next) => {
  try {
    const { framework, dateRange, pillar, departmentId, type } = req.body;
    if (!framework || !dateRange || !pillar || !type) {
      res.status(400).json({ error: "Missing required fields: framework, dateRange, pillar, type" });
      return;
    }

    // Generate simulated report size and title
    const randomSize = `${(Math.random() * 3 + 0.5).toFixed(1)} MB`;
    const title = `${framework} Report - ${pillar} (${dateRange})`;

    const created = await createReport({
      title,
      framework,
      dateRange,
      pillar,
      departmentId: departmentId ? Number(departmentId) : null,
      type,
      size: randomSize,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

export default router;
