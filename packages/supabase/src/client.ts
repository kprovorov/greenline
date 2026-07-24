import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseEnv } from "./env";

export interface BrowserSupabaseClientOptions {
  /**
   * Returns the JWT to send as the request's bearer token, e.g. Clerk's
   * `session.getToken()`. Used instead of Supabase's own session cookies —
   * see the "Third-Party Auth" section in packages/supabase/README.md.
   */
  accessToken?: () => Promise<string | null>;
}

/**
 * Creates a Supabase client for use in Client Components.
 *
 * Safe to call in the browser: only reads the `NEXT_PUBLIC_*` env vars.
 */
export function createBrowserSupabaseClient(
  options: BrowserSupabaseClientOptions = {},
): SupabaseClient<Database> {
  const { url, anonKey } = getSupabaseEnv();

  return createBrowserClient<Database>(url, anonKey, {
    accessToken: options.accessToken,
  });
}
