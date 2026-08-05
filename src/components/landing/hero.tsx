import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BadgeCheck, Play, Sparkles, Link2, Award } from "lucide-react";
import portrait from "@/assets/portrait.jpg";

export function Hero({ demoUsername }: { demoUsername?: string }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 h-[460px] w-[460px] rounded-full bg-electric/20 blur-3xl animate-blob" />
        <div className="absolute -top-20 right-0 h-[380px] w-[380px] rounded-full bg-fuchsia-300/25 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.05)_1px,transparent_0)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 md:px-6 md:pb-28 md:pt-20 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud/70 px-3.5 py-1.5 text-xs text-ink-soft backdrop-blur">
            <Sparkles size={12} className="text-electric" />
            One link for your entire professional story
          </span>

          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.2rem]">
            Build a Professional Portfolio That{" "}
            <span className="bg-gradient-to-r from-electric via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
              Opens Doors
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
            Create a beautiful, personalized portfolio that showcases your skills, experience, projects,
            achievements, and professional identity — all from a single shareable link.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cloud shadow-xl shadow-ink/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Create My Portfolio
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            {demoUsername ? (
              <Link
                to="/u/$username"
                params={{ username: demoUsername }}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud/70 px-6 py-3 text-sm font-medium text-ink backdrop-blur transition-colors hover:bg-surface"
              >
                <Play size={14} className="text-electric" /> View Demo
              </Link>
            ) : (
              <a
                href="#showcase"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud/70 px-6 py-3 text-sm font-medium text-ink backdrop-blur transition-colors hover:bg-surface"
              >
                <Play size={14} className="text-electric" /> View Demo
              </a>
            )}
          </div>

          <p className="mt-5 text-xs text-muted-ink">Free to start · No credit card · Live in minutes</p>
        </div>

        {/* Product preview mockup */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative rounded-[28px] border border-line bg-cloud p-3 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.45)]">
            <div className="flex items-center gap-1.5 px-2 pb-3 pt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-surface" />
              <span className="h-2.5 w-2.5 rounded-full bg-surface" />
              <span className="h-2.5 w-2.5 rounded-full bg-surface" />
              <span className="ml-3 truncate rounded-full bg-surface px-3 py-1 font-mono text-[10px] text-muted-ink">
                portfolio.app/u/your-name
              </span>
            </div>
            <div className="overflow-hidden rounded-[20px] bg-surface/50">
              <div className="flex items-center gap-3 p-4">
                <img
                  src={portrait}
                  alt="Example portfolio profile"
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-cloud"
                />
                <div className="min-w-0">
                  <div className="truncate font-display text-lg text-ink">Your Name</div>
                  <div className="truncate text-xs text-muted-ink">Product Manager · Lagos, NG</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
                {["Case study", "Product launch", "Design system", "Growth report"].map((t, i) => (
                  <div
                    key={t}
                    className="overflow-hidden rounded-xl border border-line bg-cloud p-3"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <div className="mb-2 h-12 rounded-lg bg-gradient-to-br from-electric/25 via-fuchsia-200/40 to-amber-100" />
                    <div className="truncate text-[11px] font-medium text-ink">{t}</div>
                    <div className="mt-1 h-1.5 w-2/3 rounded-full bg-surface" />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 px-4 pb-5">
                {["Strategy", "Analytics", "Figma", "SQL"].map((s) => (
                  <span key={s} className="rounded-full border border-line bg-cloud px-2.5 py-1 text-[10px] text-ink-soft">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Floating UI elements */}
          <div className="pointer-events-none absolute -left-4 top-24 hidden animate-blob rounded-2xl border border-line bg-cloud/95 px-3.5 py-2.5 shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-2">
            <BadgeCheck size={16} className="text-electric" />
            <span className="text-[11px] font-medium text-ink">Verified profile</span>
          </div>
          <div className="pointer-events-none absolute -right-3 top-10 hidden animate-blob animation-delay-2000 rounded-2xl border border-line bg-cloud/95 px-3.5 py-2.5 shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-2">
            <Award size={16} className="text-amber-500" />
            <span className="text-[11px] font-medium text-ink">Certificate added</span>
          </div>
          <div className="pointer-events-none absolute -bottom-5 left-6 hidden animate-blob animation-delay-4000 rounded-2xl border border-line bg-cloud/95 px-3.5 py-2.5 shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-2">
            <Link2 size={16} className="text-fuchsia-500" />
            <span className="font-mono text-[11px] text-ink">/u/your-name</span>
          </div>
        </div>
      </div>
    </section>
  );
}