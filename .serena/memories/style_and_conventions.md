# Style And Conventions

Follow existing Astro component style: frontmatter props/data at top, semantic markup, scoped component imports. Prefer static rendering and local seed data for landing. Keep admin mock client-side only unless user requests backend.

Use ASCII by default. CSS design tokens live in `apps/landing/src/styles/devdoido.css`. Public SEO metadata should target `https://devdoido.com.br`, brand `DEVDOIDO`, author `@devdoido`.

Developer constraints: prefer `rg`; use `apply_patch` for manual edits; do not revert unrelated user changes; keep frontend responsive and verify visually when UI changes.