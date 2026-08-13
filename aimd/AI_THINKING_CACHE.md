# AI Thinking Cache
> Anti-hallucination memory — read this before planning any action.  
> Write here BEFORE writing any code or making any decision.

## How to Use
Before any task, write an entry here. Before planning, search here for prior work.
This prevents re-inventing decisions, re-analyzing the same files, and repeating failed approaches.

---

## Entry Format
```markdown
## [Type] — [Feature/File] — [YYYY-MM-DD]
**Files read**: [list of files actually read]
**Decision**: [what was decided]
**Reason**: [why — evidence-based, no assumptions]
**Cost impact**: [none / service + free tier limit]
**Security impact**: [RLS affected? secrets?]
**Status**: [planned / done / blocked / verified]
```

**Entry Types**: ANALYSIS | DECISION | PATTERN | CONFLICT | BLOCKER | VERIFIED | SESSION-START

## DECISION — Astro Project Init — 2026-08-13
**Files read**: None (initializing new project)
**Decision**: Create package.json, tsconfig.json, astro.config.mjs, and core files directly in the root to bypass CLI workspace conflicts.
**Reason**: Scaffolding files directly avoids terminal/ACL conflicts and ensures a customized, clean setup for Astro + Tailwind + Supabase + Cloudflare Pages.
**Cost impact**: None ($0).
**Security impact**: None at this phase.
**Status**: done

---

## SESSION-START — Project Init — 2026-08-13
**Files read**: 
- `aimd/PROJECT_STATUS.md` — Updated infrastructure statuses
- `aimd/DECISIONS.md` — Read initial architecture choices
- `.cursor/rules/project.mdc` — Rules loaded

**Status**: Astro project scaffolded at root directory with Tailwind integration, base layouts, and Supabase client setup.

**Next steps**:
1. Run `npm install` to load all packages locally.
2. Link the repository with a free Supabase project and Cloudflare Pages.
3. Begin building the first dynamic module (Blog or Notes).

---

## PATTERN — Supabase Client Singleton — 2026-08-13
**Decision**: Use a single `src/lib/supabase.ts` that exports the client.
**Reason**: Prevents multiple client instances; single place to update config.
**Pattern**:
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
export const supabase = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);
```

---

## PATTERN — RLS on Every Table — 2026-08-13
**Decision**: Always run `ALTER TABLE x ENABLE ROW LEVEL SECURITY` before creating policies.
**Reason**: Supabase blocks all access by default when RLS is on with no policies.
This is the safest default — better to be locked out than to leak data.
**Never**: Create a table without immediately adding RLS + policies.

## DECISION — Google Auth & Profiles Trigger Setup — 2026-08-13
**Files read**:
- `.cursor/rules/03-security.mdc` — RLS rules, Auth Client structure
- `.cursor/rules/12-feature-rules.mdc` — profiles table schema & trigger
**Decision**: Implement Astro client-side auth handlers (`src/pages/login.astro`, `src/pages/profile.astro`) using the Supabase client. Set up `profiles` table in Supabase with auto-create trigger handler on signups.
**Reason**: Keeps the application front-end light and client-side reactive for dev stages, while enforcing strict backend RLS policies.
**Cost impact**: None ($0).
**Security impact**: RLS enabled on `profiles` (read public, update own only). Definer context SQL trigger prevents client spoofing.
**Status**: planned

## DECISION — Digital Notes & Auto-Save Setup — 2026-08-13
**Files read**:
- `.cursor/rules/12-feature-rules.mdc` — Notes schema, RLS, and debouncing limits
**Decision**: Create notes list page (`src/pages/notes/index.astro`) and markdown auto-saving editor (`src/pages/notes/[id].astro`). Implement client-side loading, fetching, and 500ms debouncing logic for DB writes.
**Reason**: Keeps database usage down (free quota protection) and ensures responsive editing states.
**Cost impact**: None ($0).
**Security impact**: RLS verified (`user_id = auth.uid()`). Public sharing option validated only if `is_public` is true.
**Status**: planned

## DECISION — Bookmarks & Reading Progress Setup — 2026-08-13
**Files read**:
- `.cursor/rules/12-feature-rules.mdc` — Bookmarks & Progress schemas and RLS
**Decision**: Create bookmarks page (`src/pages/bookmarks.astro`) allowing URL saving + tag categorization. Prepare scroll position tracking hooks to save reading progress on future blog articles.
**Reason**: Provides user-specific utility features fully protected by Row Level Security (RLS) under $0 cost limits.
**Cost impact**: None ($0).
**Security impact**: RLS verified (`user_id = auth.uid()`).
**Status**: planned

## DECISION — Browser Games & Leaderboards Setup — 2026-08-13
**Files read**:
- `.cursor/rules/12-feature-rules.mdc` — Games & scores schema and RLS policies
**Decision**: Implement a browser games hub page (`src/pages/games/index.astro`) and a canvas game page (`src/pages/games/[slug].astro`). Implement an HTML5 canvas Retro Snake game and build a real-time leaderboard widget that fetches top scores from Supabase.
**Reason**: Delivers engaging interactive browser features directly in the client under free tier limits.
**Cost impact**: None ($0).
**Security impact**: RLS verified (`game_scores` allow insert for authenticated owner, public read SELECT allowed).
**Status**: planned

---

_(Add new entries above this line as the project grows)_

