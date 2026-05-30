/**
 * Better Auth configuration.
 *  - Drizzle adapter over the Neon Postgres `db`.
 *  - Email/password enabled.
 *  - Organization plugin: `organization` == workspace, `member` == membership.
 *    Adds `session.activeOrganizationId` (the active workspace).
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "../db/client";
import * as schema from "../db/schema";
import { env } from "../env";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: env.CORS_ORIGINS,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      organization: schema.organization,
      member: schema.member,
      invitation: schema.invitation,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [organization()],
});

export type Auth = typeof auth;
