import { Router, type IRouter } from "express";
import { getModuleStatus } from "../services/social";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  res.json(getModuleStatus());
});

export default router;
