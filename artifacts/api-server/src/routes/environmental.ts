import { Router, type IRouter } from "express";
import { getModuleStatus } from "../services/environmental";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  res.json(getModuleStatus());
});

export default router;
