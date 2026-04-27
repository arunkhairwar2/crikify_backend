import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import { HttpStatus } from "../types/statusCode.ts";
import { ApiError } from "../utils/ApiError.ts";

/**
 * Validation middleware factory.
 * Pass a Zod schema and it will validate `req.body` against it.
 * On success, the validated (and transformed) data replaces `req.body`.
 * On failure, it throws an ApiError with field-level error details.
 *
 * Usage in routes:
 *   router.post("/register", validate(RegisterSchema), controller.register);
 */
export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed; // replace with validated + transformed data
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        throw new ApiError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          "Validation failed",
          fieldErrors,
        );
      }
      throw error;
    }
  };
