import { pinoHttp } from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import { logger } from "../lib/logger";

export const requestLogger = pinoHttp({
  logger,
  serializers: {
    req(req: IncomingMessage & { id?: string | number }) {
      return {
        id: req.id,
        method: req.method,
        url: req.url?.split("?")[0],
      };
    },
    res(res: ServerResponse) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
