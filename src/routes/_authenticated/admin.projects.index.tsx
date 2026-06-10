import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAllProjects, deleteProject } from "@/lib/cms/admin.functions";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const qo = queryOptions({ queryKey: ["admin", "projects"], queryFn: () => listAllProjects() });

export const Route = createFileRoute("/_authenticated/admin/projects/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  component: Page,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div>Not found</div>,
});

function Page() {
  const { data } = useSuspenseQuery(qo);
  const qc = useQueryClient();
  const del = useServerFn(deleteProject);
  const mut = useMutation({
    mutationFn: del,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Deleted");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Projects</h1>
        <Link to="/admin/projects/$id" params={{ id: "new" }} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-cloud">
          <Plus size={14} /> New project
        </Link>
      </div>
      <div className="divide-y divide-line rounded-2xl border border-line bg-cloud">
        {data.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4">
            <Link to="/admin/projects/$id" params={{ id: p.id }} className="flex-1">
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-muted-ink">{p.slug} · {p.status}{p.featured ? " · featured" : ""}</div>
            </Link>
            <button
              onClick={() => { if (confirm(`Delete "${p.name}"?`)) mut.mutate({ data: { id: p.id } }); }}
              className="rounded-md p-2 text-muted-ink hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {data.length === 0 && <div className="p-6 text-center text-sm text-muted-ink">No projects yet.</div>}
      </div>
    </div>
  );
}