import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/trendora?schema=public'),
  JWT_SECRET: z.string().default('trendora-access-token-secret-key-123456789'),
  JWT_REFRESH_SECRET: z.string().default('trendora-refresh-token-secret-key-123456789'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
export default env;
