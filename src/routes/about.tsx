import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_USERNAME } from "@/lib/site-url";

export const Route = createFileRoute("/about")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/u/$username/about", params: { username: DEFAULT_USERNAME, ...(params as object) }, replace: true });
  },
  component: () => null,
});
