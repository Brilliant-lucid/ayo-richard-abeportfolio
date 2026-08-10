import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, ArrowRight, MapPin, Github, Linkedin, Twitter, Mail } from "lucide-react";
import { useRef, useEffect } from "react";
import {
  siteQO,
  projectsQO,
  blogQO,
  caseStudiesQO,
  testimonialsQO,
  profileQO,
  servicesQO,
} from "@/lib/cms/portfolio-queries";
import { openContactDialog } from "@/lib/contact-dialog-store";
import { absoluteUrl, absoluteImage } from "@/lib/site-url";
import { ShareButton } from "@/components/portfolio/share-button";
import { Reveal } from "@/components/landing/reveal";
import { ServicesSection } from "@/components/portfolio/services-section";
import { actionLabel, type ServiceRow } from "@/lib/services-config";
import {
  Section,
  Pill,
  ExperienceTimeline,
  CertificationGrid,
  SkillGroups,
  TestimonialGrid,
  AwardList,
  PublicationList,
} from "@/components/portfolio/sections";

export const Route = createFileRoute("/u/$username/")({
  loader: async ({ context, params }) => {
    const u = params.username;
    const [site] = await Promise.all([
      context.queryClient.ensureQueryData(siteQO(u)),
      context.queryClient.ensureQueryData(projectsQO(u)),
      context.queryClient.ensureQueryData(caseStudiesQO(u)),
      context.queryClient.ensureQueryData(blogQO(u)),
      context.queryClient.ensureQueryData(testimonialsQO(u)),
      context.queryClient.ensureQueryData(profileQO(u)),
      context.queryClient.ensureQueryData(servicesQO(u)),
    ]);
    return {
      name: site.portfolio?.display_name ?? u,
      tagline: site.hero?.intro ?? site.portfolio?.tagline ?? "",
      image: site.hero?.profile_image_url ?? site.portfolio?.avatar_url ?? null,
      username: u,
    };
  },
  head: ({ loaderData, params }) => {
    const url = absoluteUrl(`/u/${params.username}`);
    const title = loaderData ? `${loaderData.name} — Portfolio` : "Portfolio";
    const description = loaderData?.tagline || `Projects, case studies and writing by ${params.username}.`;
    const image = absoluteImage(loaderData?.image);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: loaderData.name,
                description,
                url,
                ...(image ? { image } : {}),
              }),
            },
          ]
        : [],
    };
  },
  component: PortfolioHome,
});

