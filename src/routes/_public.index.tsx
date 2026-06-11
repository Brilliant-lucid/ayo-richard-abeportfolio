import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listProjects, listTestimonials, listBlogPosts } from "@/lib/cms/public.functions";
import { siteQueryOptions } from "./_public";
import { ArrowUpRight } from "lucide-react";
import portrait from "@/assets/portrait.jpg";

const projectsQO = queryOptions({ queryKey: ["projects"], queryFn: () => listProjects() });
const testimonialsQO = queryOptions({ queryKey: ["testimonials"], queryFn: () => listTestimonials() });
const blogQO = queryOptions({ queryKey: ["blog"], queryFn: () => listBlogPosts() });

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Ayo Richard Abe — Building products that define market categories" },
      { name: "description", content: "Portfolio of Ayo Richard Abe, Product Manager, Developer, and Growth Marketer." },
      { property: "og:title", content: "Ayo Richard Abe — Portfolio" },
      { property: "og:description", content: "Product, engineering, and growth — building things that compound." },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQO),
      context.queryClient.ensureQueryData(testimonialsQO),
      context.queryClient.ensureQueryData(blogQO),
    ]);
  },
  component: Home,
  errorComponent: ({ error }) => <div className="p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

const bentoSize: Record<string, string> = {
  small: "md:col-span-4 md:row-span-1",
  medium: "md:col-span-6 md:row-span-1",
  large: "md:col-span-8 md:row-span-2",
  wide: "md:col-span-8 md:row-span-1",
  tall: "md:col-span-4 md:row-span-2",
};

function Home() {
  const { data: site } = useSuspenseQuery(siteQueryOptions);
  const { data: projects } = useSuspenseQuery(projectsQO);
  const { data: testimonials } = useSuspenseQuery(testimonialsQO);
  const { data: posts } = useSuspenseQuery(blogQO);
  const hero = site.hero;
  const stats = site.stats;
  const featured = projects.filter((p) => p.featured);
  const featuredPosts = posts.slice(0, 3);
  const portraitSrc = hero?.profile_image_url || portrait;

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          {hero?.eyebrow && (
            <div className="mb-4 text-xs uppercase tracking-[0.22em] text-electric">{hero.eyebrow}</div>
          )}
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl">
            {hero?.heading}
          </h1>
          {hero?.intro && (
            <p className="mt-6 max-w-2xl text-lg text-ink-soft">{hero.intro}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {hero?.cta_primary_label && (
              <Link
                to={hero.cta_primary_href ?? "/projects"}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud transition-transform hover:scale-[1.02]"
              >
                {hero.cta_primary_label} <ArrowUpRight size={14} />
              </Link>
            )}
            {hero?.cta_secondary_label && (
              <Link
                to={hero.cta_secondary_href ?? "/contact"}
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink hover:bg-surface"
              >
                {hero.cta_secondary_label}
              </Link>
            )}
          </div>
        </div>
        <div className="order-first justify-self-center md:order-none md:justify-self-end">
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-electric/30 to-transparent blur-xl" aria-hidden />
            <img
              src={portraitSrc}
              alt="Ayo Richard Abe portrait"
              className="relative h-48 w-48 rounded-2xl object-cover ring-1 ring-line md:h-72 md:w-72"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Bento grid */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl text-ink">Selected work</h2>
          <Link to="/projects" className="text-sm text-electric hover:underline">View all →</Link>
        </div>
        <div className="grid auto-rows-[180px] grid-cols-1 gap-4 md:grid-cols-12">
          {featured.map((p) => (
            <Link
              key={p.id}
              to="/projects/$slug"
              params={{ slug: p.slug }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 transition-all hover:border-electric/40 hover:bg-surface ${bentoSize[p.bento_size] ?? bentoSize.small}`}
            >
              {p.featured_image_url && (
                <img src={p.featured_image_url} alt={p.name} className="absolute inset-0 h-full w-full object-cover opacity-20 transition-opacity group-hover:opacity-30" />
              )}
              <div className="relative">
                <div className="text-xs uppercase tracking-wider text-muted-ink">{p.category ?? "Project"}</div>
                <div className="mt-2 font-display text-2xl text-ink">{p.name}</div>
              </div>
              <div className="relative">
                <p className="text-sm text-ink-soft line-clamp-2">{p.summary}</p>
                <ArrowUpRight size={16} className="absolute right-0 top-0 text-electric opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {featuredPosts.length > 0 && (
        <section>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl text-ink">From the blog</h2>
            <Link to="/blog" className="text-sm text-electric hover:underline">All posts →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map((p) => (
              <Link
                key={p.id}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group flex flex-col rounded-2xl border border-line bg-cloud p-6 transition-colors hover:border-electric/40"
              >
                <div className="text-xs uppercase tracking-wider text-muted-ink">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString() : "Draft"}
                </div>
                <div className="mt-3 font-display text-xl text-ink group-hover:text-electric">{p.title}</div>
                {p.excerpt && <p className="mt-2 text-sm text-ink-soft line-clamp-3">{p.excerpt}</p>}
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-electric">
                  Read more <ArrowUpRight size={12} />
                </div>
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

      {/* Contact CTA */}
      <section className="rounded-3xl bg-ink p-10 text-cloud md:p-14">
        <div className="font-display text-4xl md:text-5xl">Let's build something inevitable.</div>
        <p className="mt-3 max-w-xl text-cloud/70">Open to product leadership, technical advisory, and selective growth engagements.</p>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-electric px-5 py-2.5 text-sm font-medium text-cloud hover:opacity-90"
        >
          Start a conversation <ArrowUpRight size={14} />
        </Link>
      </section>
    </div>
  );
}