import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../types/statusCode.ts";
import { ApiError } from "../utils/ApiError.ts";

/**
 * Route-not-found middleware.
 * Must be registered AFTER all valid routes but BEFORE the global errorHandler.
 *
 * If a request reaches this middleware it means no route matched,
 * so we throw a 404 ApiError that the errorHandler will catch.
 *
 * Usage in app setup:
 *   app.use("/api", routes);
 *   app.use(notFound);       // ← catch 404s
 *   app.use(errorHandler);   // ← handle all errors
 */
export const notFound = (req: Request, _res: Response, _next: NextFunction) => {
  throw new ApiError(HttpStatus.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`);
};
