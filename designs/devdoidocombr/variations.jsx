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
