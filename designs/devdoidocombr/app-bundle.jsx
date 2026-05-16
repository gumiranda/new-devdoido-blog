// devdoido — bundle (auto-concatenated, IIFE-wrapped per file)
// Files merged: components.jsx, page-home.jsx, page-others.jsx, page-admin.jsx, variations.jsx, app.jsx


/* ============================================================
   FILE: components.jsx
   ============================================================ */
(function(){
// devdoido — shared UI components
// Each component takes plain props, no global state.

const { useState, useEffect, useRef } = React;

/* ============================================================
   UTILITY BAR + PRIMARY NAV
   ============================================================ */

function UtilityBar() {
  return (
    <div className="utility-bar">
      <span>// devdoido.com.br · conteúdo dev sem rodeio</span>
      <span>
        <a href="#feed">RSS</a>
        <a href="#x">X/twitter</a>
        <a href="#yt">YouTube</a>
        <a href="#login">Entrar</a>
      </span>
    </div>
  );
}

function PrimaryNav({ active = "Home" }) {
  const links = ["Home", "Vibe Coding", "IA", "SaaS", "Carreira", "Cursos"];
  return (
    <nav className="primary-nav">
      <a href="#" className="brand">
        <span className="brand-mark">DD</span>
        DEVDOIDO
      </a>
      <div className="nav-links">
        {links.map((l) => (
          <a key={l} href="#" className={l === active ? "active" : ""}>
            {l}
          </a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label className="search-pill" aria-label="Buscar">
          <SearchIcon />
          <input placeholder="busca por artigo, tag, autor…" />
          <span className="t-mono muted" style={{ fontSize: 11 }}>⌘K</span>
        </label>
        <button className="btn-icon" aria-label="Salvos"><BookmarkIcon /></button>
        <button className="btn-icon" aria-label="Conta"><UserIcon /></button>
      </div>
    </nav>
  );
}

/* ============================================================
   ICONS — tiny line-only set
   ============================================================ */

const ico = { width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
function SearchIcon() { return (<svg {...ico} viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>); }
function BookmarkIcon() { return (<svg {...ico} viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4z"/></svg>); }
function UserIcon() { return (<svg {...ico} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6"/></svg>); }
function ArrowIcon({ rot = 0 }) { return (<svg {...ico} viewBox="0 0 24 24" style={{ transform: `rotate(${rot}deg)` }}><path d="M5 12h14M13 6l6 6-6 6"/></svg>); }
function PlayIcon() { return (<svg {...ico} viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7z"/></svg>); }
function ClockIcon() { return (<svg {...ico} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>); }
function EyeIcon() { return (<svg {...ico} viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>); }

window.DDIcons = { SearchIcon, BookmarkIcon, UserIcon, ArrowIcon, PlayIcon, ClockIcon, EyeIcon };

/* ============================================================
   BUTTON + CHIP
   ============================================================ */

function Button({ variant = "primary", size, children, icon, iconRight, as = "button", href, ...rest }) {
  const cls = `btn btn-${variant} ${size ? `btn-${size}` : ""}`;
  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {iconRight}
    </>
  );
  if (as === "a") return (<a className={cls} href={href} {...rest}>{inner}</a>);
  return (<button className={cls} {...rest}>{inner}</button>);
}

function Chip({ active, children, onClick }) {
  return (
    <button className="chip" aria-pressed={!!active} onClick={onClick}>{children}</button>
  );
}

/* ============================================================
   IMAGE PLACEHOLDER STAGES
   Stand-in for the "photography" slot in the Nike system.
   In a real build these are replaced by article cover images.
   ============================================================ */

function Stage({ kind = "mono", headline, headlineColor = "ink", mark, children, style, src, position = "center" }) {
  return (
    <div className="acard-img" style={style}>
      {src ? (
        <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: position }} />
      ) : (
        <div className={`stage stage-${kind}`} />
      )}
      {mark && <div style={{ position: "absolute", top: 16, left: 16, zIndex: 1 }}>{mark}</div>}
      {children && <div style={{ position: "absolute", inset: 0 }}>{children}</div>}
      {headline && (
        <div className={`acard-img-headline ${headlineColor === "canvas" ? "on-dark" : ""}`}>
          {headline}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   TYPE STAGE — type-as-graphic background
   Substitui foto editorial por tipografia massiva (estilo Nike pure)
   ============================================================ */

function TypeStage({ word = "DEVDOIDO", invert = false, density = 0.07, withGrid = true, children, style }) {
  const bg = invert ? "var(--ink)" : "var(--soft-cloud)";
  const fg = invert ? "var(--canvas)" : "var(--ink)";
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, overflow: "hidden", ...style }}>
      {/* huge wordmark */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 500,
        fontSize: "clamp(220px, 36vw, 640px)", lineHeight: 0.78,
        color: fg, opacity: density,
        letterSpacing: "-0.04em", whiteSpace: "nowrap",
        pointerEvents: "none", userSelect: "none", textTransform: "uppercase",
      }}>
        {word}
      </div>
      {/* hairline grid */}
      {withGrid && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          backgroundImage:
            `repeating-linear-gradient(0deg, ${invert ? "rgba(255,255,255,0.04)" : "var(--hairline-soft)"} 0 1px, transparent 1px 80px),` +
            `repeating-linear-gradient(90deg, ${invert ? "rgba(255,255,255,0.04)" : "var(--hairline-soft)"} 0 1px, transparent 1px 80px)`,
          opacity: 0.7, pointerEvents: "none",
        }} />
      )}
      {/* corner crop marks */}
      <CropMarks invert={invert} />
      {children}
    </div>
  );
}

function CropMarks({ invert }) {
  const c = invert ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";
  const s = { position: "absolute", width: 24, height: 24, pointerEvents: "none" };
  const line = (orient) => ({
    position: "absolute", background: c,
    ...(orient === "h" ? { left: 0, right: 0, height: 1, top: "50%" } : { top: 0, bottom: 0, width: 1, left: "50%" }),
  });
  return (
    <>
      <div style={{ ...s, top: 16, left: 16 }}><div style={line("h")}/><div style={line("v")}/></div>
      <div style={{ ...s, top: 16, right: 16 }}><div style={line("h")}/><div style={line("v")}/></div>
      <div style={{ ...s, bottom: 16, left: 16 }}><div style={line("h")}/><div style={line("v")}/></div>
      <div style={{ ...s, bottom: 16, right: 16 }}><div style={line("h")}/><div style={line("v")}/></div>
    </>
  );
}

/* ============================================================
   TERMINAL BLOCK
   ============================================================ */

function Terminal({ title = "~/devdoido", children, accent }) {
  return (
    <div className="term" style={accent ? { borderColor: "var(--accent)" } : {}}>
      <div className="term-head">
        <span className="term-dot" style={{ background: "#ff5f56" }}></span>
        <span className="term-dot" style={{ background: "#ffbd2e" }}></span>
        <span className="term-dot" style={{ background: "#27c93f" }}></span>
        <span style={{ marginLeft: 8 }}>{title}</span>
      </div>
      <div className="term-body">{children}</div>
    </div>
  );
}
function TLine({ p = "$", cmd, out, accent }) {
  return (
    <div>
      {p && <span className="term-prompt">{p} </span>}
      {cmd && <span className={accent ? "term-accent" : "term-cmd"}>{cmd}</span>}
      {out && <div className="term-out">{out}</div>}
    </div>
  );
}

/* ============================================================
   ASCII DIVIDER
   ============================================================ */

function AsciiRule({ char = "─", label }) {
  const line = char.repeat(120);
  if (!label) return <div className="ascii-rule">{line}</div>;
  return (
    <div className="ascii-rule" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ flex: 1, overflow: "hidden" }}>{line}</span>
    </div>
  );
}

/* ============================================================
   ARTICLE CARD
   ============================================================ */

function ArticleCard({ category, title, author, date, reads, kind = "mono", display, displayColor, badges = [], size, src, position }) {
  return (
    <a className="acard" href="#">
      <Stage kind={kind} headline={display} headlineColor={displayColor} src={src} position={position}
        style={size === "wide" ? { aspectRatio: "16/10" } : size === "square" ? { aspectRatio: "1/1" } : undefined}
        mark={badges.length ? (
          <div style={{ display: "flex", gap: 6 }}>
            {badges.map((b, i) => <span key={i} className={`badge ${b.solid ? "badge-solid" : b.sale ? "badge-sale" : b.accent ? "badge-accent" : ""}`}>{b.label}</span>)}
          </div>
        ) : null}
      />
      <div className="acard-cat">{category}</div>
      <h3 className="acard-title">{title}</h3>
      <div className="acard-meta">
        <span>{author}</span>
        <span className="acard-meta-dot"></span>
        <span>{date}</span>
        {reads && (<>
          <span className="acard-meta-dot"></span>
          <span>{reads} leituras</span>
        </>)}
      </div>
    </a>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  return (
    <footer className="footer">
      <div style={{ marginBottom: 48 }}>
        <h2 className="t-display" style={{ fontSize: "clamp(80px, 14vw, 200px)", lineHeight: 0.82 }}>
          DEVDOIDO.<br/>SEM RODEIO.
        </h2>
      </div>
      <div className="footer-grid">
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <span className="badge">v.2026.05</span>
            <span className="badge badge-solid">+412 artigos</span>
          </div>
          <p className="t-caption" style={{ maxWidth: 320 }}>
            Conteúdo bruto sobre programação, IA, vibe coding e o universo dev. Sem hype, sem curso de R$ 9,90, sem promessa de virar sênior em 6 meses.
          </p>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Conteúdo</h4>
          <a href="#">Últimos artigos</a>
          <a href="#">Mais lidos</a>
          <a href="#">Vibe coding</a>
          <a href="#">IA & agents</a>
          <a href="#">Micro-SaaS</a>
          <a href="#">Carreira</a>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Cursos</h4>
          <a href="#">CrazyStack</a>
          <a href="#">Bun.js do zero</a>
          <a href="#">Claude Code Pro</a>
          <a href="#">Next.js completo</a>
          <a href="#">Trilha React Native</a>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Comunidade</h4>
          <a href="#">Discord</a>
          <a href="#">YouTube</a>
          <a href="#">X/twitter</a>
          <a href="#">Newsletter</a>
          <a href="#">RSS feed</a>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Sobre</h4>
          <a href="#">Quem é o devdoido</a>
          <a href="#">Manifesto</a>
          <a href="#">Política</a>
          <a href="#">Contato</a>
          <a href="#">Anuncie</a>
        </div>
      </div>
      <div className="footer-fine">
        <span>© 2026 devdoido — feito no Brasil, em Next.js, sem framework de hype.</span>
        <span>last build: 2026-05-15 14:22:08 UTC · 7ms · 412 posts</span>
      </div>
    </footer>
  );
}

/* Export to global so other Babel scripts can use them */
Object.assign(window, {
  UtilityBar, PrimaryNav, Button, Chip, Stage, TypeStage, CropMarks,
  Terminal, TLine, AsciiRule,
  ArticleCard, Footer,
  SearchIcon, BookmarkIcon, UserIcon, ArrowIcon, PlayIcon, ClockIcon, EyeIcon,
});

})();

/* ============================================================
   FILE: page-home.jsx
   ============================================================ */
(function(){
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

})();

/* ============================================================
   FILE: page-others.jsx
   ============================================================ */
(function(){
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

})();

/* ============================================================
   FILE: page-admin.jsx
   ============================================================ */
(function(){
// devdoido — admin: YouTube → transcript page

const { PageShell, Button, Chip, TypeStage, Terminal, TLine, AsciiRule, ArrowIcon, PlayIcon, ClockIcon, EyeIcon } = window;
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

/* Mock transcript for the demo state */
const MOCK_TRANSCRIPT = [
  { t: "00:00", text: "E aí galera, bem-vindos a mais um vídeo aqui no canal. Hoje a gente vai falar de uma coisa que me incomoda muito no mundo dev." },
  { t: "00:08", text: "Vibe coding. Esse termo virou febre, e como toda febre, tem gente usando o termo sem entender o que tá fazendo." },
  { t: "00:18", text: "Andrej Karpathy cunhou o termo em fevereiro. A ideia original dele era simples: usar IA pra codar como quem conversa, sem ficar lendo todo o código." },
  { t: "00:31", text: "Aí o que aconteceu? Cada criador de conteúdo, cada curso de R$ 47, cada thread do twitter agarrou esse termo e fez virar a próxima coisa." },
  { t: "00:44", text: "E o problema é que vibe coding NÃO É pra todo mundo. Não é pra quem tá começando." },
  { t: "00:52", text: "Se você não sabe debugar um useEffect, você não vai conseguir debugar uma feature que a IA escreveu inteira pra você. Você vai só rezar e dar reload." },
  { t: "01:08", text: "Tem 4 níveis de quem usa IA pra programar. Nível 1: turista. Copia, cola, reza." },
  { t: "01:20", text: "Nível 2: apprentice. Lê o que a IA escreveu, edita umas duas linhas, segue. Nível 3: operator. Sabe o que quer, pede em pedaços, valida tudo." },
  { t: "01:38", text: "E nível 4: arquiteto. Usa IA pra acelerar o que já sabia fazer sozinho. A maioria dos cursos vende nível 4 e entrega nível 1." },
  { t: "01:52", text: "Você sai sabendo gerar landing page no Lovable mas não consegue arrumar um bug de hidratação no Next." },
  { t: "02:04", text: "A pergunta certa não é 'qual ferramenta de IA usar'. É 'em qual nível eu tô e o que eu preciso saber pra subir um'." },
  { t: "02:16", text: "Eu vou deixar três perguntas no final do vídeo. Se você responder não pra duas delas, você não tá programando." },
  { t: "02:24", text: "Você tá fazendo prompt engineering com extra steps. Vamos no próximo bloco." },
];

function AdminTranscribePage() {
  const [url, setUrl] = useStateA("https://www.youtube.com/watch?v=K-mfP_2_F2k");
  const [status, setStatus] = useStateA("done"); // idle | working | done
  const [progress, setProgress] = useStateA(100);
  const [activeT, setActiveT] = useStateA(null);
  const [aiOutput, setAiOutput] = useStateA(null);
  const [aiLoading, setAiLoading] = useStateA(false);

  function startJob() {
    setStatus("working"); setProgress(0); setAiOutput(null);
    const steps = [12, 28, 52, 78, 94, 100];
    let i = 0;
    const tick = () => {
      if (i >= steps.length) { setStatus("done"); return; }
      setProgress(steps[i]); i++;
      setTimeout(tick, 380);
    };
    tick();
  }

  async function runAISummary() {
    setAiLoading(true); setAiOutput(null);
    try {
      const full = MOCK_TRANSCRIPT.map(s => s.text).join(" ");
      const out = await window.claude.complete({
        messages: [{
          role: "user",
          content:
            "Você é o devdoido escrevendo no seu blog. Pega essa transcrição de vídeo do YouTube e gere um RASCUNHO de artigo curto: 1 título provocativo em pt-BR (sem 'descubra como', sem clickbait raso), 1 subtítulo de 1 linha, 3 bullets das ideias-chave, e 1 parágrafo de abertura no tom devdoido (sarcástico, contrarian, sem pity, mineiro). Saída em markdown.\n\nTRANSCRIÇÃO:\n" + full
        }]
      });
      setAiOutput(out);
    } catch (e) {
      setAiOutput("⚠ falhou: " + (e?.message || e));
    } finally {
      setAiLoading(false);
    }
  }

  function copyAll() {
    const txt = MOCK_TRANSCRIPT.map(s => `[${s.t}] ${s.text}`).join("\n");
    navigator.clipboard?.writeText(txt);
  }

  return (
    <div className="dd-page">
      <div className="dd-fx" />
      {/* admin utility bar — distinct from public */}
      <div className="utility-bar" style={{ background: "var(--ink)", color: "var(--canvas)" }}>
        <span>// admin · devdoido.com.br/admin</span>
        <span style={{ fontFamily: "var(--font-mono)" }}>
          @devdoido · session 4h 12m · 412 posts published
        </span>
      </div>

      {/* Admin nav strip — slimmer */}
      <nav className="primary-nav" style={{ borderBottom: "1px solid var(--hairline)" }}>
        <a href="#" className="brand">
          <span className="brand-mark">DD</span>
          DEVDOIDO <span className="t-mono muted" style={{ fontSize: 11, marginLeft: 8, letterSpacing: "0.08em" }}>/ ADMIN</span>
        </a>
        <div className="nav-links">
          <a href="#">Posts</a>
          <a href="#">Drafts</a>
          <a href="#" className="active">Transcribe</a>
          <a href="#">Stats</a>
          <a href="#">Subscribers</a>
          <a href="#">Settings</a>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" size="sm">Voltar ao site →</Button>
        </div>
      </nav>

      {/* Page header — editorial style */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="tile" style={{ minHeight: 280, padding: 0, justifyContent: "flex-end", overflow: "hidden" }}>
            <TypeStage word="TRANSCRIBE" density={0.07} />
            <div style={{ position: "absolute", top: 24, left: 24, display: "flex", gap: 6, zIndex: 1 }}>
              <span className="badge">/ admin / transcribe</span>
              <span className="badge badge-solid">v.0.4 · beta</span>
            </div>
            <div style={{ position: "absolute", top: 24, right: 24, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mute)", textAlign: "right", lineHeight: 1.5, zIndex: 1 }}>
              jobs hoje · 4<br/>
              transcript queue · 0<br/>
              usage · 12 / 100 essa semana
            </div>
            <div style={{ position: "relative", zIndex: 1, padding: 32 }}>
              <h1 className="t-display" style={{ fontSize: "clamp(56px, 8vw, 120px)", lineHeight: 0.86 }}>
                YouTube →<br/>Texto. <span style={{ color: "var(--sale)" }}>Bruto.</span>
              </h1>
              <p style={{ fontSize: 17, color: "var(--mute)", maxWidth: 540, marginTop: 18 }}>
                Cola a URL, escolhe o que fazer. Transcript completo + timestamps + summarize com Claude + export pra rascunho de artigo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* URL input bar */}
      <section style={{ padding: "0 32px 24px" }}>
        <div className="container" style={{ padding: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 8, alignItems: "stretch" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: "var(--soft-cloud)", border: "1px solid var(--hairline)", borderRadius: "var(--r-lg)", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--mute)" }}>
              <YTIcon /> youtube.com
            </div>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="cola a URL do vídeo aqui — youtube.com/watch?v=... ou youtu.be/..."
              style={{
                height: 56, padding: "0 24px",
                background: "var(--canvas)", border: "1px solid var(--hairline)",
                color: "var(--ink)", borderRadius: "var(--r-lg)",
                fontFamily: "var(--font-mono)", fontSize: 14,
                width: "100%",
              }}
            />
            <Button variant="secondary" size="sm" onClick={() => setUrl("")}>limpar</Button>
            <Button variant="primary" onClick={startJob} disabled={!url || status === "working"} iconRight={<ArrowIcon/>}>
              {status === "working" ? "Transcrevendo…" : "Transcrever"}
            </Button>
          </div>

          {/* Options row */}
          <div style={{ display: "flex", gap: 6, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
            <span className="t-caption" style={{ marginRight: 6 }}>opções:</span>
            <Chip active>idioma · auto</Chip>
            <Chip>com timestamps</Chip>
            <Chip>diarização (quem fala)</Chip>
            <Chip>punctuation cleanup</Chip>
            <Chip>capítulos</Chip>
            <span style={{ flex: 1 }} />
            <span className="t-mono muted" style={{ fontSize: 11 }}>
              custo estimado · ~$0.012 USD · ~9 min de vídeo
            </span>
          </div>
        </div>
      </section>

      {/* Working state — terminal output */}
      {status !== "idle" && (
        <section style={{ padding: "0 32px 32px" }}>
          <div className="container" style={{ padding: 0 }}>
            <Terminal title={`job://yt-K-mfP_2_F2k · ${status === "done" ? "complete" : "running"}`} accent={status === "working"}>
              <TLine p="◆" cmd={`[1/5] extract video metadata        `} out={<Status ok>ok · 142ms</Status>}/>
              <TLine p="◆" cmd={`[2/5] download audio (m4a)          `} out={<Status ok>ok · 3.2 MB · 1.8s</Status>}/>
              <TLine p="◆" cmd={`[3/5] whisper-large-v3 transcribe   `} out={<Status ok>ok · 13 segments · 9.4s</Status>}/>
              <TLine p="◆" cmd={`[4/5] punctuation + cleanup         `} out={<Status ok>ok · 412 tokens · 0.6s</Status>}/>
              <TLine p="◆" cmd={`[5/5] save to drafts                `} out={status === "done" ? <Status ok>ok · saved</Status> : <Status>running…</Status>}/>
              <div style={{ height: 8 }}/>
              {/* progress bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="term-prompt">progress</span>
                <div style={{ flex: 1, height: 6, background: "var(--hairline)", borderRadius: 0, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: status === "done" ? "var(--ink)" : "var(--sale)", transition: "width .3s" }} />
                </div>
                <span className="term-cmd" style={{ minWidth: 56, textAlign: "right" }}>{progress}%</span>
              </div>
            </Terminal>
          </div>
        </section>
      )}

      {/* Result — two-pane */}
      {status === "done" && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <AsciiRule label="// result · pare-de-aprender-framework · 02:30" />
            <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 32, marginTop: 32 }}>
              {/* video meta */}
              <aside>
                <div style={{ aspectRatio: "16/9", background: "var(--soft-cloud)", border: "1px solid var(--hairline)", position: "relative", marginBottom: 18 }}>
                  <div className="stage stage-grid" style={{ position: "absolute", inset: 0 }}/>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--ink)", color: "var(--canvas)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PlayIcon />
                    </div>
                  </div>
                  <span className="badge badge-solid" style={{ position: "absolute", bottom: 8, right: 8 }}>02:30</span>
                </div>
                <h3 className="t-h-md" style={{ marginBottom: 8 }}>Pare de aprender framework. Aprenda a pensar.</h3>
                <p className="t-caption" style={{ marginBottom: 18 }}>devdoido · 47k visualizações · há 3 dias</p>

                <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 18 }}>
                  <Meta label="duração" value="02:30" />
                  <Meta label="segmentos" value="13" />
                  <Meta label="tokens" value="412" />
                  <Meta label="idioma" value="pt-BR (98%)" />
                  <Meta label="modelo" value="whisper-large-v3" />
                  <Meta label="word error rate" value="~3.2% est." />
                </div>

                <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Button variant="primary" onClick={copyAll} iconRight={<CopyIcon/>}>Copiar tudo (txt)</Button>
                  <Button variant="secondary" size="sm">Download .srt</Button>
                  <Button variant="secondary" size="sm">Download .md</Button>
                  <Button variant="secondary" size="sm">Download .json</Button>
                </div>

                <div style={{ marginTop: 24, padding: 16, background: "var(--soft-cloud)", border: "1px solid var(--hairline)" }}>
                  <div className="t-mono muted" style={{ fontSize: 11, marginBottom: 8 }}>// SHORTCUTS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    <KbdRow k="J / K" desc="próximo / anterior" />
                    <KbdRow k="Space" desc="play / pause" />
                    <KbdRow k="⌘ + C" desc="copiar segmento" />
                    <KbdRow k="⌘ + ⇧ + A" desc="rodar AI summary" />
                  </div>
                </div>
              </aside>

              {/* transcript */}
              <div>
                {/* sub-actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                  <Chip active>Transcrição</Chip>
                  <Chip>Capítulos · 4</Chip>
                  <Chip>Quotes &amp; ganchos</Chip>
                  <Chip>Buscar…</Chip>
                  <span style={{ flex: 1 }} />
                  <span className="t-mono muted" style={{ fontSize: 11 }}>13 segments · 412 tokens · 02:30</span>
                </div>

                {/* transcript body */}
                <div style={{ background: "var(--canvas)", border: "1px solid var(--hairline)" }}>
                  {MOCK_TRANSCRIPT.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveT(i)}
                      style={{
                        display: "grid", gridTemplateColumns: "80px 1fr auto",
                        gap: 18, alignItems: "start",
                        padding: "16px 20px",
                        borderBottom: i < MOCK_TRANSCRIPT.length - 1 ? "1px solid var(--hairline-soft)" : "none",
                        background: activeT === i ? "var(--soft-cloud)" : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <span className="t-mono" style={{ color: "var(--mute)", fontSize: 12, paddingTop: 2 }}>{s.t}</span>
                      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: "var(--ink)" }}>{s.text}</p>
                      <span className="t-mono muted" style={{ fontSize: 10, paddingTop: 4, opacity: activeT === i ? 1 : 0 }}>⌘C</span>
                    </div>
                  ))}
                </div>

                {/* CTA row */}
                <div style={{ marginTop: 24, padding: 24, background: "var(--ink)", color: "var(--canvas)", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
                  <div>
                    <div className="t-mono" style={{ fontSize: 11, color: "var(--canvas)", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>◆ próximo passo</div>
                    <div style={{ fontSize: 19, fontWeight: 600, color: "var(--canvas)" }}>Transformar em rascunho de artigo com Claude?</div>
                    <div style={{ fontSize: 13, color: "var(--canvas)", opacity: 0.6, marginTop: 6, fontFamily: "var(--font-mono)" }}>
                      claude-haiku-4-5 · ~3s · template: artigo curto, tom devdoido
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button variant="outline-on-image" size="sm" onClick={runAISummary} disabled={aiLoading}>
                      {aiLoading ? "Gerando…" : "Gerar rascunho →"}
                    </Button>
                  </div>
                </div>

                {/* AI output */}
                {(aiLoading || aiOutput) && (
                  <div style={{ marginTop: 18 }}>
                    <AsciiRule label="// claude.draft" />
                    <div style={{ background: "var(--soft-cloud)", border: "1px solid var(--hairline)", padding: 24, fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--ink)" }}>
                      {aiLoading ? <><span className="cursor"></span> claude pensando…</> : aiOutput}
                    </div>
                    {aiOutput && (
                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <Button variant="primary" size="sm">Salvar como draft</Button>
                        <Button variant="secondary" size="sm" onClick={() => navigator.clipboard?.writeText(aiOutput)}>Copiar markdown</Button>
                        <Button variant="secondary" size="sm" onClick={runAISummary}>↻ Regenerar</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent jobs */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <AsciiRule label="// recent jobs · últimas 24h" />
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24, fontFamily: "var(--font-ui)", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--hairline)" }}>
                <Th>vídeo</Th>
                <Th>canal</Th>
                <Th right>duração</Th>
                <Th right>tokens</Th>
                <Th>status</Th>
                <Th>ações</Th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Pare de aprender framework", "@devdoido", "02:30", "412", "done · agora", "draft"],
                ["Como cobrar R$10k sendo dev solo", "@devdoido", "08:14", "1.4k", "done · 2h ago", "publicado"],
                ["Claude vs GPT-5 na real", "Filipe Deschamps", "11:48", "2.1k", "done · 5h ago", "ignorado"],
                ["Antigravity em 30 dias", "@devdoido", "06:22", "987", "done · ontem", "publicado"],
                ["Bun 2.0 quebra tudo", "Theo - t3.gg", "09:01", "1.6k", "done · ontem", "draft"],
                ["Por que SaaS é armadilha", "@devdoido", "07:55", "1.2k", "done · 2d ago", "publicado"],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--hairline-soft)" }}>
                  <Td><a href="#" style={{ color: "var(--ink)", textDecoration: "none", fontWeight: 500 }}>{row[0]}</a></Td>
                  <Td muted>{row[1]}</Td>
                  <Td right mono>{row[2]}</Td>
                  <Td right mono>{row[3]}</Td>
                  <Td mono>{row[4]}</Td>
                  <Td>
                    <span className={`badge ${row[5] === "publicado" ? "badge-solid" : ""}`} style={{ fontSize: 10 }}>{row[5]}</span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="t-caption">mostrando 6 · 142 jobs nos últimos 30 dias</span>
            <Button variant="secondary" size="sm">Ver histórico completo →</Button>
          </div>
        </div>
      </section>

      {/* Footer admin */}
      <footer style={{ borderTop: "1px solid var(--hairline)", padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mute)" }}>
        <span>// admin · devdoido v.2026.05 · build a8f3c2d</span>
        <span>whisper-large-v3 · claude-haiku-4-5 · vercel functions · 8 jobs/h limit</span>
      </footer>
    </div>
  );
}

function Status({ children, ok }) {
  return <span style={{ color: ok ? "var(--ink)" : "var(--sale)", fontFamily: "var(--font-mono)" }}>{ok ? "✓ " : "↻ "}{children}</span>;
}

function Meta({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--hairline-soft)", fontSize: 13 }}>
      <span style={{ color: "var(--mute)" }}>{label}</span>
      <span className="t-mono" style={{ color: "var(--ink)" }}>{value}</span>
    </div>
  );
}

function KbdRow({ k, desc }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
      <span style={{ color: "var(--mute)" }}>{desc}</span>
      <kbd style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", padding: "2px 6px", fontSize: 11, color: "var(--ink)", fontFamily: "var(--font-mono)" }}>{k}</kbd>
    </div>
  );
}

function Th({ children, right }) {
  return <th style={{ textAlign: right ? "right" : "left", padding: "12px 16px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--mute)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{children}</th>;
}
function Td({ children, right, mono, muted }) {
  return <td style={{ textAlign: right ? "right" : "left", padding: "14px 16px", fontFamily: mono ? "var(--font-mono)" : undefined, color: muted ? "var(--mute)" : "var(--ink)", fontSize: mono ? 13 : 14 }}>{children}</td>;
}

function YTIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 24 17" fill="currentColor" aria-hidden="true">
      <path d="M23 2.5a3 3 0 0 0-2.1-2.1C19 0 12 0 12 0S5 0 3.1.4A3 3 0 0 0 1 2.5C.5 4.4.5 8.5.5 8.5s0 4.1.5 6a3 3 0 0 0 2.1 2.1c1.9.4 8.9.4 8.9.4s7 0 8.9-.4a3 3 0 0 0 2.1-2.1c.5-1.9.5-6 .5-6s0-4.1-.5-6zM9.5 12V5l6 3.5-6 3.5z"/>
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="1"/>
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>
    </svg>
  );
}

window.AdminTranscribePage = AdminTranscribePage;

})();

/* ============================================================
   FILE: variations.jsx
   ============================================================ */
(function(){
// devdoido — 5 visual direction variations of the homepage hero strip
// Each shows the same content with a totally different aesthetic, so the
// user can pick which direction to push.

const { Button, Stage, Terminal, TLine, AsciiRule, ArticleCard, ArrowIcon } = window;

/* ============================================================
   VARIATION SCAFFOLD — same content, different chrome
   variant = "pure" | "lime" | "acid" | "print" | "terminal"
   ============================================================ */

function VariationHome({ variant, theme = "dark", label, summary }) {
  return (
    <div className="dd-page" data-variant={variant} data-theme={theme}>
      <div className="dd-fx" />
      {/* mini-nav specific to variation showcase */}
      <div style={{
        background: "var(--canvas)", borderBottom: "1px solid var(--hairline)",
        padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="brand-mark">DD</span>
          <span className="brand" style={{ fontSize: 20 }}>DEVDOIDO</span>
          <span className="badge" style={{ marginLeft: 12 }}>variant: {variant}</span>
        </div>
        <div style={{ display: "flex", gap: 18, fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600 }}>
          <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>Home</a>
          <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>Vibe</a>
          <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>IA</a>
          <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>Cursos</a>
        </div>
      </div>

      {/* hero */}
      <section style={{ padding: "32px 24px" }}>
        <div className="tile tile-hero" style={{ minHeight: 560, padding: 0, justifyContent: "flex-end" }}>
          <img src="assets/portrait.png" alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "65% center" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.92) 100%)" }} />

          <div style={{ position: "absolute", top: 24, left: 24, display: "flex", gap: 6, zIndex: 1 }}>
            <span className="badge" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(8px)" }}>{label}</span>
            <span className="badge" style={{ background: "var(--accent)", color: "#000", borderColor: "var(--accent)" }}>manifesto</span>
          </div>
          <div style={{ position: "absolute", top: 24, right: 24, fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.7)", textAlign: "right", lineHeight: 1.5, zIndex: 1 }}>
            15.MAY.2026<br/>12,847 leituras
          </div>
          <div style={{ position: "relative", zIndex: 1, padding: 32, color: "#fff" }}>
            <p className="t-mono" style={{ color: "var(--accent)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
              ◆ artigo da semana
            </p>
            <h1 className="t-display" style={{ fontSize: "clamp(56px, 8vw, 120px)", color: "#fff" }}>
              Pare de aprender<br/>framework.<br/>Aprenda a <span style={{ color: "var(--accent)" }}>pensar.</span>
            </h1>
            <p className="tile-sub" style={{ marginTop: 24, fontSize: 17, maxWidth: 460, color: "rgba(255,255,255,0.85)" }}>
              {summary}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="outline-on-image" iconRight={<ArrowIcon/>}>Ler agora</Button>
              <Button variant="ghost" style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>+412 artigos</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-up trending row preview */}
      <section style={{ padding: "0 24px 32px" }}>
        <AsciiRule label={`// ${label} preview · 3 artigos`} />
        <div className="article-grid" style={{ "--grid-cols": 3 }}>
          <ArticleCard category="// vibe · 8 min" title="Claude Code ficou caro" author="@devdoido" date="12 MAY" reads="8.4k" kind="grid" display="IDE WARS" badges={[{label:"#1",solid:true}]}/>
          <ArticleCard category="// IA · 12 min" title="Os 6 prompts que substituíram time" author="@devdoido" date="11 MAY" reads="6.1k" kind="mono" display="6/4"/>
          <ArticleCard category="// SaaS · 6 min" title="SaaS é armadilha pra dev" author="@devdoido" date="10 MAY" reads="5.3k" kind="grid" display="ARMADILHA"/>
        </div>
      </section>
    </div>
  );
}

/* The 5 variations as ready-to-render artboards */

function VariationPure() {
  return <VariationHome variant="pure" theme="dark" label="pure · zero accent"
    summary="A direção mais fiel ao sistema Nike: preto, branco, cinza, zero acento. Todo o peso vai pra tipografia display e pra fotografia editorial." />;
}
function VariationLime() {
  return <VariationHome variant="lime" theme="dark" label="lime · CrazyStack legacy"
    summary="Mantém o lime neon do CrazyStack atual, mas usa só como o vermelho 'sale' da Nike — pontual, em preço/destaque/sale, nunca como cor de chrome." />;
}
function VariationAcid() {
  return <VariationHome variant="acid" theme="dark" label="acid · maximum loud"
    summary="Mesma gramática, mas com display headlines 40% maiores, glitch shadow nas manchetes, scanlines fortes. Pra quem quer que o site grite." />;
}
function VariationPrint() {
  return <VariationHome variant="print" theme="light" label="print · cream + ink"
    summary="Light default, fundo creme, ink preto-tinta. Vibe revista impressa / Stripe Press. A versão mais 'editorial editorial' do conjunto." />;
}
function VariationTerminal() {
  return <VariationHome variant="terminal" theme="dark" label="terminal · mono only"
    summary="Mono em tudo, zero pílula (border-radius 0), accent verde fósforo, scanlines fortes. CRT mode. Pra quem ainda usa Vim e tem orgulho." />;
}

window.VariationPure = VariationPure;
window.VariationLime = VariationLime;
window.VariationAcid = VariationAcid;
window.VariationPrint = VariationPrint;
window.VariationTerminal = VariationTerminal;

})();

/* ============================================================
   FILE: app.jsx
   ============================================================ */
(function(){
// devdoido — main app
// Wires Tweaks panel + DesignCanvas with all artboards.

const { useState, useEffect } = React;
const {
  DesignCanvas, DCSection, DCArtboard,
  TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSlider, TweakToggle, TweakColor,
  HomePage, ArticlePage, BlogIndexPage, CategoryPage, AboutPage, NewsletterPage, CoursePage, AdminTranscribePage,
  VariationPure, VariationLime, VariationAcid, VariationPrint, VariationTerminal,
} = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "pure",
  "theme": "dark",
  "density": 1,
  "gridCols": 3,
  "fx": 0.35,
  "fontUI": "inter",
  "fontDisplay": "bebas"
}/*EDITMODE-END*/;

const FONT_UI_MAP = {
  inter: '"Inter", "Helvetica Now Text Medium", Helvetica, Arial, sans-serif',
  helvetica: 'Helvetica, "Inter", Arial, sans-serif',
  geist: '"Geist", "Inter", Helvetica, Arial, sans-serif',
};
const FONT_DISPLAY_MAP = {
  bebas: '"Bebas Neue", "Anton", Helvetica, sans-serif',
  anton: '"Anton", "Bebas Neue", Helvetica, sans-serif',
  archivo: '"Archivo Black", "Bebas Neue", Helvetica, sans-serif',
  mono: '"JetBrains Mono", monospace',
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweak values as CSS variables / data attributes on <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t.theme);
    root.setAttribute("data-variant", t.variant);
    root.setAttribute("data-fx", t.fx > 0 ? "1" : "0");
    root.style.setProperty("--density", String(t.density));
    root.style.setProperty("--fx", String(t.fx));
    root.style.setProperty("--grid-cols", String(t.gridCols));
    root.style.setProperty("--font-ui", FONT_UI_MAP[t.fontUI] || FONT_UI_MAP.inter);
    if (t.variant !== "terminal") {
      // terminal variant forces mono on display in CSS — don't override
      root.style.setProperty("--font-display", FONT_DISPLAY_MAP[t.fontDisplay] || FONT_DISPLAY_MAP.bebas);
    }
  }, [t]);

  return (
    <>
      <DesignCanvas>
        <DCSection
          id="direcao-final"
          title="devdoido — direção final"
          subtitle="Pure variant · dark · Bebas Neue. Restraint cromático Nike-style aplicado ao universo dev. Branco/preto/cinza, vermelho-sale só em preço/destaque."
        >
          <DCArtboard id="home" label="01 · Home" width={1440} height={4400}>
            <HomePage />
          </DCArtboard>
          <DCArtboard id="article" label="02 · Artigo (leitura)" width={1440} height={3600}>
            <ArticlePage />
          </DCArtboard>
          <DCArtboard id="blog-index" label="03 · Blog index" width={1440} height={3000}>
            <BlogIndexPage />
          </DCArtboard>
          <DCArtboard id="category" label="04 · Categoria (Vibe Coding)" width={1440} height={2800}>
            <CategoryPage />
          </DCArtboard>
          <DCArtboard id="about" label="05 · Sobre @devdoido" width={1440} height={2400}>
            <AboutPage />
          </DCArtboard>
          <DCArtboard id="newsletter" label="06 · Newsletter" width={1440} height={2200}>
            <NewsletterPage />
          </DCArtboard>
          <DCArtboard id="course" label="07 · Curso CrazyStack TypeScript" width={1440} height={3000}>
            <CoursePage />
          </DCArtboard>
          <DCArtboard id="admin-transcribe" label="08 · Admin / Transcribe (YouTube → texto)" width={1440} height={2400}>
            <AdminTranscribePage />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks — devdoido design system">
        <TweakSection label="Direção estética">
          <TweakRadio
            label="Variante"
            value={t.variant}
            onChange={(v) => setTweak("variant", v)}
            options={[
              { value: "pure", label: "Pure" },
              { value: "lime", label: "Lime" },
              { value: "acid", label: "Acid" },
              { value: "print", label: "Print" },
              { value: "terminal", label: "Term" },
            ]}
          />
          <TweakRadio
            label="Tema"
            value={t.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Tipografia">
          <TweakRadio
            label="Display"
            value={t.fontDisplay}
            onChange={(v) => setTweak("fontDisplay", v)}
            options={[
              { value: "bebas", label: "Bebas" },
              { value: "anton", label: "Anton" },
              { value: "archivo", label: "Archivo" },
              { value: "mono", label: "Mono" },
            ]}
          />
          <TweakRadio
            label="UI"
            value={t.fontUI}
            onChange={(v) => setTweak("fontUI", v)}
            options={[
              { value: "inter", label: "Inter" },
              { value: "helvetica", label: "Helvetica" },
              { value: "geist", label: "Geist" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakSlider
            label="Densidade"
            value={Math.round(t.density * 100)}
            onChange={(v) => setTweak("density", v / 100)}
            min={60} max={140} step={5}
            unit="%"
          />
          <TweakRadio
            label="Grid cards"
            value={String(t.gridCols)}
            onChange={(v) => setTweak("gridCols", parseInt(v))}
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Efeitos">
          <TweakSlider
            label="Intensidade FX"
            value={Math.round(t.fx * 100)}
            onChange={(v) => setTweak("fx", v / 100)}
            min={0} max={100} step={5}
            unit="%"
          />
          <p style={{ fontSize: 11, color: "var(--mute)", margin: "4px 0 0", lineHeight: 1.4 }}>
            scanlines/CRT overlay. 0% = limpo, 100% = arcade.
          </p>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

})();
