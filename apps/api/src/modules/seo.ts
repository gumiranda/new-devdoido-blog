/**
 * SEO/AEO metadata generation (M3.5 / r1#1).
 *
 * Called at article creation or publish time to populate:
 *  metaTitle, metaDescription, canonicalUrl, ogImageUrl, twitterCard,
 *  schemaJson (Article), faqJson (FAQPage), answerBox.
 *
 * Follows AI_SEO_PLAN.md and SEO_GEO_REPORT.md conventions.
 */

import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { article } from "../db/schema";
import { Elysia } from "elysia";

const SITE_URL = "https://devdoido.com.br";

interface SeoInput {
  title: string;
  excerpt?: string | null;
  coverUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  answerBox?: string | null;
  faqJson?: any;
  category?: string | null;
  tags?: string[];
}

interface SeoOutput {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  twitterCard: string;
  schemaJson: Record<string, unknown>;
  faqJson?: Record<string, unknown>;
  answerBox?: string;
}

function schemaArticle(
  title: string,
  description: string,
  slug: string,
  publishedAt: string,
  imageUrl: string,
  category?: string | null,
  tags?: string[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: imageUrl,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: publishedAt,
    dateModified: publishedAt,
    inLanguage: "pt-BR",
    ...(category ? { articleSection: category } : {}),
    ...(tags?.length ? { keywords: tags.join(", ") } : {}),
    author: {
      "@type": "Person",
      name: "DEVDOIDO",
      url: `${SITE_URL}/sobre`,
    },
    publisher: {
      "@type": "Organization",
      name: "DEVDOIDO",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-default.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
  };
}

function schemaFaq(faqItems: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Generate or enhance SEO metadata for an article.
 * Called after CREATE or before PUBLISH.
 */
export async function enhanceArticleSeo(
  articleId: string,
): Promise<SeoOutput | null> {
  const [art] = await db.select().from(article).where(eq(article.id, articleId)).limit(1);
  if (!art) return null;

  const title = art.metaTitle ?? art.title;
  const description = art.metaDescription ?? art.excerpt ?? art.title;
  const imageUrl = art.ogImageUrl ?? art.coverUrl ?? `${SITE_URL}/og-default.png`;

  const faqItems = art.faqJson?.questions
    ?? (Array.isArray(art.faqJson) ? art.faqJson : null);

  const output: SeoOutput = {
    metaTitle: title.length > 60 ? title.slice(0, 57) + "…" : title,
    metaDescription: description.length > 160 ? description.slice(0, 157) + "…" : description,
    ogImageUrl: imageUrl,
    twitterCard: art.twitterCard ?? "summary_large_image",
    schemaJson: schemaArticle(
      title,
      description,
      art.slug,
      (art.publishedAt ?? new Date()).toISOString(),
      imageUrl,
      art.category,
    ),
  };

  if (faqItems?.length) {
    output.faqJson = schemaFaq(faqItems);
  }

  if (art.answerBox) {
    output.answerBox = art.answerBox;
  }

  // Persist back
  await db
    .update(article)
    .set({
      metaTitle: output.metaTitle,
      metaDescription: output.metaDescription,
      ogImageUrl: output.ogImageUrl,
      twitterCard: output.twitterCard,
      schemaJson: output.schemaJson,
      faqJson: output.faqJson ?? null,
      answerBox: output.answerBox ?? null,
      updatedAt: new Date(),
    })
    .where(eq(article.id, art.id));

  return output;
}

export const seoModule = new Elysia({ prefix: "/seo" })
  // No routes — enhanceArticleSeo is called internally from articles.ts publish flow.
  // This module exists for organization and future public SEO endpoints.
  .get("/", () => ({ service: "seo-aeo", version: "1.0" }));
