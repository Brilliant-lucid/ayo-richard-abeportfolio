import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { blogPostQO } from "@/lib/cms/portfolio-queries";
import { BlogDetail } from "@/components/portfolio/blog-detail";
import { absoluteUrl, absoluteImage } from "@/lib/site-url";

export const Route = createFileRoute("/u/$username/blog/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(blogPostQO(params.username, params.slug));
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) => {
    const url = absoluteUrl(`/u/${params.username}/blog/${params.slug}`);
    if (!loaderData) {
      return { meta: [{ title: "Post unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData as Record<string, any>;
    const title = p.seo_title || p.title;
    const description = p.seo_description || p.excerpt || p.title;
    const image = absoluteImage(p.featured_image_url);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: p.title,
            description,
            url,
            ...(p.published_at ? { datePublished: p.published_at } : {}),
            ...(image ? { image } : {}),
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <NotFound />,
});

function NotFound() {
  const { username } = Route.useParams();
  return (
    <div className="py-20 text-center">
      <h1 className="font-display text-4xl">Post not found</h1>
      <Link to="/u/$username/blog" params={{ username }} className="mt-4 inline-block text-electric">
        Back to writing
      </Link>
    </div>
  );
}

function BlogPostPage() {
  const { username, slug } = Route.useParams();
  const { data } = useSuspenseQuery(blogPostQO(username, slug));
  if (!data) return null;
  return <BlogDetail username={username} post={data as never} />;
}
