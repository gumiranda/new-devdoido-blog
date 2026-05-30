/**
 * Google Search Console integration (M3.8 / r1#3 / r2#9).
 *
 * URL Inspection API checks indexState/indexCoverage.
 * Rate limits: 600/min, 2000/day (shared across workspaces).
 * Cached per article: TTL 24h (indexCheckedAt).
 */

import { Elysia, t } from "elysia";
import { and, eq, lt, or, isNull } from "drizzle-orm";
import { db, debitCredit } from "../db/client";
import { article } from "../db/schema";
import { authGuard } from "../auth/guard";
import { env } from "../env";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const SITE_URL = "https://devdoido.com.br";

type IndexState =
  | "na" | "indexed" | "notindexed" | "excluded" | "unknown" | "checking" | "queued";

/** Map GSC's freeform coverageState string onto our index_state enum. */
function mapCoverageState(s?: string): IndexState {
  if (!s) return "unknown";
  const l = s.toLowerCase();
  if (l.includes("not index") || l.includes("not currently")) return "notindexed";
  if (l.includes("indexed")) return "indexed";
  if (l.includes("excluded")) return "excluded";
  return "unknown";
}

interface GscResult {
  indexState: IndexState;
  indexCoverage: string;
  indexCheckedAt: Date;
}

async function inspectUrl(inspectionUrl: string, accessToken: string): Promise<GscResult | null> {
  if (!env.GOOGLE_SEARCH_CONSOLE_PROPERTY) return null;

  try {
    const resp = await fetch(
      `https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`,
      {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inspectionUrl,
      siteUrl: env.GOOGLE_SEARCH_CONSOLE_PROPERTY,
    }),
      },
    );

    if (!resp.ok) {
      console.error("GSC API error:", resp.status, await resp.text());
      return null;
    }

    const data = await resp.json();
    const result = data.inspectionResult?.indexStatusResult;

    return {
      indexState: mapCoverageState(result?.coverageState),
      indexCoverage: [
        result?.coverageState,
        result?.crawledAs ? `crawled as ${result.crawledAs}` : "",
        result?.lastCrawlTime ? `last crawl: ${result.lastCrawlTime}` : "",
      ]
        .filter(Boolean)
        .join("; ") || "N/A",
      indexCheckedAt: new Date(),
    };
  } catch (err) {
    console.error("GSC inspection failed:", err);
    return null;
  }
}

export const gscModule = new Elysia({ prefix: "/gsc" })
  .use(authGuard)

  // Check indexation for a single article
  .post("/check/:id", async ({ workspaceId, params, status }) => {
    const [art] = await db
      .select()
      .from(article)
      .where(and(eq(article.id, params.id), eq(article.workspaceId, workspaceId)))
      .limit(1);

    if (!art) return status(404, "Article not found");
    if (art.status !== "published") return status(400, "Article not published");

    // Check cache: skip if checked within TTL
    if (art.indexCheckedAt && Date.now() - art.indexCheckedAt.getTime() < CACHE_TTL_MS) {
      return {
        cached: true,
        indexState: art.indexState,
        indexCoverage: art.indexCoverage,
        indexCheckedAt: art.indexCheckedAt,
      };
    }

    // Debit index check
    try {
      await debitCredit(workspaceId, "index_check", 1, `GSC check: ${art.slug}`);
    } catch {
      return status(402, "Insufficient credits for index check");
    }

    const pageUrl = `${SITE_URL}/blog/${art.slug}`;

    // For real GSC call, we'd need a Google OAuth access token with webmasters scope.
    // Using the existing googleConnection or a dedicated service account.
    const result = await inspectUrl(pageUrl, "stub-token");

    if (!result) {
      // Stub fallback — mark as checking
      await db
        .update(article)
        .set({ indexState: "checking", indexCheckedAt: new Date() })
        .where(eq(article.id, art.id));

      return { indexState: "checking", note: "GSC API not configured — stub response" };
    }

    await db
      .update(article)
      .set(result)
      .where(eq(article.id, art.id));

    return result;
  })

  // Batch check: re-check all published articles with expired cache
  .post("/batch-check", async ({ workspaceId }) => {
    const cutoff = new Date(Date.now() - CACHE_TTL_MS);

    const expired = await db
      .select({ id: article.id, slug: article.slug })
      .from(article)
      .where(
        and(
          eq(article.workspaceId, workspaceId),
          eq(article.status, "published"),
          or(
            isNull(article.indexCheckedAt),
            lt(article.indexCheckedAt, cutoff),
          ),
        )
      )
      .limit(100);

    let checked = 0;
    for (const art of expired) {
      const pageUrl = `${SITE_URL}/blog/${art.slug}`;
      const result = await inspectUrl(pageUrl, "stub-token");
      if (result) {
        await db.update(article).set(result).where(eq(article.id, art.id));
        checked++;
      } else {
        await db
          .update(article)
          .set({ indexState: "checking", indexCheckedAt: new Date() })
          .where(eq(article.id, art.id));
      }
      // Respect rate limits: 600/min → ~10/s
      await new Promise((r) => setTimeout(r, 100));
    }

    return { checked, total: expired.length };
  });
