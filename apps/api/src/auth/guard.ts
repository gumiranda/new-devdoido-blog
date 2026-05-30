/**
 * Elysia auth guard plugin. `.use(authGuard)` in a module to require a session
 * and inject `{ userId, workspaceId, user }` into its handlers.
 * Resolves the active workspace from `session.activeOrganizationId`, falling back
 * to the user's first membership.
 */
import { Elysia } from "elysia";
import { eq } from "drizzle-orm";
import { auth } from "./auth";
import { db } from "../db/client";
import { member } from "../db/schema";

export const authGuard = new Elysia({ name: "auth-guard" }).resolve(
  { as: "scoped" },
  async ({ request, status }) => {
    const data = await auth.api.getSession({ headers: request.headers });
    if (!data?.session) return status(401, "Unauthorized");

    let workspaceId = data.session.activeOrganizationId ?? null;
    if (!workspaceId) {
      const [m] = await db
        .select({ orgId: member.organizationId })
        .from(member)
        .where(eq(member.userId, data.user.id))
        .limit(1);
      workspaceId = m?.orgId ?? null;
    }
    if (!workspaceId) return status(403, "No active workspace");

    return { userId: data.user.id, workspaceId, user: data.user };
  }
);
