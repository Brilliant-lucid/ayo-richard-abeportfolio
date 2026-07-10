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
  const pp = p as any;
  const title = pp.title || p.name;
  const overview = pp.overview || p.description;
  const challenge = pp.challenge || p.problem;
  const metrics: Array<{ value: string; label: string; note?: string }> = Array.isArray(pp.metrics) ? pp.metrics : [];
  const gallery: Array<{ url: string; alt?: string; caption?: string }> = Array.isArray(pp.gallery) ? pp.gallery : [];
  const additionalLinks: Array<{ label: string; url: string }> = Array.isArray(pp.additional_links) ? pp.additional_links : [];
  const rolesList: string[] = Array.isArray(pp.roles) && pp.roles.length ? pp.roles : (p.role ? [p.role] : []);
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
        <h1 className="mt-3 font-display text-5xl text-ink">{title}</h1>
        {p.summary && <p className="mt-4 max-w-2xl text-lg text-ink-soft">{p.summary}</p>}
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          {p.live_link && <a href={p.live_link} target="_blank" rel="noreferrer" className="rounded-full border border-line px-4 py-2 hover:bg-surface">Visit live →</a>}
          {p.case_study_link && <a href={p.case_study_link} target="_blank" rel="noreferrer" className="rounded-full border border-line px-4 py-2 hover:bg-surface">Case study →</a>}
          {additionalLinks.map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="rounded-full border border-line px-4 py-2 hover:bg-surface">{l.label} →</a>
          ))}
        </div>
      </header>
      {p.featured_image_url && (
        <img src={p.featured_image_url} alt={pp.image_alt || title} className="w-full rounded-2xl border border-line object-cover" />
      )}
      {gallery.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {gallery.map((g, i) => (
            <figure key={i} className="space-y-1">
              <img src={g.url} alt={g.alt || ""} className="w-full rounded-xl border border-line object-cover" />
              {g.caption && <figcaption className="text-xs text-muted-ink">{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {rolesList.length > 0 && <Meta label="Roles" value={rolesList.join(", ")} />}
        {p.tools?.length ? <Meta label="Stack" value={p.tools.join(", ")} /> : null}
        {p.category && <Meta label="Category" value={p.category} />}
      </div>
      <Section title="Overview" body={overview} />
      <Section title="The Challenge" body={challenge} />
      <Section title="Goals" body={pp.goals} />
      <Section title="Constraints" body={pp.constraints} />
      <Section title="Process" body={p.process} />
      <Section title="Solution" body={p.solution} />
      {metrics.length > 0 && (
        <section>
          <h2 className="font-display text-2xl text-ink">Key Metrics</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {metrics.map((m, i) => (
              <div key={i} className="rounded-xl border border-line bg-cloud p-4">
                <div className="font-display text-3xl text-electric">{m.value}</div>
                <div className="mt-1 text-sm font-medium text-ink">{m.label}</div>
                {m.note && <div className="mt-1 text-xs text-muted-ink">{m.note}</div>}
              </div>
            ))}
          </div>
        </section>
      )}
      <Section title="Results" body={p.results} />
      <Section title="Learnings" body={pp.learnings} />
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