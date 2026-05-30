import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { organization, workspaceSettings } from "../db/schema";
import { authGuard } from "../auth/guard";

export const workspace = new Elysia({ prefix: "/workspace" })
  .use(authGuard)
  .get("/", async ({ workspaceId }) => {
    const [org] = await db.select().from(organization).where(eq(organization.id, workspaceId)).limit(1);
    const [settings] = await db
      .select()
      .from(workspaceSettings)
      .where(eq(workspaceSettings.workspaceId, workspaceId))
      .limit(1);
    return { organization: org ?? null, settings: settings ?? null };
  })
  .put(
    "/",
    async ({ workspaceId, body }) => {
      if (body.name !== undefined) {
        await db.update(organization).set({ name: body.name }).where(eq(organization.id, workspaceId));
      }
      const { name, ...settingsBody } = body;
      const set = { ...settingsBody, updatedAt: new Date() };
      const [settings] = await db
        .insert(workspaceSettings)
        .values({ workspaceId, ...set })
        .onConflictDoUpdate({ target: workspaceSettings.workspaceId, set })
        .returning();
      return settings;
    },
    {
      body: t.Partial(
        t.Object({
          name: t.String(),
          blogSlug: t.String(),
          category: t.String(),
          color: t.String(),
          description: t.String(),
          website: t.String(),
          instagram: t.String(),
          coverUrl: t.String(),
          logoUrl: t.String(),
        })
      ),
    }
  );
