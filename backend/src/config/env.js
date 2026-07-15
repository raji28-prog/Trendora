import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to the backend root (works for local dev; Vercel injects env vars directly)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().default('trendora-access-token-secret-key-123456789'),
  JWT_REFRESH_SECRET: z.string().default('trendora-refresh-token-secret-key-123456789'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Cloudinary — optional; image uploads are skipped gracefully if not configured
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),

  // AI integrations — optional
  GROQ_API_KEY: z.string().optional().default(''),
  OPENAI_API_KEY: z.string().optional(),
  STABILITY_API_KEY: z.string().optional(),
  HF_TOKEN: z.string().optional(),

  // Social integrations — optional
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  FACEBOOK_REDIRECT_URI: z.string().optional(),
  META_WEBHOOK_VERIFY_TOKEN: z.string().optional().default('trendora_webhook_verify_token'),

  // CORS — set to your Vercel frontend URL in production
  FRONTEND_URL: z.string().optional().default(''),

  DEVELOPMENT_MODE: z
    .preprocess((val) => val === 'true' || val === '1' || val === true, z.boolean())
    .default(false),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
export default env;
