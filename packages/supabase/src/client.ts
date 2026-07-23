import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseEnv } from "./env";

/**
 * Creates a Supabase client for use in Client Components.
 *
 * Safe to call in the browser: only reads the `NEXT_PUBLIC_*` env vars.
 */
export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  const { url, anonKey } = getSupabaseEnv();

  return createBrowserClient<Database>(url, anonKey);
}
