/**
 * Google OAuth + YouTube Data API integration (M3.1 / r2#3 / r2#6).
 *
 * Flow:
 *  1. GET  /google/authorize → redirect to Google OAuth consent screen
 *  2. GET  /google/callback → exchange code for tokens, store encrypted
 *  3. POST /google/sync        → fetch recent videos from connected YouTube channels
 *  4. POST /google/disconnect  → revoke credentials
 */

import { Elysia, t } from "elysia";
import { and, desc, eq, isNull, or } from "drizzle-orm";
import { db, debitCredit } from "../db/client";
import {
  googleConnection,
  channel,
  video,
  run,
  cronLog,
} from "../db/schema";
import { authGuard } from "../auth/guard";
import { encrypt, decrypt } from "../lib/encryption";
import { env } from "../env";

/* ──────── YouTube Data API helpers ──────── */

const YT_API = "https://www.googleapis.com/youtube/v3";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

async function refreshAccessToken(
  conn: typeof googleConnection.$inferSelect,
): Promise<string | null> {
  if (!conn.refreshToken) return null;
  try {
    const refresh = await decrypt(conn.refreshToken);
    const resp = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID!,
        client_secret: env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refresh,
        grant_type: "refresh_token",
      }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const newAccess = await encrypt(data.access_token);
    await db
      .update(googleConnection)
      .set({
        accessToken: newAccess,
        tokenExpiresAt: new Date(Date.now() + (data.expires_in ?? 3600) * 1000),
        tokenRenewedAt: new Date(),
      })
      .where(eq(googleConnection.id, conn.id));
    return data.access_token;
  } catch {
    return null;
  }
}

async function getAccessToken(
  conn: typeof googleConnection.$inferSelect,
): Promise<string | null> {
  if (conn.accessToken && conn.tokenExpiresAt && conn.tokenExpiresAt > new Date()) {
    return decrypt(conn.accessToken);
  }
  return refreshAccessToken(conn);
}

interface YtVideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: { default?: { url: string } };
  };
  contentDetails: { duration: string };
}

interface YtSearchResponse {
  items: YtVideoItem[];
  nextPageToken?: string;
}

function parseDuration(iso: string): number {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
  if (!m) return 0;
  return (parseInt(m[1] ?? "0") * 3600) + (parseInt(m[2] ?? "0") * 60) + parseInt(m[3] ?? "0");
}

