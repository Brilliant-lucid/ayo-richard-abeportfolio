import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProjectBySlug, listProjects } from "@/lib/cms/public.functions";
import { openContactDialog } from "@/lib/contact-dialog-store";
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

const projectQo = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug({ data: { slug } }),
  });

const listQo = queryOptions({
  queryKey: ["projects"],
  queryFn: () => listProjects(),
});

export const Route = createFileRoute("/_public/projects/$slug")({
  loader: async ({ context, params }) => {
    const [data] = await Promise.all([
      context.queryClient.ensureQueryData(projectQo(params.slug)),
      context.queryClient.ensureQueryData(listQo),
    ]);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Ayo Richard Abe` },
          { name: "description", content: loaderData.summary ?? loaderData.name },
          { property: "og:title", content: loaderData.name },
          { property: "og:description", content: loaderData.summary ?? "" },
          ...(loaderData.featured_image_url
            ? [{ property: "og:image", content: loaderData.featured_image_url }]
            : []),
        ]
      : [],
  }),
  component: ProjectPage,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <h1 className="font-display text-4xl">Project not found</h1>
      <Link to="/projects" className="mt-4 inline-block text-electric">
        Back to projects
      </Link>
    </div>
  ),
});

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

function isHtml(s: string) {
  return /^\s*<(p|h[1-6]|ul|ol|blockquote|div|figure|img|pre|table|section)\b/i.test(s);
}

function RichOrPlain({ content }: { content: string }) {
  if (isHtml(content)) {
    return (
      <div
        className="max-w-none text-base leading-relaxed text-ink-soft [&_a]:text-electric [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-electric [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-ink [&_img]:my-6 [&_img]:w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-line [&_li]:mb-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  return (
    <div className="whitespace-pre-wrap text-base leading-relaxed text-ink-soft">{content}</div>
  );
}

function Section({
  title,
  eyebrow,
  children,
  narrow = true,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <section className="scroll-mt-20">
      {eyebrow && (
        <div className="mb-2 text-xs uppercase tracking-[0.22em] text-electric">{eyebrow}</div>
      )}
      <h2 className="font-display text-3xl text-ink md:text-4xl">{title}</h2>
      <div className={`mt-6 ${narrow ? "max-w-2xl" : ""}`}>{children}</div>
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

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(projectQo(slug));
  const { data: allProjects } = useSuspenseQuery(listQo);
  if (!p) return null;
  const pp = p as any;

  const title = pp.title || p.name;
  const overview = pp.overview || p.description;
  const challenge = pp.challenge || p.problem;
  const goals: string | null = pp.goals || null;
  const constraints: string | null = pp.constraints || null;
  const process: string | null = p.process || null;
  const solution: string | null = p.solution || null;
  const results: string | null = p.results || null;
  const learnings: string | null = pp.learnings || null;
  const metrics: Metric[] = Array.isArray(pp.metrics) ? pp.metrics : [];
  const gallery: GalleryItem[] = Array.isArray(pp.gallery) ? pp.gallery : [];
  const additionalLinks: NamedLink[] = Array.isArray(pp.additional_links) ? pp.additional_links : [];
  const rolesList: string[] =
    Array.isArray(pp.roles) && pp.roles.length ? pp.roles : p.role ? [p.role] : [];
  const timeframe = formatTimeframe(pp.start_date, pp.end_date, pp.ongoing);

  // Prev / Next by display order
  const idx = allProjects.findIndex((x) => x.slug === p.slug);
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx >= 0 && idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

  const hasLinks = !!(p.live_link || p.case_study_link || additionalLinks.length);

  return (
    <article className="space-y-16">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
      >
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      {/* HERO */}
      <header className="space-y-8">
        <div>
          {p.category && (
            <div className="text-xs uppercase tracking-[0.22em] text-electric">{p.category}</div>
          )}
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-6xl">{title}</h1>
          {p.summary && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
              {p.summary}
            </p>
          )}

          {(p.live_link || p.case_study_link || additionalLinks.length > 0) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {p.live_link && (
                <a
                  href={p.live_link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud transition-colors hover:bg-electric hover:text-ink"
                >
                  <Globe size={16} /> View Live Project
                </a>
              )}
              {p.case_study_link && (
                <a
                  href={p.case_study_link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface"
                >
                  <FileText size={16} /> Case Study
                </a>
              )}
              {additionalLinks.map((l, i) => (
                <a
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface"
                >
                  {linkIcon(l.url)} {l.label}
                </a>
              ))}
            </div>
          )}

          {(rolesList.length > 0 || (p.tools && p.tools.length) || timeframe) && (
            <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-line pt-6 sm:grid-cols-2 md:grid-cols-3">
              {rolesList.length > 0 && (
                <MetaItem label="Role" value={rolesList.join(", ")} />
              )}
              {p.tools && p.tools.length > 0 && (
                <MetaItem label="Tools" value={p.tools.join(" · ")} />
              )}
              {timeframe && <MetaItem label="Timeframe" value={timeframe} />}
            </dl>
          )}
        </div>

        {p.featured_image_url && (
          <img
            src={p.featured_image_url}
            alt={pp.image_alt || title}
            className="w-full rounded-2xl border border-line object-cover"
          />
        )}
      </header>

      {/* KEY RESULTS */}
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

      {overview && (
        <Section title="Overview">
          <RichOrPlain content={overview} />
        </Section>
      )}

      {challenge && (
        <Section title="The Challenge">
          <RichOrPlain content={challenge} />
        </Section>
      )}

      {(goals || constraints) && (
        <section>
          <div className="grid gap-10 md:grid-cols-2">
            {goals && (
              <div>
                <h2 className="font-display text-3xl text-ink md:text-4xl">Goals</h2>
                <div className="mt-6">
                  <RichOrPlain content={goals} />
                </div>
              </div>
            )}
            {constraints && (
              <div>
                <h2 className="font-display text-3xl text-ink md:text-4xl">Constraints</h2>
                <div className="mt-6">
                  <RichOrPlain content={constraints} />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {process && (
        <Section title="Process">
          <RichOrPlain content={process} />
        </Section>
      )}

      {solution && (
        <Section title="The Solution">
          <RichOrPlain content={solution} />
        </Section>
      )}

      {gallery.length > 0 && (
        <section>
          <h2 className="font-display text-3xl text-ink md:text-4xl">Gallery</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {gallery.map((g, i) => (
              <figure key={i} className="space-y-2">
                <div className="overflow-hidden rounded-xl border border-line">
                  <img
                    src={g.url}
                    alt={g.alt || ""}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                {g.caption && (
                  <figcaption className="text-xs text-muted-ink">{g.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {results && (
        <Section title="Results & Impact">
          <RichOrPlain content={results} />
        </Section>
      )}

      {learnings && (
        <Section title="Learnings">
          <RichOrPlain content={learnings} />
        </Section>
      )}

      {hasLinks && (
        <section>
          <h2 className="font-display text-3xl text-ink md:text-4xl">Project Links</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {p.live_link && (
              <a
                href={p.live_link}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface"
              >
                <Globe size={16} /> Live Site
              </a>
            )}
            {p.case_study_link && (
              <a
                href={p.case_study_link}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface"
              >
                <FileText size={16} /> External Case Study
              </a>
            )}
            {additionalLinks.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface"
              >
                {linkIcon(l.url)} {l.label}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* PREV / NEXT */}
      {(prev || next) && (
        <nav aria-label="Project navigation" className="border-t border-line pt-10">
          <div className="grid gap-4 md:grid-cols-2">
            {prev ? (
              <Link
                to="/projects/$slug"
                params={{ slug: prev.slug }}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-cloud p-4 text-left hover:bg-surface"
              >
                {prev.featured_image_url && (
                  <img
                    src={prev.featured_image_url}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted-ink">
                    <ArrowLeft size={12} /> Previous
                  </div>
                  <div className="mt-1 truncate font-display text-lg text-ink group-hover:text-electric">
                    {prev.name}
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                to="/projects/$slug"
                params={{ slug: next.slug }}
                className="group flex items-center justify-end gap-4 rounded-2xl border border-line bg-cloud p-4 text-right hover:bg-surface"
              >
                <div className="min-w-0">
                  <div className="flex items-center justify-end gap-1 text-xs uppercase tracking-[0.18em] text-muted-ink">
                    Next <ArrowRight size={12} />
                  </div>
                  <div className="mt-1 truncate font-display text-lg text-ink group-hover:text-electric">
                    {next.name}
                  </div>
                </div>
                {next.featured_image_url && (
                  <img
                    src={next.featured_image_url}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                )}
              </Link>
            ) : (
              <div />
            )}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-electric"
            >
              <ArrowLeft size={14} /> Back to all projects
            </Link>
          </div>
        </nav>
      )}

      {/* CONTACT CTA */}
      <section className="rounded-3xl bg-ink px-8 py-12 text-center text-cloud md:px-12 md:py-16">
        <h2 className="font-display text-3xl md:text-4xl">Have a project in mind?</h2>
        <p className="mx-auto mt-3 max-w-lg text-cloud/70">
          Let's talk about what you're building and how I can help bring it to life.
        </p>
        <button
          type="button"
          onClick={() => openContactDialog()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
        >
          <Mail size={16} /> Get in touch
        </button>
      </section>
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.18em] text-muted-ink">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}