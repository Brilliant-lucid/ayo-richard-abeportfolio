import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, LayoutTemplate, Share2, Sparkles } from "lucide-react";
import { listFeaturedPortfolios } from "@/lib/cms/public.functions";

const featuredQO = queryOptions({
  queryKey: ["platform", "featured-portfolios"],
  queryFn: () => listFeaturedPortfolios(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Portfolio Platform — Publish your work with your own link" },
      { name: "description", content: "Create a beautiful portfolio in minutes. Share your projects, case studies and blog with your own /u/username link." },
      { property: "og:title", content: "Portfolio Platform" },
      { property: "og:description", content: "Create a beautiful portfolio in minutes. Your own shareable /u/username link." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(featuredQO),
  component: Landing,
  errorComponent: ({ error }) => <div className="p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function Landing() {
  const { data: featured } = useSuspenseQuery(featuredQO);

  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="pt-4">
        <div className="text-xs uppercase tracking-[0.22em] text-electric">Portfolio platform</div>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl">
          Publish your work.<br />Own your link.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          Spin up a beautiful portfolio in minutes — projects, case studies, and a blog, all under
          your own <span className="font-mono text-ink">/u/your-name</span> URL.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud transition-transform hover:scale-[1.02]"
          >
            Create your portfolio <ArrowUpRight size={14} />
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink hover:bg-surface"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="font-display text-3xl text-ink">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "Claim your username", body: "Sign up in seconds. Pick a username — that becomes your public link." },
            { icon: LayoutTemplate, title: "Add your work", body: "Use the admin dashboard to add projects, case studies, blog posts and more." },
            { icon: Share2, title: "Publish & share", body: "Toggle publish on — share your /u/your-name link anywhere." },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-line bg-cloud p-6">
              <s.icon size={18} className="text-electric" />
              <div className="mt-4 font-display text-xl text-ink">{s.title}</div>
              <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured portfolios */}
      {featured.length > 0 && (
        <section>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl text-ink">Portfolios on the platform</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {featured.map((p) => (
              <Link
                key={p.username}
                to="/u/$username"
                params={{ username: p.username }}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-cloud p-4 transition-colors hover:border-electric/40"
              >
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt="" className="h-14 w-14 rounded-full object-cover ring-1 ring-line" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface font-display text-lg text-ink-soft">
                    {(p.display_name ?? p.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-display text-lg text-ink group-hover:text-electric">{p.display_name ?? p.username}</div>
                  <div className="truncate text-xs text-muted-ink">/u/{p.username}</div>
                  {p.tagline && <div className="mt-1 line-clamp-1 text-xs text-ink-soft">{p.tagline}</div>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="rounded-3xl bg-ink p-10 text-cloud md:p-14">
        <div className="font-display text-4xl md:text-5xl">Ready to launch yours?</div>
        <p className="mt-3 max-w-xl text-cloud/70">Free to try. Sign up and share your first portfolio in the next 5 minutes.</p>
        <Link
          to="/auth"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-electric px-5 py-2.5 text-sm font-medium text-cloud hover:opacity-90"
        >
          Get started <ArrowUpRight size={14} />
        </Link>
      </section>
    </div>
  );
}