import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// Sitemap — install with: npm install @astrojs/sitemap
let sitemap;
try { sitemap = (await import('@astrojs/sitemap')).default; } catch {}

// ⚠️ Update 'site' to your custom domain after first Cloudflare deploy
export default defineConfig({
  site: 'https://therising.pages.dev',
  adapter: cloudflare(),
  integrations: [
    tailwind(),
    ...(sitemap ? [sitemap()] : []),
  ],
});
