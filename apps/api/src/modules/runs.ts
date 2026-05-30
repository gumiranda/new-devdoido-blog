import { Elysia } from "elysia";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { run, channel } from "../db/schema";
import { authGuard } from "../auth/guard";

export const runs = new Elysia({ prefix: "/runs" })
  .use(authGuard)
  .get("/", ({ workspaceId }) =>
    db.select().from(run).where(eq(run.workspaceId, workspaceId)).orderBy(desc(run.startedAt))
  )
  // Manual trigger — STUB. Real pipeline (YouTube fetch + transcription) is TODO.
  .post("/trigger", async ({ workspaceId }) => {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(channel)
      .where(eq(channel.workspaceId, workspaceId));
    const [row] = await db
      .insert(run)
      .values({ workspaceId, status: "ok", channelsCount: count, newVideos: 0, transcribedCount: 0 })
      .returning();
    return row;
  });
