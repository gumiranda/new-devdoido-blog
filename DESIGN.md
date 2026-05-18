---
name: DEVDOIDO
description: Conteudo dev bruto, acido e legivel, com green lime como choque editorial.
colors:
  canvas: "#0a0a0a"
  elevated: "#121212"
  soft-cloud: "#161616"
  hairline: "#262626"
  ink: "#f5f5f5"
  charcoal: "#d4d4d4"
  ash: "#a3a3a3"
  mute: "#969696"
  primary-lime: "#c8ff00"
  danger-red: "#ff3a2d"
  success-green: "#19c37d"
typography:
  display:
    fontFamily: "Bebas Neue, Anton, Helvetica, Arial, sans-serif"
    fontSize: "clamp(4rem, 11vw, 10rem)"
    fontWeight: 400
    lineHeight: 0.88
    letterSpacing: "0"
  body:
    fontFamily: "Inter, Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0"
rounded:
  none: "0"
  xs: "4px"
  sm: "8px"
  pill: "999px"
spacing:
  tight: "8px"
  compact: "16px"
  base: "24px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  button-primary-accent:
    backgroundColor: "{colors.primary-lime}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
---

# Design System: DEVDOIDO

## 1. Overview

**Creative North Star: "Fanzine de terminal".**

DEVDOIDO mistura jornal mural, terminal sujo e manifesto dev. O sistema deve parecer escrito por alguem com opiniao, nao montado por uma equipe de growth. A composicao aceita brutalidade: grade visivel, headlines enormes, contraste seco, textura minima e chamadas que cortam.

O green lime e a cor primaria de choque. Ele aparece como sinal de sistema vivo, cursor piscando, highlight de acao e ponto de venda do CrazyStack. A base continua escura para criar foco e deixar artigos longos confortaveis, mas o site nunca deve virar dark SaaS generico.

**Key Characteristics:**
- Tipografia display grande, condensada e urgente.
- Conteudo editorial acima de decoracao.
- Green lime usado como faca, nao como confete.
- Vermelho reservado para ironia, alerta e ruptura.
- Layout gridded, duro, com respiro suficiente para leitura.

## 2. Colors

Paleta de contraste alto: preto mineral, branco ligeiramente quente, green lime eletrico e vermelho acido.

### Primary
- **Terminal Lime** (#c8ff00): cor primaria DEVDOIDO. Use em CTAs de CrazyStack, estados ativos decisivos, highlights editoriais e pequenos choques visuais.

### Secondary
- **Acid Red** (#ff3a2d): ruptura, ironia, warning editorial e palavras de impacto. Nao usar como cor primaria de conversao quando lime estiver presente.

### Neutral
- **Blackout Canvas** (#0a0a0a): fundo principal, nunca trocar por preto puro fora do token.
- **Raised Carbon** (#121212): superficies elevadas, cards editoriais e blocos de ferramenta.
- **Soft Carbon** (#161616): campos, trilhos e paineis discretos.
- **Hairline Grey** (#262626): linhas de grade, divisores e bordas finas.
- **Hot Ink** (#f5f5f5): texto principal e botoes claros.
- **Muted Ash** (#969696): metadados, captions e texto de baixa prioridade, claro o bastante para WCAG AA nos fundos carbon.

### Named Rules

**The Lime Knife Rule.** Green lime deve aparecer em poucos lugares importantes. Se tudo brilha, nada vende.

**The No Purple AI Rule.** Nao usar gradientes roxos, azul neon de SaaS AI ou glassmorphism para parecer tecnologico.

## 3. Typography

**Display Font:** Bebas Neue, com Anton/Helvetica/Arial fallback  
**Body Font:** Inter, com Helvetica/Arial fallback  
**Label/Mono Font:** JetBrains Mono

**Character:** Display alto, comprimido e impaciente. Corpo limpo para leitura longa. Mono entra como instrumentacao: timestamp, tag, prompt, terminal e metadata.

### Hierarchy
- **Display** (400, clamp grande, 0.88 line-height): heroes, titulos de artigo, curso e manifesto.
- **Headline** (400, 64px a 80px, 0.9 line-height): secoes principais e chamadas editoriais.
- **Title** (700, 18px a 24px, 1.15 line-height): cards, listas e blocos de conteudo.
- **Body** (400, 16px a 20px, 1.5 a 1.65 line-height): leitura de artigo e descricoes. Limite 65 a 75ch.
- **Label** (500, 11px a 13px, mono): badges, categorias, timestamps, filtros e comandos.

### Named Rules

**The Display Is A Weapon Rule.** Display gigante serve para tese editorial. Nao usar em texto de ajuda, labels ou controles.

## 4. Elevation

DEVDOIDO e quase flat. Profundidade vem de contraste tonal, linhas de grade, bordas finas e camadas sobre o canvas. Sombras decorativas nao combinam com o sistema.

### Named Rules

**The Flat-By-Default Rule.** Superficies ficam planas em repouso. Estado interativo muda cor, borda, deslocamento minimo ou contraste, nao sombra fofa.

## 5. Components

### Buttons
- **Shape:** pill para acoes principais (`999px`), compacto e direto.
- **Primary:** texto escuro sobre ink ou lime; padding minimo `14px 24px`.
- **Hover / Focus:** contraste aumenta, foco visivel com outline lime ou red. Nada de bounce.
- **Secondary / Ghost:** fundo carbon, borda hairline, texto ink.

### Chips
- **Style:** capsula pequena, mono ou bold, border hairline.
- **State:** ativo pode usar ink ou lime; inativo fica carbon com texto ink.

### Cards / Containers
- **Corner Style:** `0`, `4px` ou `8px`; nunca arredondamento grande.
- **Background:** raised carbon ou soft carbon.
- **Shadow Strategy:** sem sombra decorativa.
- **Border:** hairline fino e grade interna quando reforcar o tom editorial.
- **Internal Padding:** variar entre `16px`, `24px`, `32px` conforme densidade.

### Inputs / Fields
- **Style:** fundo carbon, borda hairline, pill ou `8px`.
- **Focus:** outline lime, texto claro, placeholder muted.
- **Error / Disabled:** red para erro real; disabled reduz contraste sem sumir.

### Navigation
- **Style:** header duro, logo curto, links grossos, active com underline ou bloco simples.
- **Mobile:** menu iconico, alvo grande, sem dropdown complexo.

### TypeStage

Palavra gigante de fundo como ruido editorial. Deve ficar atras do conteudo, com opacidade baixa, sem atrapalhar leitura.

### Terminal

Bloco para prompts, transcript, comandos e admin mock. Deve parecer ferramenta, nao card de marketing.

## 6. Do's and Don'ts

### Do:
- **Do** usar `#c8ff00` como cor primaria de venda e destaque real.
- **Do** manter leitura de artigo como prioridade, com linha de texto entre 65 e 75ch.
- **Do** usar grid visivel, bordas finas e contraste seco para criar identidade.
- **Do** deixar CrazyStack vender pelo desconforto certo: clareza, dor, resultado e preco sem maquiagem.
- **Do** respeitar foco de teclado e `prefers-reduced-motion`.

### Don't:
- **Don't** fazer SaaS pastel generico.
- **Don't** parecer guru de curso.
- **Don't** virar LinkedIn motivacional.
- **Don't** criar AI blog fofinho.
- **Don't** usar landing corporativa sem opiniao.
- **Don't** usar gradient text, glassmorphism decorativo, hero metrics ou grids de cards identicos.
- **Don't** usar green lime em tudo. Lime raro tem mais autoridade.
