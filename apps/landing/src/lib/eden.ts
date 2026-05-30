/**
 * Eden Treaty client: type-safe API calls.
 * App type is imported from the api package — same types as the server.
 * `credentials: 'include'` sends the Better Auth session cookie cross-origin
 * (landing → api), which every guarded route requires.
 */
import { treaty } from '@elysiajs/eden';
import type { App } from 'api';

const API_URL = typeof window !== 'undefined'
  ? (import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000')
  : 'http://localhost:3000';

export const api = treaty<App>(API_URL, {
  fetch: { credentials: 'include' },
});
