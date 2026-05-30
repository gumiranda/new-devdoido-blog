/**
 * Better Auth client (vanilla) for the landing admin.
 * Talks to the API's `/api/auth/*` routes; `credentials: 'include'` so the
 * session cookie is set/sent cross-origin. baseURL matches `eden.ts`.
 */
import { createAuthClient } from 'better-auth/client';

const API_URL = typeof window !== 'undefined'
  ? (import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000')
  : 'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: { credentials: 'include' },
});

/** Where to send unauthenticated visitors, preserving the page they wanted. */
export function loginUrl(next: string = location.pathname): string {
  return '/admin/login?next=' + encodeURIComponent(next);
}
