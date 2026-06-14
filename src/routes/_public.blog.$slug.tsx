import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getBlogPostBySlug } from "@/lib/cms/public.functions";
import { ArrowLeft } from "lucide-react";

const qo = (slug: string) => queryOptions({
  queryKey: ["blog", slug],
  queryFn: () => getBlogPostBySlug({ data: { slug } }),
});

export const Route = createFileRoute("/_public/blog/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(qo(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.title} — Ayo Richard Abe` },
      { name: "description", content: loaderData.excerpt ?? loaderData.title },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: loaderData.excerpt ?? "" },
      { property: "og:type", content: "article" },
      ...(loaderData.featured_image_url ? [{ property: "og:image", content: loaderData.featured_image_url }] : []),
    ] : [],
  }),
  component: Post,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="py-20 text-center">Post not found</div>,
});

function Post() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(qo(slug));
  if (!p) return null;
  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <Link to="/blog" className="inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm font-medium text-ink hover:bg-surface"><ArrowLeft size={16} /> Back to Writing</Link>
      <header>
        {p.category && <div className="text-xs uppercase tracking-[0.22em] text-electric">{p.category}</div>}
        <h1 className="mt-3 font-display text-5xl leading-tight text-ink">{p.title}</h1>
        <div className="mt-3 text-sm text-muted-ink">{p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}</div>
      </header>
      {p.featured_image_url && <img src={p.featured_image_url} alt={p.title} className="w-full rounded-2xl border border-line" />}
      {p.content && (
        <div className="whitespace-pre-wrap text-base leading-relaxed text-ink-soft">{p.content}</div>
      )}
    </article>
  );
}