import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProjectBySlug } from "@/lib/cms/public.functions";
import { ArrowLeft } from "lucide-react";

const qo = (slug: string) => queryOptions({
  queryKey: ["project", slug],
  queryFn: () => getProjectBySlug({ data: { slug } }),
});

export const Route = createFileRoute("/_public/projects/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(qo(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — Ayo Richard Abe` },
      { name: "description", content: loaderData.summary ?? loaderData.name },
      { property: "og:title", content: loaderData.name },
      { property: "og:description", content: loaderData.summary ?? "" },
      ...(loaderData.featured_image_url ? [{ property: "og:image", content: loaderData.featured_image_url }] : []),
    ] : [],
  }),
  component: ProjectPage,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <h1 className="font-display text-4xl">Project not found</h1>
      <Link to="/projects" className="mt-4 inline-block text-electric">Back to projects</Link>
    </div>
  ),
});

function Section({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink-soft">{body}</div>
    </section>
  );
}

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(qo(slug));
  if (!p) return null;
  return (
    <article className="space-y-10">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
      >
        <ArrowLeft size={16} /> Back to Projects
      </Link>
      <header>
        <div className="text-xs uppercase tracking-[0.22em] text-electric">{p.category ?? "Project"}</div>
        <h1 className="mt-3 font-display text-5xl text-ink">{p.name}</h1>
        {p.summary && <p className="mt-4 max-w-2xl text-lg text-ink-soft">{p.summary}</p>}
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          {p.live_link && <a href={p.live_link} target="_blank" rel="noreferrer" className="rounded-full border border-line px-4 py-2 hover:bg-surface">Visit live →</a>}
          {p.case_study_link && <a href={p.case_study_link} target="_blank" rel="noreferrer" className="rounded-full border border-line px-4 py-2 hover:bg-surface">Case study →</a>}
        </div>
      </header>
      {p.featured_image_url && (
        <img src={p.featured_image_url} alt={p.name} className="w-full rounded-2xl border border-line object-cover" />
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {p.role && <Meta label="Role" value={p.role} />}
        {p.tools?.length ? <Meta label="Stack" value={p.tools.join(", ")} /> : null}
        {p.category && <Meta label="Category" value={p.category} />}
      </div>
      <Section title="Problem" body={p.problem} />
      <Section title="Solution" body={p.solution} />
      <Section title="Process" body={p.process} />
      <Section title="Results" body={p.results} />
      <Section title="Overview" body={p.description} />
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-cloud p-4">
      <div className="text-xs uppercase tracking-wider text-muted-ink">{label}</div>
      <div className="mt-1 text-sm text-ink">{value}</div>
    </div>
  );
}