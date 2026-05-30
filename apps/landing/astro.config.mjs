import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://devdoido.com.br',
  output: 'hybrid',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
