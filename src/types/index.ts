// src/types/index.ts — Single source of truth for all types

// Blog
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt?: Date;
  tags: string[];
  draft: boolean;
  content?: string;
}

// User profile (mirrors Supabase `profiles` table)
export interface Profile {
  id: string;           // UUID — matches auth.uid()
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;    // ISO date string from Supabase
}

// Game score (mirrors Supabase `game_scores` table)
export interface GameScore {
  id: string;
  userId: string;
  gameSlug: string;
  score: number;
  achievedAt: string;
}

// Bookmark (mirrors Supabase `bookmarks` table)
export interface Bookmark {
  id: string;
  userId: string;
  url: string;
  title: string;
  notes?: string;
  tags: string[];
  createdAt: string;
}

// Auth state
export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; userId: string; email: string }
  | { status: 'unauthenticated' };

// API response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
