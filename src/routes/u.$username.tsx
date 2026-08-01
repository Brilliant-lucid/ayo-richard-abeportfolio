import { createFileRoute, Link, Outlet, notFound, useSearch } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { siteQO } from "@/lib/cms/portfolio-queries";
import { notifyPortfolioVisit } from "@/lib/cms/public.functions";
import { PublicShell } from "@/components/public-shell";
import { ContactDialog } from "@/components/contact-dialog";
import { openContactDialog } from "@/lib/contact-dialog-store";

export const Route = createFileRoute("/u/$username")({
  validateSearch: (s: Record<string, unknown>) => ({ contact: s.contact ? 1 : undefined }) as { contact?: 1 },
  loader: async ({ context, params }) => {
    const site = await context.queryClient.ensureQueryData(siteQO(params.username));
    if (!site.portfolio) throw notFound();
    return { username: params.username };
  },
  component: PortfolioLayout,
  errorComponent: ({ error }) => <div className="p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-8 text-center">
      <div>
        <h1 className="font-display text-3xl">Portfolio not found</h1>
        <p className="mt-2 text-sm text-ink-soft">This portfolio doesn't exist or hasn't been published yet.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full border border-line px-4 py-2 text-xs hover:bg-surface">
          Back to platform
        </Link>
      </div>
    </div>
  ),
});

function PortfolioLayout() {
  const { username } = Route.useParams();
  const search = useSearch({ from: "/u/$username" });
  const { data: site } = useSuspenseQuery(siteQO(username));

  useEffect(() => {
    if (search.contact) openContactDialog();
  }, [search.contact]);

  // Visitor notification: once per 12h per browser per portfolio, owner excluded.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const key = `visited:${username}`;
      const last = Number(localStorage.getItem(key) || 0);
      const now = Date.now();
      if (now - last < 12 * 60 * 60 * 1000) return;
      import("@/integrations/supabase/client").then(({ supabase }) => {
        supabase.auth.getUser().then(({ data }) => {
          if (data.user && data.user.id === site.portfolio?.owner_id) return;
          localStorage.setItem(key, String(now));
          notifyPortfolioVisit({
            data: { username, referrer: document.referrer || "", userAgent: navigator.userAgent || "" },
          }).catch(() => {});
        });
      });
    } catch {
      /* noop */
    }
  }, [username, site.portfolio?.owner_id]);

  const settings = {
    ...(site.settings ?? {}),
    site_name: site.portfolio?.display_name || site.settings?.site_name || username,
  };

  const nav = [
    { id: "home", label: "Home", href: "" },
    { id: "about", label: "About", href: "/about" },
    { id: "projects", label: "Projects", href: "/projects" },
    { id: "case-studies", label: "Case Studies", href: "/case-studies" },
    { id: "blog", label: "Writing", href: "/blog" },
    { id: "contact", label: "Contact", href: "/contact" },
  ];

  return (
    <PublicShell nav={nav} settings={settings as never} username={username}>
      <Outlet />
      <ContactDialog username={username} />
    </PublicShell>
  );
}
