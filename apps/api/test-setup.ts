/**
 * Test preload: load `apps/api/.env` even when `bun test` runs from the monorepo
 * root (Bun only auto-loads `.env` from the current working directory). Resolves
 * the path from this file's own location, so it works from any cwd. Idempotent —
 * never overrides a variable that is already set.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const envPath = join(import.meta.dir, ".env");
if (existsSync(envPath)) {
  for (const raw of readFileSync(envPath, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (process.env[key] !== undefined) continue;
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}
