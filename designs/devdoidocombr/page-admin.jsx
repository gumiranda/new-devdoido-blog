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
