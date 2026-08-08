import { createFileRoute, redirect } from "@tanstack/react-router";

// Case studies are managed inside Projects (single source of truth).
export const Route = createFileRoute("/_authenticated/admin/case-studies")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/projects" });
  },
  component: () => null,
});
