import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Beta auth.oauth namespace typing shim.
interface OAuthClient { name?: string; redirect_uri?: string }
interface AuthorizationDetails {
  client?: OAuthClient;
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
}
interface OAuthApi {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
}
function oauth(): OAuthApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase.auth as any).oauth as OAuthApi;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) {
      window.location.href = immediate;
      return data;
    }
    return data;
  },
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md p-8">
      <h1 className="font-display text-xl text-ink">Authorization error</h1>
      <p className="mt-2 text-sm text-muted-ink">{String((error as Error)?.message ?? error)}</p>
    </main>
  ),
  component: Consent,
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) { setBusy(false); setError(error.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("No redirect returned by the authorization server."); return; }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an app";
  return (
    <main className="flex min-h-screen items-center justify-center bg-cloud px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-cloud p-8">
        <div className="text-xs uppercase tracking-[0.22em] text-electric">Authorize</div>
        <h1 className="mt-2 font-display text-2xl text-ink">
          Connect {clientName} to your portfolio
        </h1>
        <p className="mt-3 text-sm text-muted-ink">
          {clientName} will be able to manage your projects, blog posts, hero, and read your contact messages as you.
        </p>
        <p className="mt-3 text-xs text-muted-ink">
          This does not bypass your portfolio's row-level security — {clientName} only sees your own data.
        </p>
        {error && <p role="alert" className="mt-4 rounded-md border border-line bg-surface/50 px-3 py-2 text-xs text-ink">{error}</p>}
        <div className="mt-6 flex gap-3">
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 rounded-full bg-ink py-2.5 text-sm font-medium text-cloud disabled:opacity-50"
          >
            {busy ? "Please wait…" : "Approve"}
          </button>
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 rounded-full border border-line py-2.5 text-sm font-medium text-ink disabled:opacity-50"
          >
            Deny
          </button>
        </div>
      </div>
    </main>
  );
}