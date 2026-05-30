/**
 * Cron scheduler worker (M3.9 / r1#9).
 *
 * Runs in-process alongside the API server. Checks scheduleConfig for each
 * workspace and triggers pipeline runs at their configured times.
 *
 * For production, this should be replaced by a dedicated scheduler (e.g.,
 * Kubernetes CronJob, Vercel Cron, or a separate worker process).
 */

import { eq, lte } from "drizzle-orm";
import { db } from "../db/client";
import { scheduleConfig, cronLog } from "../db/schema";

const CHECK_INTERVAL_MS = 60_000; // Check every minute

async function checkAndRun() {
  const now = new Date();

  const schedules = await db
    .select()
    .from(scheduleConfig)
    .where(lte(scheduleConfig.nextRunAt, now));

  for (const sched of schedules) {
    // Avoid double-triggering by advancing nextRunAt before the run
    const nextRun = calculateNextRun(sched.cronExpr ?? "0 8 * * *", now);
    await db
      .update(scheduleConfig)
      .set({ nextRunAt: nextRun })
      .where(eq(scheduleConfig.id, sched.id));

    try {
      // Call the /api/v1/runs/trigger endpoint internally
      const resp = await fetch(`http://localhost:${process.env.PORT ?? 3000}/api/v1/runs/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Cron runs don't have a session — we'd need a service account or internal auth.
        // For now, we can use the app.handle() directly or a shared function.
        // This is a simplified approach — in production, use an internal queue.
      });

      await db.insert(cronLog).values({
        workspaceId: sched.workspaceId,
        status: resp.ok ? "ok" : "error",
        message: resp.ok ? "Scheduled run triggered" : `Trigger failed: ${resp.status}`,
      });
    } catch (err: any) {
      await db.insert(cronLog).values({
        workspaceId: sched.workspaceId,
        status: "error",
        message: `Trigger error: ${err.message ?? err}`,
      });
    }
  }
}

/** Simple cron expression parser — supports "min hour * * *" format. */
function calculateNextRun(cronExpr: string, from: Date): Date {
  const parts = cronExpr.split(/\s+/);
  const minute = parseInt(parts[0] ?? "0");
  const hour = parseInt(parts[1] ?? "0");

  const next = new Date(from);
  next.setSeconds(0, 0);

  // If the scheduled time today has passed, move to tomorrow
  if (next.getHours() > hour || (next.getHours() === hour && next.getMinutes() >= minute)) {
    next.setDate(next.getDate() + 1);
  }
  next.setHours(hour, minute, 0, 0);

  return next;
}

/** Start the cron loop. Call once at server startup. */
export function startCronScheduler() {
  console.log("Cron scheduler started (checks every 60s)");

  // Initialize nextRunAt for schedules that don't have one
  const now = new Date();
  (async () => {
    const schedules = await db.select().from(scheduleConfig);
    for (const sched of schedules) {
      if (!sched.nextRunAt || sched.nextRunAt <= new Date(0)) {
        const nextRun = calculateNextRun(sched.cronExpr ?? "0 8 * * *", now);
        await db
          .update(scheduleConfig)
          .set({ nextRunAt: nextRun })
          .where(eq(scheduleConfig.id, sched.id));
      }
    }
  })();

  setInterval(checkAndRun, CHECK_INTERVAL_MS);
}
