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
| Supabase project created | 🔲 Pending | Free tier project |
| GitHub repo created | 🔲 Pending | |
| Cloudflare Pages connected | 🔲 Pending | Connect to GitHub repo |
| Hostinger DNS → Cloudflare | 🔲 Pending | Point domain to Cloudflare Pages |
| `.env` configured | ✅ Done | Template env.example created |
| RLS enabled on all tables | 🔄 InProgress | SQL scripts prepared for profiles, notes, bookmarks, and score tables |
| Google OAuth configured | 🔄 InProgress | Client-side integration code implemented |

---

## Current Session
**Working on**: Added site-wide eye-protection themes and Snake game upgrades (Zen mode, Speed controls, Fullscreen canvas resizing)  
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
```
