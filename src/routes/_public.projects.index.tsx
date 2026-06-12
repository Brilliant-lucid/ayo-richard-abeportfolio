import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listProjects } from "@/lib/cms/public.functions";

const qo = queryOptions({ queryKey: ["projects"], queryFn: () => listProjects() });

export const Route = createFileRoute("/_public/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Ayo Richard Abe" },
      { name: "description", content: "Selected products, platforms, and experiments." },
      { property: "og:title", content: "Projects — Ayo Richard Abe" },
      { property: "og:description", content: "Selected products, platforms, and experiments." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  component: ProjectsIndex,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div>No projects yet.</div>,
});

function ProjectsIndex() {
  const { data } = useSuspenseQuery(qo);
  return (
    <div className="space-y-10">
      <header>
        <div className="text-xs uppercase tracking-[0.22em] text-electric">Projects</div>
        <h1 className="mt-3 font-display text-5xl text-ink">Selected work</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {data.map((p) => (
          <Link
            key={p.id}
            to="/projects/$slug"
            params={{ slug: p.slug }}
            className="group overflow-hidden rounded-2xl border border-line bg-cloud transition-all hover:border-electric/40"
          >
            {p.featured_image_url && (
              <div className="relative aspect-video overflow-hidden">
                <img src={p.featured_image_url} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            )}
            <div className="p-6">
              <div className="text-xs uppercase tracking-wider text-muted-ink">{p.category ?? "Project"}</div>
              <div className="mt-2 font-display text-2xl text-ink">{p.name}</div>
              <p className="mt-3 text-sm text-ink-soft">{p.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}