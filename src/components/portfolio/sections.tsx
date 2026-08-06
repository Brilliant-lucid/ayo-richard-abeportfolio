import type { ReactNode } from "react";
import { Reveal } from "@/components/landing/reveal";
import { Award, BadgeCheck, Briefcase, ExternalLink, Star } from "lucide-react";

export function fmtDate(d?: string | null) {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function range(start?: string | null, end?: string | null, ongoing?: boolean | null) {
  const s = fmtDate(start);
  const e = ongoing || !end ? "Present" : fmtDate(end);
  if (!s && !end) return null;
  return [s, e].filter(Boolean).join(" — ");
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <Reveal>
        <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            {eyebrow && <div className="text-xs font-medium uppercase tracking-[0.22em] text-electric">{eyebrow}</div>}
            <h2 className="mt-2 font-display text-3xl leading-tight text-ink md:text-4xl">{title}</h2>
            {description && <p className="mt-3 max-w-2xl text-sm text-ink-soft md:text-base">{description}</p>}
          </div>
          {action}
        </div>
      </Reveal>
      {children}
    </section>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-soft">
      {children}
    </span>
  );
}

type Exp = {
  id: string;
  organization: string;
  role: string;
  employment_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  responsibilities?: string[] | null;
  achievements?: string[] | null;
  skills_gained?: string[] | null;
  logo_url?: string | null;
};

