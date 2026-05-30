import { Elysia, t } from "elysia";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { channel, googleConnection } from "../db/schema";
import { authGuard } from "../auth/guard";

export const channels = new Elysia({ prefix: "/channels" })
  .use(authGuard)
  .get("/", ({ workspaceId }) =>
    db.select().from(channel).where(eq(channel.workspaceId, workspaceId)).orderBy(desc(channel.createdAt))
  )
  .post(
    "/",
    async ({ workspaceId, body, status }) => {
      const [conn] = await db
        .select()
        .from(googleConnection)
        .where(eq(googleConnection.workspaceId, workspaceId))
        .limit(1);
      if (!conn) return status(400, "Connect a Google account first");

      const [row] = await db
        .insert(channel)
        .values({
          workspaceId,
          googleConnectionId: conn.id,
          name: body.name,
          handle: body.handle ?? "@" + body.name.toLowerCase().replace(/\s+/g, ""),
          youtubeChannelId: body.youtubeChannelId,
          letter: body.name[0]?.toUpperCase(),
          active: true,
        })
        .returning();
      return row;
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        handle: t.Optional(t.String()),
        youtubeChannelId: t.Optional(t.String()),
      }),
    }
  )
  .patch(
    "/:id",
    async ({ workspaceId, params, body, status }) => {
      const [row] = await db
        .update(channel)
        .set(body)
        .where(and(eq(channel.id, params.id), eq(channel.workspaceId, workspaceId)))
        .returning();
      if (!row) return status(404, "Channel not found");
      return row;
    },
    {
      body: t.Partial(
        t.Object({ name: t.String(), active: t.Boolean(), subscribers: t.Integer(), lastVideoLabel: t.String() })
      ),
    }
  )
  .delete("/:id", async ({ workspaceId, params }) => {
    await db.delete(channel).where(and(eq(channel.id, params.id), eq(channel.workspaceId, workspaceId)));
    return { ok: true };
  });
