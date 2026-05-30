import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { scheduleConfig } from "../db/schema";
import { authGuard } from "../auth/guard";

export const schedule = new Elysia({ prefix: "/schedule" })
  .use(authGuard)
  .get("/", async ({ workspaceId }) => {
    const [row] = await db
      .select()
      .from(scheduleConfig)
      .where(eq(scheduleConfig.workspaceId, workspaceId))
      .limit(1);
    return row ?? null;
  })
  .put(
    "/",
    async ({ workspaceId, body }) => {
      const set = {
        ...body,
        nextRunAt: body.nextRunAt ? new Date(body.nextRunAt) : undefined,
        updatedAt: new Date(),
      };
      const [row] = await db
        .insert(scheduleConfig)
        .values({ workspaceId, ...set })
        .onConflictDoUpdate({ target: scheduleConfig.workspaceId, set })
        .returning();
      return row;
    },
    {
      body: t.Partial(
        t.Object({
          frequency: t.Union([t.Literal("daily"), t.Literal("weekly"), t.Literal("monthly")]),
          cronExpr: t.String(),
          timezone: t.String(),
          quotaPerRun: t.Integer(),
          nextRunAt: t.String(),
        })
      ),
    }
  );
