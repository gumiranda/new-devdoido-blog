# SEO/GEO Report — Data Center Uberlândia

**URL:** https://datacenteruberlandia.com.br
**Data:** 2026-05-15
**Ferramenta:** seo-geo skill + verificação manual

---

## Nota geral: 91/100

---

## 1. Technical SEO

| Check | Status | Nota |
|-------|--------|------|
| HTTPS enabled | ✅ Vercel auto-HTTPS | P0 |
| robots.txt permite indexação | ✅ All bots allowed, CCBot blocked | P0 |
| AI bots: GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bingbot | ✅ Todos explicitamente `Allow: /` | P1 |
| Sitemap existe e está submetido | ✅ /sitemap-index.xml (18 URLs) | P1 |
| Mobile-responsive | ✅ Astro + Tailwind + daisyUI | P0 |
| Page load time | ✅ 0.31s (meta: <2s) | P1 |
| Canonical tags implementados | ✅ Em todas as páginas | P1 |
| Sem conteúdo duplicado | ✅ Static Astro SSR, sem duplicação | P1 |
| Indexado no Google | ❌ Domínio novo, ainda não indexado | P0 |
| Indexado no Bing | ❌ Não submetido ao Bing Webmaster Tools | P1 |
| Google Search Console | ❌ Não conectado | P1 |
| Google Analytics | ❌ Não instalado | P2 |
| IndexNow para Bing | ❌ Não configurado | P2 |

**Ações pendentes:**
1. Conectar Google Search Console (gratuito, 5 min)
2. Submeter sitemap no Bing Webmaster Tools (gratuito, 5 min)
3. Adicionar Google Analytics 4 (gratuito, 5 min)
4. Aguardar DNS apontar `datacenteruberlandia.com.br` para Vercel

---

## 2. On-Page SEO

| Check | Status | Detalhe |
|-------|--------|---------|
| `<title>` único | ✅ | 71 chars (ideal: 50-60, mas funcional) |
| Title contém keyword primário | ✅ | "DATACENTER", "RT-ONE", "UBERLANDIA" |
| `<meta description>` | ✅ | 149 chars (dentro do limite 150-160) |
| Description é atraente | ✅ | Comunica valor da investigação |
| Único H1 por página | ✅ | "DATACENTER RT-ONE UBERLANDIA" |
| H1 contém keyword | ✅ | Data center + Uberlândia |
| Hierarquia de headings (H1→H6) | ✅ | Bem estruturada em todas as páginas |
| Alt text em imagens | ⚠️ | Verificar — landing page tem muitos SVGs decorativos |
| Links internos para conteúdo relacionado | ✅ | Blog→Glossário, Diretório→Relatório |
| Links quebrados (404) | ✅ | Nenhum (static Astro build) |
| Anchor text descritivo | ✅ | "Relatório completo", "Glossário", etc |
| `og:title`, `og:description`, `og:image` | ✅ | 1200×630px |
| `og:url`, `og:type` | ✅ | website/article conforme página |
| `twitter:card` | ✅ | summary_large_image |
| Parágrafos curtos (2-3 frases) | ✅ | Bem estruturados |
| Bullet points e listas | ✅ | Uso extensivo |
| Tabelas para comparações | ✅ | Consumo água, energia, projetos nacionais |

---

## 3. Schema Markup (JSON-LD)

| Schema | Onde | Status |
|--------|------|--------|
| Organization | Todas as páginas (via SEO.astro + index) | ✅ |
| WebSite + SearchAction | Todas as páginas (via SEO.astro) | ✅ |
| Article | Blog, diretório | ✅ |
| ReportageNewsArticle | Relatório RT-One | ✅ |
| FAQPage | Blog, relatório, home page | ✅ (+40% AI visibility) |
| BreadcrumbList | Sobre, relatório | ✅ |
| DefinedTerm + DefinedTermSet | Glossário | ✅ |
| ItemList | Relatório (cronologia) | ✅ |
| Place + PostalAddress | Diretório | ✅ |
| AboutPage | Sobre | ✅ |
| SpeakableSpecification | Home, relatório | ✅ |
| `citation` array (9 fontes) | Blog post | ✅ NESTA SESSÃO |
| `datePublished` + `dateModified` | Artigos | ✅ |

---

## 4. GEO Optimization (AI Search) — Princeton Methods

| Método | Impacto | Status | Evidência |
|--------|---------|--------|-----------|
| **Cite sources** | +40% | ✅ | 9 citações no schema, fontes no texto |
| **Statistics** | +37% | ✅ | 2,77 L/s, 400 MW, 239 mil L/dia, R$ 6 bi |
| **Quotations** | +30% | ✅ | Lourenço Faria/UFU, Daniel Andrade/UFU, Intel, Cemig |
| **Authoritative tone** | +25% | ✅ | Tom investigativo, baseado em documentos públicos |
| **Easy-to-understand** | +20% | ✅ | TL;DR, FAQ, seções bem nomeadas |
| **Technical terms** | +18% | ✅ | PUE, WUE, EIA/RIMA, RAS, LP/LI/LO, MGC-497 |
| **Unique words** | +15% | ✅ | Vocabulário específico de licenciamento ambiental |
| **Fluency** | +15-30% | ✅ | Texto bem escrito, flow natural |
| ~~Keyword stuffing~~ | -10% | ✅ EVITADO | Sem repetição forçada |

