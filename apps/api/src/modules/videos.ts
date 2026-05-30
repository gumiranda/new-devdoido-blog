import { Elysia, t } from "elysia";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { video } from "../db/schema";
import { authGuard } from "../auth/guard";

export const videos = new Elysia({ prefix: "/videos" })
  .use(authGuard)
  .get(
    "/",
    ({ workspaceId, query }) => {
      const where = query.channel
        ? and(eq(video.workspaceId, workspaceId), eq(video.channelId, query.channel))
        : eq(video.workspaceId, workspaceId);
      return db.select().from(video).where(where).orderBy(desc(video.publishedAt));
    },
    { query: t.Object({ channel: t.Optional(t.String()) }) }
  )
  .get("/:id/transcript", async ({ workspaceId, params, status }) => {
    const [row] = await db
      .select({ id: video.id, title: video.title, status: video.status, transcript: video.transcript })
      .from(video)
      .where(and(eq(video.id, params.id), eq(video.workspaceId, workspaceId)))
      .limit(1);
    if (!row) return status(404, "Video not found");
    if (row.status !== "done") return status(409, "Transcript not ready");
    return row;
  });
