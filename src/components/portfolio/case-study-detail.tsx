import { Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Mail } from "lucide-react";
import { openContactDialog } from "@/lib/contact-dialog-store";
import { RichOrPlain } from "./rich-text-view";
import { ShareButton } from "./share-button";

function Block({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <section>
      <h2 className="font-display text-3xl text-ink md:text-4xl">{title}</h2>
      <div className="mt-5 max-w-2xl"><RichOrPlain content={body} /></div>
    </section>
  );
}

export function CaseStudyDetail({ username, study }: { username: string; study: Record<string, any> }) {
  const c = study;
  const links: Array<{ label: string; url: string }> = Array.isArray(c.external_links) ? c.external_links : [];
  return (
    <article className="space-y-14">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/u/$username/case-studies"
          params={{ username }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
        >
          <ArrowLeft size={16} /> Back to Case Studies
        </Link>
        <ShareButton title={c.title} />
      </div>

      <header>
        <div className="text-xs uppercase tracking-[0.22em] text-electric">{c.category ?? "Case study"}</div>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-6xl">{c.title}</h1>
        {c.summary && <p className="mt-5 max-w-2xl text-lg text-ink-soft">{c.summary}</p>}
      </header>

      {c.cover_image_url && (
        <img src={c.cover_image_url} alt={c.title} className="w-full rounded-2xl border border-line object-cover" />
      )}

      <Block title="Challenge" body={c.challenge} />
      <Block title="Research" body={c.research} />
      <Block title="Strategy" body={c.strategy} />
      <Block title="Execution" body={c.execution} />
      <Block title="Outcome" body={c.outcome} />
      <Block title="Lessons" body={c.lessons} />

      {links.length > 0 && (
        <section>
          <h2 className="font-display text-3xl text-ink md:text-4xl">Links</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {links.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface">
                <ExternalLink size={16} /> {l.label}
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-3xl bg-ink px-8 py-12 text-center text-cloud md:px-12 md:py-16">
        <h2 className="font-display text-3xl md:text-4xl">Want results like these?</h2>
        <button type="button" onClick={() => openContactDialog()} className="mt-6 inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5">
          <Mail size={16} /> Get in touch
        </button>
      </section>
    </article>
  );
}
