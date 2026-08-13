# Project Status

> **AI: Read this file at the START of every session.**  
> Update status immediately when a feature changes state.

## Feature Status

| Feature | Status | Notes |
|---|---|---|
| Blog | ✅ Done | AI-driven multilingual SSG with auto-publishing |
| Notes (Public) | 🔲 Pending | Markdown-based, SSG |
| Notes (Private) | ✅ Done | Editor + dashboard + DB (notes table + RLS live) |
| Browser Games | ✅ Done | Snake hub + DB (game_scores RLS live) |
| Projects Showcase | ✅ Done | Static data file, SSG |
| Google Login | ✅ Done | OAuth client + Supabase provider + redirect verified |
| User Profiles | ✅ Done | Profile page + SQL trigger schema (profiles RLS live) |
| Bookmarks | ✅ Done | Dashboard + DB (bookmarks RLS live) |
| Reading Progress | ✅ Done | ScrollTracker + DB (reading_progress RLS live) |
| Game Scores | ✅ Done | Save triggers + DB (game_scores RLS live) |
| Monetization | ⏳ Future | No infra until actively needed |

**Status Legend**: 🔲 Pending | 🔄 InProgress | ✅ Done | ❌ Blocked

---

## Infrastructure Status

| Item | Status | Notes |
|---|---|---|
| Astro project init | ✅ Done | Project scaffolded at root |
| Tailwind setup | ✅ Done | Configured in astro.config.mjs |
| Supabase project created | ✅ Done | `rmkgjcwfwpykmxdeiirv` — free tier, ap-northeast-2 |
| GitHub repo created | ✅ Done | `tidkegopal6-bit/free_website` |
| Cloudflare Pages connected | ✅ Done | Auto-deploy via GitHub Actions on push to main |
| Hostinger DNS → Cloudflare | ✅ Done | therisingview.com live on Cloudflare Pages (CNAME + SSL active, verified HTTPS 200) |
| `.env` configured | ✅ Done | Template env.example created |
| RLS enabled on all tables | ✅ Done | profiles, notes, bookmarks, game_scores, reading_progress — all verified `rowsecurity = true` |
| Google OAuth configured | ✅ Done | Google OAuth client `932272915307-...` wired into Supabase; redirect verified via /auth/v1/authorize |
| AI blog provider | ✅ Done | OpenRouter free tier (gpt-oss-20b:free w/ fallback chain + retry/backoff); `OPENROUTER_API_KEY` secret set; DeepSeek V4 Flash available via `--model deepseek/deepseek-v4-flash` if credits added |

---

## Current Session
**Working on**: Custom domain therisingview.com activated on Cloudflare Pages (CNAME via new DNS-edit token); HTTPS verified 200 globally  
**Started**: 2026-08-13  
**Blocked by**: none  

---

## Completed Work Log
_(Add entries as features are completed)_

```
2026-08-13 — Project Initialization — Done — Scaffolded Astro with Tailwind, TS strict config, and Supabase client.
2026-08-13 — Auth & Profiles Pages — Done — Created src/pages/login.astro, src/pages/profile.astro, and integrated dynamic header links in BaseLayout.
2026-08-13 — Notes Module Workspace — Done — Created src/pages/notes/index.astro and src/pages/notes/[id].astro supporting auto-saves and public sharing.
2026-08-13 — Bookmarks & Reading Progress — Done — Created src/pages/bookmarks.astro and src/components/blog/ScrollTracker.astro.
2026-08-13 — Browser Games & Leaderboards — Done — Created src/pages/games/index.astro and src/pages/games/[slug].astro with D-Pad controls and score auto-saves.
2026-08-13 — Game Upgrades & Global Themes — Done — Added Zen mode, Speed controls, responsive full-window canvas scaling, and 5 global eye-care site themes.
2026-08-13 — Deployment Pipeline — Done — GitHub repo + 4 Actions secrets, Cloudflare Pages project `free-website` with auto-deploy CI, site live at free-website-ee9.pages.dev.
2026-08-13 — Supabase Schema — Done — Created profiles, notes, bookmarks, game_scores with RLS + auto-profile trigger on auth.users; verified via pg.
2026-08-13 — Custom Domain — Done — therisingview.com added to Cloudflare zone + Pages project, nameservers switched from Hostinger (pending propagation).
2026-08-13 — Blog Module — Done — Content Collections (src/content.config.ts), 2 sample posts, /blog listing with tag filter, /blog/[slug] with reading progress bar + ScrollTracker. reading_progress table + RLS added to schema.
2026-08-13 — TS Strict Cleanup — Done — Fixed 57 pre-existing type errors (games canvas typing, projects statusConfig, bookmarks form cast); npm run check now passes with @astrojs/check installed.
2026-08-13 — Automated AI Blog Generator — Done — Multilingual blog templates (/blog, /blog/[slug]) built with language/tag filters, automated Gemini 1.5 Flash script (scripts/generate-blog.js), Pollinations AI image downloader, GitHub Actions scheduler, and local Windows startup script.
2026-08-13 — AI Provider Switch — Done — DeepSeek V4 Flash is no longer `:free` on OpenRouter; generator now uses OpenRouter free tier (gpt-oss-20b:free + fallback chain + 429 retry/backoff), Gemini kept as optional provider, `--model` flag added. First auto-generated post (EN/HI/MR) built, tested locally, and pushed (551be3b).
2026-08-13 — Custom Domain Activation — Done — Zone active on Cloudflare; Pages lacked CNAME ("CNAME record not set"), added via new DNS-edit API token (cfut_RWhgi...); domain status `active` with Google CA cert; therisingview.com serves HTTPS 200 globally (local ISP DNS lags).
```
