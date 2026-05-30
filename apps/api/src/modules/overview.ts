import { Elysia } from "elysia";
import { eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { channel, video, run, wallet, scheduleConfig } from "../db/schema";
import { authGuard } from "../auth/guard";

export const overview = new Elysia({ prefix: "/overview" }).use(authGuard).get("/", async ({ workspaceId }) => {
  const n = sql<number>`count(*)::int`;
  const [[channels], [videos], [runs], [w], [sched]] = await Promise.all([
    db.select({ n }).from(channel).where(eq(channel.workspaceId, workspaceId)),
    db.select({ n }).from(video).where(eq(video.workspaceId, workspaceId)),
    db.select({ n }).from(run).where(eq(run.workspaceId, workspaceId)),
    db.select().from(wallet).where(eq(wallet.workspaceId, workspaceId)).limit(1),
    db.select().from(scheduleConfig).where(eq(scheduleConfig.workspaceId, workspaceId)).limit(1),
  ]);

  return {
    channels: channels.n,
    videos: videos.n,
    runs: runs.n,
    balance: w?.balance ?? 0,
    plan: w?.plan ?? "free",
    nextRunAt: sched?.nextRunAt ?? null,
    timezone: sched?.timezone ?? null,
    frequency: sched?.frequency ?? null,
  };
});