async function fetchChannelVideos(
  accessToken: string,
  youtubeChannelId: string,
  publishedAfter?: Date,
): Promise<YtVideoItem[]> {
  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    channelId: youtubeChannelId,
    maxResults: "50",
    order: "date",
    type: "video",
  });
  if (publishedAfter) {
    params.set("publishedAfter", publishedAfter.toISOString());
  }

  const resp = await fetch(`${YT_API}/search?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) {
    console.error("YouTube API error:", resp.status, await resp.text());
    return [];
  }
  const data: YtSearchResponse = await resp.json();
  return data.items ?? [];
}

/* ──────── Module ──────── */

export const googleModule = new Elysia({ prefix: "/google" })
  .use(authGuard)

  // Get current Google connection status
  .get("/connection", async ({ workspaceId }) => {
    const [conn] = await db
      .select({
        id: googleConnection.id,
        accountEmail: googleConnection.accountEmail,
        avatarLetter: googleConnection.avatarLetter,
        status: googleConnection.status,
        authorizedAt: googleConnection.authorizedAt,
        tokenRenewedAt: googleConnection.tokenRenewedAt,
        tokenExpiresAt: googleConnection.tokenExpiresAt,
      })
      .from(googleConnection)
      .where(eq(googleConnection.workspaceId, workspaceId))
      .limit(1);
    return conn ?? null;
  })

  // OAuth: generate authorization URL
  .get("/authorize", async ({ workspaceId, redirect }) => {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_REDIRECT_URI) {
      return { url: null, error: "Google OAuth not configured" };
    }
    const state = Buffer.from(JSON.stringify({ workspaceId })).toString("base64url");
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        access_type: "offline",
        prompt: "consent",
        state,
      });
    return redirect(url);
  })

  // Google OAuth callback (called by Google, not by the frontend)
  .get("/callback", async ({ query, redirect, status }) => {
    const { code, state } = query;
    if (!code) return status(400, "Missing authorization code");

    let workspaceId = "";
    try {
      const parsed = JSON.parse(Buffer.from(state ?? "", "base64url").toString());
      workspaceId = parsed.workspaceId;
    } catch {
      return status(400, "Invalid state parameter");
    }

    // Exchange code for tokens
    const tokenResp = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID!,
        client_secret: env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: env.GOOGLE_REDIRECT_URI!,
      }),
    });

    if (!tokenResp.ok) return status(400, "Failed to exchange authorization code");

    const tokens = await tokenResp.json();

    // Get user info
    const userResp = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userInfo = await userResp.json();

    // Store encrypted tokens
    const encryptedAccess = await encrypt(tokens.access_token);
    const encryptedRefresh = tokens.refresh_token ? await encrypt(tokens.refresh_token) : null;

    await db
      .insert(googleConnection)
      .values({
        workspaceId,
        accountEmail: userInfo.email ?? "",
        avatarLetter: (userInfo.email?.[0] ?? "G").toUpperCase(),
        status: "active",
        accessToken: encryptedAccess,
        refreshToken: encryptedRefresh,
        tokenExpiresAt: new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000),
        authorizedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: googleConnection.workspaceId,
        set: {
          accountEmail: userInfo.email ?? "",
          accessToken: encryptedAccess,
          refreshToken: encryptedRefresh,
          tokenExpiresAt: new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000),
          tokenRenewedAt: new Date(),
          status: "active",
        },
      });

    // Redirect back to the admin (frontend OAuth modal will close)
    return redirect(`${env.CORS_ORIGINS[0] ?? "http://localhost:4321"}/admin/pipeline/account?connected=true`);
  })

  // Sync: fetch new videos from all active channels
  .post("/sync", async ({ workspaceId, status }) => {
    const [conn] = await db
      .select()
      .from(googleConnection)
      .where(eq(googleConnection.workspaceId, workspaceId))
      .limit(1);

    if (!conn) return status(400, "No Google account connected");

    const accessToken = await getAccessToken(conn);
    if (!accessToken) return status(400, "Failed to obtain access token");

    const channels = await db
      .select()
      .from(channel)
      .where(and(eq(channel.workspaceId, workspaceId), eq(channel.active, true)));

    if (channels.length === 0) return { synced: 0, imported: 0 };

    // Create a run record
    const [runRow] = await db
      .insert(run)
      .values({ workspaceId, channelsCount: channels.length, status: "ok" })
      .returning();

    let imported = 0;

    for (const ch of channels) {
      if (!ch.youtubeChannelId) continue;

      const items = await fetchChannelVideos(
        accessToken,
        ch.youtubeChannelId,
        ch.lastSyncedAt ?? undefined,
      );

      for (const item of items) {
        const vid = item.id.videoId;
        if (!vid) continue;

        try {
          await db.insert(video).values({
            workspaceId,
            channelId: ch.id,
            youtubeVideoId: vid,
            title: item.snippet.title,
            durationSeconds: parseDuration(item.contentDetails.duration),
            publishedAt: new Date(item.snippet.publishedAt),
            status: "queued",
            transcriptStatus: "pending",
          }).onConflictDoNothing();
          imported++;
        } catch {
          // Duplicate (UNIQUE on workspaceId+youtubeVideoId) — skip silently
        }
      }

      // Update channel lastSync timestamp
      await db
        .update(channel)
        .set({ lastSyncedAt: new Date() })
        .where(eq(channel.id, ch.id));
    }

    // Update run record
    await db
      .update(run)
      .set({
        newVideos: imported,
        finishedAt: new Date(),
        status: "ok",
        transcribedCount: 0,
      })
      .where(eq(run.id, runRow.id));

    // Log cron entry
    await db.insert(cronLog).values({
      workspaceId,
      runId: runRow.id,
      status: "ok",
      message: `Synced ${imported} new videos from ${channels.length} channels`,
      contextJson: { imported, channelsCount: channels.length },
    });

    return { synced: channels.length, imported };
  })

  // Disconnect Google account
  .post("/disconnect", async ({ workspaceId }) => {
    await db
      .update(googleConnection)
      .set({ status: "revoked", accessToken: null, refreshToken: null })
      .where(eq(googleConnection.workspaceId, workspaceId));
    return { ok: true };
  });
