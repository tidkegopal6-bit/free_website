# Decisions Log
> Architectural decisions and their rationale.  
> AI: Read this before making any architectural choice — decision may already exist.

## How to Add an Entry
Check the last DEC number below, increment by 1.
Never reuse numbers. Never delete entries — add "REVERSED" status if changed.

---

## DEC-001 — Multi-File Rule Architecture — [2026-08-13]
**Situation**: Need cursor rules for $0-cost personal website project.  
**Options**:
- A) Single `project.mdc` with everything — Pros: simple; Cons: too large, hard to maintain
- B) Multiple focused `.mdc` files with a master manifest — Pros: focused, maintainable, context-aware loading; Cons: more files  
**Decision**: Option B — 8 focused `.mdc` files in `.cursor/rules/`  
**Reason**: Follows established pattern from existing `apk_ruler` rules (111 files); Cursor can load context-specific rules via `globs` without overloading context.  
**Risk**: Low  
**Status**: Done

---

## DEC-002 — Supabase for DB + Auth (Free Tier) — [2026-08-13]
**Situation**: Need a free database and auth provider.  
**Options**:
- A) Supabase — 500MB DB, 50K MAU, no card required; Cons: 1 project on free tier
- B) PlanetScale — No longer has free tier (2024) ❌
- C) Firebase — Free tier exists but requires Google billing account  
**Decision**: Supabase free tier  
**Reason**: Genuinely free, no card, PostgreSQL (powerful), built-in Auth + Storage + RLS. Verified at supabase.com/pricing.  
**Risk**: Low — well within limits for a personal site  
**Status**: Done (decision made; project not yet created)

---

## DEC-003 — Cloudflare Pages for Hosting — [2026-08-13]
**Situation**: Need free hosting for Astro site.  
**Options**:
- A) Cloudflare Pages — unlimited bandwidth, 500 builds/mo, no card; SSR via Cloudflare Workers free tier  
- B) Vercel — free tier has bandwidth cap + requires card for commercial use  
- C) Netlify — free tier limited to 100GB bandwidth  
**Decision**: Cloudflare Pages  
**Reason**: Best free tier — unlimited bandwidth, supports Astro SSR via Workers (free), no credit card required.  
**Risk**: Low  
**Status**: Done

---

## DEC-004 — Astro `static` Output Mode with SSR Opt-In — [2026-08-13]
**Situation**: Need SSG for blog/static pages AND SSR for auth-protected pages.  
**Options**:
- A) `output: 'static'` — SSG by default, opt-in SSR per page via `export const prerender = false`
- B) `output: 'server'` — All SSR; loses static generation benefits (speed, $0 bandwidth)
- C) `output: 'hybrid'` — Deprecated and removed in Astro v5.
**Decision**: Option A (Astro v5 default `static` output)
**Reason**: Astro v5 deprecated the `hybrid` config option. The default `static` mode now supports SSR per-page opt-in by setting `export const prerender = false` on server-rendered pages. This functions identically to the previous `hybrid` behavior.
**Risk**: Low
**Status**: Done (Updated for Astro v5)

---

## DEC-005 — Blog as Markdown Files (No CMS) — [2026-08-13]
**Situation**: Need a blog that works at $0.  
**Options**:
- A) Paid CMS (Contentful, Sanity) — has free tiers but adds complexity and dependency  
- B) Supabase DB for posts — costs DB storage, harder to version control content  
- C) Markdown files in repo + Astro Content Collections — $0, versioned in Git, type-safe  
**Decision**: Option C — markdown in repo  
**Reason**: $0, fast (static), no external dependency, content versioned in GitHub, Astro Content Collections provide type-safety.  
**Risk**: Low — trade-off is no visual editor (acceptable for a developer's personal site)  
**Status**: Done

---

_(Add new decisions below as the project evolves — increment DEC number)_
