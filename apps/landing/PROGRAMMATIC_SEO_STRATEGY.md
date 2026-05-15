# Estratégia Programmatic SEO — Data Center Uberlândia

**Data:** 12 de maio de 2026
**Site:** datacenteruberlandia.com.br
**Stack:** Astro + Content Collections

---

## 1. Business Context

**Produto:** Blog independente de monitoramento ambiental e socioeconômico
**Público-alvo:** Cidadãos de Uberlândia, jornalistas, pesquisadores, ambientalistas, vereadores
**Objetivo de conversão:** Engajamento (leitura, compartilhamento, newsletter futura)

**Diferencial defensável:** Dados proprietários de audiências públicas, documentos do MPF, análises técnicas da UFU — nenhum outro site tem essa curadoria.

---

## 2. Oportunidade de pSEO

### Playbooks Escolhidos

| Playbook | Padrão de Busca | Páginas Estimadas | Dificuldade |
|----------|----------------|-------------------|-------------|
| **Glossary** | "o que é [termo]" / "[termo] significado" | 15–30 termos | Baixa |
| **Directory** | "data centers no Brasil" / "projetos de data center" | 10–20 projetos | Média |
| **Locations** | "data center em [cidade]" | 5–10 cidades | Média |
| **Comparisons** | "[projeto] vs [projeto]" | 5–10 pares | Média |
| **Profiles** | "[empresa] data center" | 5–10 empresas | Baixa |

**Volume total estimado:** 50–80 páginas no lançamento

### Keyword Patterns Identificados

**Glossary (top-of-funnel):**
- "o que é PUE data center"
- "o que é WUE"
- "EIA RIMA significado"
- "licença ambiental LP LI LO"
- "Aquífero Guarani Uberlândia"
- "outorga de uso de recursos hídricos"
- "RAS ambiental"
- "PUE abaixo de 1.2"
- "data center sustentável"
- "subestação dedicada Cemig"

**Directory (mid-funnel):**
- "data centers no Brasil 2026"
- "projetos de data center em construção"
- "RT-One data center"
- "TikTok data center Brasil"
- "Alibaba Cloud data center Brasil"
- "data center IA América Latina"

**Locations (local SEO):**
- "data center em Uberlândia"
- "data center em Maringá"
- "data center em Caucaia"
- "data center em Jacarepaguá"

---

## 3. Estratégia de Conteúdo

### Estrutura de Dados (Content Collections)

```
src/content/
  blog/              # Posts longos (já existe)
  glossary/          # Definições técnicas
    pue.md
    wue.md
    eia-rima.md
    aquifero-guarani.md
    ...
  diretorio/         # Data centers brasileiros
    rt-one-uberlandia.md
    rt-one-maringa.md
    tiktok-caucaia.md
    scala-eldorado.md
    elea-jacarepagua.md
    ...
```

### Templates de Página

**Glossary (`/glossario/[termo]`):**
- H1: "O que é [Termo]?"
- Definição clara e contextualizada
- Exemplo prático (relacionado a data centers)
- Relacionados: links para outros termos
- Posts relacionados: links para análises que usam o termo
- Schema: `DefinedTerm` (Schema.org)

**Diretório (`/diretorio/[projeto]`):**
- H1: "[Nome do Projeto]"
- Tabela de especificações técnicas
- Status ambiental e regulatório
- Comparativo rápido com projetos similares
- Links para análises detalhadas
- Schema: `Organization` + `Article`

---

## 4. Arquitetura de Links Internos

```
Home
├── /blog
│   └── /blog/impacto-ambiental-rtone-uberlandia
│       → links para: /glossario/pue, /glossario/wue, /diretorio/rt-one-uberlandia
│
├── /glossario
│   └── /glossario/pue
│       → links para: /blog/impacto-ambiental-rtone-uberlandia, /glossario/wue
│
└── /diretorio
    └── /diretorio/rt-one-uberlandia
        → links para: /blog/impacto-ambiental-rtone-uberlandia, /diretorio/rt-one-maringa
```

**Regras:**
- Cada post de blog linka para 2–5 termos do glossário
- Cada termo do glossário linka para posts que o mencionam
- Cada projeto do diretório linka para posts e projetos relacionados
- Hub pages (`/glossario`, `/diretorio`) linkam para todas as páginas filhas

---

## 5. Schema Markup por Tipo

| Tipo | Schema Principal | Schema Secundário |
|------|------------------|-------------------|
| Glossário | `DefinedTerm` | `WebPage`, `BreadcrumbList` |
| Diretório | `Organization` | `Article`, `BreadcrumbList` |
| Índice Glossário | `CollectionPage` | `BreadcrumbList` |
| Índice Diretório | `CollectionPage` | `BreadcrumbList` |

---

## 6. Estratégia de Indexação

- **Sitemap separado:** Considerar sitemap separado para `/glossario/*` e `/diretorio/*`
- **Prioridade:** Glossário (alto volume, baixa competição) → Diretório → Locations
- **Noindex:** Páginas de diretório sem dados suficientes (menos de 100 palavras)
- **Canonical:** Auto-canonical em todas as páginas programáticas

---

## 7. Roadmap de Implementação

### Fase 1 — Glossário (Semana 1)
- [x] Criar content collection `glossary/`
- [x] Criar 5 termos iniciais
- [x] Criar páginas dinâmicas `/glossario/[slug]` e `/glossario`
- [x] Adicionar schema `DefinedTerm`

### Fase 2 — Diretório (Semana 2)
- [x] Criar content collection `diretorio/`
- [x] Criar 5 projetos iniciais
- [x] Criar páginas dinâmicas `/diretorio/[slug]` e `/diretorio`
- [x] Adicionar schema `Organization`

### Fase 3 — Cross-linking (Semana 3)
- [x] Atualizar posts existentes com links para glossário/diretório
- [x] Adicionar "Related" em todas as páginas programáticas
- [x] Criar componente de navegação cruzada

### Fase 4 — Expansão (Semanas 4–8)
- [x] Adicionar 10+ termos ao glossário (17 termos total: +aneel-ons, +convencao-169-oit, +igam, +mpf-inquerito-civil, +outorga-hidrica, +principio-precaucao, +refrigeracao-liquida, +semad-feam, +siam-mg, +subestacao-dedicada, +tier-iii)
- [x] Criar páginas de comparação (/comparar) — 3 comparativos: RT-One vs TikTok, RT-One vs Scala, Uberlândia vs Maringá
- [ ] Criar páginas de localidade (/local)

---

## 8. Métricas de Sucesso

| Métrica | Meta (3 meses) | Meta (6 meses) |
|---------|----------------|----------------|
| Páginas indexadas | 30+ | 60+ |
| Tráfego orgânico | +200% | +500% |
| Palavras-chave top 10 | 10+ | 30+ |
| Rich snippets | 2+ | 5+ |
| Backlinks | 5+ | 15+ |

---

## 9. Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Thin content | Mínimo 300 palavras por página; conteúdo contextualizado |
| Keyword cannibalization | Um termo = uma página; canonicals corretos |
| Penalidade Google | Conteúdo original, dados proprietários, não doorway pages |
| Manutenção | Content collections em Markdown — fácil de atualizar |

---

## 10. Próximos Passos

1. Implementar content collections glossary e diretorio
2. Criar páginas dinâmicas com schema markup
3. Adicionar links cruzados nos posts existentes
4. Submeter sitemap atualizado ao Google Search Console
5. Monitorar indexação e rankings

**Prioridade máxima:** Glossário — menor esforço, maior impacto em volume de busca.
