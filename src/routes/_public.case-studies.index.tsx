import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listCaseStudies } from "@/lib/cms/public.functions";

const qo = queryOptions({ queryKey: ["case-studies"], queryFn: () => listCaseStudies() });

export const Route = createFileRoute("/_public/case-studies/")({
  head: () => ({
    meta: [
      { title: "Case Studies — Ayo Richard Abe" },
      { name: "description", content: "In-depth breakdowns of strategy, execution, and outcome." },
      { property: "og:title", content: "Case Studies" },
      { property: "og:description", content: "Strategy. Execution. Outcome." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  component: CaseStudiesIndex,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div>No case studies yet.</div>,
});

function CaseStudiesIndex() {
  const { data } = useSuspenseQuery(qo);
  return (
    <div className="space-y-10">
      <header>
        <div className="text-xs uppercase tracking-[0.22em] text-electric">Case Studies</div>
        <h1 className="mt-3 font-display text-5xl text-ink">Depth over breadth</h1>
      </header>
      <div className="space-y-4">
        {data.map((c) => (
          <Link key={c.id} to="/case-studies/$slug" params={{ slug: c.slug }} className="group block rounded-2xl border border-line bg-cloud p-6 hover:border-electric/40">
            <div className="text-xs uppercase tracking-wider text-muted-ink">{c.category ?? "Case study"}</div>
            <div className="mt-2 font-display text-2xl text-ink group-hover:text-electric">{c.title}</div>
            {c.summary && <p className="mt-2 text-sm text-ink-soft">{c.summary}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}