import { createFileRoute, useNavigate, Link, useBlocker } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getProjectById,
  upsertProject,
  uploadMedia,
  duplicateProject,
  setProjectStatus,
  deleteProject,
  listAllProjects,
} from "@/lib/cms/admin.functions";
import { getMyPortfolio } from "@/lib/cms/portfolio.functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft, Upload, Trash2, MoreHorizontal, ChevronDown, ChevronUp,
  Plus, GripVertical, X, ExternalLink, Copy, Archive, EyeOff, Eye,
} from "lucide-react";
import { ChipInput } from "@/components/editor/ChipInput";
import { RichText } from "@/components/editor/RichText";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/_authenticated/admin/projects/$id")({
  component: EditProject,
});

type GalleryItem = { url: string; alt: string; caption: string };
type LinkItem = { label: string; url: string };
type Metric = { value: string; label: string; note: string };
type Status = "draft" | "published" | "unlisted" | "archived";
type Visibility = "public" | "unlisted" | "private";
type BentoSize = "small" | "medium" | "large" | "wide" | "tall";

type Form = {
  title: string;
  slug: string;
  summary: string;
  category: string;
  roles: string[];
  tools: string[];
  start_date: string;
  end_date: string;
  ongoing: boolean;

  featured_image_url: string;
  image_alt: string;
  gallery: GalleryItem[];

  live_link: string;
  case_study_link: string;
  additional_links: LinkItem[];

  overview: string;
  challenge: string;
  goals: string;
  constraints: string;
  process: string;
  solution: string;
  results: string;
  learnings: string;
  metrics: Metric[];

  status: Status;
  visibility: Visibility;
  featured: boolean;
  publish_date: string;
  display_order: number;
  bento_size: BentoSize;

  seo_title: string;
  seo_description: string;
  social_image_url: string;
  canonical_url: string;
  index_allowed: boolean;
};

const CATEGORIES = ["Crypto", "Fintech", "SaaS", "E-commerce", "Consumer", "Internal Tools", "Other"];
const ROLE_SUGGESTIONS = ["Growth Strategy", "Product Management", "Product Design", "Research", "Engineering", "Brand", "Marketing"];
const TOOL_SUGGESTIONS = ["React", "TypeScript", "Next.js", "TailwindCSS", "Node.js", "Postgres", "Supabase", "Figma", "WebSockets", "Rust", "Python"];

const emptyForm: Form = {
  title: "", slug: "", summary: "", category: "", roles: [], tools: [],
  start_date: "", end_date: "", ongoing: false,
  featured_image_url: "", image_alt: "", gallery: [],
  live_link: "", case_study_link: "", additional_links: [],
  overview: "", challenge: "", goals: "", constraints: "",
  process: "", solution: "", results: "", learnings: "", metrics: [],
  status: "draft", visibility: "public", featured: false,
  publish_date: "", display_order: 0, bento_size: "small",
  seo_title: "", seo_description: "", social_image_url: "", canonical_url: "", index_allowed: true,
};

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeUrl(u: string) {
  const s = u.trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (/^mailto:/i.test(s) || s.startsWith("/") || s.startsWith("#")) return s;
  return `https://${s}`;
}

function isValidUrl(u: string) {
  if (!u) return true;
  try { new URL(normalizeUrl(u)); return true; } catch { return false; }
}

