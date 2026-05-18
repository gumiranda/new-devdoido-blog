# Project Overview

Monorepo Bun workspace. Current focus: `apps/landing`, an Astro static site for devdoido.com.br. Root also has `apps/api` Elysia API, but landing task should stay static unless explicitly requested.

Top-level structure: `apps/landing` for Astro frontend, `apps/api` for API, `designs` for supplied design references/assets, root SEO/docs files.

Landing uses Astro 5, Tailwind integration, sitemap, RSS, TypeScript, CSS design system in `apps/landing/src/styles/devdoido.css`, data seeds in `apps/landing/src/data/devdoido.ts`.