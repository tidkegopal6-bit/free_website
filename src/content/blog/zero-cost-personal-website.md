---
title: "Building a $0/Month Personal Website in 2026"
description: "How I built a full-featured personal hub — blog, notes, games, bookmarks — with Astro, Supabase, and Cloudflare Pages without paying a single rupee."
pubDate: 2026-08-13
updatedDate: 2026-08-13
tags: ["Astro", "Web Dev", "Free Tier"]
draft: false
---

## The Dream: A Personal Hub for $0

Most "free" hosting tiers have catch after catch — bandwidth caps, card requirements, or "free for 30 days" traps. I wanted something genuinely free that could hold a blog, private notes, bookmarks, and even arcade games with a global leaderboard.

## The Stack

| Layer | Tool | Free Limit |
|---|---|---|
| Framework | Astro 5 | SSG by default, SSR opt-in per page |
| Database + Auth | Supabase | 500MB DB, 50K MAU |
| Hosting | Cloudflare Pages | Unlimited bandwidth, 500 builds/mo |
| Styling | Tailwind CSS | $0 forever |

## Why Astro?

Astro's killer feature is **islands architecture** — static-first output with zero JavaScript by default, and you can opt specific pages into server rendering with a single line. Content Collections give type-safe markdown blogs out of the box.

## Deployment Flow

Every push to `main` runs a GitHub Actions workflow that type-checks, builds with real environment secrets, and deploys to Cloudflare Pages. Deploys take under a minute.

## Cost Verdict

**₹0.00 per month.** The only thing money can't solve is the discipline to check quota dashboards. The entire stack stays well within free limits for a personal site.
