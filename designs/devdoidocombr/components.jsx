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
