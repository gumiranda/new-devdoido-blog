/**
 * Astro middleware — verify Better Auth session for /admin/** routes.
 *
 * In SSR/hybrid mode, reads the session cookie and redirects
 * unauthenticated users before the page renders (zero JS flash).
 * Falls back to the client-side check in PipelineLayout on errors.
 */
import { defineMiddleware } from 'astro:middleware';

const ADMIN_PREFIX = '/admin';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (!pathname.startsWith(ADMIN_PREFIX) || pathname === '/admin/login') {
    return next();
  }

  try {
    const cookieHeader = context.request.headers.get('cookie') ?? '';
    const apiUrl = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000';

    const resp = await fetch(`${apiUrl}/api/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
        accept: 'application/json',
      },
    });

    if (!resp.ok) {
      const loginUrl = `/admin/login?next=${encodeURIComponent(pathname + context.url.search)}`;
      return context.redirect(loginUrl);
    }
  } catch {
    // If the API is unreachable (dev restart), let the client-side check handle it.
  }

  return next();
});
