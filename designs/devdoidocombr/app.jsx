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
