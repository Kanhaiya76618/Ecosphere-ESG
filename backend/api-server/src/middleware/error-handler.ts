import type { ErrorRequestHandler } from "express";
import { logger } from "../lib/logger";

// Express 5 forwards rejected promises from async handlers here.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error({ err }, "Unhandled error in request");
  if (res.headersSent) return;
  res.status(500).json({ error: "Internal server error" });
};
