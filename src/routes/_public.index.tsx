import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listProjects, listTestimonials, listBlogPosts } from "@/lib/cms/public.functions";
import { siteQueryOptions } from "./_public";
import { ArrowUpRight } from "lucide-react";
import portrait from "@/assets/portrait.jpg";
import { useEffect } from "react";
import { openContactDialog } from "@/lib/contact-dialog-store";

const projectsQO = queryOptions({ queryKey: ["projects"], queryFn: () => listProjects() });
const testimonialsQO = queryOptions({ queryKey: ["testimonials"], queryFn: () => listTestimonials() });
const blogQO = queryOptions({ queryKey: ["blog"], queryFn: () => listBlogPosts() });

export const Route = createFileRoute("/_public/")({
  validateSearch: (s: Record<string, unknown>) => ({ contact: s.contact ? 1 : undefined }) as { contact?: 1 },
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

function Home() {
  const { data: site } = useSuspenseQuery(siteQueryOptions);
  const { data: projects } = useSuspenseQuery(projectsQO);
  const { data: testimonials } = useSuspenseQuery(testimonialsQO);
  const { data: posts } = useSuspenseQuery(blogQO);
  const search = useSearch({ from: "/_public/" });
  useEffect(() => {
    if (search.contact) openContactDialog();
  }, [search.contact]);
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
              <HeroCta href={hero.cta_primary_href ?? "/projects"} variant="primary">
                {hero.cta_primary_label} <ArrowUpRight size={14} />
              </HeroCta>
            )}
            {hero?.cta_secondary_label && (
              <HeroCta href={hero.cta_secondary_href ?? "/contact"} variant="secondary">
                {hero.cta_secondary_label}
              </HeroCta>
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

      {/* Projects & Case Studies */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl text-ink">Projects &amp; Case Studies</h2>
          <Link to="/projects" className="text-sm text-electric hover:underline">View all →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((p) => (
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
                {p.summary && <p className="mt-2 line-clamp-3 text-sm text-cloud/70">{p.summary}</p>}
              </div>
              <div className="mt-3 flex items-center justify-center rounded-full bg-cloud px-5 py-3 text-sm font-medium text-ink transition-colors group-hover:bg-electric group-hover:text-ink">
                View project
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
                  {p.published_at ? new Date(p.published_at).toISOString().slice(0, 10) : "Draft"}
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

function HeroCta({ href, variant, children }: { href: string; variant: "primary" | "secondary"; children: React.ReactNode }) {
  const cls = variant === "primary"
    ? "inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud transition-transform hover:scale-[1.02]"
    : "inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink hover:bg-surface";
  if (href === "/contact") {
    return <button type="button" onClick={() => openContactDialog()} className={cls}>{children}</button>;
  }
  return <Link to={href} className={cls}>{children}</Link>;
}