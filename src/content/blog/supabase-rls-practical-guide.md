---
title: "Row Level Security: The Cheap Way to Sleep at Night"
description: "A practical guide to Supabase RLS — why every table needs it, and how to write policies that protect user data without breaking your app."
pubDate: 2026-08-12
tags: ["Supabase", "Security", "PostgreSQL"]
draft: false
---

## The Default Is Danger

Supabase is wonderful — until you realize the anon key is public. Anyone can read your GitHub repo, grab that key, and query your database directly. The only thing standing between your users' data and the internet is **Row Level Security**.

## The Golden Rule

> Never create a table without immediately enabling RLS and adding policies.

With RLS enabled and zero policies, Supabase blocks **everything** — which is the safest default. Better to be locked out than leaking data.

## Anatomy of a Policy

```sql
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

- `USING` — which rows existing users can touch
- `WITH CHECK` — which new rows a user can write
- `auth.uid()` — the signed-in user's ID, forged-client-proof

## The Profile Trigger Trick

Never trust the client to create a profile row. Use a `SECURITY DEFINER` trigger on `auth.users` that fires after signup:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'preferred_username', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Now a profile exists *before* the client ever loads — no race conditions, no empty-profile bugs.

## Verification

Always verify after setup — every table should report `rowsecurity = true`:

```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' ORDER BY tablename;
```

If any row says `false`, someone's data is exposed. Fix it before shipping.
