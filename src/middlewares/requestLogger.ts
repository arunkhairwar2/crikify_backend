import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.ts";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    const { method, originalUrl } = req;
    const statusCode = res.statusCode;

    const message = `${method} ${originalUrl} - ${statusCode} [${responseTime}ms]`;

    if (statusCode >= 500) {
      logger.error(message);
    } else if (statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
};
