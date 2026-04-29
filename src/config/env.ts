import "dotenv/config";
import process from "process";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  // CORS_ALLOWED_ORIGINS: z.url().min(1, "CORS_ALLOWED_ORIGINS is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().min(1, "JWT_EXPIRES_IN is required"),
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_S3_BUCKET_NAME: z.string().min(1, "AWS_S3_BUCKET_NAME is required"),
  PINNACLE_ACCESS_KEY: z.string().min(1, "PINNACLE_ACCESS_KEY is required"),
  PINNACLE_URL: z.string().min(1, "PINNACLE_URL is required"),
  PINNACLE_SENDER_ID: z.string().min(1, "PINNACLE_SENDER_ID is required"),
  PINNACLE_DLT_ENTITY_ID: z
    .string()
    .min(1, "PINNACLE_DLT_ENTITY_ID is required"),
  PINNACLE_DLT_TEMPLATE_ID: z
    .string()
    .min(1, "PINNACLE_DLT_TEMPLATE_ID is required"),
  RAZORPAY_KEY_ID:z.string().min(1, "RAZORPAY_KEY_ID is required"),
  RAZORPAY_KEY_SECRET:z.string().min(1, "RAZORPAY_KEY_SECRET is required"),
  RAZORPAY_WEBHOOK_SECRET:z.string().min(1, "RAZORPAY_WEBHOOK_SECRET is required"),
});

// Validate `process.env` against our schema
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ CRITICAL ERROR: Invalid or missing environment variables:");
  _env.error.issues.forEach((issue) => {
    console.error(`   ➔ ${issue.path.join(".")}: ${issue.message}`);
  });
  console.error("The server will now shut down.");
  process.exit(1); // Stop execution entirely
}

export const env = _env.data;
