import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_USERNAME } from "@/lib/site-url";

export const Route = createFileRoute("/contact")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/u/$username", params: { username: DEFAULT_USERNAME, ...(params as object) }, replace: true });
  },
  component: () => null,
});
