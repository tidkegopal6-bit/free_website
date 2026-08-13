# Project Status

> **AI: Read this file at the START of every session.**  
> Update status immediately when a feature changes state.

## Feature Status

| Feature | Status | Notes |
|---|---|---|
| Blog | 🔲 Pending | Markdown-based, SSG, Content Collections |
| Notes (Public) | 🔲 Pending | Markdown-based, SSG |
| Notes (Private) | 🔄 InProgress | Client editor & dashboard created, awaiting DB setup |
| Browser Games | 🔄 InProgress | Client hub and Snake Canvas game created, awaiting DB setup |
| Projects Showcase | 🔲 Pending | Static data file, SSG |
| Google Login | 🔄 InProgress | Client login page created, awaiting provider config |
| User Profiles | 🔄 InProgress | Client profile page & SQL trigger schema prepared |
| Bookmarks | 🔄 InProgress | Client dashboard created, awaiting DB setup |
| Reading Progress | 🔄 InProgress | Client scroll tracker component created, awaiting DB setup |
| Game Scores | 🔄 InProgress | Client-side save triggers created, awaiting DB setup |
| Monetization | ⏳ Future | No infra until actively needed |

**Status Legend**: 🔲 Pending | 🔄 InProgress | ✅ Done | ❌ Blocked

---

## Infrastructure Status

| Item | Status | Notes |
|---|---|---|
| Astro project init | ✅ Done | Project scaffolded at root |
| Tailwind setup | ✅ Done | Configured in astro.config.mjs |
| Supabase project created | ✅ Done | `rmkgjcwfwpykmxdeiirv` — free tier, ap-south-1 |
| GitHub repo created | ✅ Done | `tidkegopal6-bit/free_website` |
| Cloudflare Pages connected | ✅ Done | Auto-deploy via GitHub Actions on push to main |
| Hostinger DNS → Cloudflare | 🔲 Pending | Point domain to Cloudflare Pages |
| `.env` configured | ✅ Done | Template env.example created |
| RLS enabled on all tables | ✅ Done | profiles, notes, bookmarks, game_scores — all verified `rowsecurity = true` |
| Google OAuth configured | ✅ Done | Google OAuth client `932272915307-...` wired into Supabase; redirect verified via /auth/v1/authorize |

---

## Current Session
**Working on**: Deployment + database setup — site live on Cloudflare Pages, Supabase schema applied  
**Started**: 2026-08-13  
**Blocked by**: Google OAuth provider credentials (browser task) — login, notes, bookmarks, scores all work once OAuth is wired  

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
```
