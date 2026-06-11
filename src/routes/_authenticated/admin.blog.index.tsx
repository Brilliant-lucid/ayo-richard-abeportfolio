import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listAllBlogPosts, deleteBlogPost } from "@/lib/cms/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/blog/")({ component: Page });

function Page() {
  const load = useServerFn(listAllBlogPosts);
  const del = useServerFn(deleteBlogPost);
  const [rows, setRows] = useState<any[]>([]);
  const navigate = useNavigate();

  async function refresh() { setRows(await load()); }
  useEffect(() => { refresh(); }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    try { await del({ data: { id } }); toast.success("Deleted"); refresh(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Blog</h1>
        <button
          onClick={() => navigate({ to: "/admin/blog/$id", params: { id: "new" } })}
          className="rounded-full bg-ink px-5 py-2.5 text-sm text-cloud"
        >
          New post
        </button>
      </div>
      <div className="divide-y divide-line rounded-xl border border-line bg-cloud">
        {rows.length === 0 && <div className="p-6 text-sm text-muted-ink">No posts yet.</div>}
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <div className="truncate font-medium">{r.title}</div>
              <div className="text-xs text-muted-ink">
                {r.status} · /{r.slug}
                {r.published_at ? ` · ${new Date(r.published_at).toISOString().slice(0, 10)}` : ""}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link to="/admin/blog/$id" params={{ id: r.id }} className="rounded-md border border-line px-3 py-1.5 text-xs">Edit</Link>
              <button onClick={() => onDelete(r.id)} className="rounded-md border border-line px-3 py-1.5 text-xs text-destructive">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}