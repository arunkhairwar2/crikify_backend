import multer from "multer";
import type { Request } from "express";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "../utils/fileValidation.ts";

/**
 * Multer instance configured for in-memory file buffering.
 *
 * - **Memory storage**: File is kept in RAM as a Buffer — no temp files on
 *   disk. The buffer is streamed directly to S3 in the controller/service.
 * - **File filter**: Rejects disallowed MIME types at the stream level,
 *   before the entire file is buffered.
 * - **Size limit**: Hard cap at MAX_FILE_SIZE (5 MB). Multer will abort the
 *   upload and throw a `MulterError` with code `LIMIT_FILE_SIZE`.
 */
const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ) => {
    if (
      (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.mimetype)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(
          `Unsupported file type: "${file.mimetype}". Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
        ),
      );
    }
  },

  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * Factory that returns a multer middleware for a **single** file upload.
 *
 * @param fieldName — The form-data field name the client sends the file as.
 *
 * Usage in routes:
 * ```ts
 * router.put("/profile-picture", authenticate, uploadSingle("profilePicture"), controller);
 * ```
 */
export function uploadSingle(fieldName: string) {
  return upload.single(fieldName);
}
