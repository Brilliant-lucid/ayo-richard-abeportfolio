import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { siteQO, projectsQO, blogQO, caseStudiesQO, testimonialsQO } from "@/lib/cms/portfolio-queries";
import { openContactDialog } from "@/lib/contact-dialog-store";
import { absoluteUrl, absoluteImage } from "@/lib/site-url";
import { ShareButton } from "@/components/portfolio/share-button";

export const Route = createFileRoute("/u/$username/")({
  loader: async ({ context, params }) => {
    const u = params.username;
    const [site] = await Promise.all([
      context.queryClient.ensureQueryData(siteQO(u)),
      context.queryClient.ensureQueryData(projectsQO(u)),
      context.queryClient.ensureQueryData(caseStudiesQO(u)),
      context.queryClient.ensureQueryData(blogQO(u)),
      context.queryClient.ensureQueryData(testimonialsQO(u)),
    ]);
    return {
      name: site.portfolio?.display_name ?? u,
      tagline: site.hero?.intro ?? site.portfolio?.tagline ?? "",
      image: site.hero?.profile_image_url ?? site.portfolio?.avatar_url ?? null,
      username: u,
    };
  },
  head: ({ loaderData, params }) => {
    const url = absoluteUrl(`/u/${params.username}`);
    const title = loaderData ? `${loaderData.name} — Portfolio` : "Portfolio";
    const description = loaderData?.tagline || `Projects, case studies and writing by ${params.username}.`;
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
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: loaderData.name,
                description,
                url,
                ...(image ? { image } : {}),
              }),
            },
          ]
        : [],
    };
  },
  component: PortfolioHome,
});

function PortfolioHome() {
  const { username } = Route.useParams();
  const { data: site } = useSuspenseQuery(siteQO(username));
  const { data: projects } = useSuspenseQuery(projectsQO(username));
  const { data: studies } = useSuspenseQuery(caseStudiesQO(username));
  const { data: posts } = useSuspenseQuery(blogQO(username));
  const { data: testimonials } = useSuspenseQuery(testimonialsQO(username));

  const hero = site.hero;
  const stats = site.stats;
  const featured = projects.filter((p) => p.featured);
  const shownProjects = featured.length > 0 ? featured : projects.slice(0, 4);
  const featuredPosts = posts.slice(0, 3);
  const portraitSrc = hero?.profile_image_url || site.portfolio?.avatar_url || undefined;

  return (
    <div className="space-y-20">
      <section className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          {hero?.eyebrow && <div className="mb-4 text-xs uppercase tracking-[0.22em] text-electric">{hero.eyebrow}</div>}
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl">
            {hero?.heading ?? site.portfolio?.display_name}
          </h1>
          {(hero?.intro || site.portfolio?.tagline) && (
            <p className="mt-6 max-w-2xl text-lg text-ink-soft">{hero?.intro ?? site.portfolio?.tagline}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openContactDialog()}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud transition-transform hover:scale-[1.02]"
            >
              Get in touch <ArrowUpRight size={14} />
            </button>
            {projects.length > 0 && (
              <Link
                to="/u/$username/projects"
                params={{ username }}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
              >
                View Projects <ArrowUpRight size={14} />
              </Link>
            )}
            <ShareButton title={site.portfolio?.display_name ?? username} />
          </div>
        </div>
        {portraitSrc && (
          <div className="order-first justify-self-center md:order-none md:justify-self-end">
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-electric/30 to-transparent blur-xl" aria-hidden />
              <img
                src={portraitSrc}
                alt={site.portfolio?.display_name ?? username}
                className="relative h-48 w-48 rounded-2xl object-cover ring-1 ring-line md:h-72 md:w-72"
              />
            </div>
          </div>
        )}
      </section>

      {stats.length > 0 && (
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.id} className="bg-cloud p-6">
              <div className="font-display text-3xl text-ink">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-ink">{s.label}</div>
            </div>
          ))}
        </section>
      )}

      {shownProjects.length > 0 && (
        <section id="projects" className="scroll-mt-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl text-ink">Projects &amp; Case Studies</h2>
            <Link to="/u/$username/projects" params={{ username }} className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-electric">
              All projects <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {shownProjects.map((p) => (
              <Link
                key={p.id}
                to="/u/$username/projects/$slug"
                params={{ username, slug: p.slug }}
                className="group flex flex-col gap-3 rounded-[28px] bg-ink p-3 text-cloud shadow-xl shadow-ink/10 transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                {p.featured_image_url ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                    <img src={p.featured_image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-[20px] bg-cloud/10" />
                )}
                <div className="px-3 pt-2">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-cloud/50">{p.category ?? "Project"}</div>
                  <div className="mt-2 font-display text-2xl">{p.name}</div>
                  {p.summary && <p className="mt-2 line-clamp-3 text-sm text-cloud/70">{p.summary}</p>}
                </div>
                <div className="mt-3 flex items-center justify-center rounded-full bg-cloud px-5 py-3 text-sm font-medium text-ink transition-colors group-hover:bg-electric group-hover:text-ink">
                  View project
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {studies.length > 0 && (
        <section>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl text-ink">Case studies</h2>
            <Link to="/u/$username/case-studies" params={{ username }} className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-electric">
              All case studies <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {studies.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to="/u/$username/case-studies/$slug"
                params={{ username, slug: c.slug }}
                className="group block rounded-2xl border border-line bg-cloud p-6 hover:border-electric/40"
              >
                <div className="text-xs uppercase tracking-wider text-muted-ink">{c.category ?? "Case study"}</div>
                <div className="mt-2 font-display text-2xl text-ink group-hover:text-electric">{c.title}</div>
                {c.summary && <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{c.summary}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {featuredPosts.length > 0 && (
        <section>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl text-ink">From the blog</h2>
            <Link to="/u/$username/blog" params={{ username }} className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-electric">
              All posts <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map((p) => (
              <Link
                key={p.id}
                to="/u/$username/blog/$slug"
                params={{ username, slug: p.slug }}
                className="group flex flex-col rounded-2xl border border-line bg-cloud p-6 hover:border-electric/40"
              >
                <div className="text-xs uppercase tracking-wider text-muted-ink">
                  {p.published_at ? new Date(p.published_at).toISOString().slice(0, 10) : "Draft"}
                </div>
                <div className="mt-3 font-display text-xl text-ink group-hover:text-electric">{p.title}</div>
                {p.excerpt && <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section>
          <h2 className="mb-6 font-display text-3xl">Praise</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.id} className="rounded-2xl border border-line bg-cloud p-6">
                <blockquote className="text-base leading-relaxed text-ink">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-sm text-ink-soft">— {t.name}{t.role ? `, ${t.role}` : ""}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-3xl bg-ink p-10 text-cloud md:p-14">
        <div className="font-display text-4xl md:text-5xl">Let's build something together.</div>
        <button
          type="button"
          onClick={() => openContactDialog()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-electric px-5 py-2.5 text-sm font-medium text-cloud hover:opacity-90"
        >
          Start a conversation <ArrowUpRight size={14} />
        </button>
      </section>
    </div>
  );
}
