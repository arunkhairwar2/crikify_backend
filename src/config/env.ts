import { z } from "zod";
import process from "process";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
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
