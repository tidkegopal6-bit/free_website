---
title: "Build a Free Website with Astro & Cloudflare Pages"
description: "Learn how to create a zero‑cost, high‑performance site using Astro and Cloudflare Pages in a few simple steps."
pubDate: "2026-08-13"
heroImage: "/assets/blog/build-website-free-astro-cloudflare-pages.jpg"
tags: ["astro","cloudflare","free","webdev"]
draft: false
---

## Why Astro + Cloudflare Pages?
Astro is a modern static site generator that ships minimal JavaScript to the browser, while Cloudflare Pages offers instant global CDN, zero‑cost hosting, and seamless Git integration. Together they give you a fast, secure, and free web presence.

### Astro: Static Site Generator
- **Zero JS by default** – only load what the user needs.
- **Component‑first** – use React, Vue, Svelte, or plain HTML.
- **Built‑in image optimization** – lazy load, responsive sizes.
- **Easy routing** – file‑based, no extra config.

### Cloudflare Pages: Zero‑Cost Hosting
- **Global CDN** – 100+ edge locations.
- **Automatic HTTPS** – free TLS certificates.
- **Git‑based workflow** – every push triggers a deploy.
- **Build & preview URLs** – instant feedback.

## Step‑by‑Step Setup
### 1. Create a GitHub Repository
- Fork or create a new repo named `my-astro-site`.
- Add a `README.md` and commit.

### 2. Initialize Astro Project
```bash
npm create astro@latest my-astro-site
cd my-astro-site
npm install
```
- Choose the **minimal** template.
- Commit the generated files to GitHub.

### 3. Deploy to Cloudflare Pages
- Log in to Cloudflare and navigate to **Pages**.
- Click **Create a Project**, connect your GitHub repo.
- Set the build command to `npm run build` and the output directory to `dist`.
- Enable **Auto‑Deploy** and click **Save and Deploy**.

## Optimizing Performance
- Use **Astro Islands** to hydrate only interactive parts.
- Enable **Image CDN** by adding `astro:cdn` in `astro.config.mjs`.
- Leverage **Cloudflare Workers** for API routes.
- Minify CSS/JS with `esbuild` in the build script.

## Common Pitfalls & Fixes
- **Build errors**: Ensure `node` >= 18 and `npm` >= 9.
- **Missing assets**: Verify paths are relative and use `public/` folder.
- **Slow deploys**: Cache dependencies with `pnpm` or `npm ci`.

## Wrap‑Up
Astro and Cloudflare Pages together provide a powerful, zero‑cost stack for modern web projects. By following these steps, you can launch a fast, SEO‑friendly site in minutes and scale it globally without paying a dime.