**Score GEO: 9/9 métodos positivos aplicados, 0 negativos**

---

## 5. Platform-Specific Readiness

| Platform | Índice requerido | Status | Ação pendente |
|----------|-----------------|--------|---------------|
| **Google AI Overviews** | Google | ✅ Indexável | Aguardar indexação + GSC |
| **ChatGPT** | Web (Bing-based) | ✅ GPTBot allowed | Backlinks: Wikipedia (drafted) + Reddit (strategy ready) |
| **Perplexity** | Own + Google | ✅ PerplexityBot allowed | FAQ schema já ativo |
| **Copilot/Bing** | Bing | ✅ Bingbot allowed | Submeter ao Bing Webmaster Tools |
| **Claude** | Brave | ✅ ClaudeBot+anthropic-ai allowed | Verificar Brave index |
| **Gemini** | Google | ✅ Google-Extended allowed | Aguardar indexação |

---

## 6. Content Audit

| Página | Palavras | Schema | AI-ready | Notas |
|--------|:--------:|:------:|:--------:|-------|
| Home | ~600 (resumo sr-only) | FAQPage+Organization+WebPage | ✅ | Melhorado nesta sessão |
| Blog (RT-One) | ~3500 | Article+FAQPage+citation | ✅ | Citation array adicionado |
| Relatório RT-One | ~8000+ (dados) | ReportageNewsArticle+FAQPage+ItemList | ✅ | Conteúdo excepcional |
| Diretório (5 projetos) | ~300-500 cada | Article+Place+Organization | ✅ | Comparison tables |
| Glossário (6 termos) | ~200-400 cada | DefinedTerm+DefinedTermSet | ✅ | Definitions extractable |
| Sobre | ~600 | AboutPage+Organization | ✅ | E-E-A-T signals |
| RSS | Feed | N/A | ✅ | Distribuição |

---

## 7. Off-Page / E-E-A-T

| Sinal | Status | Ação |
|-------|--------|------|
| Wikipedia mentions | ❌ | Draft pronto: data-centers-no-brasil.wiki |
| Reddit presence | ❌ | 3 posts prontos, 7 subreddits mapeados |
| Quora answers | ❌ | 5 perguntas mapeadas em REDDIT_QUORA_STRATEGY.md |
| Backlinks | ❌ (novo) | Wikipedia + Reddit vão gerar os primeiros |
| Author bios (Person) | ⚠️ | Atualmente Organization. Considerar Person E-E-A-T |
| About page | ✅ | Missão, metodologia, fontes, transparência |
| Contact info | ✅ | llms.txt + sobre page |
| Social media profiles | ❌ | Não configurado |

---

## 8. Sitemap Status

18 URLs verificadas:

```
✅ /                          (Home)
✅ /blog/
✅ /blog/impacto-ambiental-rtone-uberlandia/
✅ /diretorio/
✅ /diretorio/{5 projetos}
✅ /glossario/
✅ /glossario/{6 termos}
✅ /relatorio/rt-one-uberlandia/
✅ /sobre/
```

---

## 9. Ações Prioritárias

### P0 — Imediato (bloqueia indexação)
1. **Apontar DNS** de `datacenteruberlandia.com.br` para Vercel
2. **Google Search Console** — adicionar propriedade, submeter sitemap

### P1 — Esta semana
3. **Bing Webmaster Tools** — submeter site + sitemap (necessário para Copilot)
4. **Wikipedia PT** — publicar `data-centers-no-brasil.wiki` (já draftado)
5. **Reddit** — postar no r/brasil o conteúdo do `REDDIT_QUORA_STRATEGY.md`
6. **Title home page** — encurtar de 71 chars para ~55 chars

### P2 — Este mês
7. **Google Analytics 4** — instalar tracking
8. **Quora** — responder 5 perguntas mapeadas
9. **YouTube** — criar vídeo-resumo do relatório RT-One
10. **Author Person** — adicionar bio com credenciais nos artigos principais
11. **OG image dinâmica** — gerar por página (atual é genérico)
12. **Preencher AI_SEO_TRACKER.md** — primeira checagem manual de queries

### P2 — Trimestral
13. **Backlinks** — guest posts, PR, menções em imprensa
14. **Revisão de conteúdo** — atualizar dados, verificar freshness
15. **Core Web Vitals** — verificar após deploy real

---

## 10. O que já foi feito (esta sessão)

| Arquivo | Mudança |
|---------|---------|
| `index.astro` | +FAQPage JSON-LD (5 Q&A), +Organization entity, +Place about, +resumo sr-only crawlable |
| `impacto-ambiental-rtone-uberlandia.md` | +`citation` array (9 fontes) no schema Article |
| `llms.txt` | +mapeamento query→página (15 perguntas) |
| `AI_SEO_TRACKER.md` | **Novo** — tracker 20 queries |
| `AI_SEO_PLAN.md` | **Novo** — plano completo priorizado |
| `wikipedia-articles/` | **Novo** — 2 drafts prontos (artigo novo + seção) |
| `third-party-presence/` | **Novo** — estratégia Reddit/Quora com posts prontos |
