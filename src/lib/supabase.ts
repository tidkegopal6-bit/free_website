import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Client initialized with anon key for browser calls.
// Using placeholders if env vars are missing so compilation/build does not crash.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
