import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    modifiedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    articleSection: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    jsonLd: z.record(z.unknown()).optional(),
  }),
});

const glossary = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    term: z.string(),
    acronym: z.string().optional(),
    relatedTerms: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
    modifiedDate: z.coerce.date().optional(),
  }),
});

const diretorio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    company: z.string(),
    location: z.string(),
    city: z.string(),
    state: z.string(),
    capacityMw: z.string(),
    status: z.enum(['anunciado', 'licenciamento', 'construcao', 'operacao', 'suspenso']),
    investment: z.string().optional(),
    waterConsumption: z.string().optional(),
    environmentalLicense: z.enum(['sem-licenca', 'lp', 'li', 'lo', 'ras', 'eia-rima']).default('sem-licenca'),
    tags: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
    modifiedDate: z.coerce.date().optional(),
  }),
});

const comparar = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    projectA: z.string(),
    projectB: z.string(),
    projectASlug: z.string(),
    projectBSlug: z.string(),
    cityA: z.string(),
    cityB: z.string(),
    stateA: z.string(),
    stateB: z.string(),
    tags: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
    modifiedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog, glossary, diretorio, comparar };
