import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "local-development-placeholder";
export const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && supabaseAnonKey !== "local-development-placeholder");
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
