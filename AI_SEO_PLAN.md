# AI SEO — Plano de Ação

## O que foi implementado

| Ação | Arquivo | Impacto |
|------|---------|---------|
| FAQPage JSON-LD (5 perguntas) na home page | `index.astro` | +40% extração por AI Overviews/ChatGPT |
| Organization JSON-LD com `sameAs` na home | `index.astro` | Entity recognition no Knowledge Graph |
| `about.place` JSON-LD (Uberlândia) na home | `index.astro` | Geo-relevância para queries locais |
| Resumo estruturado (sr-only) na home page | `index.astro` | Conteúdo extraível mesmo do landing visual |
| `citation` array (9 fontes) no schema Article do blog | `impacto-ambiental-rtone-uberlandia.md` | +40% citação AI (Princeton GEO) |
| Mapeamento query→página no llms.txt | `llms.txt` | AI agents encontram respostas diretas |
| Tracker de visibilidade AI (20 queries) | `AI_SEO_TRACKER.md` | Monitoramento mensal |

## O que já estava excelente (não mexer)

- ✅ `robots.txt` — todos AI bots liberados, CCBot bloqueado
- ✅ Schema markup extensivo em todas as páginas
- ✅ `datePublished` + `dateModified` nos artigos
- ✅ FAQPage schema no blog e relatório
- ✅ Comparison tables nos artigos
- ✅ Expert quotes com nome, título e instituição
- ✅ Estatísticas com fontes citadas
- ✅ Conteúdo original e investigativo (E-E-A-T forte)

---

## Próximas ações — por prioridade

### Prioridade 1: Presença em terceiros (maior impacto)

**Wikipedia (7.8% das citações do ChatGPT vêm da Wikipedia)**
- Criar/expandir página "Data centers no Brasil" na Wikipedia PT
- Adicionar seção sobre RT-One Uberlândia com citação do blog como fonte
- Verificar se "RT-One" ou "Aquífero Guarani" já têm páginas

**Reddit (1.8% das citações do ChatGPT)**
- Participar de discussões em r/brasil, r/uberlandia, r/investimentos
- Postar resumos dos achados com link para o relatório
- Responder perguntas sobre impacto ambiental de data centers

**Quora (PT-BR)**
- Responder: "Qual o impacto ambiental de data centers?"
- Responder: "O que está acontecendo com o data center em Uberlândia?"
- Responder: "Data centers são sustentáveis?"

**YouTube**
- Criar vídeo-resumo de 5-8 minutos do relatório RT-One
- Google AI Overviews frequentemente cita YouTube para queries "how-to" e explicativas

### Prioridade 2: Conteúdo novo para capturar queries órfãs

**Página: "Data Centers no Brasil — Comparação Completa 2026"**
- Query alvo: "data centers no Brasil", "quantos data centers existem no Brasil", "comparação data centers Brasil"
- Conteúdo: tabela comparativa dos 5 projetos do diretório + mapa + análise de impacto cumulativo
- Schema: `ItemList` + `Table`
- Linkar de todas as páginas do diretório

**Página: "Data Center em Uberlândia — O que o cidadão precisa saber"**
- Query alvo: "data center uberlandia", "o que é data center uberlandia"
- Conteúdo: FAQ estilo cidadão, linguagem simples, 10 perguntas
- Schema: `FAQPage`

**Página: "Aquífero Guarani e Data Centers — O risco que ninguém conta"**
- Query alvo: "aquífero guarani data center", "data center água subterrânea"
- Conteúdo: Deep dive sobre o Aquífero Guarani vs. projetos de data center no BR
- Schema: `Article` + `FAQPage`

### Prioridade 3: Otimizações técnicas

**Open Graph image dinâmica para cada página**
- Atualmente: `/og-default.png` genérico
- Ideal: imagem com título da página (ex: `/og/blog/impacto-ambiental-rtone-uberlandia.png`)
- Ferramentas: `@vercel/og` ou `satori`
- Impacto: melhor CTR em compartilhamentos → mais backlinks → mais citações AI

**BreadcrumbList em todas as páginas**
- Já existe no relatório e sobre. Adicionar no blog, glossário e diretório.

**Author Person com credenciais**
- Opcional: adicionar author bio para dar E-E-A-T individual
- Ex: "Por [Nome], jornalista investigativo, especializado em meio ambiente e políticas públicas"

### Prioridade 4: Monitoramento contínuo

1. Preencher `AI_SEO_TRACKER.md` mensalmente
2. Verificar Google Search Console para queries que já geram impressão
3. Se uma query tem impressão mas não clique → o conteúdo está sendo visto por AI Overviews
4. Adicionar Google Analytics 4 para rastrear tráfego de referência de AI (ChatGPT, Perplexity)

---

## Métricas de sucesso (3 meses)

| Métrica | Baseline | Meta 3 meses |
|---------|----------|-------------|
| Queries com AI Overview presente | ? | 8/20 |
| Citações em ChatGPT/Perplexity | 0 | 3/20 |
| Páginas indexadas (GSC) | ? | 100% |
| Tráfego orgânico (GSC) | ? | +50% |
| Backlinks de sites autoritativos | ? | +5 |
