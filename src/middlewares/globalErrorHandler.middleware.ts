import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpStatus } from "../types/statusCode.ts";
import { ApiError } from "../utils/ApiError.ts";
import { logger } from "../utils/logger.ts";

/**
 * Global error handling middleware.
 * Must be registered LAST with app.use() — after all routes.
 *
 * Catches:
 *  - ApiError → returns structured JSON with status code
 *  - ZodError → formats field errors into a 422 response
 *  - Unknown errors → returns a generic 500 response
 */
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Only log as 'error' if it's a 5xx or unhandled.
  const isClientError =
    (err instanceof ApiError && err.statusCode < 500) ||
    err instanceof ZodError ||
    err instanceof SyntaxError;

  // logger.error(err.stack);
  if (isClientError) {
    logger.warn(`[${req.originalUrl}] Client Error: ${err.message}`);
  } else {
    logger.error(`[${req.originalUrl}] Server Error: ${err.message}`);
  }

  // Handle our custom ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // Handle ZodError (in case one slips through without the validate middleware)
  if (err instanceof ZodError) {
    const fieldErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: "Validation failed",
      errors: fieldErrors,
    });
    return;
  }

  // Handle SyntaxError (in case one slips through without the validate middleware)
  if (err instanceof SyntaxError) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "Invalid JSON payload",
      // errors: [{ message: err.message }],
    });
  }

  // Unknown / unexpected errors
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error",
  });
};
