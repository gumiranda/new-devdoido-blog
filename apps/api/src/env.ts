/** Centralized env access. Bun auto-loads `.env`. */
export function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  DATABASE_URL: required("DATABASE_URL"),
  BETTER_AUTH_SECRET: required("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  /** Comma-separated allowed browser origins (landing app). */
  CORS_ORIGINS: (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  PORT: Number.parseInt(process.env.PORT ?? "", 10) || 3000,
  HOST: process.env.HOST ?? "0.0.0.0",

  // Integrations (M3)
  GLADIA_API_KEY: process.env.GLADIA_API_KEY,
  GLADIA_WEBHOOK_SECRET: process.env.GLADIA_WEBHOOK_SECRET,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  GOOGLE_SEARCH_CONSOLE_PROPERTY: process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  ABACATEPAY_API_KEY: process.env.ABACATEPAY_API_KEY,
  ABACATEPAY_WEBHOOK_SECRET: process.env.ABACATEPAY_WEBHOOK_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_REGION: process.env.S3_REGION,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
};
