import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "./reveal";

export type FeaturedPortfolio = {
  username: string;
  display_name: string | null;
  tagline: string | null;
  avatar_url: string | null;
  cover_url: string | null;
};

export function PortfolioShowcase({ featured }: { featured: FeaturedPortfolio[] }) {
  const fillers = Math.max(0, 9 - featured.length);
  return (
    <section id="showcase" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-6 md:py-28">
      <SectionHeading
        eyebrow="Showcase"
        title="Real portfolios, real professionals"
        subtitle="Different industries, different styles — same effortless setup."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p, i) => (
          <Reveal key={p.username} delay={(i % 3) * 80}>
            <Link
              to="/u/$username"
              params={{ username: p.username }}
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:shadow-2xl"
            >
              {p.cover_url ? (
                <>
                  <img
                    src={p.cover_url}
                    alt={`${p.display_name ?? p.username}'s portfolio cover`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-electric/15 via-surface to-cloud" />
              )}

              <div className="relative flex items-end gap-3 p-4">
                {p.avatar_url ? (
                  <img
                    src={p.avatar_url}
                    alt=""
                    loading="lazy"
                    className={`h-11 w-11 shrink-0 rounded-full object-cover ring-2 ${p.cover_url ? "ring-cloud/70" : "ring-line"}`}
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cloud font-display text-base text-ink">
                    {(p.display_name ?? p.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className={`truncate font-display text-lg ${p.cover_url ? "text-cloud" : "text-ink"}`}>
                    {p.display_name ?? p.username}
                  </div>
                  <div className={`truncate text-xs ${p.cover_url ? "text-cloud/70" : "text-muted-ink"}`}>
                    /u/{p.username}
                  </div>
                  {p.tagline && (
                    <div className={`mt-0.5 line-clamp-1 text-xs ${p.cover_url ? "text-cloud/70" : "text-ink-soft"}`}>
                      {p.tagline}
                    </div>
                  )}
                </div>
              </div>

              <span className="pointer-events-none absolute right-3 top-3 inline-flex translate-y-1 items-center gap-1 rounded-full bg-cloud/95 px-3 py-1 text-[11px] font-medium text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                View Live Demo <ArrowUpRight size={12} />
              </span>
            </Link>
          </Reveal>
        ))}

        {Array.from({ length: fillers }).map((_, i) => (
          <Reveal key={`slot-${i}`} delay={(i % 3) * 80}>
            <Link
              to="/auth"
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-dashed border-line/70 transition-all duration-300 hover:-translate-y-1 hover:border-electric/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-electric/10 via-transparent to-ink/5 blur-2xl" />
              <div className="relative flex items-end gap-3 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-line text-lg text-muted-ink">
                  +
                </div>
                <div className="min-w-0">
                  <div className="font-display text-lg text-ink-soft group-hover:text-electric">Your portfolio here</div>
                  <div className="truncate text-xs text-muted-ink">Claim your /u/username</div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}