function EditProject() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();

  const get = useServerFn(getProjectById);
  const save = useServerFn(upsertProject);
  const upload = useServerFn(uploadMedia);
  const dup = useServerFn(duplicateProject);
  const setStatus = useServerFn(setProjectStatus);
  const del = useServerFn(deleteProject);
  const listAll = useServerFn(listAllProjects);
  const getPortfolio = useServerFn(getMyPortfolio);

  const [form, setForm] = useState<Form>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [dirty, setDirty] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [siblingSlugs, setSiblingSlugs] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const initialLoad = useRef(true);

  // Update helper that flags dirty state
  function update<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  }

  // Auto-slug from title until user edits slug manually
  useEffect(() => {
    if (!slugTouched && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title]);

  useEffect(() => {
    getPortfolio().then((p) => setUsername((p as any)?.username ?? null)).catch(() => {});
    listAll().then((rows) => setSiblingSlugs((rows as any[]).filter((r) => r.id !== id).map((r) => r.slug))).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (isNew) return;
    get({ data: { id } }).then((p: any) => {
      if (p) {
        setForm({
          title: p.title || p.name || "",
          slug: p.slug || "",
          summary: p.summary ?? "",
          category: p.category ?? "",
          roles: Array.isArray(p.roles) && p.roles.length
            ? p.roles
            : (p.role ? String(p.role).split(",").map((s: string) => s.trim()).filter(Boolean) : []),
          tools: Array.isArray(p.tools) ? p.tools : [],
          start_date: p.start_date ?? "",
          end_date: p.end_date ?? "",
          ongoing: !!p.ongoing,
          featured_image_url: p.featured_image_url ?? "",
          image_alt: p.image_alt ?? "",
          gallery: Array.isArray(p.gallery) ? p.gallery : [],
          live_link: p.live_link ?? "",
          case_study_link: p.case_study_link ?? "",
          additional_links: Array.isArray(p.additional_links) ? p.additional_links : [],
          overview: p.overview ?? p.description ?? "",
          challenge: p.challenge ?? p.problem ?? "",
          goals: p.goals ?? "",
          constraints: p.constraints ?? "",
          process: p.process ?? "",
          solution: p.solution ?? "",
          results: p.results ?? "",
          learnings: p.learnings ?? "",
          metrics: Array.isArray(p.metrics) ? p.metrics : [],
          status: (p.status as Status) ?? "draft",
          visibility: (p.visibility as Visibility) ?? "public",
          featured: !!p.featured,
          publish_date: p.publish_date ?? "",
          display_order: p.display_order ?? 0,
          bento_size: (p.bento_size as BentoSize) ?? "small",
          seo_title: p.seo_title ?? "",
          seo_description: p.seo_description ?? "",
          social_image_url: p.social_image_url ?? "",
          canonical_url: p.canonical_url ?? "",
          index_allowed: p.index_allowed !== false,
        });
      }
      setLoading(false);
      queueMicrotask(() => { setDirty(false); initialLoad.current = false; });
    });
  }, [id, isNew]);

  // Unsaved-changes protection
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  useBlocker({
    shouldBlockFn: () => {
      if (!dirty) return false;
      return !window.confirm("You have unsaved changes. Leave anyway?");
    },
  });

  // Validation
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = "Lowercase letters, numbers and dashes only";
    else if (siblingSlugs.includes(form.slug)) e.slug = "Slug already used by another project";
    if (form.summary.length > 200) e.summary = "Keep under 200 characters";
    if (form.live_link && !isValidUrl(form.live_link)) e.live_link = "Invalid URL";
    if (form.case_study_link && !isValidUrl(form.case_study_link)) e.case_study_link = "Invalid URL";
    if (form.canonical_url && !isValidUrl(form.canonical_url)) e.canonical_url = "Invalid URL";
    form.additional_links.forEach((l, i) => {
      if (l.url && !isValidUrl(l.url)) e[`additional_links.${i}`] = "Invalid URL";
    });
    return e;
  }, [form, siblingSlugs]);

  const saveMut = useMutation({
    mutationFn: (payload: Form & { publish?: boolean; unpublish?: boolean }) => {
      const nextStatus: Status = payload.publish ? "published" : payload.unpublish ? "draft" : payload.status;
      return save({
        data: {
          id: isNew ? undefined : id,
          name: payload.title,
          title: payload.title,
          slug: payload.slug,
          summary: payload.summary || null,
          description: payload.overview || null,
          overview: payload.overview || null,
          problem: payload.challenge || null,
          challenge: payload.challenge || null,
          solution: payload.solution || null,
          process: payload.process || null,
          results: payload.results || null,
          goals: payload.goals || null,
          constraints: payload.constraints || null,
          learnings: payload.learnings || null,
          metrics: payload.metrics,
          tools: payload.tools,
          role: payload.roles.join(", ") || null,
          roles: payload.roles,
          category: payload.category || null,
          live_link: payload.live_link ? normalizeUrl(payload.live_link) : null,
          case_study_link: payload.case_study_link ? normalizeUrl(payload.case_study_link) : null,
          additional_links: payload.additional_links.map((l) => ({ label: l.label, url: l.url ? normalizeUrl(l.url) : "" })),
          featured_image_url: payload.featured_image_url || null,
          image_alt: payload.image_alt || null,
          gallery: payload.gallery,
          featured: payload.featured,
          display_order: payload.display_order,
          bento_size: payload.bento_size,
          status: nextStatus,
          visibility: payload.visibility,
          start_date: payload.start_date || null,
          end_date: payload.ongoing ? null : (payload.end_date || null),
          ongoing: payload.ongoing,
          publish_date: payload.publish_date || null,
          seo_title: payload.seo_title || null,
          seo_description: payload.seo_description || null,
          social_image_url: payload.social_image_url || null,
          canonical_url: payload.canonical_url ? normalizeUrl(payload.canonical_url) : null,
          index_allowed: payload.index_allowed,
        },
      });
    },
    onSuccess: (res, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["project"] });
      setDirty(false);
      setLastSavedAt(new Date());
      if (vars.publish) toast.success("Published");
      else if (vars.unpublish) toast.success("Moved to draft");
      else toast.success("Saved");
      if (isNew && (res as any)?.id) navigate({ to: "/admin/projects/$id", params: { id: (res as any).id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  function attemptSave(mode: "draft" | "publish" | "update" | "unpublish") {
    if (Object.keys(errors).length) {
      toast.error("Fix validation errors before saving");
      return;
    }
    if (mode === "publish") saveMut.mutate({ ...form, publish: true });
    else if (mode === "unpublish") saveMut.mutate({ ...form, unpublish: true });
    else if (mode === "draft") saveMut.mutate({ ...form, status: "draft" });
    else saveMut.mutate(form);
  }

  async function doUpload(file: File): Promise<string> {
    if (file.size > 10 * 1024 * 1024) throw new Error("Max 10MB");
    if (!file.type.startsWith("image/")) throw new Error("Images only");
    const fd = new FormData();
    fd.append("file", file);
    const r = await upload({ data: fd });
    return (r as any).url as string;
  }

  async function uploadFeatured(file: File) {
    try { const url = await doUpload(file); update("featured_image_url", url); toast.success("Uploaded"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
  }

  async function addGallery(files: FileList | File[]) {
    const arr = Array.from(files);
    for (const f of arr) {
      try {
        const url = await doUpload(f);
        setForm((s) => ({ ...s, gallery: [...s.gallery, { url, alt: "", caption: "" }] }));
        setDirty(true);
      } catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
    }
  }

  if (loading) return <div className="py-20 text-center text-muted-ink">Loading…</div>;

  const statusBadge = STATUS_BADGE[form.status];
  const previewHref = form.slug ? `/projects/${form.slug}` : null;

  return (
    <div className="pb-32">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 -mx-4 border-b border-line bg-cloud/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link to="/admin/projects" className="inline-flex items-center gap-1 text-xs text-muted-ink hover:text-ink">
              <ArrowLeft size={12} /> Projects
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="truncate font-display text-2xl text-ink md:text-3xl">
                {isNew ? "New project" : "Edit Project"}
              </h1>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadge}`}>
                {form.status}
              </span>
            </div>
            {!isNew && form.title && <div className="mt-0.5 truncate text-sm text-muted-ink">{form.title}</div>}
            {lastSavedAt && !dirty && (
              <div className="mt-1 text-xs text-muted-ink">
                Saved · {lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            )}
            {dirty && <div className="mt-1 text-xs text-electric">Unsaved changes</div>}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {previewHref && (
              <a href={previewHref} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-ink hover:bg-surface">
                <ExternalLink size={12} /> Preview
              </a>
            )}
            {form.status !== "published" && (
              <button type="button" disabled={saveMut.isPending} onClick={() => attemptSave("draft")}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-ink hover:bg-surface disabled:opacity-50">
                Save Draft
              </button>
            )}
            <button type="button" disabled={saveMut.isPending} onClick={() => attemptSave(form.status === "published" ? "update" : "publish")}
              className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-cloud hover:opacity-90 disabled:opacity-50">
              {saveMut.isPending ? "Saving…" : form.status === "published" ? "Update Project" : "Publish"}
            </button>
            <MoreMenu open={moreOpen} onOpenChange={setMoreOpen} isNew={isNew} status={form.status}
              onDuplicate={async () => {
                if (isNew) return;
                setMoreOpen(false);
                try { const r = await dup({ data: { id } }); toast.success("Duplicated"); navigate({ to: "/admin/projects/$id", params: { id: (r as any).id } }); }
                catch (e) { toast.error(e instanceof Error ? e.message : "Duplicate failed"); }
              }}
              onUnpublish={() => { setMoreOpen(false); attemptSave("unpublish"); }}
              onArchive={async () => {
                if (isNew || !confirm("Archive this project? It will be hidden from your portfolio.")) return;
                setMoreOpen(false);
                try { await setStatus({ data: { id, status: "archived" } }); toast.success("Archived"); qc.invalidateQueries({ queryKey: ["admin", "projects"] }); navigate({ to: "/admin/projects" }); }
                catch (e) { toast.error(e instanceof Error ? e.message : "Archive failed"); }
              }}
              onDelete={async () => {
                if (isNew || !confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
                setMoreOpen(false);
                try { await del({ data: { id } }); toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "projects"] }); navigate({ to: "/admin/projects" }); }
                catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
              }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          {/* 1. Project Details */}
          <Section title="Project Details" description="Basic information used across your portfolio.">
            <Field label="Project Title" required error={errors.title}>
              <input value={form.title} onChange={(e) => { update("title", e.target.value); }}
                placeholder="Islo Markets"
                className={inputCls} />
            </Field>
            <Field label="Slug" required error={errors.slug}
              hint={username && form.slug ? `URL: /u/${username}/projects/${form.slug}` : "Lowercase, URL-safe, unique to your projects."}>
              <input value={form.slug} onChange={(e) => { setSlugTouched(true); update("slug", e.target.value.toLowerCase()); }}
                className={inputCls} />
            </Field>
            <Field label="Short Summary" hint="Shown on cards and listing pages." error={errors.summary}>
              <textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} rows={2}
                maxLength={220} placeholder="A market-analysis suite for liquidity providers…"
                className={inputCls} />
              <div className={`mt-1 text-right text-xs ${form.summary.length > 200 ? "text-destructive" : "text-muted-ink"}`}>
                {form.summary.length} / 200
              </div>
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Category">
                <input list="cat-suggestions" value={form.category} onChange={(e) => update("category", e.target.value)}
                  placeholder="Choose or type" className={inputCls} />
                <datalist id="cat-suggestions">
                  {CATEGORIES.map((c) => <option key={c} value={c} />)}
                </datalist>
              </Field>
              <Field label="Roles" hint="Tag your contributions.">
                <ChipInput values={form.roles} onChange={(v) => update("roles", v)} suggestions={ROLE_SUGGESTIONS} placeholder="Add role and press Enter" />
              </Field>
            </div>
            <Field label="Technologies & Tools" hint="Enter or comma to add. Drag to reorder.">
              <ChipInput values={form.tools} onChange={(v) => update("tools", v)} suggestions={TOOL_SUGGESTIONS} sortable placeholder="React, WebSockets, Rust…" />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Start date">
                <input type="date" value={form.start_date} onChange={(e) => update("start_date", e.target.value)} className={inputCls} />
              </Field>
              <Field label="End date">
                <input type="date" value={form.end_date} disabled={form.ongoing} onChange={(e) => update("end_date", e.target.value)} className={`${inputCls} disabled:opacity-50`} />
              </Field>
              <Field label="Ongoing?">
                <label className="mt-2 inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.ongoing} onChange={(e) => update("ongoing", e.target.checked)} />
                  Currently active
                </label>
              </Field>
            </div>
          </Section>

          {/* 2. Media */}
          <Section title="Media" description="Cover image and gallery.">
            <Field label="Featured Image" hint="Recommended 16:9, up to 10MB.">
              <FeaturedImage
                url={form.featured_image_url}
                onUrl={(u) => update("featured_image_url", u)}
                onUpload={uploadFeatured}
              />
            </Field>
            <Field label="Image Alt Text" hint="Describes the image for visitors who cannot see it.">
              <input value={form.image_alt} onChange={(e) => update("image_alt", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Project Gallery" hint="Multiple images, drag to reorder.">
              <Gallery
                items={form.gallery}
                onChange={(g) => update("gallery", g)}
                onAdd={addGallery}
              />
            </Field>
          </Section>

          {/* 3. Links */}
          <Section title="Project Links" description="Live URL, external case study, and additional resources.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Live Project URL" error={errors.live_link}>
                <input value={form.live_link} onBlur={(e) => update("live_link", normalizeUrl(e.target.value))}
                  onChange={(e) => update("live_link", e.target.value)} placeholder="https://…" className={inputCls} />
              </Field>
              <Field label="External Case Study URL" hint="Optional — only if hosted outside this portfolio." error={errors.case_study_link}>
                <input value={form.case_study_link} onBlur={(e) => update("case_study_link", normalizeUrl(e.target.value))}
                  onChange={(e) => update("case_study_link", e.target.value)} placeholder="https://…" className={inputCls} />
              </Field>
            </div>
            <Field label="Additional Links">
              <AdditionalLinks
                items={form.additional_links}
                errors={errors}
                onChange={(v) => update("additional_links", v)}
              />
            </Field>
          </Section>

          {/* 4. Case Study */}
          <Section title="Case Study" description="Structured narrative of the project.">
            <RichField label="Overview" hint="Introduce the product, users, your contribution, and context." value={form.overview} onChange={(v) => update("overview", v)} onUpload={doUpload} />
            <RichField label="The Challenge" hint="Describe the user or business problem and why it mattered." value={form.challenge} onChange={(v) => update("challenge", v)} onUpload={doUpload} />
            <RichField label="Goals" hint="Objectives and success criteria." value={form.goals} onChange={(v) => update("goals", v)} onUpload={doUpload} />
            <RichField label="Constraints" hint="Time, data, regulation, technical or confidentiality limits." value={form.constraints} onChange={(v) => update("constraints", v)} onUpload={doUpload} />
            <RichField label="Process" hint="Research, decisions, experiments, collaboration." value={form.process} onChange={(v) => update("process", v)} onUpload={doUpload} />
            <RichField label="Solution" hint="What you built and why this approach." value={form.solution} onChange={(v) => update("solution", v)} onUpload={doUpload} />
            <RichField label="Results & Impact" hint="Measurable and qualitative outcomes." value={form.results} onChange={(v) => update("results", v)} onUpload={doUpload} />
            <Field label="Key Metrics" hint="Add repeatable metric cards.">
              <Metrics items={form.metrics} onChange={(m) => update("metrics", m)} />
            </Field>
            <RichField label="Learnings" hint="Reflections and possible next steps." value={form.learnings} onChange={(v) => update("learnings", v)} onUpload={doUpload} />
          </Section>
        </div>

        {/* Right column */}
        <aside className="space-y-6">
          <Panel title="Publishing">
            <Field label="Status">
              <select value={form.status} onChange={(e) => update("status", e.target.value as Status)} className={inputCls}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="unlisted">Unlisted</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Visibility">
              <select value={form.visibility} onChange={(e) => update("visibility", e.target.value as Visibility)} className={inputCls}>
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </Field>
            <Field label="Publish date">
              <input type="datetime-local" value={form.publish_date ? form.publish_date.slice(0, 16) : ""}
                onChange={(e) => update("publish_date", e.target.value ? new Date(e.target.value).toISOString() : "")}
                className={inputCls} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
              Featured project (highlight on homepage)
            </label>
            <Field label="Display order" hint="Tip: drag-reorder from the projects list.">
              <input type="number" value={form.display_order} onChange={(e) => update("display_order", Number(e.target.value) || 0)} className={inputCls} />
            </Field>
            <Field label="Bento size (homepage grid)">
              <select value={form.bento_size} onChange={(e) => update("bento_size", e.target.value as BentoSize)} className={inputCls}>
                {["small", "medium", "large", "wide", "tall"].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
          </Panel>

          <Panel title="SEO and Sharing" collapsible open={seoOpen} onToggle={() => setSeoOpen((v) => !v)}>
            <Field label="SEO title" hint={`Defaults to project title. ${form.seo_title.length}/60`}>
              <input value={form.seo_title} onChange={(e) => update("seo_title", e.target.value)} maxLength={80} className={inputCls} />
            </Field>
            <Field label="Meta description" hint={`${form.seo_description.length}/160`}>
              <textarea value={form.seo_description} onChange={(e) => update("seo_description", e.target.value)} rows={3} maxLength={200} className={inputCls} />
            </Field>
            <Field label="Social image">
              <FeaturedImage url={form.social_image_url}
                onUrl={(u) => update("social_image_url", u)}
                onUpload={async (f) => { try { const url = await doUpload(f); update("social_image_url", url); toast.success("Uploaded"); } catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); } }} />
            </Field>
            <Field label="Canonical URL" error={errors.canonical_url}>
              <input value={form.canonical_url} onChange={(e) => update("canonical_url", e.target.value)} className={inputCls} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.index_allowed} onChange={(e) => update("index_allowed", e.target.checked)} />
              Allow search-engine indexing
            </label>
          </Panel>
        </aside>
      </div>

      {/* Mobile sticky bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-line bg-cloud/95 px-4 py-3 backdrop-blur md:hidden">
        {previewHref && (
          <a href={previewHref} target="_blank" rel="noreferrer" className="rounded-full border border-line px-3 py-2 text-xs">
            <ExternalLink size={12} />
          </a>
        )}
        {form.status !== "published" && (
          <button type="button" onClick={() => attemptSave("draft")} disabled={saveMut.isPending}
            className="flex-1 rounded-full border border-line px-3 py-2 text-xs">Draft</button>
        )}
        <button type="button" onClick={() => attemptSave(form.status === "published" ? "update" : "publish")} disabled={saveMut.isPending}
          className="flex-[2] rounded-full bg-ink px-3 py-2 text-xs font-medium text-cloud">
          {saveMut.isPending ? "Saving…" : form.status === "published" ? "Update" : "Publish"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Presentational subcomponents ---------- */

const inputCls = "mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none";

const STATUS_BADGE: Record<Status, string> = {
  draft: "bg-surface text-muted-ink",
  published: "bg-electric/15 text-electric",
  unlisted: "bg-amber-100 text-amber-700",
  archived: "bg-neutral-200 text-neutral-600",
};

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-cloud p-5 md:p-6">
      <header className="mb-4">
        <h2 className="font-display text-xl text-ink">{title}</h2>
        {description && <p className="text-xs text-muted-ink">{description}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Panel({ title, children, collapsible, open, onToggle }: { title: string; children: React.ReactNode; collapsible?: boolean; open?: boolean; onToggle?: () => void }) {
  return (
    <div className="rounded-2xl border border-line bg-cloud p-4">
      <button type="button" disabled={!collapsible} onClick={onToggle}
        className="flex w-full items-center justify-between text-left">
        <h3 className="font-display text-base text-ink">{title}</h3>
        {collapsible && (open ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </button>
      {(!collapsible || open) && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
}

function Field({ label, hint, error, required, children }: { label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-ink">
        {label}{required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
      {error ? (
        <div className="mt-1 text-xs text-destructive">{error}</div>
      ) : hint ? (
        <div className="mt-1 text-xs text-muted-ink">{hint}</div>
      ) : null}
    </div>
  );
}

function RichField({ label, hint, value, onChange, onUpload }: { label: string; hint?: string; value: string; onChange: (v: string) => void; onUpload: (f: File) => Promise<string> }) {
  return (
    <Field label={label} hint={hint}>
      <div className="mt-1">
        <RichText value={value} onChange={onChange} onUploadImage={onUpload} />
      </div>
    </Field>
  );
}

function MoreMenu({ open, onOpenChange, isNew, status, onDuplicate, onUnpublish, onArchive, onDelete }:
  { open: boolean; onOpenChange: (b: boolean) => void; isNew: boolean; status: Status;
    onDuplicate: () => void; onUnpublish: () => void; onArchive: () => void; onDelete: () => void }) {
  if (isNew) return null;
  return (
    <div className="relative">
      <button type="button" onClick={() => onOpenChange(!open)} aria-label="More actions"
        className="rounded-full border border-line p-2 text-ink hover:bg-surface">
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => onOpenChange(false)} />
          <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-line bg-cloud py-1 shadow-lg">
            <MenuItem onClick={onDuplicate}><Copy size={12} /> Duplicate</MenuItem>
            {status === "published" && <MenuItem onClick={onUnpublish}><EyeOff size={12} /> Unpublish</MenuItem>}
            {status !== "published" && status !== "archived" && <MenuItem disabled><Eye size={12} /> Publish (use main button)</MenuItem>}
            <MenuItem onClick={onArchive}><Archive size={12} /> Archive</MenuItem>
            <div className="my-1 border-t border-line" />
            <MenuItem onClick={onDelete} destructive><Trash2 size={12} /> Delete</MenuItem>
          </div>
        </>
      )}
    </div>
  );
}
function MenuItem({ onClick, disabled, destructive, children }: { onClick?: () => void; disabled?: boolean; destructive?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs ${disabled ? "text-muted-ink" : destructive ? "text-destructive hover:bg-destructive/10" : "text-ink hover:bg-surface"}`}>
      {children}
    </button>
  );
}

function FeaturedImage({ url, onUrl, onUpload }: { url: string; onUrl: (v: string) => void; onUpload: (f: File) => void | Promise<void> }) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div className="mt-1">
      {url ? (
        <div className="space-y-2">
          <img src={url} alt="" className="max-h-56 w-full rounded-md border border-line object-cover" />
          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer rounded-md border border-line px-3 py-1.5 text-xs hover:bg-surface">
              Replace
              <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
            </label>
            <button type="button" onClick={() => onUrl("")} className="rounded-md border border-line px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragOver(false);
            const f = e.dataTransfer.files?.[0]; if (f) onUpload(f);
          }}
          className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center text-sm ${dragOver ? "border-electric bg-electric/5" : "border-line"}`}
        >
          <Upload size={18} className="text-muted-ink" />
          <div className="text-muted-ink">Drag & drop an image, or</div>
          <label className="cursor-pointer rounded-md border border-line bg-cloud px-3 py-1.5 text-xs hover:bg-surface">
            Choose File
            <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
          </label>
        </div>
      )}
      <div className="mt-2 flex items-center gap-2">
        <input type="url" value={url} placeholder="Or paste an image URL"
          onChange={(e) => onUrl(e.target.value)} className="flex-1 rounded-md border border-line bg-cloud px-3 py-1.5 text-xs" />
      </div>
    </div>
  );
}

function Gallery({ items, onChange, onAdd }: { items: GalleryItem[]; onChange: (g: GalleryItem[]) => void; onAdd: (files: FileList) => void }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  return (
    <div className="mt-1 space-y-3">
      {items.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
          const { active, over } = e;
          if (!over || active.id === over.id) return;
          const ids = items.map((_, i) => String(i));
          const oi = ids.indexOf(active.id as string), ni = ids.indexOf(over.id as string);
          if (oi >= 0 && ni >= 0) onChange(arrayMove(items, oi, ni));
        }}>
          <SortableContext items={items.map((_, i) => String(i))} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((it, i) => (
                <GalleryRow key={i} id={String(i)} item={it}
                  onChange={(next) => onChange(items.map((x, idx) => idx === i ? next : x))}
                  onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2 text-xs hover:bg-surface">
        <Plus size={12} /> Add images
        <input type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files?.length) onAdd(e.target.files); }} />
      </label>
    </div>
  );
}

function GalleryRow({ id, item, onChange, onRemove }: { id: string; item: GalleryItem; onChange: (n: GalleryItem) => void; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-3 rounded-md border border-line bg-surface/40 p-2">
      <button type="button" {...attributes} {...listeners} className="cursor-grab pt-1 text-muted-ink"><GripVertical size={14} /></button>
      <img src={item.url} alt={item.alt} className="h-16 w-24 shrink-0 rounded object-cover" />
      <div className="grid flex-1 gap-1">
        <input value={item.caption} onChange={(e) => onChange({ ...item, caption: e.target.value })} placeholder="Caption" className="rounded border border-line bg-cloud px-2 py-1 text-xs" />
        <input value={item.alt} onChange={(e) => onChange({ ...item, alt: e.target.value })} placeholder="Alt text" className="rounded border border-line bg-cloud px-2 py-1 text-xs" />
      </div>
      <button type="button" onClick={onRemove} aria-label="Remove" className="text-muted-ink hover:text-destructive"><X size={14} /></button>
    </div>
  );
}

function AdditionalLinks({ items, errors, onChange }: { items: LinkItem[]; errors: Record<string, string>; onChange: (v: LinkItem[]) => void }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  return (
    <div className="mt-1 space-y-2">
      {items.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
          const { active, over } = e;
          if (!over || active.id === over.id) return;
          const ids = items.map((_, i) => "l" + i);
          const oi = ids.indexOf(active.id as string), ni = ids.indexOf(over.id as string);
          if (oi >= 0 && ni >= 0) onChange(arrayMove(items, oi, ni));
        }}>
          <SortableContext items={items.map((_, i) => "l" + i)} strategy={verticalListSortingStrategy}>
            {items.map((it, i) => (
              <LinkRow key={i} id={"l" + i} item={it}
                error={errors[`additional_links.${i}`]}
                onChange={(n) => onChange(items.map((x, idx) => idx === i ? n : x))}
                onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
      <button type="button" onClick={() => onChange([...items, { label: "", url: "" }])}
        className="inline-flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-xs hover:bg-surface">
        <Plus size={12} /> Add link
      </button>
    </div>
  );
}
function LinkRow({ id, item, error, onChange, onRemove }: { id: string; item: LinkItem; error?: string; onChange: (n: LinkItem) => void; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,2fr)_auto] items-center gap-2">
      <button type="button" {...attributes} {...listeners} className="cursor-grab text-muted-ink"><GripVertical size={12} /></button>
      <input value={item.label} onChange={(e) => onChange({ ...item, label: e.target.value })} placeholder="Label (GitHub, Figma…)" className="rounded border border-line bg-cloud px-2 py-1.5 text-xs" />
      <div>
        <input value={item.url} onChange={(e) => onChange({ ...item, url: e.target.value })} onBlur={(e) => onChange({ ...item, url: normalizeUrl(e.target.value) })} placeholder="https://…" className="w-full rounded border border-line bg-cloud px-2 py-1.5 text-xs" />
        {error && <div className="mt-1 text-[10px] text-destructive">{error}</div>}
      </div>
      <button type="button" onClick={onRemove} aria-label="Remove" className="text-muted-ink hover:text-destructive"><X size={14} /></button>
    </div>
  );
}

function Metrics({ items, onChange }: { items: Metric[]; onChange: (m: Metric[]) => void }) {
  return (
    <div className="mt-1 space-y-2">
      {items.map((m, i) => (
        <div key={i} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] items-start gap-2 rounded-md border border-line bg-surface/40 p-2">
          <input value={m.value} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))} placeholder="Value (24%)" className="rounded border border-line bg-cloud px-2 py-1.5 text-xs" />
          <div className="space-y-1">
            <input value={m.label} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} placeholder="Label (Increase in activation)" className="w-full rounded border border-line bg-cloud px-2 py-1.5 text-xs" />
            <input value={m.note} onChange={(e) => onChange(items.map((x, idx) => idx === i ? { ...x, note: e.target.value } : x))} placeholder="Optional note" className="w-full rounded border border-line bg-cloud px-2 py-1.5 text-xs" />
          </div>
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} aria-label="Remove" className="text-muted-ink hover:text-destructive"><X size={14} /></button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { value: "", label: "", note: "" }])}
        className="inline-flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-xs hover:bg-surface">
        <Plus size={12} /> Add metric
      </button>
    </div>
  );
}