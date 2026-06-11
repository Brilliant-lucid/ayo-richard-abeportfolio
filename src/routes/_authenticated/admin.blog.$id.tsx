import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getBlogPostById, upsertBlogPost, uploadMedia } from "@/lib/cms/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/blog/$id")({ component: Page });

const empty = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: [] as string[],
  featured_image_url: "",
  seo_title: "",
  seo_description: "",
  status: "draft" as "draft" | "published",
  published_at: null as string | null,
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function Page() {
  const { id } = useParams({ from: "/_authenticated/admin/blog/$id" });
  const isNew = id === "new";
  const load = useServerFn(getBlogPostById);
  const save = useServerFn(upsertBlogPost);
  const upload = useServerFn(uploadMedia);
  const navigate = useNavigate();
  const [p, setP] = useState<any>(empty);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    load({ data: { id } }).then((r) => { if (r) setP({ ...empty, ...r, tags: r.tags ?? [] }); setLoading(false); });
  }, [id, isNew]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload: any = {
        title: p.title,
        slug: p.slug || slugify(p.title),
        excerpt: p.excerpt || null,
        content: p.content || null,
        category: p.category || null,
        tags: p.tags ?? [],
        featured_image_url: p.featured_image_url || null,
        seo_title: p.seo_title || null,
        seo_description: p.seo_description || null,
        status: p.status,
        published_at: p.published_at,
      };
      if (!isNew) payload.id = id;
      const r = await save({ data: payload });
      toast.success("Saved");
      if (isNew) navigate({ to: "/admin/blog/$id", params: { id: r.id } });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  async function onUpload(f: File) {
    const fd = new FormData(); fd.append("file", f);
    const r = await upload({ data: fd });
    setP({ ...p, featured_image_url: r.url });
  }

  if (loading) return <div>Loading…</div>;

  const F = (k: string, label: string, multi = false, rows = 3) => (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-ink">{label}</label>
      {multi
        ? <textarea rows={rows} value={p[k] ?? ""} onChange={(e) => setP({ ...p, [k]: e.target.value })} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm" />
        : <input value={p[k] ?? ""} onChange={(e) => setP({ ...p, [k]: e.target.value })} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm" />
      }
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">{isNew ? "New post" : "Edit post"}</h1>
        <button type="button" onClick={() => navigate({ to: "/admin/blog" })} className="text-xs text-muted-ink hover:text-ink">← Back</button>
      </div>
      {F("title", "Title")}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-ink">Slug</label>
        <div className="mt-1 flex gap-2">
          <input value={p.slug} onChange={(e) => setP({ ...p, slug: e.target.value })} className="flex-1 rounded-md border border-line bg-cloud px-3 py-2 text-sm" />
          <button type="button" onClick={() => setP({ ...p, slug: slugify(p.title) })} className="rounded-md border border-line px-3 text-xs">Auto</button>
        </div>
      </div>
      {F("category", "Category")}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-ink">Tags (comma-separated)</label>
        <input value={(p.tags ?? []).join(", ")} onChange={(e) => setP({ ...p, tags: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-ink">Featured image</label>
        {p.featured_image_url && <img src={p.featured_image_url} alt="" className="mt-2 h-32 w-full rounded-md object-cover" />}
        <div className="mt-2 flex gap-2">
          <input value={p.featured_image_url ?? ""} onChange={(e) => setP({ ...p, featured_image_url: e.target.value })} className="flex-1 rounded-md border border-line bg-cloud px-3 py-2 text-sm" />
          <label className="cursor-pointer rounded-md border border-line px-3 py-2 text-xs">Upload<input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} /></label>
        </div>
      </div>
      {F("excerpt", "Excerpt", true, 2)}
      {F("content", "Content (Markdown)", true, 16)}
      <div className="grid gap-4 md:grid-cols-2">
        {F("seo_title", "SEO title")}
        {F("seo_description", "SEO description")}
      </div>
      <div className="flex items-center gap-4">
        <label className="text-xs uppercase tracking-wider text-muted-ink">Status</label>
        <select value={p.status} onChange={(e) => setP({ ...p, status: e.target.value })} className="rounded-md border border-line bg-cloud px-3 py-2 text-sm">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <button className="rounded-full bg-ink px-5 py-2.5 text-sm text-cloud">Save</button>
    </form>
  );
}