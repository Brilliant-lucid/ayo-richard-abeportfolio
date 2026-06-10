import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { checkIsAdmin } from "@/lib/cms/admin.functions";
import { AdminShell } from "@/components/admin-shell";

const adminQO = queryOptions({ queryKey: ["admin", "is-admin"], queryFn: () => checkIsAdmin() });

export const Route = createFileRoute("/_authenticated/admin")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminQO),
  component: AdminLayout,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function AdminLayout() {
  const { data } = useSuspenseQuery(adminQO);
  if (!data.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cloud">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl">Not authorized</h1>
          <p className="mt-2 text-sm text-ink-soft">Your account does not have admin access.</p>
          <Link to="/" className="mt-4 inline-block text-electric">Back to site</Link>
        </div>
      </div>
    );
  }
  return <AdminShell><Outlet /></AdminShell>;
}