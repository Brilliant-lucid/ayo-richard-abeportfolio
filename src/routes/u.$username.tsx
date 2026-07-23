import { createFileRoute, Link, notFound, useSearch } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import {
  getSiteData,
  listProjects,
  listBlogPosts,
  listTestimonials,
  notifyPortfolioVisit,
} from "@/lib/cms/public.functions";
import { PublicShell } from "@/components/public-shell";
import { ContactDialog } from "@/components/contact-dialog";
import { openContactDialog } from "@/lib/contact-dialog-store";

const siteQO = (username: string) =>
  queryOptions({ queryKey: ["u", username, "site"], queryFn: () => getSiteData({ data: { username } }) });
const projectsQO = (username: string) =>
  queryOptions({ queryKey: ["u", username, "projects"], queryFn: () => listProjects({ data: { username } }) });
const blogQO = (username: string) =>
  queryOptions({ queryKey: ["u", username, "blog"], queryFn: () => listBlogPosts({ data: { username } }) });
const testimonialsQO = (username: string) =>
  queryOptions({ queryKey: ["u", username, "testimonials"], queryFn: () => listTestimonials({ data: { username } }) });

export const Route = createFileRoute("/u/$username")({
  validateSearch: (s: Record<string, unknown>) => ({ contact: s.contact ? 1 : undefined }) as { contact?: 1 },
  loader: async ({ context, params }) => {
    const site = await context.queryClient.ensureQueryData(siteQO(params.username));
    if (!site.portfolio) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQO(params.username)),
      context.queryClient.ensureQueryData(blogQO(params.username)),
      context.queryClient.ensureQueryData(testimonialsQO(params.username)),
    ]);
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.username} — Portfolio` },
      { name: "description", content: `${params.username}'s portfolio on the platform.` },
      { property: "og:title", content: `${params.username} — Portfolio` },
      { property: "og:description", content: `${params.username}'s portfolio.` },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UserPortfolio,
  errorComponent: ({ error }) => <div className="p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-8 text-center">
      <div>
        <h1 className="font-display text-3xl">Portfolio not found</h1>
        <p className="mt-2 text-sm text-ink-soft">This portfolio doesn't exist or hasn't been published yet.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full border border-line px-4 py-2 text-xs hover:bg-surface">Back to platform</Link>
      </div>
    </div>
  ),
});

function UserPortfolio() {
  const { username } = Route.useParams();
  const search = useSearch({ from: "/u/$username" });
  const { data: site } = useSuspenseQuery(siteQO(username));
  const { data: projects } = useSuspenseQuery(projectsQO(username));
  const { data: posts } = useSuspenseQuery(blogQO(username));
  const { data: testimonials } = useSuspenseQuery(testimonialsQO(username));

  useEffect(() => {
    if (search.contact) openContactDialog();
  }, [search.contact]);

  // Fire visitor notification once per 12h per browser per portfolio.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const key = `visited:${username}`;
      const last = Number(localStorage.getItem(key) || 0);
      const now = Date.now();
      if (now - last < 12 * 60 * 60 * 1000) return;
      // Skip if the viewer is the owner
      import("@/integrations/supabase/client").then(({ supabase }) => {
        supabase.auth.getUser().then(({ data }) => {
          if (data.user && data.user.id === site.portfolio?.owner_id) return;
          localStorage.setItem(key, String(now));
          notifyPortfolioVisit({
            data: {
              username,
              referrer: document.referrer || "",
              userAgent: navigator.userAgent || "",
            },
          }).catch(() => {});
        });
      });
    } catch {
      /* noop */
    }
  }, [username, site.portfolio?.owner_id]);

  const hero = site.hero;
  const stats = site.stats;
  const featured = projects.filter((p) => p.featured);
  const featuredPosts = posts.slice(0, 3);
  const portraitSrc = hero?.profile_image_url || site.portfolio?.avatar_url || undefined;

  // Rewrite nav hrefs into per-user paths — the CMS ships /about etc., but on
  // /u/$username those anchor labels are the only signal we can keep. Filter
  // to items that still route somewhere meaningful; contact stays as a dialog.
  const nav = site.nav
    .map((n) => ({ id: n.id, label: n.label, href: n.href }))
    .filter((n) => n.href === "/contact" || n.href === "/" || n.href.startsWith("#"));

  return (
    <PublicShell nav={nav} settings={site.settings as never}>
      <div className="space-y-20">
        {/* Hero */}
        <section className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            {hero?.eyebrow && (
              <div className="mb-4 text-xs uppercase tracking-[0.22em] text-electric">{hero.eyebrow}</div>
            )}
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
            </div>
          </div>
          {portraitSrc && (
            <div className="order-first justify-self-center md:order-none md:justify-self-end">
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-electric/30 to-transparent blur-xl" aria-hidden />
                <img
                  src={portraitSrc}
                  alt=""
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

        {featured.length > 0 && (
          <section>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-3xl text-ink">Projects &amp; Case Studies</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col gap-3 rounded-[28px] bg-ink p-3 text-cloud shadow-xl shadow-ink/10"
                >
                  {p.featured_image_url ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                      <img src={p.featured_image_url} alt={p.name} className="h-full w-full object-cover" />
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
                </div>
              ))}
            </div>
          </section>
        )}

        {featuredPosts.length > 0 && (
          <section>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-3xl text-ink">From the blog</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredPosts.map((p) => (
                <div key={p.id} className="flex flex-col rounded-2xl border border-line bg-cloud p-6">
                  <div className="text-xs uppercase tracking-wider text-muted-ink">
                    {p.published_at ? new Date(p.published_at).toISOString().slice(0, 10) : "Draft"}
                  </div>
                  <div className="mt-3 font-display text-xl text-ink">{p.title}</div>
                  {p.excerpt && <p className="mt-2 text-sm text-ink-soft line-clamp-3">{p.excerpt}</p>}
                </div>
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
      <ContactDialog />
    </PublicShell>
  );
}