import { Router, type IRouter } from "express";
import healthRouter from "./health";
import environmentalRouter from "./environmental";
import socialRouter from "./social";
import governanceRouter from "./governance";
import gamificationRouter from "./gamification";
import reportsRouter from "./reports";
import settingsRouter from "./settings";

const router: IRouter = Router();

// Module routers mirror the frontend: modules/<name> ↔ routes/<name>.ts
router.use(healthRouter);
router.use("/environmental", environmentalRouter);
router.use("/social", socialRouter);
router.use("/governance", governanceRouter);
router.use("/gamification", gamificationRouter);
router.use("/reports", reportsRouter);
router.use("/settings", settingsRouter);

export default router;
