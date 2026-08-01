import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_USERNAME } from "@/lib/site-url";

export const Route = createFileRoute("/blog/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/u/$username/blog", params: { username: DEFAULT_USERNAME, ...(params as object) }, replace: true });
  },
  component: () => null,
});
