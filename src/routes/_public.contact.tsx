import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { openContactDialog } from "@/lib/contact-dialog-store";

export const Route = createFileRoute("/_public/contact")({
  beforeLoad: ({ location }) => {
    // SSR-safe: redirect to home; the home route will trigger the dialog via the ?contact=1 flag.
    if (location.pathname === "/contact") {
      throw redirect({ to: "/", search: { contact: 1 } as never });
    }
  },
  component: ContactRedirect,
});

function ContactRedirect() {
  useEffect(() => { openContactDialog(); }, []);
  return null;
}