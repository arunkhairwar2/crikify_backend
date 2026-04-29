import { HttpStatus } from "../types/statusCode.ts";
import { ApiError } from "./ApiError.ts";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Allowed image MIME types for profile picture uploads. */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

/** Maximum file size in bytes (5 MB). */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// ---------------------------------------------------------------------------
// Type guard
// ---------------------------------------------------------------------------

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

function isAllowedImageType(mime: string): mime is AllowedImageType {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(mime);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validate an uploaded image file for type and size.
 *
 * @throws ApiError(400) when the file is missing, has a disallowed MIME type,
 *         or exceeds `MAX_FILE_SIZE`.
 *
 * This is a **pure validation function** with no side effects — safe to call
 * from controllers, middlewares, or tests.
 */
export function validateImageFile(
  file: Express.Multer.File | undefined,
): asserts file is Express.Multer.File {
  
  if (!file) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Image file is required");
  }

  if (!isAllowedImageType(file.mimetype)) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      `Unsupported file type: "${file.mimetype}". Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    const maxMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    const fileMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      `File size (${fileMB} MB) exceeds the ${maxMB} MB limit`,
    );
  }
}
