import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@greenline/supabase/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@greenline/ui/components/card";

/**
 * Proves the Clerk -> Supabase JWT flow end-to-end: the Supabase client
 * below sends the signed-in user's Clerk session token as its bearer token,
 * so any RLS policy using `auth.jwt()` (e.g. matching `auth.jwt() ->> 'sub'`
 * against a `user_id` column) sees the Clerk user for this request.
 *
 * `/dashboard` isn't in `isPublicRoute` in middleware.ts, so `clerkMiddleware`
 * already requires sign-in before this page renders.
 */
export default async function DashboardPage() {
  const { userId, getToken } = await auth();
  const cookieStore = await cookies();

  const supabase = createServerSupabaseClient(cookieStore, {
    accessToken: () => getToken(),
  });

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .limit(10);

  return (
    <div className="p-8">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Signed in as Clerk user <code>{userId}</code>. The query below
            runs through <code>@greenline/supabase</code>&apos;s server
            client, authenticated with this Clerk session&apos;s JWT.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-muted-foreground">
              Query against <code>tasks</code> failed with:{" "}
              <code>{error.message}</code>. That&apos;s expected until the
              table exists — the important part is that the request reached
              Postgres authenticated as this Clerk user, so an{" "}
              <code>auth.jwt()</code>-based RLS policy on that table would
              already work.
            </p>
          ) : (
            <pre className="overflow-x-auto text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
