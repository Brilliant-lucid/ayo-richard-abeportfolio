import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getProjectById, upsertProject, uploadMedia } from "@/lib/cms/admin.functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/projects/$id")({
  component: EditProject,
});

type Form = {
  name: string; slug: string; summary: string; description: string;
  problem: string; solution: string; process: string; results: string;
  tools: string; role: string; category: string; live_link: string; case_study_link: string;
  featured_image_url: string; featured: boolean; display_order: number;
  bento_size: "small" | "medium" | "large" | "wide" | "tall";
  status: "draft" | "published";
};

const empty: Form = {
  name: "", slug: "", summary: "", description: "", problem: "", solution: "", process: "", results: "",
  tools: "", role: "", category: "", live_link: "", case_study_link: "", featured_image_url: "",
  featured: false, display_order: 0, bento_size: "small", status: "draft",
};

function EditProject() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const get = useServerFn(getProjectById);
  const save = useServerFn(upsertProject);
  const upload = useServerFn(uploadMedia);
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    get({ data: { id } }).then((p) => {
      if (p) setForm({
        name: p.name, slug: p.slug,
        summary: p.summary ?? "", description: p.description ?? "",
        problem: p.problem ?? "", solution: p.solution ?? "",
        process: p.process ?? "", results: p.results ?? "",
        tools: (p.tools ?? []).join(", "), role: p.role ?? "", category: p.category ?? "",
        live_link: p.live_link ?? "", case_study_link: p.case_study_link ?? "",
        featured_image_url: p.featured_image_url ?? "",
        featured: p.featured, display_order: p.display_order,
        bento_size: (p.bento_size as Form["bento_size"]) ?? "small",
        status: p.status as Form["status"],
      });
      setLoading(false);
    });
  }, [id, isNew]);

  const mut = useMutation({
    mutationFn: (vars: Parameters<typeof save>[0]) => save(vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Saved");
      navigate({ to: "/admin/projects" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  async function onUpload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await upload({ data: fd });
      setForm({ ...form, featured_image_url: r.url });
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    mut.mutate({
      data: {
        id: isNew ? undefined : id,
        name: form.name, slug: form.slug,
        summary: form.summary || null, description: form.description || null,
        problem: form.problem || null, solution: form.solution || null,
        process: form.process || null, results: form.results || null,
        tools: form.tools ? form.tools.split(",").map((s) => s.trim()).filter(Boolean) : null,
        role: form.role || null, category: form.category || null,
        live_link: form.live_link || null, case_study_link: form.case_study_link || null,
        featured_image_url: form.featured_image_url || null,
        featured: form.featured, display_order: form.display_order,
        bento_size: form.bento_size, status: form.status,
      },
    });
  }

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <Link to="/admin/projects" className="inline-flex items-center gap-1 text-sm text-muted-ink"><ArrowLeft size={14} /> Projects</Link>
      <h1 className="font-display text-4xl">{isNew ? "New project" : "Edit project"}</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
        </div>
        <Textarea label="Summary" value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} rows={2} />
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <Input label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
          <Input label="Tools (comma sep.)" value={form.tools} onChange={(v) => setForm({ ...form, tools: v })} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Live link" value={form.live_link} onChange={(v) => setForm({ ...form, live_link: v })} />
          <Input label="Case study link" value={form.case_study_link} onChange={(v) => setForm({ ...form, case_study_link: v })} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-ink">Featured image</label>
          {form.featured_image_url && <img src={form.featured_image_url} alt="" className="mt-2 h-32 rounded-md border border-line object-cover" />}
          <div className="mt-2 flex items-center gap-2">
            <input type="url" placeholder="Image URL" value={form.featured_image_url} onChange={(e) => setForm({ ...form, featured_image_url: e.target.value })} className="flex-1 rounded-md border border-line bg-cloud px-3 py-2 text-sm" />
            <label className="cursor-pointer rounded-md border border-line px-3 py-2 text-xs hover:bg-surface">
              Upload
              <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
            </label>
          </div>
        </div>
        <Textarea label="Problem" value={form.problem} onChange={(v) => setForm({ ...form, problem: v })} />
        <Textarea label="Solution" value={form.solution} onChange={(v) => setForm({ ...form, solution: v })} />
        <Textarea label="Process" value={form.process} onChange={(v) => setForm({ ...form, process: v })} />
        <Textarea label="Results" value={form.results} onChange={(v) => setForm({ ...form, results: v })} />
        <Textarea label="Description (long)" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        <div className="grid gap-4 md:grid-cols-4">
          <Select label="Bento size" value={form.bento_size} onChange={(v) => setForm({ ...form, bento_size: v as Form["bento_size"] })} options={["small", "medium", "large", "wide", "tall"]} />
          <Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as Form["status"] })} options={["draft", "published"]} />
          <Input label="Display order" value={String(form.display_order)} onChange={(v) => setForm({ ...form, display_order: Number(v) || 0 })} />
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
          </label>
        </div>
        <div className="flex gap-3 pt-4">
          <button disabled={mut.isPending} className="rounded-full bg-ink px-5 py-2.5 text-sm text-cloud disabled:opacity-50">{mut.isPending ? "Saving…" : "Save"}</button>
          <Link to="/admin/projects" className="rounded-full border border-line px-5 py-2.5 text-sm">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, required, ...rest }: { label: string; value: string; onChange: (v: string) => void; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-ink">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required} {...rest} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none" />
    </div>
  );
}
function Textarea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-ink">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none" />
    </div>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-ink">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}