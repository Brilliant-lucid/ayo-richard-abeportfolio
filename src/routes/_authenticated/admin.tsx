import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getMyPortfolio, createMyPortfolio } from "@/lib/cms/portfolio.functions";
import { AdminShell } from "@/components/admin-shell";
import { toast } from "sonner";

const portfolioQO = queryOptions({
  queryKey: ["my-portfolio"],
  queryFn: () => getMyPortfolio(),
});

export const Route = createFileRoute("/_authenticated/admin")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQO),
  component: AdminLayout,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function AdminLayout() {
  const { data: portfolio } = useSuspenseQuery(portfolioQO);
  if (!portfolio) return <Onboarding />;
  return <AdminShell><Outlet /></AdminShell>;
}

function Onboarding() {
  const qc = useQueryClient();
  const create = useServerFn(createMyPortfolio);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await create({ data: { username: username.trim().toLowerCase(), display_name: displayName.trim() } });
      await qc.invalidateQueries({ queryKey: ["my-portfolio"] });
      toast.success("Portfolio created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 rounded-2xl border border-line bg-cloud p-8">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-electric">Welcome</div>
          <h1 className="mt-2 font-display text-3xl text-ink">Claim your portfolio</h1>
          <p className="mt-1 text-sm text-muted-ink">
            Pick a username — your shareable link will be <span className="text-ink">{typeof window !== "undefined" ? window.location.origin : ""}/u/{username || "your-name"}</span>
          </p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-ink">Display name</label>
          <input
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your full name"
            className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-ink">Username</label>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="your-name"
            className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-muted-ink">Lowercase letters, numbers and dashes. 2–31 characters.</p>
        </div>
        <button disabled={loading} className="w-full rounded-full bg-ink py-2.5 text-sm font-medium text-cloud disabled:opacity-50">
          {loading ? "Creating…" : "Create portfolio"}
        </button>
        <Link to="/" className="block text-center text-xs text-muted-ink hover:text-ink">Back to site</Link>
      </form>
    </div>
  );
}
