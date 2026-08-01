import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteQO } from "@/lib/cms/portfolio-queries";
import { absoluteUrl, absoluteImage } from "@/lib/site-url";
import { RichOrPlain } from "@/components/portfolio/rich-text-view";

export const Route = createFileRoute("/u/$username/about")({
  loader: async ({ context, params }) => {
    const site = await context.queryClient.ensureQueryData(siteQO(params.username));
    return {
      name: site.portfolio?.display_name ?? params.username,
      tagline: site.hero?.intro ?? site.portfolio?.tagline ?? "",
      image: site.hero?.profile_image_url ?? site.portfolio?.avatar_url ?? null,
    };
  },
  head: ({ loaderData, params }) => {
    const url = absoluteUrl(`/u/${params.username}/about`);
    const title = `About — ${loaderData?.name ?? params.username}`;
    const description = loaderData?.tagline || `About ${loaderData?.name ?? params.username}.`;
    const image = absoluteImage(loaderData?.image);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const { username } = Route.useParams();
  const { data: site } = useSuspenseQuery(siteQO(username));
  const hero = site.hero;
  const portrait = hero?.profile_image_url || site.portfolio?.avatar_url;

  return (
    <div className="space-y-10">
      <Link to="/u/$username" params={{ username }} className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm font-medium text-ink hover:bg-surface">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <header className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-electric">About</div>
          <h1 className="mt-3 font-display text-5xl leading-tight text-ink">
            {site.portfolio?.display_name ?? username}
          </h1>
          {site.portfolio?.tagline && <p className="mt-4 text-lg text-ink-soft">{site.portfolio.tagline}</p>}
        </div>
        {portrait && (
          <img src={portrait} alt={site.portfolio?.display_name ?? username} className="h-40 w-40 rounded-2xl object-cover ring-1 ring-line" />
        )}
      </header>

      {hero?.intro && <div className="max-w-2xl"><RichOrPlain content={hero.intro} /></div>}

      {site.stats.length > 0 && (
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {site.stats.map((s) => (
            <div key={s.id} className="bg-cloud p-6">
              <div className="font-display text-3xl text-ink">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-ink">{s.label}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
