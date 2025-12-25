import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  // App Settings
  NODE_ENV: z.enum(["DEVELOPMENT", "PRODUCTION", "TEST"]).default("DEVELOPMENT"),
  PORT: z.string().default("5000").transform(Number),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // JWT Settings
  JWT_ACCESS_TOKEN_SECRET: z.string().min(1, "JWT_ACCESS_TOKEN_SECRET is required"),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(1, "JWT_REFRESH_TOKEN_SECRET is required"),
  JWT_ACCESS_TOKEN_TTL: z.string().default("3h"),
  JWT_REFRESH_TOKEN_TTL: z.string().default("7d"),

  // CORS (optional)
  CORS_ORIGINS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
