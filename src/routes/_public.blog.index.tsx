import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listBlogPosts } from "@/lib/cms/public.functions";

const qo = queryOptions({ queryKey: ["blog"], queryFn: () => listBlogPosts() });

export const Route = createFileRoute("/_public/blog/")({
  head: () => ({
    meta: [
      { title: "Writing — Ayo Richard Abe" },
      { name: "description", content: "Essays on product, engineering, and growth." },
      { property: "og:title", content: "Writing — Ayo Richard Abe" },
      { property: "og:description", content: "Essays on product, engineering, and growth." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  component: BlogIndex,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div>No posts yet.</div>,
});

function BlogIndex() {
  const { data } = useSuspenseQuery(qo);
  return (
    <div className="space-y-10">
      <header>
        <div className="text-xs uppercase tracking-[0.22em] text-electric">Writing</div>
        <h1 className="mt-3 font-display text-5xl text-ink">Notes & essays</h1>
      </header>
      <div className="divide-y divide-line border-y border-line">
        {data.map((p) => (
          <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group flex items-baseline justify-between gap-6 py-6 hover:bg-surface/40">
            <div>
              <div className="font-display text-2xl text-ink group-hover:text-electric">{p.title}</div>
              {p.excerpt && <p className="mt-1 text-sm text-ink-soft">{p.excerpt}</p>}
            </div>
            <div className="shrink-0 text-xs text-muted-ink">
              {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}