import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectQO, projectsQO } from "@/lib/cms/portfolio-queries";
import { ProjectDetail } from "@/components/portfolio/project-detail";
import { absoluteUrl, absoluteImage } from "@/lib/site-url";

export const Route = createFileRoute("/u/$username/projects/$slug")({
  loader: async ({ context, params }) => {
    const [project] = await Promise.all([
      context.queryClient.ensureQueryData(projectQO(params.username, params.slug)),
      context.queryClient.ensureQueryData(projectsQO(params.username)),
    ]);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData, params }) => {
    const url = absoluteUrl(`/u/${params.username}/projects/${params.slug}`);
    if (!loaderData) {
      return { meta: [{ title: "Project unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData as Record<string, any>;
    const title = p.seo_title || p.title || p.name;
    const description = p.seo_description || p.summary || p.name;
    const image = absoluteImage(p.social_image_url || p.featured_image_url);
    return {
      meta: [
        { title: `${title} — Project` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: p.canonical_url || url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: title,
            description,
            url,
            ...(image ? { image } : {}),
          }),
        },
      ],
    };
  },
  component: ProjectPage,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <NotFound />,
});

function NotFound() {
  const { username } = Route.useParams();
  return (
    <div className="py-20 text-center">
      <h1 className="font-display text-4xl">Project not found</h1>
      <Link to="/u/$username/projects" params={{ username }} className="mt-4 inline-block text-electric">
        Back to projects
      </Link>
    </div>
  );
}

function ProjectPage() {
  const { username, slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectQO(username, slug));
  const { data: all } = useSuspenseQuery(projectsQO(username));
  if (!project) return null;
  return <ProjectDetail username={username} project={project as never} allProjects={all as never} />;
}
