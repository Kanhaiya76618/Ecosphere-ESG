import { Router, type IRouter } from "express";
import {
  getPolicies,
  getPolicyAcknowledgements,
  getAudits,
  createAudit,
  getComplianceIssues,
  createComplianceIssue,
} from "../services/governance";

const router: IRouter = Router();

router.get("/policies", async (_req, res, next) => {
  try {
    const policies = await getPolicies();
    res.json(policies);
  } catch (err) {
    next(err);
  }
});

router.get("/policy-acknowledgements", async (_req, res, next) => {
  try {
    const acks = await getPolicyAcknowledgements();
    res.json(acks);
  } catch (err) {
    next(err);
  }
});

router.get("/audits", async (_req, res, next) => {
  try {
    const audits = await getAudits();
    res.json(audits);
  } catch (err) {
    next(err);
  }
});

router.post("/audits", async (req, res, next) => {
  try {
    const newAudit = await createAudit(req.body);
    res.status(201).json(newAudit);
  } catch (err) {
    next(err);
  }
});

router.get("/issues", async (_req, res, next) => {
  try {
    const issues = await getComplianceIssues();
    res.json(issues);
  } catch (err) {
    next(err);
  }
});

router.post("/issues", async (req, res, next) => {
  try {
    const newIssue = await createComplianceIssue(req.body);
    res.status(201).json(newIssue);
  } catch (err) {
    next(err);
  }
});

export default router;
