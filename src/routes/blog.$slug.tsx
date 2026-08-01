import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_USERNAME } from "@/lib/site-url";

export const Route = createFileRoute("/blog/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/u/$username/blog/$slug", params: { ...(params as Record<string, string>), username: DEFAULT_USERNAME } as never, replace: true });
  },
  component: () => null,
});
