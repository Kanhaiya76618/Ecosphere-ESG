import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, url } = req;
  const path = url?.split("?")[0];

  res.on("finish", () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    if (status >= 500) {
      logger.error({ req: { method, url: path }, res: { statusCode: status }, responseTime: ms }, "request errored");
    } else {
      logger.info({ req: { method, url: path }, res: { statusCode: status }, responseTime: ms }, "request completed");
    }
  });

  next();
}
