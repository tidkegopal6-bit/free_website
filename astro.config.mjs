import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// Sitemap — install with: npm install @astrojs/sitemap
let sitemap;
try { sitemap = (await import('@astrojs/sitemap')).default; } catch {}

// Custom domain — Cloudflare Pages custom domain, DNS via Cloudflare zone
export default defineConfig({
  site: 'https://therisingview.com',
  adapter: cloudflare(),
  integrations: [
    tailwind(),
    ...(sitemap ? [sitemap()] : []),
  ],
});
