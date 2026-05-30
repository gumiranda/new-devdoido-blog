import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { automationConfig } from "../db/schema";
import { authGuard } from "../auth/guard";

export const automation = new Elysia({ prefix: "/automation" })
  .use(authGuard)
  .get("/", async ({ workspaceId }) => {
    const [row] = await db
      .select()
      .from(automationConfig)
      .where(eq(automationConfig.workspaceId, workspaceId))
      .limit(1);
    return row ?? null;
  })
  .put(
    "/",
    async ({ workspaceId, body }) => {
      const [row] = await db
        .insert(automationConfig)
        .values({ workspaceId, ...body, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: automationConfig.workspaceId,
          set: { ...body, updatedAt: new Date() },
        })
        .returning();
      return row;
    },
    {
      body: t.Partial(
        t.Object({
          enabled: t.Boolean(),
          promptTemplate: t.String(),
          model: t.String(),
          generateOnTranscript: t.Boolean(),
          autoPublish: t.Boolean(),
          options: t.Any(),
        })
      ),
    }
  );
