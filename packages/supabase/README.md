# @greenline/supabase

Typed Supabase client factories for Next.js apps in this monorepo. Auth is
delegated entirely to Clerk: these clients don't use Supabase's own
session/cookie-based auth system. Instead every request is signed with the
caller's Clerk session JWT via Supabase's native **Third-Party Auth**
integration, so Postgres Row Level Security policies can read Clerk claims
straight out of `auth.jwt()` (e.g. `(auth.jwt() ->> 'sub')` for the Clerk user
ID).

## One-time Supabase Dashboard setup

This step can't be automated from this repo — it has to be done once per
Supabase project, by a project admin, in the Supabase Dashboard:

1. Go to **Authentication → Sign In / Providers → Third Party Auth** (also
   reachable as "Third-Party Auth" under Authentication settings).
2. Add a new integration and choose **Clerk**.
3. Enter your Clerk instance's domain (the "Frontend API URL", e.g.
   `https://your-app.clerk.accounts.dev` in dev, or your custom Clerk domain
   in production). Supabase uses this to fetch Clerk's JWKS and verify the
   `RS256` signature on incoming JWTs — no shared secret or JWT template is
   required.
4. Save the integration.

Once configured, `auth.jwt()` inside RLS policies is populated from any
valid Clerk session JWT sent as the request's bearer token — no other
Supabase Auth setup (users table, sign-up flow, etc.) is needed. See
[Supabase's Clerk integration guide](https://supabase.com/docs/guides/auth/third-party/clerk)
for background.

If your app runs against multiple Clerk instances (e.g. separate dev/prod
Clerk apps), repeat this for each corresponding Supabase project.

## Client factories

Both factories accept an `accessToken` callback instead of relying on
Supabase-managed cookies. Wire it up to Clerk's token getter for the
environment you're calling from:

### Browser (Client Components)

```ts
"use client";

import { useAuth } from "@clerk/nextjs";
import { createBrowserSupabaseClient } from "@greenline/supabase/client";

const { getToken } = useAuth();
const supabase = createBrowserSupabaseClient({
  accessToken: () => getToken(),
});
```

`session.getToken()` from `useSession()` works the same way.

### Server (Server Components, Route Handlers, Server Actions)

```ts
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@greenline/supabase/server";

const cookieStore = await cookies();
const supabase = createServerSupabaseClient(cookieStore, {
  accessToken: async () => (await auth()).getToken(),
});
```

Neither factory needs Clerk's default session token to carry a Supabase-specific
JWT template — the third-party integration verifies Clerk's standard session
JWT directly.

See `apps/web/app/dashboard/page.tsx` for a working end-to-end example.
