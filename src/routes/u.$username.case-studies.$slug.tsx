import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { caseStudyQO } from "@/lib/cms/portfolio-queries";
import { CaseStudyDetail } from "@/components/portfolio/case-study-detail";
import { absoluteUrl, absoluteImage } from "@/lib/site-url";

export const Route = createFileRoute("/u/$username/case-studies/$slug")({
  loader: async ({ context, params }) => {
    const study = await context.queryClient.ensureQueryData(caseStudyQO(params.username, params.slug));
    if (!study) throw notFound();
    return study;
  },
  head: ({ loaderData, params }) => {
    const url = absoluteUrl(`/u/${params.username}/case-studies/${params.slug}`);
    if (!loaderData) {
      return { meta: [{ title: "Case study unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const c = loaderData as Record<string, any>;
    const description = c.summary || c.title;
    const image = absoluteImage(c.cover_image_url);
    return {
      meta: [
        { title: `${c.title} — Case Study` },
        { name: "description", content: description },
        { property: "og:title", content: c.title },
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
            "@type": "Article",
            headline: c.title,
            description,
            url,
            ...(image ? { image } : {}),
          }),
        },
      ],
    };
  },
  component: CaseStudyPage,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <NotFound />,
});

function NotFound() {
  const { username } = Route.useParams();
  return (
    <div className="py-20 text-center">
      <h1 className="font-display text-4xl">Case study not found</h1>
      <Link to="/u/$username/case-studies" params={{ username }} className="mt-4 inline-block text-electric">
        Back to case studies
      </Link>
    </div>
  );
}

function CaseStudyPage() {
  const { username, slug } = Route.useParams();
  const { data } = useSuspenseQuery(caseStudyQO(username, slug));
  if (!data) return null;
  return <CaseStudyDetail username={username} study={data as never} />;
}
