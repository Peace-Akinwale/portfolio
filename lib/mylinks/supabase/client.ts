import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/mylinks/types/database";

function getPublicSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

function getPublicSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
}

export function createClient() {
  return createBrowserClient<Database>(
    getPublicSupabaseUrl(),
    getPublicSupabaseAnonKey()
  );
}
