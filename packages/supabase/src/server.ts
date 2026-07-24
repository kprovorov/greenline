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

export interface ServerSupabaseClientOptions {
  /**
   * Returns the JWT to send as the request's bearer token, e.g. Clerk's
   * `(await auth()).getToken()`. Used instead of Supabase's own session
   * cookies — see the "Third-Party Auth" section in
   * packages/supabase/README.md.
   */
  accessToken?: () => Promise<string | null>;
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
  options: ServerSupabaseClientOptions = {},
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
    accessToken: options.accessToken,
  });
}
