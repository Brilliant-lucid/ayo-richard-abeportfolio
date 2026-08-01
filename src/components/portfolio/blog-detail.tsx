import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { RichOrPlain } from "./rich-text-view";
import { ShareButton } from "./share-button";

export function BlogDetail({ username, post }: { username: string; post: Record<string, any> }) {
  const p = post;
  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/u/$username/blog"
          params={{ username }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
        >
          <ArrowLeft size={16} /> Back to Writing
        </Link>
        <ShareButton title={p.title} />
      </div>

      <header>
        {p.category && <div className="text-xs uppercase tracking-[0.22em] text-electric">{p.category}</div>}
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">{p.title}</h1>
        <div className="mt-3 text-sm text-muted-ink">
          {p.published_at ? new Date(p.published_at).toISOString().slice(0, 10) : ""}
        </div>
      </header>

      {p.featured_image_url && (
        <img src={p.featured_image_url} alt={p.title} className="w-full rounded-2xl border border-line object-cover" />
      )}

      {p.content && <RichOrPlain content={p.content} />}

      {Array.isArray(p.tags) && p.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-line pt-6">
          {p.tags.map((t: string) => (
            <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted-ink">#{t}</span>
          ))}
        </div>
      )}
    </article>
  );
}
