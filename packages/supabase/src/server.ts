import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseEnv } from "./env";

/**
 * Minimal cookie store shape this factory needs. Next.js's `cookies()`
 * (already awaited) satisfies this directly.
 */
export interface CookiesAdapter {
  getAll(): { name: string; value: string }[];
  set(name: string, value: string, options: CookieOptions): void;
}

/**
 * Creates a Supabase client for use in Server Components, Route Handlers,
 * and Server Actions.
 *
 * Server Components can't write cookies, so a failing `set` call is
 * swallowed here — pair this with a middleware that refreshes the session
 * so auth keeps working in that case.
 */
export function createServerSupabaseClient(
  cookieStore: CookiesAdapter,
): SupabaseClient<Database> {
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component; safe to ignore if middleware refreshes sessions.
        }
      },
    },
  });
}
