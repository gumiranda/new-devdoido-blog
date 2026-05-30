/**
 * Default workspace rows (settings, wallet, automation, schedule) for a freshly
 * created organization (= workspace). Extracted from the seed's `bootstrapWorkspace`
 * so it can be reused by Better Auth's organization-creation hook (M4.1) and the
 * seed alike. Kept dependency-light (no `auth` import) to avoid an import cycle
 * with auth.ts → seed.ts. Idempotent via upserts.
 */
import { db } from "../db/client";
import * as s from "../db/schema";
import { PLAN_CREDITS, PLANS, type PlanName } from "./plans";

/** SEO/AEO-first default prompt used until the user customizes it. */
export const DEFAULT_AUTOMATION_PROMPT =
  "Você é um redator técnico especializado em SEO. Escreva um artigo de blog em português brasileiro a partir da transcrição abaixo. O artigo deve ter título H1 cativante, meta description (max 160 chars), subtítulos H2, parágrafos curtos (max 4 linhas), bullets quando couber, e uma seção de FAQ com 3 perguntas no final. Use tom informal mas profissional. Inclua uma caixa de resposta rápida (answer box) de 40-80 palavras no início resumindo o artigo.\n\nTranscrição:\n{{transcript}}";

export async function bootstrapWorkspaceDefaults(
  workspaceId: string,
  blogSlug: string,
  plan: PlanName = "free",
): Promise<void> {
  await db
    .insert(s.workspaceSettings)
    .values({ workspaceId, blogSlug })
    .onConflictDoUpdate({ target: s.workspaceSettings.workspaceId, set: { updatedAt: new Date() } });

  await db
    .insert(s.wallet)
    .values({ workspaceId, balance: PLAN_CREDITS[plan], plan })
    .onConflictDoUpdate({ target: s.wallet.workspaceId, set: { updatedAt: new Date() } });

  await db
    .insert(s.automationConfig)
    .values({
      workspaceId,
      enabled: false,
      model: "claude-sonnet-4-5",
      generateOnTranscript: true,
      autoPublish: false,
      promptTemplate: DEFAULT_AUTOMATION_PROMPT,
    })
    .onConflictDoUpdate({ target: s.automationConfig.workspaceId, set: { updatedAt: new Date() } });

  await db
    .insert(s.scheduleConfig)
    .values({
      workspaceId,
      frequency: "daily",
      cronExpr: "0 8 * * *",
      timezone: "America/Sao_Paulo",
      quotaPerRun: PLANS[plan].quotaPerRun,
    })
    .onConflictDoUpdate({ target: s.scheduleConfig.workspaceId, set: { updatedAt: new Date() } });
}
