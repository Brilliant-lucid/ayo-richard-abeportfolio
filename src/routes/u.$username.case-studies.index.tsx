import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { caseStudiesQO, siteQO } from "@/lib/cms/portfolio-queries";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/u/$username/case-studies/")({
  loader: async ({ context, params }) => {
    const [site] = await Promise.all([
      context.queryClient.ensureQueryData(siteQO(params.username)),
      context.queryClient.ensureQueryData(caseStudiesQO(params.username)),
    ]);
    return { name: site.portfolio?.display_name ?? params.username };
  },
  head: ({ loaderData, params }) => {
    const url = absoluteUrl(`/u/${params.username}/case-studies`);
    const title = `Case Studies — ${loaderData?.name ?? params.username}`;
    const description = `In-depth breakdowns of strategy, execution and outcome by ${loaderData?.name ?? params.username}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CaseStudiesIndex,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
});

function CaseStudiesIndex() {
  const { username } = Route.useParams();
  const { data } = useSuspenseQuery(caseStudiesQO(username));
  return (
    <div className="space-y-10">
      <header>
        <Link to="/u/$username" params={{ username }} className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm font-medium text-ink hover:bg-surface">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <div className="mt-6 text-xs uppercase tracking-[0.22em] text-electric">Case Studies</div>
        <h1 className="mt-3 font-display text-5xl text-ink">Depth over breadth</h1>
      </header>
      {data.length === 0 && <p className="text-sm text-ink-soft">No case studies published yet.</p>}
      <div className="grid gap-6 md:grid-cols-2">
        {data.map((c) => (
          <Link
            key={c.id}
            to="/u/$username/case-studies/$slug"
            params={{ username, slug: c.slug }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-cloud transition-all hover:-translate-y-1 hover:border-electric/40"
          >
            {c.cover_image_url && (
              <div className="aspect-[16/9] overflow-hidden">
                <img src={c.cover_image_url} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            )}
            <div className="p-6">
              <div className="text-xs uppercase tracking-wider text-muted-ink">{c.category ?? "Case study"}</div>
              <div className="mt-2 font-display text-2xl text-ink group-hover:text-electric">{c.title}</div>
              {c.summary && <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{c.summary}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
