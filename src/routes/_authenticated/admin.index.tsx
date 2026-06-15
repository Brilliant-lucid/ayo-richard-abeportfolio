import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAllProjects, listMessages } from "@/lib/cms/admin.functions";
import { getMyPortfolio, updateMyPortfolio } from "@/lib/cms/portfolio.functions";
import { toast } from "sonner";
import { Copy, ExternalLink } from "lucide-react";

const projectsQO = queryOptions({ queryKey: ["admin", "projects"], queryFn: () => listAllProjects() });
const messagesQO = queryOptions({ queryKey: ["admin", "messages"], queryFn: () => listMessages() });
const portfolioQO = queryOptions({ queryKey: ["my-portfolio"], queryFn: () => getMyPortfolio() });

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQO),
      context.queryClient.ensureQueryData(messagesQO),
      context.queryClient.ensureQueryData(portfolioQO),
    ]);
  },
  component: Dashboard,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div>Not found</div>,
});

function Dashboard() {
  const { data: projects } = useSuspenseQuery(projectsQO);
  const { data: messages } = useSuspenseQuery(messagesQO);
  const { data: portfolio } = useSuspenseQuery(portfolioQO);
  const qc = useQueryClient();
  const updatePortfolio = useServerFn(updateMyPortfolio);
  const unread = messages.filter((m) => !m.read).length;

  const shareUrl = portfolio
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/u/${portfolio.username}`
    : "";

  async function togglePublished() {
    if (!portfolio) return;
    try {
      await updatePortfolio({ data: { is_published: !portfolio.is_published } });
      await qc.invalidateQueries({ queryKey: ["my-portfolio"] });
      toast.success(portfolio.is_published ? "Portfolio unpublished" : "Portfolio published");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Welcome back</h1>
        <p className="mt-2 text-ink-soft">Manage your portfolio and share your link.</p>
      </div>

      {portfolio && (
        <section className="rounded-2xl border border-line bg-cloud p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-ink">Your shareable link</div>
              <div className="mt-1 font-display text-lg text-ink break-all">{shareUrl}</div>
              <div className="mt-1 text-xs text-muted-ink">
                Status: {portfolio.is_published ? <span className="text-electric">Published</span> : <span>Unpublished (private)</span>}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={copyLink} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cloud px-3 py-2 text-xs hover:bg-surface">
                <Copy size={12} /> Copy
              </button>
              <a href={shareUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cloud px-3 py-2 text-xs hover:bg-surface">
                <ExternalLink size={12} /> Open
              </a>
              <button onClick={togglePublished} className="rounded-full bg-ink px-3 py-2 text-xs text-cloud">
                {portfolio.is_published ? "Unpublish" : "Publish"}
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Projects" value={projects.length} href="/admin/projects" />
        <Card label="Published" value={projects.filter((p) => p.status === "published").length} href="/admin/projects" />
        <Card label="Unread messages" value={unread} href="/admin/messages" />
      </div>
      <section>
        <h2 className="font-display text-2xl">Recent messages</h2>
        <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-cloud">
          {messages.slice(0, 5).map((m) => (
            <Link key={m.id} to="/admin/messages" className="block p-4 hover:bg-surface/40">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{m.name}</span>
                <span className="text-xs text-muted-ink">{new Date(m.created_at).toLocaleString()}</span>
              </div>
              <div className="mt-1 line-clamp-1 text-xs text-ink-soft">{m.message}</div>
            </Link>
          ))}
          {messages.length === 0 && <div className="p-6 text-center text-sm text-muted-ink">No messages yet.</div>}
        </div>
      </section>
    </div>
  );
}

function Card({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link to={href} className="rounded-2xl border border-line bg-cloud p-6 hover:border-electric/40">
      <div className="text-xs uppercase tracking-wider text-muted-ink">{label}</div>
      <div className="mt-2 font-display text-4xl">{value}</div>
    </Link>
  );
}
