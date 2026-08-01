import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_USERNAME } from "@/lib/site-url";

export const Route = createFileRoute("/case-studies/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/u/$username/case-studies", params: { username: DEFAULT_USERNAME, ...(params as object) }, replace: true });
  },
  component: () => null,
});
