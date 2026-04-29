import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import { HttpStatus } from "../types/statusCode.ts";
import { ApiError } from "../utils/ApiError.ts";

/**
 * Pre-processes form-data body values.
 *
 * Multer populates `req.body` with **string** values for every field.
 * This helper attempts to JSON-parse values that look like JSON
 * (objects / arrays) so nested structures survive into Zod.
 * Scalar coercion (numbers, dates) is intentionally left to the Zod
 * schema's own `.coerce` / `.transform` helpers.
 */
function preprocessFormData(body: Record<string, unknown>): Record<string, unknown> {
  const processed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      const trimmed = value.trim();

      // Attempt to recover JSON objects / arrays sent as strings
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          processed[key] = JSON.parse(trimmed);
          continue;
        } catch {
          // Not valid JSON — fall through and keep the raw string
        }
      }
    }

    processed[key] = value;
  }

  return processed;
}

/**
 * Returns `true` when the incoming request uses a multipart content-type
 * (i.e. form-data), meaning body fields arrive as strings.
 */
function isFormData(req: Request): boolean {
  const contentType = req.headers["content-type"] ?? "";
  return contentType.includes("multipart/form-data");
}

/**
 * Validation middleware factory.
 * Pass a Zod schema and it will validate `req.body` against it.
 * On success, the validated (and transformed) data replaces `req.body`.
 * On failure, it throws an ApiError with field-level error details.
 *
 * Handles both JSON and multipart/form-data requests:
 * - JSON bodies are validated directly.
 * - Form-data bodies are pre-processed (JSON string recovery) before
 *   validation. Scalar coercion (e.g. string → Date) should be handled
 *   via `z.coerce.*` in the schema itself.
 *
 * Usage in routes:
 *   router.post("/register", validate(RegisterSchema), controller.register);
 *   router.post("/create", uploadSingle("image"), validate(CreateSchema), controller.create);
 */
export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      const body = isFormData(req)
        ? preprocessFormData(req.body as Record<string, unknown>)
        : req.body;

      const parsed = schema.parse(body);
      req.body = parsed;
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
