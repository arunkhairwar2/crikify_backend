import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.ts";
import { HttpStatus } from "../types/statusCode.ts";

/**
 * Global error handling middleware.
 * Must be registered LAST with app.use() — after all routes.
 *
 * Catches:
 *  - ApiError → returns structured JSON with status code
 *  - ZodError → formats field errors into a 422 response
 *  - Unknown errors → returns a generic 500 response
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
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

  // Unknown / unexpected errors
  console.error("Unhandled error:", err);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error",
  });
};
