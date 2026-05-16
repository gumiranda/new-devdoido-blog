// devdoido — pages
// Each page is a self-contained component that fills its artboard.

const {
  UtilityBar, PrimaryNav, Button, Chip, Stage, Terminal, TLine, AsciiRule,
  ArticleCard, Footer, ArrowIcon, PlayIcon, ClockIcon, EyeIcon,
} = window;

/* ============================================================
   PageShell — wraps an artboard with utility+nav+content+footer
   ============================================================ */

function PageShell({ active, children, fx = true }) {
  return (
    <div className="dd-page">
      {fx && <div className="dd-fx" />}
      <UtilityBar />
      <PrimaryNav active={active} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ============================================================
   HOME
   ============================================================ */

function HomePage() {
  return (
    <PageShell active="Home">
      {/* === Hero campaign tile — type-as-graphic === */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="tile tile-hero" style={{ minHeight: 720, padding: 0, justifyContent: "flex-end", overflow: "hidden" }}>
            <TypeStage word="DEVDOIDO" density={0.07} />
            {/* sticker top-left */}
            <div style={{ position: "absolute", top: 32, left: 32, display: "flex", gap: 8, zIndex: 1 }}>
              <span className="badge">edição #142</span>
              <span className="badge badge-solid">manifesto</span>
            </div>
            {/* top-right meta */}
            <div style={{ position: "absolute", top: 32, right: 32, textAlign: "right", zIndex: 1, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mute)", lineHeight: 1.5 }}>
              published 15.MAY.2026<br/>
              reading time 04:12<br/>
              reads 12,847
            </div>
            <div style={{ position: "relative", zIndex: 1, padding: 48 }}>
              <p className="t-mono muted" style={{ marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12 }}>
                ◆ artigo da semana · vibe coding
              </p>
              <h1 className="t-display" style={{ fontSize: "clamp(72px, 11vw, 180px)" }}>
                Pare de aprender<br/>framework. Aprenda<br/>a <span style={{ color: "var(--sale)" }}>pensar.</span>
              </h1>
              <p className="tile-sub" style={{ marginTop: 32, maxWidth: 560, fontSize: 18 }}>
                Você não precisa de mais um curso de Next.js. Você precisa parar de tratar IDE como tutorial e código como cargo. O artigo que ninguém quis publicar.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <Button variant="primary" iconRight={<ArrowIcon />}>Ler agora</Button>
                <Button variant="secondary">+412 artigos no arquivo</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === ASCII section separator === */}
      <div className="container">
        <AsciiRule label="// trending now · 7d" />
      </div>

      {/* === Trending row (3-up) === */}
      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32 }}>
            <h2 className="t-section">Em alta na bolha</h2>
            <a href="#" className="t-mono" style={{ color: "var(--ink)", textDecoration: "underline" }}>ver tudo →</a>
          </div>
          <div className="article-grid">
            <ArticleCard
              category="// vibe coding · 8 min"
              title="Claude Code ficou caro. Cursor virou refém. E agora?"
              author="@devdoido"
              date="12 MAY"
              reads="8.4k"
              kind="grid"
              display="A IDE morreu"
              badges={[{ label: "🔥 #1", solid: true }]}
            />
            <ArticleCard
              category="// IA · 12 min"
              title="Os 6 prompts que substituíram meu time de 4 devs"
              author="@devdoido"
              date="11 MAY"
              reads="6.1k"
              kind="mono"
              display="6 PROMPTS / 4 DEVS"
              badges={[{ label: "🔥 #2", solid: true }]}
            />
            <ArticleCard
              category="// SaaS · 6 min"
              title="Por que SaaS e micro-SaaS são a maior armadilha pra devs"
              author="@devdoido"
              date="10 MAY"
              reads="5.3k"
              kind="grid"
              display="A ARMADILHA DO MICRO-SAAS"
              badges={[{ label: "🔥 #3", solid: true }]}
            />
          </div>
        </div>
      </section>

      {/* === Categorias rail (4-up) === */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <AsciiRule label="// browse by categoria" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 32 }}>
            <CategoryTile name="Vibe Coding" count="48 posts" />
            <CategoryTile name="IA & Agents" count="91 posts" />
            <CategoryTile name="Micro-SaaS" count="62 posts" />
            <CategoryTile name="Carreira" count="37 posts" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 8 }}>
            <CategoryTile name="Next.js" count="29 posts" small />
            <CategoryTile name="React Native" count="18 posts" small />
            <CategoryTile name="Bun & Node" count="22 posts" small />
            <CategoryTile name="Conteúdo" count="14 posts" small />
          </div>
        </div>
      </section>

      {/* === Editorial campaign — wide 2-up: courses + manifesto === */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 8 }}>
            {/* curso tile — CrazyStack type-as-graphic */}
            <div className="tile" style={{ minHeight: 520, color: "var(--canvas)", padding: 0, justifyContent: "flex-end", overflow: "hidden" }}>
              <TypeStage word="CRAZY" invert density={0.16} />
              <div style={{ position: "relative", zIndex: 1, padding: 48 }}>
                <span className="badge" style={{ background: "transparent", color: "var(--canvas)", borderColor: "rgba(255,255,255,0.3)" }}>bootcamp · 14h · 2026</span>
                <h2 className="t-display" style={{ marginTop: 24, color: "var(--canvas)", fontSize: "clamp(56px, 7vw, 104px)" }}>
                  CrazyStack<br/>TypeScript
                </h2>
                <p style={{ color: "var(--canvas)", opacity: 0.8, maxWidth: 480, marginTop: 24, marginBottom: 32, fontSize: 17 }}>
                  Fullstack do zero ao deploy com Claude Code, Bun, Next 16, Convex e n8n. Não é teoria, é a stack que eu uso em produção há 8 meses.
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <Button variant="outline-on-image" iconRight={<ArrowIcon />}>Ver módulos</Button>
                  <Button variant="ghost" style={{ color: "var(--canvas)", border: "1px solid rgba(255,255,255,0.3)" }}>R$ 497 · 60% OFF</Button>
                </div>
              </div>
            </div>
            {/* terminal manifesto tile */}
            <div className="tile" style={{ minHeight: 520, padding: 48, background: "var(--soft-cloud)" }}>
              <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
                <p className="t-mono muted" style={{ fontSize: 11, marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  ◆ manifesto v.0.4
                </p>
                <Terminal title="cat MANIFESTO.md" accent>
                  <TLine cmd="# devdoido não é tutorial." accent/>
                  <TLine cmd="# é o que sobra depois que" accent/>
                  <TLine cmd="# o hype acaba."/>
                  <div style={{ height: 12 }}/>
                  <TLine p=">" cmd="conteúdo sem rodeio"/>
                  <TLine p=">" cmd="opinião sem patrocinador"/>
                  <TLine p=">" cmd="código que roda em prod"/>
                  <TLine p=">" cmd="zero promessa de salário"/>
                  <div style={{ height: 12 }}/>
                  <TLine p="$" cmd="ler manifesto completo" accent/>
                  <TLine p="" cmd="" out={<span className="cursor"></span>}/>
                </Terminal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Latest articles 4-up grid === */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <AsciiRule label="// últimos publicados" />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32 }}>
            <h2 className="t-section">Saiu fresquinho</h2>
            <div style={{ display: "flex", gap: 6 }}>
              <Chip active>Tudo</Chip>
              <Chip>Vibe</Chip>
              <Chip>IA</Chip>
              <Chip>SaaS</Chip>
              <Chip>Carreira</Chip>
            </div>
          </div>
          <div className="article-grid" style={{ "--grid-cols": 4 }}>
            <ArticleCard category="// IA · 5 min" title="Antigravity virou o novo Cursor (e ninguém viu chegando)" author="@devdoido" date="14 MAY" reads="2.1k" kind="grid" display="ANTI-GRAVITY" badges={[{label:"new"}]} />
            <ArticleCard category="// vibe · 7 min" title="A sandbox method: 90% faster, 0% pensar" author="@devdoido" date="13 MAY" reads="1.8k" kind="mono" display="SANDBOX METHOD" />
            <ArticleCard category="// SaaS · 9 min" title="Como cobrar R$ 10k/mês sendo dev solo em 2026" author="@devdoido" date="12 MAY" reads="3.2k" kind="grid" display="10K SOLO" badges={[{label:"long read"}]} />
            <ArticleCard category="// carreira · 4 min" title="Salário dev BR caiu 18% — culpa da IA ou do excel?" author="@devdoido" date="11 MAY" reads="4.5k" kind="mono" display="-18%" />
            <ArticleCard category="// IA · 6 min" title="Claude vs GPT-5 vs Gemini 3: testei em produção" author="@devdoido" date="10 MAY" reads="2.8k" kind="grid" display="MODEL WARS" />
            <ArticleCard category="// vibe · 11 min" title="Como debugar um app vibe-coded sem chorar" author="@devdoido" date="09 MAY" reads="1.6k" kind="mono" display="DEBUG OR DIE" />
            <ArticleCard category="// next · 3 min" title="Next 16 chegou: server actions finalmente prestam" author="@devdoido" date="08 MAY" reads="2.0k" kind="grid" display="NEXT 16" badges={[{label:"hot",sale:true}]} />
            <ArticleCard category="// SaaS · 8 min" title="Eu não vendo curso. Eu vendo desconforto." author="@devdoido" date="07 MAY" reads="3.9k" kind="mono" display="DESCONFORTO" />
          </div>
          <div className="center" style={{ marginTop: 48 }}>
            <Button variant="secondary" iconRight={<ArrowIcon />}>Ver +404 artigos</Button>
          </div>
        </div>
      </section>

      {/* === Newsletter strip === */}
      <NewsletterStrip />

      <Footer />
    </PageShell>
  );
}

