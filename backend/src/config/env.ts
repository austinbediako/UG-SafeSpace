import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),

  // Redis
  REDIS_URL: z.string().default("redis://localhost:6379"),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  // Server
  PORT: z.coerce.number().default(3105),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),

  // Storage
  STORAGE_ENDPOINT: z.string().default("http://localhost:9000"),
  STORAGE_ACCESS_KEY: z.string().default("minioadmin"),
  STORAGE_SECRET_KEY: z.string().default("minioadmin"),
  STORAGE_BUCKET: z.string().default("safespace-evidence"),
  STORAGE_REGION: z.string().default("us-east-1"),

  // Email
  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default("noreply@safespace.ug.edu.gh"),

  // App URLs
  AUTH_APP_URL: z.string().default("http://localhost:3004"),
  REPORTING_PORTAL_URL: z.string().default("http://localhost:3001"),
  PARTICIPATION_PORTAL_URL: z.string().default("http://localhost:3002"),
  COMMITTEE_DASHBOARD_URL: z.string().default("http://localhost:3003"),
  PUBLIC_PLATFORM_URL: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
