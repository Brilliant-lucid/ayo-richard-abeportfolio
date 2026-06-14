import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getCaseStudyBySlug } from "@/lib/cms/public.functions";
import { ArrowLeft } from "lucide-react";

const qo = (slug: string) => queryOptions({
  queryKey: ["case-study", slug],
  queryFn: () => getCaseStudyBySlug({ data: { slug } }),
});

export const Route = createFileRoute("/_public/case-studies/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(qo(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.title} — Case Study` },
      { name: "description", content: loaderData.summary ?? loaderData.title },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: loaderData.summary ?? "" },
      ...(loaderData.cover_image_url ? [{ property: "og:image", content: loaderData.cover_image_url }] : []),
    ] : [],
  }),
  component: Page,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="py-20 text-center">Case study not found</div>,
});

function Block({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <section>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink-soft">{body}</div>
    </section>
  );
}

function Page() {
  const { slug } = Route.useParams();
  const { data: c } = useSuspenseQuery(qo(slug));
  if (!c) return null;
  return (
    <article className="space-y-10">
      <Link to="/case-studies" className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm font-medium text-ink hover:bg-surface"><ArrowLeft size={16} /> Back to Case Studies</Link>
      <header>
        <div className="text-xs uppercase tracking-[0.22em] text-electric">{c.category ?? "Case study"}</div>
        <h1 className="mt-3 font-display text-5xl text-ink">{c.title}</h1>
        {c.summary && <p className="mt-4 max-w-2xl text-lg text-ink-soft">{c.summary}</p>}
      </header>
      {c.cover_image_url && <img src={c.cover_image_url} alt={c.title} className="w-full rounded-2xl border border-line" />}
      <Block title="Challenge" body={c.challenge} />
      <Block title="Research" body={c.research} />
      <Block title="Strategy" body={c.strategy} />
      <Block title="Execution" body={c.execution} />
      <Block title="Outcome" body={c.outcome} />
      <Block title="Lessons" body={c.lessons} />
    </article>
  );
}