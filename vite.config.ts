import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * URL pública do site, usada nas meta tags Open Graph (precisam ser absolutas).
 * Na Vercel é preenchida automaticamente; localmente pode ser definida com SITE_URL.
 */
function siteUrl(): string {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : '';
}

const injectSiteUrl = (): Plugin => ({
  name: 'inject-site-url',
  transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl()),
});

export default defineConfig({
  plugins: [react(), injectSiteUrl()],
  build: {
    target: 'es2020',
  },
});
