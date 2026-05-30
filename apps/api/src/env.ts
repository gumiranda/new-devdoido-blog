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
};
