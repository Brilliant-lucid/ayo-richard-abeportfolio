import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
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
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm font-medium text-ink hover:bg-surface">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <div className="mt-6 text-xs uppercase tracking-[0.22em] text-electric">Projects</div>
        <h1 className="mt-3 font-display text-5xl text-ink">Selected work</h1>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {data.map((p) => (
          <Link
            key={p.id}
            to="/projects/$slug"
            params={{ slug: p.slug }}
            className="group flex flex-col gap-3 rounded-[28px] bg-ink p-3 text-cloud shadow-xl shadow-ink/10 transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            {p.featured_image_url ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                <img
                  src={p.featured_image_url}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-[20px] bg-cloud/10" />
            )}
            <div className="px-3 pt-2">
              <div className="text-[10px] uppercase tracking-[0.22em] text-cloud/50">
                {p.category ?? "Project"}
              </div>
              <div className="mt-2 font-display text-2xl">{p.name}</div>
              <p className="mt-2 line-clamp-3 text-sm text-cloud/70">{p.summary}</p>
            </div>
            <div className="mt-3 flex items-center justify-center rounded-full bg-cloud px-5 py-3 text-sm font-medium text-ink transition-colors group-hover:bg-electric group-hover:text-ink">
              View project
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}