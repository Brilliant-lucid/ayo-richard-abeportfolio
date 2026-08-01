import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Figma,
  Globe,
  Play,
  Apple,
  FileText,
  Mail,
} from "lucide-react";
import { openContactDialog } from "@/lib/contact-dialog-store";
import { RichOrPlain } from "./rich-text-view";
import { ShareButton } from "./share-button";

type Metric = { value: string; label: string; note?: string };
type GalleryItem = { url: string; alt?: string; caption?: string };
type NamedLink = { label: string; url: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(d?: string | null) {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return `${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;
}

function formatTimeframe(start?: string | null, end?: string | null, ongoing?: boolean | null) {
  const s = fmtDate(start);
  const e = ongoing ? "Present" : fmtDate(end);
  if (s && e) return `${s} – ${e}`;
  return s || e || null;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-20">
      <h2 className="font-display text-3xl text-ink md:text-4xl">{title}</h2>
      <div className="mt-6 max-w-2xl">{children}</div>
    </section>
  );
}

function linkIcon(url: string) {
  const h = (() => {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return "";
    }
  })();
  if (h.includes("github.com")) return <Github size={16} />;
  if (h.includes("figma.com")) return <Figma size={16} />;
  if (h.includes("apps.apple.com") || h.includes("appstore")) return <Apple size={16} />;
  if (h.includes("play.google")) return <Play size={16} />;
  if (h.includes("medium.com") || h.includes("notion.")) return <FileText size={16} />;
  return <ExternalLink size={16} />;
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.18em] text-muted-ink">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}

export function ProjectDetail({
  username,
  project,
  allProjects,
}: {
  username: string;
  project: Record<string, any>;
  allProjects: Array<Record<string, any>>;
}) {
  const p = project;
  const title = p.title || p.name;
  const overview = p.overview || p.description;
  const challenge = p.challenge || p.problem;
  const goals: string | null = p.goals || null;
  const constraints: string | null = p.constraints || null;
  const metrics: Metric[] = Array.isArray(p.metrics) ? p.metrics : [];
  const gallery: GalleryItem[] = Array.isArray(p.gallery) ? p.gallery : [];
  const additionalLinks: NamedLink[] = Array.isArray(p.additional_links) ? p.additional_links : [];
  const rolesList: string[] = Array.isArray(p.roles) && p.roles.length ? p.roles : p.role ? [p.role] : [];
  const timeframe = formatTimeframe(p.start_date, p.end_date, p.ongoing);

  const idx = allProjects.findIndex((x) => x.slug === p.slug);
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx >= 0 && idx < allProjects.length - 1 ? allProjects[idx + 1] : null;
  const hasLinks = !!(p.live_link || p.case_study_link || additionalLinks.length);

  return (
    <article className="space-y-16">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/u/$username/projects"
          params={{ username }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <ShareButton title={title} />
      </div>

      <header className="space-y-8">
        <div>
          {p.category && <div className="text-xs uppercase tracking-[0.22em] text-electric">{p.category}</div>}
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-6xl">{title}</h1>
          {p.summary && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">{p.summary}</p>}

          {(p.live_link || p.case_study_link || additionalLinks.length > 0) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {p.live_link && (
                <a href={p.live_link} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud transition-colors hover:bg-electric hover:text-ink">
                  <Globe size={16} /> View Live Project
                </a>
              )}
              {p.case_study_link && (
                <a href={p.case_study_link} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface">
                  <FileText size={16} /> Case Study
                </a>
              )}
              {additionalLinks.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface">
                  {linkIcon(l.url)} {l.label}
                </a>
              ))}
            </div>
          )}

          {(rolesList.length > 0 || (p.tools && p.tools.length) || timeframe) && (
            <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-line pt-6 sm:grid-cols-2 md:grid-cols-3">
              {rolesList.length > 0 && <MetaItem label="Role" value={rolesList.join(", ")} />}
              {p.tools && p.tools.length > 0 && <MetaItem label="Tools" value={p.tools.join(" · ")} />}
              {timeframe && <MetaItem label="Timeframe" value={timeframe} />}
            </dl>
          )}
        </div>

        {p.featured_image_url && (
          <img src={p.featured_image_url} alt={p.image_alt || title} className="w-full rounded-2xl border border-line object-cover" />
        )}
      </header>

      {metrics.length > 0 && (
        <section>
          <div className="mb-2 text-xs uppercase tracking-[0.22em] text-electric">Key Results</div>
          <h2 className="font-display text-3xl text-ink md:text-4xl">At a glance</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {metrics.map((m, i) => (
              <div key={i} className="rounded-2xl border border-line bg-cloud p-6">
                <div className="font-display text-4xl text-electric">{m.value}</div>
                <div className="mt-2 text-sm font-medium text-ink">{m.label}</div>
                {m.note && <div className="mt-2 text-xs text-muted-ink">{m.note}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {overview && <Section title="Overview"><RichOrPlain content={overview} /></Section>}
      {challenge && <Section title="The Challenge"><RichOrPlain content={challenge} /></Section>}

      {(goals || constraints) && (
        <section className="grid gap-10 md:grid-cols-2">
          {goals && (
            <div>
              <h2 className="font-display text-3xl text-ink md:text-4xl">Goals</h2>
              <div className="mt-6"><RichOrPlain content={goals} /></div>
            </div>
          )}
          {constraints && (
            <div>
              <h2 className="font-display text-3xl text-ink md:text-4xl">Constraints</h2>
              <div className="mt-6"><RichOrPlain content={constraints} /></div>
            </div>
          )}
        </section>
      )}

      {p.process && <Section title="Process"><RichOrPlain content={p.process} /></Section>}
      {p.solution && <Section title="The Solution"><RichOrPlain content={p.solution} /></Section>}

      {gallery.length > 0 && (
        <section>
          <h2 className="font-display text-3xl text-ink md:text-4xl">Gallery</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {gallery.map((g, i) => (
              <figure key={i} className="space-y-2">
                <div className="overflow-hidden rounded-xl border border-line">
                  <img src={g.url} alt={g.alt || ""} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </div>
                {g.caption && <figcaption className="text-xs text-muted-ink">{g.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {p.results && <Section title="Results & Impact"><RichOrPlain content={p.results} /></Section>}
      {p.learnings && <Section title="Learnings"><RichOrPlain content={p.learnings} /></Section>}

      {hasLinks && (
        <section>
          <h2 className="font-display text-3xl text-ink md:text-4xl">Project Links</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {p.live_link && (
              <a href={p.live_link} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface">
                <Globe size={16} /> Live Site
              </a>
            )}
            {p.case_study_link && (
              <a href={p.case_study_link} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface">
                <FileText size={16} /> External Case Study
              </a>
            )}
            {additionalLinks.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface">
                {linkIcon(l.url)} {l.label}
              </a>
            ))}
          </div>
        </section>
      )}

      {(prev || next) && (
        <nav aria-label="Project navigation" className="border-t border-line pt-10">
          <div className="grid gap-4 md:grid-cols-2">
            {prev ? (
              <Link to="/u/$username/projects/$slug" params={{ username, slug: prev.slug }} className="group flex items-center gap-4 rounded-2xl border border-line bg-cloud p-4 text-left hover:bg-surface">
                {prev.featured_image_url && <img src={prev.featured_image_url} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />}
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted-ink"><ArrowLeft size={12} /> Previous</div>
                  <div className="mt-1 truncate font-display text-lg text-ink group-hover:text-electric">{prev.name}</div>
                </div>
              </Link>
            ) : <div />}
            {next ? (
              <Link to="/u/$username/projects/$slug" params={{ username, slug: next.slug }} className="group flex items-center justify-end gap-4 rounded-2xl border border-line bg-cloud p-4 text-right hover:bg-surface">
                <div className="min-w-0">
                  <div className="flex items-center justify-end gap-1 text-xs uppercase tracking-[0.18em] text-muted-ink">Next <ArrowRight size={12} /></div>
                  <div className="mt-1 truncate font-display text-lg text-ink group-hover:text-electric">{next.name}</div>
                </div>
                {next.featured_image_url && <img src={next.featured_image_url} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />}
              </Link>
            ) : <div />}
          </div>
        </nav>
      )}

      <section className="rounded-3xl bg-ink px-8 py-12 text-center text-cloud md:px-12 md:py-16">
        <h2 className="font-display text-3xl md:text-4xl">Have a project in mind?</h2>
        <p className="mx-auto mt-3 max-w-lg text-cloud/70">Let's talk about what you're building and how I can help bring it to life.</p>
        <button type="button" onClick={() => openContactDialog()} className="mt-6 inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5">
          <Mail size={16} /> Get in touch
        </button>
      </section>
    </article>
  );
}
