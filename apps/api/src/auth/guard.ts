import { Elysia } from 'elysia';
import { auth } from './auth';

export const authGuard = new Elysia({ name: 'auth-guard' })
  .derive({ as: 'global' }, async ({ request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const activeOrgId = session.session.activeOrganizationId ?? session.user.id;

    return {
      userId: session.user.id,
      workspaceId: activeOrgId,
      session: session.session,
      user: session.user,
    };
  });
