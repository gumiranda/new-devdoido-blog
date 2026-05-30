import { Elysia } from 'elysia';
import { db } from '../db/client';
import { authGuard } from '../auth/guard';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

export const automationModule = new Elysia({ prefix: '/automation' })
  .use(authGuard)
  .get('/', async ({ workspaceId }) => {
    const configs = await db.query.automationConfig.findMany({
      where: (ac, { eq: e }) => e(ac.workspaceId, workspaceId),
    });

    return configs[0] ?? {
      enabled: false,
      promptTemplate: '',
      model: 'claude',
      generateOnTranscript: true,
      options: {},
    };
  })
  .put('/', async ({ workspaceId, body }: any) => {
    const existing = await db.query.automationConfig.findFirst({
      where: (ac, { eq: e }) => e(ac.workspaceId, workspaceId),
    });

    if (existing) {
      return (
        await db
          .update(schema.automationConfig)
          .set({ ...body, updatedAt: new Date() })
          .where(eq(schema.automationConfig.workspaceId, workspaceId))
          .returning()
      )[0];
    }

    return (
      await db
        .insert(schema.automationConfig)
        .values({ workspaceId, ...body })
        .returning()
    )[0];
  })
  .post('/test', async () => {
    return {
      preview: {
        title: 'Next.js 16 na prática: o novo cache que finalmente faz sentido',
        subtitle: 'O que muda no App Router, nos Server Actions e por que o Turbopack agora é padrão.',
        excerpt: 'A versão 16 do Next.js repensou completamente o sistema de cache...',
        tags: ['nextjs', 'cache', 'server-actions', 'turbopack', 'react'],
        slug: 'nextjs-16-cache',
        metaDescription: 'Entenda as mudanças do Next.js 16 no cache, Server Actions e Turbopack.',
      },
    };
  });
