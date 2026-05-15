/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      // Design tokens da landing RT-One (variáveis em :root — ver design-tokens.css).
      // Prefixo "dc-" evita conflito com as cores do daisyUI usadas no resto do site.
      colors: {
        'dc-bg': 'oklch(var(--dc-background) / <alpha-value>)',
        'dc-fg': 'oklch(var(--dc-foreground) / <alpha-value>)',
        'dc-card': 'oklch(var(--dc-card) / <alpha-value>)',
        'dc-card-fg': 'oklch(var(--dc-card-foreground) / <alpha-value>)',
        'dc-popover': 'oklch(var(--dc-popover) / <alpha-value>)',
        'dc-popover-fg': 'oklch(var(--dc-popover-foreground) / <alpha-value>)',
        'dc-primary': 'oklch(var(--dc-primary) / <alpha-value>)',
        'dc-primary-fg': 'oklch(var(--dc-primary-foreground) / <alpha-value>)',
        'dc-secondary': 'oklch(var(--dc-secondary) / <alpha-value>)',
        'dc-secondary-fg': 'oklch(var(--dc-secondary-foreground) / <alpha-value>)',
        'dc-muted': 'oklch(var(--dc-muted) / <alpha-value>)',
        'dc-muted-fg': 'oklch(var(--dc-muted-foreground) / <alpha-value>)',
        'dc-accent': 'oklch(var(--dc-accent) / <alpha-value>)',
        'dc-accent-fg': 'oklch(var(--dc-accent-foreground) / <alpha-value>)',
        'dc-destructive': 'oklch(var(--dc-destructive) / <alpha-value>)',
        'dc-destructive-fg': 'oklch(var(--dc-destructive-foreground) / <alpha-value>)',
        'dc-border': 'oklch(var(--dc-border) / <alpha-value>)',
        'dc-input': 'oklch(var(--dc-input) / <alpha-value>)',
        'dc-ring': 'oklch(var(--dc-ring) / <alpha-value>)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
  },
};