function ProfessionalHighlights({ hero }: { hero: any }) {
  const items: { key: string; label: string; value?: any }[] = [];
  if (hero?.years_experience) items.push({ key: "years", label: "Years experience", value: `${hero.years_experience}+` });
  if (hero?.industries?.length) items.push({ key: "industries", label: "Industries", value: hero.industries.join(" • ") });
  if (hero?.expertise?.length) items.push({ key: "expertise", label: "Expertise", value: hero.expertise.join(" • ") });
  if (hero?.availability) items.push({ key: "availability", label: "Availability", value: hero.availability });

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="highlights" className="mt-8">
      <h2 id="highlights" className="sr-only">
        Professional highlights
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.key} className="rounded-2xl border border-line bg-cloud p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-ink">{it.label}</div>
            <div className="mt-2 font-display text-lg text-ink">{it.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PortfolioHome() {
  const { username } = Route.useParams();
  const { data: site } = useSuspenseQuery(siteQO(username));
  const { data: projects } = useSuspenseQuery(projectsQO(username));
  const { data: studies } = useSuspenseQuery(caseStudiesQO(username));
  const { data: posts } = useSuspenseQuery(blogQO(username));
  const { data: testimonials } = useSuspenseQuery(testimonialsQO(username));
  const { data: profile } = useSuspenseQuery(profileQO(username));
  const { data: services } = useSuspenseQuery(servicesQO(username)) as { data: ServiceRow[] };
  const bookable = services.filter((s) => s.status === "active" && s.accepting_requests);
  const primaryCta =
    bookable.length === 1
      ? actionLabel(bookable[0])
      : bookable.length > 1
      ? "Work with me"
      : null;

  const hero = site.hero;
  const settings = site.settings;
  const featured = projects.filter((p) => p.featured);
  const shownProjects = featured.length > 0 ? featured : projects.slice(0, 4);
  const featuredPosts = posts.slice(0, 3);
  const portraitSrc = hero?.profile_image_url || site.portfolio?.avatar_url || undefined;
  const name = site.portfolio?.display_name ?? username;
  const headline = hero?.headline || hero?.eyebrow || site.portfolio?.tagline || "";
  const summary = hero?.intro || site.portfolio?.tagline || "";
  const socials = [
    settings?.linkedin_url && { href: settings.linkedin_url, Icon: Linkedin, label: "LinkedIn" },
    settings?.github_url && { href: settings.github_url, Icon: Github, label: "GitHub" },
    settings?.twitter_url && { href: settings.twitter_url, Icon: Twitter, label: "X" },
    settings?.email && { href: `mailto:${settings.email}`, Icon: Mail, label: "Email" },
  ].filter(Boolean) as { href: string; Icon: typeof Mail; label: string }[];
  const aboutBody = hero?.bio || site.portfolio?.tagline || "";
  const hasAbout = Boolean(
    aboutBody || hero?.expertise?.length || hero?.industries?.length || hero?.years_experience || hero?.mission,
  );

  // CTA labels and urls from hero/profile where available
  const primaryLabel = hero?.cta_primary_label || primaryCta || "Hire me";
  const primaryUrl = hero?.cta_primary_url || null;
  const secondaryLabel = hero?.cta_secondary_label || (projects.length > 0 ? "View Projects" : null);
  const secondaryUrl = hero?.cta_secondary_url || null;

  // Ref + keyboard handlers for mobile horizontal projects
  const projectsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = projectsRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        el.scrollBy({ left: -el.clientWidth * 0.8, behavior: "smooth" });
      }
    };
    el.addEventListener("keydown", onKey as any);
    return () => el.removeEventListener("keydown", onKey as any);
  }, []);

  return (
    <div className="space-y-24">
      {/* 1. Hero — who is this */}
      <section id="overview" className="scroll-mt-24 grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
        <Reveal className="min-w-0">
          {hero?.availability && (
            <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-medium text-electric">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric" />
              {hero.availability}
            </span>
          )}
          <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-7xl">
            {hero?.heading ?? name}
          </h1>
          {headline && <p className="mt-4 text-lg font-medium text-ink md:text-xl">{headline}</p>}
          {summary && <p className="mt-4 max-w-2xl text-base text-ink-soft md:text-lg">{summary}</p>}

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-ink">
            {hero?.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} /> {hero.location}
              </span>
            )}
            {socials.length > 0 && (
              <span className="flex items-center gap-2">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-electric/40 hover:text-electric"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {primaryUrl ? (
              <a
                href={primaryUrl}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud transition-transform hover:scale-[1.02]"
              >
                {primaryLabel} <ArrowUpRight size={14} />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => openContactDialog()}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud transition-transform hover:scale-[1.02]"
              >
                {primaryLabel} <ArrowUpRight size={14} />
              </button>
            )}

            {secondaryUrl ? (
              <a
                href={secondaryUrl}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
              >
                {secondaryLabel} <ArrowUpRight size={14} />
              </a>
            ) : (
              projects.length > 0 && (
                <Link
                  to="/u/$username/projects"
                  params={{ username }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
                >
                  {secondaryLabel || "View Projects"} <ArrowUpRight size={14} />
                </Link>
              )
            )}
            <ShareButton title={name} />
          </div>
        </Reveal>
        {portraitSrc && (
          <Reveal delay={80} className="order-first justify-self-center md:order-none md:justify-self-end">
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-electric/30 to-transparent blur-xl" aria-hidden />
              <img
                src={portraitSrc}
                alt={name}
                className="relative h-44 w-44 rounded-2xl object-cover ring-1 ring-line sm:h-56 sm:w-56 md:h-72 md:w-72"
              />
            </div>
          </Reveal>
        )}

        {/* Professional highlights - replaces large numeric metric block */}
        <div className="md:col-span-full">
          <ProfessionalHighlights hero={hero} />
        </div>
      </section>

      <ServicesSection services={services} />

      {/* 2. About */}
      {hasAbout && (
        <Section
          id="about"
          eyebrow="About"
          title={`Who ${name.split(" ")[0]} is`}
          action={
            <Link
              to="/u/$username/about"
              params={{ username }}
              className="hidden shrink-0 items-center gap-1 text-sm text-ink-soft hover:text-electric sm:inline-flex"
            >
              Full bio <ArrowRight size={14} />
            </Link>
          }
        >
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <Reveal className="rounded-2xl border border-line bg-cloud p-6">
              {aboutBody && <p className="whitespace-pre-wrap text-base leading-relaxed text-ink-soft">{aboutBody}</p>}
              {hero?.mission && (
                <p className="mt-5 border-l-2 border-electric pl-4 text-base italic text-ink">{hero.mission}</p>
              )}
            </Reveal>
            <Reveal delay={80} className="space-y-4">
              {hero?.years_experience ? (
                <div className="rounded-2xl border border-line bg-cloud p-6">
                  <div className="font-display text-4xl text-ink">{hero.years_experience}+</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-ink">Years of experience</div>
                </div>
              ) : null}
              {hero?.expertise?.length ? (
                <div className="rounded-2xl border border-line bg-cloud p-6">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-ink">Areas of expertise</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {hero.expertise.map((e: string) => (
                      <Pill key={e}>{e}</Pill>
                    ))}
                  </div>
                </div>
              ) : null}
              {hero?.industries?.length ? (
                <div className="rounded-2xl border border-line bg-cloud p-6">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-ink">Industries</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {hero.industries.map((e: string) => (
                      <Pill key={e}>{e}</Pill>
                    ))}
                  </div>
                </div>
              ) : null}
            </Reveal>
          </div>
        </Section>
      )}

      {/* 3. Experience & Certifications */}
      {(profile.experience.length > 0 || profile.certifications.length > 0) && (
        <Section
          id="experience"
          eyebrow="Credibility"
          title="Experience & certifications"
          description="A track record of shipped work, verified by the organisations behind it."
        >
          <div className="space-y-10">
            {profile.experience.length > 0 && <ExperienceTimeline items={profile.experience} />}
            {profile.certifications.length > 0 && (
              <div>
                <h3 className="mb-4 font-display text-xl text-ink">Certifications</h3>
                <CertificationGrid items={profile.certifications} />
              </div>
            )}
          </div>
        </Section>
      )}

      {/* 4. Skills */}
      {profile.skills.length > 0 && (
        <Section id="skills" eyebrow="Capabilities" title="Skills & tools">
          <SkillGroups items={profile.skills} />
        </Section>
      )}

      {shownProjects.length > 0 && (
        <Section
          id="projects"
          eyebrow="Work"
          title="Projects & case studies"
          action={
            <Link
              to="/u/$username/projects"
              params={{ username }}
              className="inline-flex shrink-0 items-center gap-1 text-sm text-ink-soft hover:text-electric"
            >
              All projects <ArrowRight size={14} />
            </Link>
          }
        >
          {/* Mobile: horizontal scroll with partial next card. Desktop: grid */}
          <div className="md:block">
            <div
              ref={projectsRef}
              tabIndex={0}
              className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 scroll-smooth snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
              aria-label="Projects"
            >
              {shownProjects.map((p) => (
                <div key={p.id} className="min-w-[80%] snap-start md:min-w-0 md:contents">
                  <Link
                    to="/u/$username/projects/$slug"
                    params={{ username, slug: p.slug }}
                    className="group flex flex-col gap-3 rounded-[28px] bg-ink p-3 text-cloud shadow-xl shadow-ink/10 transition-all hover:-translate-y-1 hover:shadow-2xl"
                  >
                    {p.featured_image_url ? (
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                        <img src={p.featured_image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] rounded-[20px] bg-cloud/10" />
                    )}
                    <div className="px-3 pt-2">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-cloud/50">{p.category ?? "Project"}</div>
                      <div className="mt-2 font-display text-2xl">{p.name}</div>
                      {p.summary && <p className="mt-2 line-clamp-3 text-sm text-cloud/70">{p.summary}</p>}
                      {p.tools?.length ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {p.tools.slice(0, 4).map((t: string) => (
                            <span key={t} className="rounded-full border border-cloud/20 px-2 py-0.5 text-[10px] text-cloud/70">
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-3 flex items-center justify-center rounded-full bg-cloud px-5 py-3 text-sm font-medium text-ink transition-colors group-hover:bg-electric group-hover:text-ink">
                      View project
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {studies.length > 0 && (
        <Section
          id="case-studies"
          eyebrow="Deep dives"
          title="Case studies"
          action={
            <Link
              to="/u/$username/case-studies"
              params={{ username }}
              className="inline-flex shrink-0 items-center gap-1 text-sm text-ink-soft hover:text-electric"
            >
              All case studies <ArrowRight size={14} />
            </Link>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            {studies.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to="/u/$username/case-studies/$slug"
                params={{ username, slug: c.slug }}
                className="group block rounded-2xl border border-line bg-cloud p-6 hover:border-electric/40"
              >
                <div className="text-xs uppercase tracking-wider text-muted-ink">{c.category ?? "Case study"}</div>
                <div className="mt-2 font-display text-2xl text-ink group-hover:text-electric">{c.title}</div>
                {c.summary && <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{c.summary}</p>}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* 6. Testimonials */}
      {testimonials.length > 0 && (
        <Section id="testimonials" eyebrow="Trust" title="What people say">
          <TestimonialGrid items={testimonials} />
        </Section>
      )}

      {/* 7. Awards */}
      {profile.awards.length > 0 && (
        <Section id="awards" eyebrow="Recognition" title="Awards & recognition">
          <AwardList items={profile.awards} />
        </Section>
      )}

      {/* 8. Publications & media */}
      {profile.publications.length > 0 && (
        <Section id="publications" eyebrow="Media" title="Publications & media">
          <PublicationList items={profile.publications} />
        </Section>
      )}

      {featuredPosts.length > 0 && (
        <Section
          id="writing"
          eyebrow="Writing"
          title="From the blog"
          action={
            <Link
              to="/u/$username/blog"
              params={{ username }}
              className="inline-flex shrink-0 items-center gap-1 text-sm text-ink-soft hover:text-electric"
            >
              All posts <ArrowRight size={14} />
            </Link>
          }
        >
          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map((p) => (
              <Link
                key={p.id}
                to="/u/$username/blog/$slug"
                params={{ username, slug: p.slug }}
                className="group flex flex-col rounded-2xl border border-line bg-cloud p-6 hover:border-electric/40"
              >
                <div className="text-xs uppercase tracking-wider text-muted-ink">
                  {p.published_at ? new Date(p.published_at).toISOString().slice(0, 10) : "Draft"}
                </div>
                <div className="mt-3 font-display text-xl text-ink group-hover:text-electric">{p.title}</div>
                {p.excerpt && <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Reveal as="section" className="scroll-mt-24">
        <div id="contact" className="rounded-3xl bg-ink p-10 text-cloud md:p-14">
          <div className="font-display text-4xl md:text-5xl">Let's build something together.</div>
          {hero?.availability && <p className="mt-3 text-sm text-cloud/70">{hero.availability}</p>}
          <button
            type="button"
            onClick={() => openContactDialog()}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-electric px-5 py-2.5 text-sm font-medium text-cloud hover:opacity-90"
          >
            Start a conversation <ArrowUpRight size={14} />
          </button>
        </div>
      </Reveal>
    </div>
  );
}
