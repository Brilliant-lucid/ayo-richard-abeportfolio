import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listAllProjects, listMessages } from "@/lib/cms/admin.functions";

const projectsQO = queryOptions({ queryKey: ["admin", "projects"], queryFn: () => listAllProjects() });
const messagesQO = queryOptions({ queryKey: ["admin", "messages"], queryFn: () => listMessages() });

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQO),
      context.queryClient.ensureQueryData(messagesQO),
    ]);
  },
  component: Dashboard,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div>Not found</div>,
});

function Dashboard() {
  const { data: projects } = useSuspenseQuery(projectsQO);
  const { data: messages } = useSuspenseQuery(messagesQO);
  const unread = messages.filter((m) => !m.read).length;
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Welcome back</h1>
        <p className="mt-2 text-ink-soft">Quick overview of your site.</p>
      </div>
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