function CategoryTile({ name, count, small }) {
  return (
    <a href="#" className="cat-tile" style={small ? { aspectRatio: "16/9" } : {}}>
      <div className={`stage ${small ? "stage-mono" : "stage-grid"}`} style={{ position: "absolute", inset: 0 }}/>
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <h3 className="cat-tile-name" style={small ? { fontSize: "clamp(20px,2vw,28px)" } : {}}>{name}</h3>
        <span className="t-mono muted" style={{ fontSize: 11 }}>{count}</span>
      </div>
    </a>
  );
}

function NewsletterStrip() {
  return (
    <section style={{ background: "var(--ink)", color: "var(--canvas)", padding: "80px 32px" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <p className="t-mono" style={{ color: "var(--canvas)", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18, fontSize: 12 }}>
            ◆ newsletter · toda quinta · 6h da manhã
          </p>
          <h2 className="t-display" style={{ color: "var(--canvas)", fontSize: "clamp(56px, 8vw, 120px)" }}>
            1 email.<br/>0 conselho<br/>de coach.
          </h2>
        </div>
        <div>
          <p style={{ color: "var(--canvas)", opacity: 0.8, fontSize: 17, marginBottom: 24, maxWidth: 460 }}>
            Toda quinta às 6h: 3 links que eu li essa semana, 1 opinião impopular, 1 trecho de código que tá em produção. Nada de "10 razões pra você aprender X".
          </p>
          <div style={{ display: "flex", gap: 8, maxWidth: 480 }}>
            <input
              placeholder="seu@email.com"
              style={{
                flex: 1, height: 48, padding: "0 18px",
                background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
                color: "var(--canvas)", borderRadius: "var(--r-lg)", fontFamily: "var(--font-ui)", fontSize: 16,
              }}
            />
            <Button variant="accent">Assinar →</Button>
          </div>
          <p className="t-mono" style={{ color: "var(--canvas)", opacity: 0.5, fontSize: 11, marginTop: 12 }}>
            12,847 devs · 0% spam · 1 unsubscribe-click
          </p>
        </div>
      </div>
    </section>
  );
}

window.HomePage = HomePage;
window.NewsletterStrip = NewsletterStrip;
window.CategoryTile = CategoryTile;
window.PageShell = PageShell;
