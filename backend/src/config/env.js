import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required in .env'),
  JWT_SECRET: z.string().default('trendora-access-token-secret-key-123456789'),
  JWT_REFRESH_SECRET: z.string().default('trendora-refresh-token-secret-key-123456789'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required in .env'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required in .env'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required in .env'),
  GROQ_API_KEY: z.string().min(1, 'GROQ_API_KEY is required in .env'),
  OPENAI_API_KEY: z.string().optional(),
  STABILITY_API_KEY: z.string().optional(),
  HF_TOKEN: z.string().optional(),
  DEVELOPMENT_MODE: z.preprocess((val) => val === 'true' || val === '1' || val === true, z.boolean()).default(false),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
export default env;
