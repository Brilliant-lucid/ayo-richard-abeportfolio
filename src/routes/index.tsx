import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, LayoutTemplate, Share2, Sparkles, LayoutDashboard, LogIn } from "lucide-react";
import { listFeaturedPortfolios } from "@/lib/cms/public.functions";
import { supabase } from "@/integrations/supabase/client";

const featuredQO = queryOptions({
  queryKey: ["platform", "featured-portfolios"],
  queryFn: () => listFeaturedPortfolios(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio Platform — Publish your work with your own link" },
      { name: "description", content: "Create a beautiful portfolio in minutes. Share your projects, case studies and blog under your own /u/username link." },
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
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const words = useMemo(() => ["Publish your work.", "Own your link.", "Share your story."], []);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setWordIdx((i) => (i + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length]);

  function onHeroMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPointer({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setSignedIn(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session?.user);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-cloud text-ink">
      {/* Animated background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-electric/25 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-24 h-[380px] w-[380px] rounded-full bg-fuchsia-300/30 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-amber-200/40 blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="group inline-flex items-center gap-2 font-display text-xl">
          <span className="inline-block h-2 w-2 rounded-full bg-electric animate-pulse" />
          <span className="transition-transform group-hover:-translate-y-0.5">Portfolio Platform</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {signedIn ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-cloud hover:opacity-90"
            >
              <LayoutDashboard size={12} /> Dashboard
            </Link>
          ) : (
            <>
              <Link to="/auth" className="rounded-full px-4 py-2 text-xs text-ink-soft hover:text-ink">
                Sign in
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-cloud hover:opacity-90"
              >
                <LogIn size={12} /> Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl space-y-24 px-6 pb-24 pt-8 md:pt-16">
        {/* Hero */}
        <section
          ref={heroRef}
          onMouseMove={onHeroMove}
          className={`relative transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {/* Cursor spotlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl opacity-70 transition-[background] duration-300"
            style={{
              background: `radial-gradient(500px circle at ${pointer.x * 100}% ${pointer.y * 100}%, hsl(var(--electric) / 0.18), transparent 60%)`,
            }}
          />
          <div className="text-xs uppercase tracking-[0.22em] text-electric">Portfolio platform</div>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl">
            <span className="block">Publish your work.</span>
            <span className="relative block">
              <span
                key={wordIdx}
                className="inline-block bg-gradient-to-r from-electric via-fuchsia-500 to-amber-500 bg-clip-text text-transparent animate-fade-in"
              >
                {words[wordIdx]}
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Spin up a beautiful portfolio in minutes — projects, case studies, and a blog, all under
            your own <span className="font-mono text-ink">/u/your-name</span> URL.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud shadow-lg shadow-ink/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Create your portfolio
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            {!signedIn && (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink hover:bg-surface"
              >
                Sign in
              </Link>
            )}
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
            ].map((s, i) => (
              <div
                key={s.title}
                style={{ animationDelay: `${i * 120}ms` }}
                className="group rounded-2xl border border-line bg-cloud/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:shadow-xl animate-fade-in"
              >
                <s.icon size={18} className="text-electric transition-transform group-hover:rotate-12 group-hover:scale-110" />
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
              {featured.map((p, i) => (
                <Link
                  key={p.username}
                  to="/u/$username"
                  params={{ username: p.username }}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-cloud/80 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-lg animate-fade-in"
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
      </main>

      <footer className="border-t border-line py-8">
        <div className="mx-auto max-w-6xl px-6 text-xs text-muted-ink">
          © {new Date().getFullYear()} Portfolio Platform
        </div>
      </footer>
    </div>
  );
}