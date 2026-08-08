import { createFileRoute, redirect } from "@tanstack/react-router";

// Hero editing now lives inside Profile & Hero.
export const Route = createFileRoute("/_authenticated/admin/hero")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/profile" });
  },
  component: () => null,
});
