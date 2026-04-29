import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";
import { logger } from "../utils/logger.ts";
import { S3_BUCKET, s3Client } from "./s3Client.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface S3UploadParams {
  /** Raw file buffer */
  buffer: Buffer;
  /** MIME type — e.g. "image/jpeg" */
  mimetype: string;
  /** Full S3 object key — e.g. "profile-pictures/abc123-photo.jpg" */
  key: string;
}

export interface S3UploadResult {
  /** Public URL to access the uploaded object */
  url: string;
  /** S3 object key (needed for future deletion) */
  key: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a unique S3 object key.
 *
 * Format: `{folder}/{uuid}-{sanitisedOriginalName}`
 *
 * The UUID prefix guarantees uniqueness even if two users upload
 * files with the same name at the exact same time.
 */
export function generateS3Key(folder: string, originalName: string): string {
  const uuid = crypto.randomUUID();
  const ext = path.extname(originalName).toLowerCase();
  // Strip anything that isn't alphanumeric, dash, or underscore
  const baseName = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 64); // cap length to avoid overly long keys

  return `${folder}/${uuid}-${baseName}${ext}`;
}

// ---------------------------------------------------------------------------
// Core Operations
// ---------------------------------------------------------------------------

/**
 * Upload a file buffer to S3.
 *
 * @returns The public URL and key of the uploaded object.
 * @throws  Re-throws the AWS SDK error after logging — let the
 *          caller (controller / service) decide the HTTP response.
 */
export async function uploadToS3(
  params: S3UploadParams,
): Promise<S3UploadResult> {
  const { buffer, mimetype, key } = params;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  try {
    await s3Client.send(command);

    const url = `https://${S3_BUCKET}.s3.amazonaws.com/${key}`;

    logger.info("S3 upload succeeded", { key, size: buffer.length });

    return { url, key };
  } catch (error) {
    logger.error("S3 upload failed", { key, error });
    throw error;
  }
}

/**
 * Delete an object from S3 by its key.
 *
 * Silently succeeds if the object doesn't exist (S3 returns 204
 * for non-existent keys on DeleteObject).
 */
export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  try {
    await s3Client.send(command);
    logger.info("S3 delete succeeded", { key });
  } catch (error) {
    // Log but don't throw — old-file cleanup should never break the request
    logger.error("S3 delete failed", { key, error });
  }
}

/**
 * Extract the S3 object key from a full S3 URL.
 *
 * Example:
 *   Input:  "https://bucket.s3.amazonaws.com/profile-pictures/abc-photo.jpg"
 *   Output: "profile-pictures/abc-photo.jpg"
 *
 * Returns `null` if the URL doesn't match the expected pattern.
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Remove the leading "/" from the pathname
    const key = urlObj.pathname.slice(1);
    return key || null;
  } catch {
    return null;
  }
}

/**
 * Generate a presigned URL for an S3 object.
 *
 * @param key - The S3 object key.
 * @param expiresIn - The expiration time of the presigned URL in seconds (default: 3600).
 * @returns The presigned URL.
 */
export async function getPresignedUrl(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    logger.info("Presigned URL generated successfully", { key });
    return url;
  } catch (error) {
    logger.error("Failed to generate presigned URL", { key, error });
    throw error;
  }
}