export function ExperienceTimeline({ items }: { items: Exp[] }) {
  return (
    <ol className="relative space-y-6 border-l border-line pl-6">
      {items.map((e, i) => (
        <Reveal as="li" key={e.id} delay={i * 60} className="relative">
          <span className="absolute -left-[31px] top-2 grid h-4 w-4 place-items-center rounded-full border border-line bg-cloud">
            <span className="h-1.5 w-1.5 rounded-full bg-electric" />
          </span>
          <div className="rounded-2xl border border-line bg-cloud p-5 transition-colors hover:border-electric/40">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {e.logo_url ? (
                  <img src={e.logo_url} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-line" />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface text-muted-ink">
                    <Briefcase size={16} />
                  </span>
                )}
                <div className="min-w-0">
                  <div className="truncate font-display text-lg text-ink">{e.role}</div>
                  <div className="truncate text-sm text-ink-soft">{e.organization}</div>
                </div>
              </div>
              <div className="shrink-0 text-right text-xs text-muted-ink">
                {range(e.start_date, e.end_date)}
                {e.employment_type && <div className="mt-1">{e.employment_type}</div>}
              </div>
            </div>
            {e.description && <p className="mt-4 text-sm leading-relaxed text-ink-soft">{e.description}</p>}
            {e.responsibilities?.length ? (
              <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                {e.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-electric" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {e.achievements?.length ? (
              <div className="mt-4 rounded-xl bg-surface p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-ink">Key achievements</div>
                <ul className="mt-2 space-y-1.5 text-sm text-ink">
                  {e.achievements.map((a) => (
                    <li key={a} className="flex gap-2">
                      <BadgeCheck size={14} className="mt-0.5 shrink-0 text-electric" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {e.skills_gained?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {e.skills_gained.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>
            ) : null}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

type Cert = {
  id: string;
  name: string;
  issuer: string;
  issued_on?: string | null;
  expires_on?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  description?: string | null;
  image_url?: string | null;
};

export function CertificationGrid({ items }: { items: Cert[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((c, i) => (
        <Reveal key={c.id} delay={i * 50}>
          <div className="flex h-full gap-4 rounded-2xl border border-line bg-cloud p-5 transition-colors hover:border-electric/40">
            {c.image_url ? (
              <img src={c.image_url} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-line" />
            ) : (
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-surface text-electric">
                <BadgeCheck size={18} />
              </span>
            )}
            <div className="min-w-0">
              <div className="font-display text-lg leading-snug text-ink">{c.name}</div>
              <div className="text-sm text-ink-soft">{c.issuer}</div>
              <div className="mt-1 text-xs text-muted-ink">
                {[fmtDate(c.issued_on) && `Issued ${fmtDate(c.issued_on)}`, c.expires_on && `Expires ${fmtDate(c.expires_on)}`]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
              {c.credential_id && <div className="mt-1 text-xs text-muted-ink">ID: {c.credential_id}</div>}
              {c.description && <p className="mt-2 text-sm text-ink-soft">{c.description}</p>}
              {c.credential_url && (
                <a
                  href={c.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-electric hover:underline"
                >
                  Verify credential <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

type Skill = { id: string; name: string; category?: string | null; proficiency?: number | null };

export function SkillGroups({ items }: { items: Skill[] }) {
  const groups = new Map<string, Skill[]>();
  for (const s of items) {
    const key = s.category?.trim() || "Core skills";
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[...groups.entries()].map(([category, skills], i) => (
        <Reveal key={category} delay={i * 50}>
          <div className="h-full rounded-2xl border border-line bg-cloud p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-ink">{category}</div>
            <ul className="mt-4 space-y-3">
              {skills.map((s) => (
                <li key={s.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-ink">{s.name}</span>
                    {typeof s.proficiency === "number" && (
                      <span className="text-xs text-muted-ink">{s.proficiency}%</span>
                    )}
                  </div>
                  {typeof s.proficiency === "number" && (
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-electric transition-all duration-700"
                        style={{ width: `${Math.max(0, Math.min(100, s.proficiency))}%` }}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

type Testimonial = {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  quote: string;
  rating?: number | null;
  image_url?: string | null;
};

export function TestimonialGrid({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((t, i) => (
        <Reveal key={t.id} delay={i * 50}>
          <figure className="flex h-full flex-col rounded-2xl border border-line bg-cloud p-6">
            {typeof t.rating === "number" && (
              <div className="mb-3 flex gap-0.5 text-electric" aria-label={`${t.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={14} fill={idx < t.rating! ? "currentColor" : "none"} />
                ))}
              </div>
            )}
            <blockquote className="flex-1 text-base leading-relaxed text-ink">"{t.quote}"</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              {t.image_url ? (
                <img src={t.image_url} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover ring-1 ring-line" />
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full bg-surface text-xs font-medium text-ink">
                  {t.name.charAt(0)}
                </span>
              )}
              <span className="min-w-0 text-sm">
                <span className="block truncate font-medium text-ink">{t.name}</span>
                <span className="block truncate text-xs text-muted-ink">
                  {[t.role, t.company].filter(Boolean).join(", ")}
                </span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

type AwardItem = {
  id: string;
  title: string;
  organization?: string | null;
  awarded_on?: string | null;
  description?: string | null;
  link?: string | null;
};

export function AwardList({ items }: { items: AwardItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((a, i) => (
        <Reveal key={a.id} delay={i * 50}>
          <div className="flex h-full gap-4 rounded-2xl border border-line bg-cloud p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-surface text-electric">
              <Award size={18} />
            </span>
            <div className="min-w-0">
              <div className="font-display text-lg text-ink">{a.title}</div>
              <div className="text-sm text-ink-soft">
                {[a.organization, fmtDate(a.awarded_on)].filter(Boolean).join(" · ")}
              </div>
              {a.description && <p className="mt-2 text-sm text-ink-soft">{a.description}</p>}
              {a.link && (
                <a href={a.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-electric hover:underline">
                  Learn more <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

type Publication = {
  id: string;
  title: string;
  kind?: string | null;
  outlet?: string | null;
  published_on?: string | null;
  description?: string | null;
  url?: string | null;
  image_url?: string | null;
};

export function PublicationList({ items }: { items: Publication[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((p, i) => {
        const inner = (
          <div className="flex h-full flex-col rounded-2xl border border-line bg-cloud p-5 transition-colors group-hover:border-electric/40">
            {p.image_url && (
              <div className="mb-4 aspect-video overflow-hidden rounded-xl">
                <img src={p.image_url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            )}
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-ink">
              {[p.kind, p.outlet, fmtDate(p.published_on)].filter(Boolean).join(" · ")}
            </div>
            <div className="mt-2 font-display text-xl text-ink">{p.title}</div>
            {p.description && <p className="mt-2 text-sm text-ink-soft">{p.description}</p>}
            {p.url && (
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-electric">
                View <ExternalLink size={12} />
              </span>
            )}
          </div>
        );
        return (
          <Reveal key={p.id} delay={i * 50}>
            {p.url ? (
              <a href={p.url} target="_blank" rel="noreferrer" className="group block h-full">
                {inner}
              </a>
            ) : (
              <div className="group h-full">{inner}</div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}