import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../config/env.ts";

/**
 * Singleton AWS S3 client instance.
 * Configured from validated environment variables.
 *
 * Re-export the bucket name so consumers don't need
 * to import env directly for S3 operations.
 */
export const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const S3_BUCKET = env.AWS_S3_BUCKET_NAME;
