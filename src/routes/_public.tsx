import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getSiteData } from "@/lib/cms/public.functions";
import { PublicShell } from "@/components/public-shell";
import { ContactDialog } from "@/components/contact-dialog";

export const siteQueryOptions = queryOptions({
  queryKey: ["site"],
  queryFn: () => getSiteData(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/_public")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteQueryOptions),
  component: PublicLayout,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-ink-soft">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <h1 className="font-display text-3xl">Not found</h1>
    </div>
  ),
});

function PublicLayout() {
  const { data } = useSuspenseQuery(siteQueryOptions);
  return (
    <PublicShell
      nav={data.nav.map((n) => ({ id: n.id, label: n.label, href: n.href }))}
      settings={data.settings as never}
    >
      <Outlet />
      <ContactDialog />
    </PublicShell>
  );
}