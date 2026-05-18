# AI SEO — Plano DEVDOIDO

## Implementado

| Area | Arquivo | Estado |
|------|---------|--------|
| Entidade principal | `apps/landing/src/components/SEO.astro` | `DEVDOIDO`, `https://devdoido.com.br`, autor `@devdoido` |
| Conteudo estruturado | `apps/landing/src/data/devdoido.ts` | posts, categorias, curso, newsletter e admin mock |
| Rotas editoriais | `apps/landing/src/pages` | home, blog, artigo, categoria, sobre, newsletter, curso, admin |
| RSS | `apps/landing/src/pages/rss.xml.js` | feed DEVDOIDO |
| Sitemap | `apps/landing/astro.config.mjs` | site canonico DEVDOIDO |
| Robots/LLMs | `apps/landing/public/robots.txt`, `apps/landing/public/llms.txt` | instrucoes para crawlers e agentes AI |

## Prioridade 1: Cluster editorial

- Vibe coding: guias sobre prompts, agentes, custos, limites e revisao humana.
- IA aplicada a dev: comparativos de workflow, model choice, automacao local e debugging.
- SaaS solo: posts de produto, distribuicao, precificacao e bastidores de build.
- Carreira dev: textos opinativos, mercado, portfolio e aprendizagem sem teatro.

## Prioridade 2: Dados para AI Overviews

- Manter cada artigo com titulo literal, resumo direto, categoria e leitura estimada.
- Usar perguntas reais como subtitulos quando fizer sentido.
- Preferir exemplos concretos, checklists e trechos de terminal.
- Atualizar `llms.txt` quando surgirem novas rotas pillar.

## Prioridade 3: Conteudo que falta

- Landing de comunidade/newsletter com arquivo publico de edicoes.
- Pagina de ferramentas recomendadas com criterio tecnico.
- Serie CrazyStack com aulas, repos e notas de arquitetura.
- Pagina de transcricoes publicas quando houver material real revisado.

## Checklist continuo

1. Rodar `bun run lint`.
2. Rodar `bun run build:landing`.
3. Verificar termos legados fora de assets/designs.
4. Conferir desktop/mobile das rotas principais.
5. Revisar Open Graph antes de publicar campanhas.
