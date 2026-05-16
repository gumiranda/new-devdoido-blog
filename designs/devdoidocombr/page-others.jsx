// devdoido — secondary pages: Article, Blog Index, Category, About, Newsletter, Course

const {
  PageShell, Button, Chip, Stage, TypeStage, Terminal, TLine, AsciiRule,
  ArticleCard, Footer, NewsletterStrip,
  ArrowIcon, PlayIcon, ClockIcon, EyeIcon,
} = window;

/* ============================================================
   ARTICLE READING PAGE
   ============================================================ */

function ArticlePage() {
  return (
    <PageShell active="Vibe Coding">
      {/* breadcrumb */}
      <div style={{ borderBottom: "1px solid var(--hairline)", padding: "12px 32px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--mute)" }}>
        <div className="container" style={{ padding: 0, display: "flex", justifyContent: "space-between" }}>
          <span>// Home / Vibe Coding / <span style={{ color: "var(--ink)" }}>pare-de-aprender-framework</span></span>
          <span><a href="#" style={{ color: "var(--ink)", textDecoration: "underline" }}>← voltar</a></span>
        </div>
      </div>

      {/* HERO — campaign-tile editorial style */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="tile tile-hero" style={{ minHeight: 720, padding: 0, justifyContent: "flex-end", overflow: "hidden" }}>
            <TypeStage word="MANIFESTO" density={0.06} />
            <div style={{ position: "absolute", top: 32, left: 32, display: "flex", gap: 8, zIndex: 1 }}>
              <span className="badge badge-solid">vibe coding</span>
              <span className="badge">8 min de leitura</span>
              <span className="badge">manifesto</span>
            </div>
            <div style={{ position: "absolute", top: 32, right: 32, textAlign: "right", zIndex: 1, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mute)", lineHeight: 1.6 }}>
              published 15.MAY.2026 09:14<br/>
              edited  15.MAY.2026 11:02<br/>
              version v.4.2 · git:a8f3c2d
            </div>
            <div style={{ position: "relative", zIndex: 1, padding: 48 }}>
              <h1 className="t-display" style={{ fontSize: "clamp(64px, 10vw, 160px)", maxWidth: "100%" }}>
                Pare de aprender<br/>framework.<br/>Aprenda a <span style={{ color: "var(--sale)" }}>pensar.</span>
              </h1>
              <p className="tile-sub" style={{ marginTop: 32, maxWidth: 640, fontSize: 19 }}>
                Você não precisa de mais um curso de Next.js. Você precisa parar de tratar IDE como tutorial e código como cargo.
              </p>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 32, flexWrap: "wrap" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--ink)", color: "var(--on-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14 }}>DD</div>
                <div>
                  <div className="t-body-strong">@devdoido</div>
                  <div className="t-caption">8 anos quebrando código em prod · 412 artigos publicados</div>
                </div>
                <div style={{ flex: 1, minWidth: 24 }} />
                <Button variant="secondary" size="sm">Salvar</Button>
                <Button variant="secondary" size="sm">Compartilhar</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROSE BODY */}
      <section className="section">
        <div className="prose">
          <p style={{ fontSize: 22, lineHeight: 1.6, fontWeight: 500, color: "var(--ink)" }}>
            Toda quinta-feira aparece um curso novo prometendo te transformar em sênior em 90 dias. Toda quinta-feira aparece um dev iniciante perguntando "qual framework devo aprender primeiro". E toda quinta-feira eu fico com mais vontade de fechar a internet.
          </p>
          <p>
            A pergunta tá errada. Não é qual framework — é por que você acha que framework é o problema. Você passou 8 meses estudando React, 4 meses migrando pra Next, 3 semanas brigando com Server Actions, e você ainda não sabe escrever uma função que faz uma coisa só.
          </p>

          <blockquote>
            Framework é gramática. Você precisa aprender a falar.
          </blockquote>

          <h2>O sintoma é o tutorial</h2>
          <p>
            Quando você abre o Cursor pela milésima vez essa semana e a primeira coisa que faz é digitar "como faço um botão que…", o problema não é o botão. O problema é que você terceirizou o ato de pensar pro autocomplete. Isso tem nome: <code>cognitive offloading</code>. E sim, existe pesquisa séria sobre isso.
          </p>
          <p>
            Não é sobre largar IA. É sobre não usar IA como muleta antes de tentar pensar. Cinco minutos de pensar. Você consegue cinco minutos?
          </p>

          <pre>{`// errado
"escreva uma função que pega um array de users
e retorna os ativos com email"

// certo
// (5 min depois de pensar)
"essa função tá retornando duplicados porque
o filter tá rodando antes do dedupe. mexe só
no dedupe, não inverta a ordem das ops."`}</pre>

          <h2>Os 4 níveis</h2>
          <p>Tem 4 níveis de quem usa IA pra programar. Você precisa saber em qual você tá:</p>
          <ul>
            <li><strong>Nível 1 — turista.</strong> Copia, cola, reza. Não sabe o que tá rodando.</li>
            <li><strong>Nível 2 — apprentice.</strong> Lê o que a IA escreveu, edita 2 linhas, segue.</li>
            <li><strong>Nível 3 — operator.</strong> Sabe o que quer, pede em pedaços, valida tudo.</li>
            <li><strong>Nível 4 — arquiteto.</strong> Usa IA pra acelerar o que já sabia fazer sozinho.</li>
          </ul>
          <p>
            A maioria dos cursos vende nível 4 e entrega nível 1. Você sai sabendo gerar landing page no Lovable e não sabe debugar um <code>useEffect</code>.
          </p>

          <h2>O que fazer</h2>
          <p>
            Não vou te dar checklist. Checklist é o problema. Mas vou te dar três perguntas que valem mais que qualquer curso:
          </p>
          <p>
            1. Se a IA sumir hoje, você consegue terminar esse projeto sozinho? <br/>
            2. Você sabe explicar pra outra pessoa por que o código tá assim? <br/>
            3. Você consegue fazer essa mesma feature em outra stack se precisar?
          </p>
          <p>
            Se você respondeu não pra duas dessas, você não tá programando. Tá fazendo prompt engineering com extra steps.
          </p>
        </div>
      </section>

      {/* Article CTA strip — newsletter inline */}
      <section className="section-tight">
        <div className="container-narrow">
          <div style={{ background: "var(--soft-cloud)", padding: "32px", display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div className="t-mono muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>◆ se chegou até aqui</div>
              <div className="t-h-md">Recebe o próximo artigo direto no email. Toda quinta às 6h.</div>
            </div>
            <Button variant="primary" iconRight={<ArrowIcon />}>Assinar</Button>
          </div>
        </div>
      </section>

      {/* Tags & meta */}
      <section className="section-tight">
        <div className="container-narrow" style={{ paddingTop: 32, borderTop: "1px solid var(--hairline)" }}>
          <div className="t-mono muted" style={{ fontSize: 11, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>// tagged</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
            {["vibe-coding", "claude-code", "cursor", "carreira", "manifesto", "iniciante", "ferramentas"].map(t => (
              <Chip key={t}>#{t}</Chip>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid var(--hairline)" }}>
            <div className="t-mono muted" style={{ fontSize: 11 }}>↑ 1.2k upvotes · 247 comments · last activity 2h ago</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-icon">♥</button>
              <button className="btn-icon">↗</button>
              <button className="btn-icon">⌘</button>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section">
        <div className="container">
          <AsciiRule label="// continue lendo" />
          <h2 className="t-section" style={{ marginBottom: 32 }}>Mais nesse beco</h2>
          <div className="article-grid">
            <ArticleCard category="// vibe · 7 min" title="A sandbox method: 90% faster, 0% pensar" author="@devdoido" date="13 MAY" reads="1.8k" kind="mono" display="SANDBOX" />
            <ArticleCard category="// IA · 12 min" title="Os 6 prompts que substituíram meu time de 4 devs" author="@devdoido" date="11 MAY" reads="6.1k" kind="grid" display="6/4" />
            <ArticleCard category="// vibe · 11 min" title="Como debugar um app vibe-coded sem chorar" author="@devdoido" date="09 MAY" reads="1.6k" kind="mono" display="DEBUG/DIE" />
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}

/* ============================================================
   BLOG INDEX (lista paginada)
   ============================================================ */

function BlogIndexPage() {
  return (
    <PageShell active="Home">
      {/* page header */}
      <section style={{ padding: "64px 32px 32px", borderBottom: "1px solid var(--hairline)" }}>
        <div className="container" style={{ padding: 0 }}>
          <div className="t-mono muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>◆ /blog · 412 artigos · 8 categorias</div>
          <h1 className="t-display" style={{ fontSize: "clamp(72px, 10vw, 160px)" }}>O Arquivo.</h1>
          <p style={{ fontSize: 19, color: "var(--mute)", maxWidth: 680, marginTop: 18 }}>
            Tudo que eu já publiquei. Em ordem cronológica, sem filtro de relevância. Use o filtro embaixo. Ou role. Você decide.
          </p>
        </div>
      </section>

      {/* sub-nav — filter + sort */}
      <section style={{ padding: "16px 32px", borderBottom: "1px solid var(--hairline)", position: "sticky", top: 0, background: "var(--canvas)", zIndex: 4 }}>
        <div className="container" style={{ padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
            <Chip active>Tudo · 412</Chip>
            <Chip>Vibe Coding · 48</Chip>
            <Chip>IA · 91</Chip>
            <Chip>Micro-SaaS · 62</Chip>
            <Chip>Carreira · 37</Chip>
            <Chip>Next.js · 29</Chip>
            <Chip>React Native · 18</Chip>
            <Chip>Conteúdo · 14</Chip>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="t-caption">ordenar:</span>
            <select style={{
              background: "var(--canvas)", color: "var(--ink)", border: "1px solid var(--hairline)",
              padding: "8px 16px", borderRadius: "var(--r-lg)", fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600,
            }}>
              <option>+ recentes</option>
              <option>+ lidos</option>
              <option>+ comentados</option>
            </select>
          </div>
        </div>
      </section>

      {/* sidebar + grid */}
      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 48 }}>
          {/* filter sidebar */}
          <aside>
            <FilterGroup title="Período">
              {["essa semana", "esse mês", "2026", "2025", "2024", "todos"].map(o => (
                <FilterRow key={o} label={o} active={o === "essa semana"} count={Math.floor(Math.random()*40+5)}/>
              ))}
            </FilterGroup>
            <FilterGroup title="Formato">
              <FilterRow label="artigo" count={341} active/>
              <FilterRow label="manifesto" count={28}/>
              <FilterRow label="tutorial" count={43}/>
            </FilterGroup>
            <FilterGroup title="Duração">
              <FilterRow label="< 5 min" count={186}/>
              <FilterRow label="5–10 min" count={142}/>
              <FilterRow label="long read" count={84}/>
            </FilterGroup>
            <FilterGroup title="Stack">
              {["next.js", "react", "react native", "bun", "node", "claude code", "cursor", "n8n"].map(s => (
                <FilterRow key={s} label={s} count={Math.floor(Math.random()*30+5)}/>
              ))}
            </FilterGroup>
          </aside>

          {/* grid */}
          <div>
            <div className="article-grid" style={{ "--grid-cols": 3 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <ArticleCard
                  key={i}
                  category={["// vibe · 6 min", "// IA · 9 min", "// saas · 4 min", "// carreira · 7 min"][i%4]}
                  title={[
                    "Antigravity virou o novo Cursor",
                    "A sandbox method: 90% faster",
                    "Como cobrar R$ 10k/mês sendo dev solo",
                    "Salário dev BR caiu 18%",
                    "Claude vs GPT-5 vs Gemini 3",
                    "Como debugar um app vibe-coded sem chorar",
                    "Next 16: server actions finalmente prestam",
                    "Eu não vendo curso, vendo desconforto",
                    "Bun 2.0 quebrou todo seu setup (e tá ótimo)",
                    "Por que eu desinstalei o VSCode",
                    "Meu salário em 2024 vs 2026",
                    "Como criar agente de IA no n8n em 1h",
                  ][i]}
                  author="@devdoido"
                  date={`${14-i} MAY`}
                  reads={`${(8.4 - i*0.4).toFixed(1)}k`}
                  kind={i%2 ? "mono" : "grid"}
                  display={["ANTI-GRAV", "SANDBOX", "10K SOLO", "-18%", "MODEL WARS", "DEBUG/DIE", "NEXT 16", "DESCONFORTO", "BUN 2.0", "BYE VSCODE", "+200%", "AGENT/1H"][i]}
                />
              ))}
            </div>
            <div style={{ marginTop: 64, padding: "32px 0", borderTop: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="t-caption">mostrando 1–12 de 412</span>
              <div style={{ display: "flex", gap: 4 }}>
                <button className="btn-icon" disabled><ArrowIcon rot={180}/></button>
                <Chip active>1</Chip>
                <Chip>2</Chip>
                <Chip>3</Chip>
                <span className="t-caption" style={{ alignSelf: "center", padding: "0 8px" }}>…</span>
                <Chip>35</Chip>
                <button className="btn-icon"><ArrowIcon/></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h4 className="t-body-strong" style={{ marginBottom: 12 }}>{title}</h4>
      <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
    </div>
  );
}
function FilterRow({ label, count, active }) {
  return (
    <button style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "6px 0", background: "none", border: 0, cursor: "pointer",
      fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: active ? 700 : 400,
      color: "var(--ink)", textDecoration: active ? "underline" : "none", textUnderlineOffset: 4,
    }}>
      <span>{label}</span>
      <span style={{ color: "var(--mute)" }}>({count})</span>
    </button>
  );
}

/* ============================================================
   CATEGORY PAGE — "Vibe Coding"
   ============================================================ */

function CategoryPage() {
  return (
    <PageShell active="Vibe Coding">
      {/* Hero: huge category headline burned over editorial stage */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="tile tile-hero" style={{ minHeight: 560, background: "var(--soft-cloud)" }}>
            <div className="stage stage-grid" style={{ position: "absolute", inset: 0 }} />
            <div style={{ position: "absolute", top: 32, left: 32, display: "flex", gap: 8, zIndex: 1 }}>
              <span className="badge">categoria</span>
              <span className="badge badge-solid">48 artigos</span>
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <h1 className="t-display" style={{ fontSize: "clamp(80px, 14vw, 220px)", lineHeight: 0.84 }}>
                Vibe<br/>Coding.
              </h1>
              <p className="tile-sub" style={{ maxWidth: 580, fontSize: 19, marginTop: 32 }}>
                Programar com IA virou jeito de vida ou virou muleta? 48 artigos sobre Cursor, Claude Code, Lovable, Antigravity, e o que sobra depois que o hype acaba.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <Button variant="primary" iconRight={<ArrowIcon/>}>Ver os 48</Button>
                <Button variant="secondary">Assinar essa categoria</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / pinned */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <AsciiRule label="// pinned · os 3 + lidos" />
          <div className="article-grid">
            <ArticleCard category="// 12 min · pinned" title="Os 6 prompts que substituíram meu time de 4 devs" author="@devdoido" date="11 MAY" reads="6.1k" kind="grid" display="6 / 4" badges={[{label:"📌 pinned",solid:true}]} />
            <ArticleCard category="// 8 min · pinned" title="Claude Code ficou caro. Cursor virou refém. E agora?" author="@devdoido" date="10 MAY" reads="8.4k" kind="mono" display="IDE WARS" badges={[{label:"📌 pinned",solid:true}]} />
            <ArticleCard category="// 11 min · pinned" title="Como debugar um app vibe-coded sem chorar" author="@devdoido" date="09 MAY" reads="5.6k" kind="grid" display="DEBUG/DIE" badges={[{label:"📌 pinned",solid:true}]} />
          </div>
        </div>
      </section>

      {/* Sub-tags */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <AsciiRule label="// sub-tags" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["claude code", 14], ["cursor", 12], ["lovable", 7], ["antigravity", 5],
              ["windsurf", 4], ["v0", 3], ["bolt", 2], ["replit agent", 4],
              ["prompts", 18], ["agents", 9], ["mcp", 6],
            ].map(([t, n]) => (
              <Chip key={t}>{t} <span style={{ color: "var(--mute)" }}>({n})</span></Chip>
            ))}
          </div>
        </div>
      </section>

      {/* Cronologia */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <AsciiRule label="// cronologia · maio 2026" />
          <div className="article-grid" style={{ "--grid-cols": 4 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ArticleCard
                key={i}
                category={`// vibe · ${4 + i} min`}
                title={["A sandbox method: 90% faster", "Antigravity skills cheat code", "Cursor 3.0: o que mudou", "Bolt.new vs Lovable em 2026", "MCP server em 10 min", "Por que eu não uso Copilot", "Claude Code é o novo Vim", "Stop vibe coding em prod"][i]}
                author="@devdoido"
                date={`${14-i} MAY`}
                reads={`${(2.5 + Math.random()*4).toFixed(1)}k`}
                kind={i%2 ? "grid" : "mono"}
                display={["SANDBOX", "ANTIGRAV", "CURSOR 3", "BOLT/LOV", "MCP/10MIN", "NO COPILOT", "CC = VIM", "STOP/PROD"][i]}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}

/* ============================================================
   ABOUT / BIO
   ============================================================ */

function AboutPage() {
  return (
    <PageShell active="Home">
      {/* SUBJECT — wide editorial */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 8, alignItems: "stretch" }}>
            {/* portrait stage — DD monogram editorial */}
            <div className="tile" style={{ minHeight: 640, padding: 0, justifyContent: "stretch", overflow: "hidden" }}>
              <TypeStage word="DD" density={0.85} withGrid={false} />
              <div style={{ position: "relative", zIndex: 1, padding: 32, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className="badge">about · v.0.1</span>
                  <span className="badge badge-solid">// monogram</span>
                </div>
                <div className="t-mono muted" style={{ fontSize: 11 }}>
                  // identidade visual · @devdoido<br/>
                  // brand mark · 2026
                </div>
              </div>
            </div>
            {/* bio */}
            <div style={{ background: "var(--ink)", color: "var(--canvas)", padding: 48, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <span className="t-mono" style={{ color: "var(--canvas)", opacity: 0.6, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>◆ quem é o devdoido</span>
                <h1 className="t-display" style={{ fontSize: "clamp(64px, 6vw, 96px)", marginTop: 24, color: "var(--canvas)" }}>
                  Não sou<br/>tech lead.<br/>Sou devdoido.
                </h1>
              </div>
              <div style={{ marginTop: 32 }}>
                <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--canvas)", opacity: 0.85, marginBottom: 24 }}>
                  Eu programo há 8 anos, ensino há 4, e escrevo aqui porque LinkedIn me cansou. Já fui sênior em startup, freelancer remoto, professor, e agora vivo de criar conteúdo dev. <br/><br/>
                  Brasileiro, mineiro, 32 anos, café preto. Stack favorita atual: Bun + Next + Convex + Claude Code. Stack favorita do mês que vem: provavelmente outra.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                  <Stat n="412" l="artigos" />
                  <Stat n="12.8k" l="newsletter" />
                  <Stat n="48k" l="youtube" />
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button variant="outline-on-image" size="sm">contato@</Button>
                  <Button variant="ghost" size="sm" style={{ color: "var(--canvas)", border: "1px solid rgba(255,255,255,0.3)" }}>github</Button>
                  <Button variant="ghost" size="sm" style={{ color: "var(--canvas)", border: "1px solid rgba(255,255,255,0.3)" }}>youtube</Button>
                  <Button variant="ghost" size="sm" style={{ color: "var(--canvas)", border: "1px solid rgba(255,255,255,0.3)" }}>x</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stack atual — terminal display */}
      <section className="section">
        <div className="container">
          <AsciiRule label="// current.stack" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <h2 className="t-section" style={{ marginBottom: 24 }}>Stack atual</h2>
              <Terminal title="cat ~/.devdoido/stack.json">
                <TLine cmd='{'/>
                <TLine cmd='  "runtime":    '/>
                <TLine cmd='    ["bun 1.2", "node 22"],' accent/>
                <TLine cmd='  "framework":  '/>
                <TLine cmd='    "next 16.0.2",' accent/>
                <TLine cmd='  "db":         '/>
                <TLine cmd='    ["convex", "postgres"],' accent/>
                <TLine cmd='  "ai":         '/>
                <TLine cmd='    ["claude code", "cursor"],' accent/>
                <TLine cmd='  "auto":       '/>
                <TLine cmd='    ["n8n", "github actions"],' accent/>
                <TLine cmd='  "host":       '/>
                <TLine cmd='    ["vercel", "coolify"]' accent/>
                <TLine cmd='}'/>
              </Terminal>
            </div>
            <div>
              <h2 className="t-section" style={{ marginBottom: 24 }}>Opiniões impopulares</h2>
              <ol style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                {[
                  ["VSCode é uma muleta. Use Cursor, Zed, Trae — qualquer um.", true],
                  ["Tailwind é o melhor que aconteceu pra HTML em 10 anos."],
                  ["Micro-SaaS de prompt é o novo dropshipping."],
                  ["IA não vai te tirar emprego. Dev que usa IA, sim."],
                  ["Next.js é exagerado pra 80% dos projetos. Use mesmo assim."],
                ].map(([op, hot], i) => (
                  <li key={i} style={{ display: "flex", gap: 18, padding: "18px 0", borderBottom: "1px solid var(--hairline)" }}>
                    <span className="t-mono" style={{ color: "var(--mute)", fontSize: 11, width: 24, flexShrink: 0 }}>0{i+1}</span>
                    <span style={{ fontSize: 17, lineHeight: 1.4, flex: 1 }}>{op}</span>
                    {hot && <span className="badge badge-sale">🔥</span>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <AsciiRule label="// timeline" />
          <h2 className="t-section" style={{ marginBottom: 32 }}>De onde eu venho</h2>
          <div>
            {[
              ["2026", "devdoido.com.br relança. 412 artigos. 12.8k newsletter."],
              ["2025", "Quit do CLT. Vivo 100% de conteúdo + cursos. CrazyStack faz R$ 80k em 90 dias."],
              ["2024", "Começo a publicar todo dia. Primeira newsletter atinge 1k inscritos em 30 dias."],
              ["2023", "Sênior full-remote em startup gringa. Salário 4x maior, alma 4x menor."],
              ["2021", "Primeiro emprego dev na pandemia. Era pra ser temporário. Vira carreira."],
              ["2018", "Larga engenharia mecânica no 7º período. Estudo JS sozinho 14h/dia por 6 meses."],
            ].map(([year, body], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 32, padding: "24px 0", borderTop: "1px solid var(--hairline)" }}>
                <div className="t-display" style={{ fontSize: 36 }}>{year}</div>
                <div style={{ fontSize: 17, lineHeight: 1.5, paddingTop: 8 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}

function Stat({ n, l }) {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 12 }}>
      <div className="t-display" style={{ fontSize: 40, color: "var(--canvas)", lineHeight: 1 }}>{n}</div>
      <div className="t-mono" style={{ fontSize: 11, color: "var(--canvas)", opacity: 0.6, textTransform: "uppercase", marginTop: 4 }}>{l}</div>
    </div>
  );
}

/* ============================================================
   NEWSLETTER PAGE
   ============================================================ */

function NewsletterPage() {
  return (
    <PageShell active="Home">
      {/* HUGE editorial hero — type-as-graphic */}
      <section style={{ background: "var(--ink)", color: "var(--canvas)", position: "relative", overflow: "hidden", minHeight: 720 }}>
        <TypeStage word="WEEKLY" invert density={0.08} withGrid={true} />
        <div style={{ position: "relative", padding: "80px 32px 120px", zIndex: 1 }}>
          <div className="container" style={{ padding: 0 }}>
            <span className="t-mono" style={{ color: "var(--canvas)", opacity: 0.6, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>◆ devdoido weekly · #142 · quinta 06:00 BRT</span>
            <h1 className="t-display" style={{ fontSize: "clamp(96px, 16vw, 280px)", color: "var(--canvas)", marginTop: 24, lineHeight: 0.82 }}>
              1 EMAIL.<br/>0 BS.
            </h1>
            <p style={{ fontSize: 22, color: "var(--canvas)", opacity: 0.85, maxWidth: 620, marginTop: 32, lineHeight: 1.5 }}>
              Toda quinta-feira às 6h da manhã. 3 links que eu li essa semana, 1 opinião impopular, 1 trecho de código que tá rodando em produção. 5 minutos de leitura. Zero "10 razões pra você aprender X em 2026".
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 48, maxWidth: 560 }}>
              <input
                placeholder="seu@email.com"
                style={{
                  flex: 1, height: 56, padding: "0 24px",
                  background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
                  color: "var(--canvas)", borderRadius: "var(--r-lg)",
                  fontFamily: "var(--font-ui)", fontSize: 17,
                }}
              />
              <Button variant="outline-on-image" style={{ height: 56, padding: "0 32px" }}>Assinar →</Button>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 48, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--canvas)", opacity: 0.55, flexWrap: "wrap" }}>
              <span>12,847 inscritos</span>
              <span>·</span>
              <span>open rate 64%</span>
              <span>·</span>
              <span>0 spam</span>
              <span>·</span>
              <span>unsubscribe 1-click</span>
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="section">
        <div className="container">
          <AsciiRule label="// what's inside" />
          <h2 className="t-section" style={{ marginBottom: 48 }}>O que vem dentro</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <Slot n="01" t="3 LINKS" b="3 artigos / vídeos / tools que eu realmente li essa semana. Com comentário curto, não com resumo."/>
            <Slot n="02" t="1 OPINIÃO" b="A opinião impopular da semana. Sobre IA, framework, dev culture, mercado. Geralmente errada. Sempre honesta."/>
            <Slot n="03" t="1 CÓDIGO" b="Um trecho de código que tá rodando em produção essa semana. Com o porquê de ter ficado assim."/>
          </div>
        </div>
      </section>

      {/* Past editions preview */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <AsciiRule label="// últimas edições" />
          <div style={{ marginTop: 32 }}>
            {[
              ["#141", "08.MAY.2026", "Por que eu desinstalei o Cursor (e voltei pro Zed)", "11.2k abriram"],
              ["#140", "01.MAY.2026", "O dia que eu deletei 14 cursos da minha biblioteca", "9.8k abriram"],
              ["#139", "24.APR.2026", "Antigravity em prod: 30 dias depois", "10.1k abriram"],
              ["#138", "17.APR.2026", "Não, IA não escreveu seu PR. Você não escreveu também.", "12.4k abriram"],
              ["#137", "10.APR.2026", "Salário dev BR: 5 dados que ninguém mostra", "13.7k abriram"],
            ].map(([n, d, t, r], i) => (
              <a key={i} href="#" style={{ display: "grid", gridTemplateColumns: "80px 140px 1fr 160px 24px", gap: 24, padding: "24px 0", borderTop: "1px solid var(--hairline)", alignItems: "center", textDecoration: "none", color: "var(--ink)" }}>
                <span className="t-display" style={{ fontSize: 32 }}>{n}</span>
                <span className="t-mono" style={{ fontSize: 12, color: "var(--mute)" }}>{d}</span>
                <span style={{ fontSize: 19, fontWeight: 600 }}>{t}</span>
                <span className="t-caption" style={{ textAlign: "right" }}>{r}</span>
                <ArrowIcon/>
              </a>
            ))}
            <div className="hr" style={{ marginTop: 0 }}/>
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}

function Slot({ n, t, b }) {
  return (
    <div style={{ background: "var(--soft-cloud)", padding: 32, aspectRatio: "4/5", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <span className="t-mono muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>// item.{n}</span>
      <div>
        <h3 className="t-display" style={{ fontSize: "clamp(40px, 5vw, 64px)", marginBottom: 18, lineHeight: 0.92 }}>{t}</h3>
        <p style={{ fontSize: 15, color: "var(--mute)", lineHeight: 1.5 }}>{b}</p>
      </div>
    </div>
  );
}

/* ============================================================
   COURSE / LANDING — CrazyStack
   ============================================================ */

function CoursePage() {
  return (
    <PageShell active="Cursos">
      {/* HERO */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="tile tile-hero" style={{ minHeight: 760, color: "var(--canvas)", padding: 0, justifyContent: "flex-end", overflow: "hidden" }}>
            <TypeStage word="CRAZYSTACK" invert density={0.10} />

            <div style={{ position: "absolute", top: 32, left: 32, display: "flex", gap: 8, zIndex: 1 }}>
              <span className="badge" style={{ background: "var(--canvas)", color: "var(--ink)", borderColor: "var(--canvas)" }}>bootcamp · 14h</span>
              <span className="badge badge-sale">-60% até domingo</span>
              <span className="badge" style={{ background: "transparent", color: "var(--canvas)", borderColor: "rgba(255,255,255,0.3)" }}>turma #03</span>
            </div>
            <div style={{ position: "absolute", top: 32, right: 32, textAlign: "right", zIndex: 1, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--canvas)", opacity: 0.6, lineHeight: 1.6 }}>
              próxima turma · 22.MAY.2026<br/>
              vagas restantes · 47 / 200<br/>
              v.2026.05 · last update 14.MAY
            </div>

            <div style={{ position: "relative", zIndex: 1, padding: 48 }}>
              <h1 className="t-display" style={{ color: "var(--canvas)", fontSize: "clamp(96px, 13vw, 220px)" }}>
                CrazyStack<br/>TypeScript.
              </h1>
              <p className="tile-sub" style={{ color: "var(--canvas)", opacity: 0.85, maxWidth: 640, fontSize: 19, marginTop: 32 }}>
                Fullstack do zero ao deploy com Bun, Next 16, Convex, Claude Code e n8n. Não é tutorial de hello-world. É a stack que eu uso em produção há 8 meses, do jeito que eu uso.
              </p>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 32, flexWrap: "wrap" }}>
                <Button variant="outline-on-image" iconRight={<ArrowIcon/>}>Garantir vaga · R$ 497</Button>
                <Button variant="ghost" style={{ color: "var(--canvas)", border: "1px solid rgba(255,255,255,0.3)" }} icon={<PlayIcon/>}>Aula 0 grátis</Button>
                <span className="t-mono" style={{ color: "var(--canvas)", opacity: 0.6, fontSize: 12, marginLeft: 12 }}>parcela em 12x · R$ 49,70</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you build */}
      <section className="section">
        <div className="container">
          <AsciiRule label="// o que você vai construir" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
            <h2 className="t-section">3 apps reais.<br/>Em produção.</h2>
            <span className="t-mono muted" style={{ fontSize: 12 }}>módulos 4–10</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <BuildCard n="01" name="WhatsApp Bot SaaS" stack={["bun", "convex", "wpp api"]} body="Bot multi-tenant com fila, billing, dashboard. Stack idêntica à que eu uso no meu cliente que paga R$ 12k/mês."/>
            <BuildCard n="02" name="AI Content Engine" stack={["next 16", "claude api", "n8n"]} body="Pipeline que pega tópico → pesquisa → escreve → publica. Mesmo motor que produz 30% dos artigos aqui."/>
            <BuildCard n="03" name="Dev Tools Marketplace" stack={["next 16", "stripe", "convex"]} body="Marketplace tipo Lemonsqueezy só pra dev tools. Inclui auth, pagamento internacional, payout."/>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <AsciiRule label="// curriculum.json" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
            <h2 className="t-section">10 módulos · 14h.</h2>
            <span className="t-mono muted" style={{ fontSize: 12 }}>todos com código aberto no github</span>
          </div>
          <div>
            {[
              ["01", "Setup & filosofia", "1h 12m", "Stack, ferramentas, mindset. Por que NÃO usar Webpack em 2026."],
              ["02", "Bun + TypeScript do jeito certo", "1h 38m", "Bun como runtime, package manager, test runner. Substituindo Node, npm, vitest tudo de uma vez."],
              ["03", "Next 16 sem o que não importa", "1h 51m", "Server Components, Server Actions, parallel routes. O que usar e o que ignorar."],
              ["04", "Convex: o backend que ninguém te contou", "1h 24m", "Real-time, reactive, type-safe. Substituindo Supabase + Postgres + Redis + Pusher tudo junto."],
              ["05", "Claude Code workflow profissional", "1h 48m", "Como eu uso Claude Code 8h por dia sem virar muleta. Skills, slash commands, MCP servers."],
              ["06", "n8n + Claude API: pipeline de IA real", "1h 36m", "Workflows que rodam 24/7 em produção. Erro handling, retry, custos."],
              ["07", "Build #1: WhatsApp Bot SaaS", "2h 04m", "Do schema ao deploy. Multi-tenant, fila, dashboard. Código completo no github."],
              ["08", "Build #2: AI Content Engine", "1h 28m", "Pipeline de pesquisa + escrita + publicação. O motor que faz 30% dos artigos aqui rodar."],
              ["09", "Build #3: Dev Tools Marketplace", "1h 32m", "Stripe Connect, payout internacional, auth com Clerk. Pronto pra vender."],
              ["10", "Deploy + monitoramento + custos", "0h 47m", "Coolify, Vercel, Sentry. Quanto custa rodar tudo (spoiler: USD 38/mês)."],
            ].map(([n, name, t, body], i) => (
              <details key={i} style={{ borderTop: "1px solid var(--hairline)" }}>
                <summary style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px 80px 24px", gap: 24, padding: "24px 0", alignItems: "center", cursor: "pointer", listStyle: "none" }}>
                  <span className="t-display" style={{ fontSize: 28 }}>{n}</span>
                  <span style={{ fontSize: 19, fontWeight: 600 }}>{name}</span>
                  <span className="t-mono" style={{ fontSize: 12, color: "var(--mute)" }}>{t}</span>
                  <span className="t-mono" style={{ fontSize: 11, color: "var(--mute)" }}>{i === 0 ? "grátis" : "incluso"}</span>
                  <span style={{ fontSize: 20, color: "var(--mute)" }}>+</span>
                </summary>
                <p style={{ padding: "0 0 24px 104px", color: "var(--mute)", fontSize: 16, maxWidth: 720 }}>{body}</p>
              </details>
            ))}
            <div className="hr" style={{ marginTop: 0 }} />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section">
        <div className="container">
          <AsciiRule label="// pricing.txt" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: "var(--soft-cloud)", padding: 48 }}>
              <span className="t-mono muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>// plano.solo</span>
              <h3 className="t-display" style={{ fontSize: 56, marginTop: 12 }}>R$ 497</h3>
              <p className="t-caption">12× R$ 49,70 · acesso vitalício</p>
              <ul style={{ paddingLeft: 0, listStyle: "none", margin: "24px 0", fontSize: 15 }}>
                {["14h de aula + 3 projetos completos", "Código no github (todos os builds)", "Atualizações vitalícias", "Discord da turma · 1 ano", "Não inclui mentoria"].map(b => (
                  <li key={b} style={{ padding: "6px 0", display: "flex", gap: 12 }}>
                    <span style={{ color: "var(--mute)" }}>—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button variant="primary" iconRight={<ArrowIcon/>}>Garantir vaga</Button>
            </div>
            <div style={{ background: "var(--ink)", color: "var(--canvas)", padding: 48, position: "relative" }}>
              <span className="badge badge-accent" style={{ position: "absolute", top: 24, right: 24 }}>recomendado</span>
              <span className="t-mono" style={{ fontSize: 11, color: "var(--canvas)", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" }}>// plano.pro</span>
              <h3 className="t-display" style={{ fontSize: 56, marginTop: 12, color: "var(--canvas)" }}>R$ 1.297</h3>
              <p style={{ color: "var(--canvas)", opacity: 0.7, fontSize: 14 }}>12× R$ 129,70 · vitalício + mentoria</p>
              <ul style={{ paddingLeft: 0, listStyle: "none", margin: "24px 0", fontSize: 15, color: "var(--canvas)" }}>
                {["Tudo do plano.solo", "4× mentoria 1:1 (1h cada)", "Review de PR direto comigo", "Discord priority channel", "Acesso à próxima turma de graça"].map(b => (
                  <li key={b} style={{ padding: "6px 0", display: "flex", gap: 12 }}>
                    <span style={{ color: "var(--accent)" }}>+</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button variant="accent" iconRight={<ArrowIcon/>}>Garantir vaga PRO</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}

function BuildCard({ n, name, stack, body }) {
  return (
    <div style={{ background: "var(--soft-cloud)", padding: 32, aspectRatio: "4/5", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <span className="t-mono muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>// build.{n}</span>
        <h3 className="t-display" style={{ fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 0.92, marginTop: 12 }}>{name}</h3>
      </div>
      <div>
        <p style={{ fontSize: 15, color: "var(--mute)", lineHeight: 1.5, marginBottom: 18 }}>{body}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {stack.map(s => <span key={s} className="badge">{s}</span>)}
        </div>
      </div>
    </div>
  );
}

window.ArticlePage = ArticlePage;
window.BlogIndexPage = BlogIndexPage;
window.CategoryPage = CategoryPage;
window.AboutPage = AboutPage;
window.NewsletterPage = NewsletterPage;
window.CoursePage = CoursePage;
