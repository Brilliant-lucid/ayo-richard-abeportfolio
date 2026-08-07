import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Pencil, Plus, Star, Trash2, Archive } from "lucide-react";
import {
  listMyServices,
  upsertService,
  deleteService,
  patchService,
  reorderServices,
  uploadMedia,
} from "@/lib/cms/admin.functions";
import {
  SERVICE_CATEGORIES,
  PRICING_TYPES,
  LOCATIONS,
  actionLabel,
  categoryLabel,
  priceSummary,
  defaultAction,
} from "@/lib/services-config";

export const Route = createFileRoute("/_authenticated/admin/services")({ component: Page });

type Row = Record<string, any>;

const blank = () => ({
  name: "",
  category: "consultation",
  short_description: "",
  detailed_description: "",
  cover_image_url: "",
  starting_price: "",
  currency: "USD",
  pricing_type: "custom_quote",
  duration: "",
  delivery_time: "",
  location: "online",
  availability: "",
  featured: false,
  accepting_requests: true,
  action_label: "",
  status: "active",
});

const input =
  "mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm text-ink focus:border-electric focus:outline-none";
const lbl = "text-xs uppercase tracking-wider text-muted-ink";

function Page() {
  const load = useServerFn(listMyServices);
  const save = useServerFn(upsertService);
  const del = useServerFn(deleteService);
  const patch = useServerFn(patchService);
  const reorder = useServerFn(reorderServices);
  const upload = useServerFn(uploadMedia);

  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setRows(await load());
  }
  useEffect(() => {
    refresh();
  }, []);

  function edit(r: Row) {
    setForm({ ...blank(), ...r, starting_price: r.starting_price ?? "" });
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    try {
      await save({
        data: {
          ...(form.id ? { id: form.id } : {}),
          name: form.name,
          category: form.category,
          short_description: form.short_description || null,
          detailed_description: form.detailed_description || null,
          cover_image_url: form.cover_image_url || null,
          starting_price: form.starting_price === "" ? null : Number(form.starting_price),
          currency: form.currency || "USD",
          pricing_type: form.pricing_type,
          duration: form.duration || null,
          delivery_time: form.delivery_time || null,
          location: form.location,
          availability: form.availability || null,
          featured: !!form.featured,
          accepting_requests: !!form.accepting_requests,
          action_label: form.action_label || null,
          status: form.status,
          display_order: form.display_order ?? rows.length,
        },
      });
      toast.success("Saved");
      setForm(null);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function onUpload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = (await upload({ data: fd })) as { url: string };
      setForm((f) => (f ? { ...f, cover_image_url: res.url } : f));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function move(i: number, dir: -1 | 1) {
    const next = [...rows];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    await reorder({ data: { ids: next.map((r) => r.id) } });
  }

  async function quick(id: string, data: Record<string, unknown>) {
    await patch({ data: { id, ...data } as never });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Services</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Active services appear on your portfolio and drive the contact experience.
          </p>
        </div>
        <button
          onClick={() => setForm(blank())}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm text-cloud"
        >
          <Plus size={14} /> Add service
        </button>
      </div>

      {form && (
        <form onSubmit={onSave} className="space-y-4 rounded-2xl border border-line bg-cloud p-5">
          <div className="font-display text-2xl">{form.id ? "Edit service" : "New service"}</div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={lbl}>Service name</label>
              <input
                required
                className={input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className={lbl}>Category</label>
              <select
                className={input}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={lbl}>Short description</label>
            <input
              className={input}
              value={form.short_description ?? ""}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            />
          </div>
          <div>
            <label className={lbl}>Detailed description</label>
            <textarea
              rows={4}
              className={input}
              value={form.detailed_description ?? ""}
              onChange={(e) => setForm({ ...form, detailed_description: e.target.value })}
            />
          </div>
          <div>
            <label className={lbl}>Cover image (optional)</label>
            <div className="mt-1 flex items-center gap-3">
              {form.cover_image_url && (
                <img src={form.cover_image_url} alt="" className="h-16 w-24 rounded-md object-cover" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                className="text-xs"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={lbl}>Pricing type</label>
              <select
                className={input}
                value={form.pricing_type}
                onChange={(e) => setForm({ ...form, pricing_type: e.target.value })}
              >
                {PRICING_TYPES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>Starting price (optional)</label>
              <input
                type="number"
                min="0"
                step="any"
                className={input}
                value={form.starting_price}
                onChange={(e) => setForm({ ...form, starting_price: e.target.value })}
              />
            </div>
            <div>
              <label className={lbl}>Currency</label>
              <input
                className={input}
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={lbl}>Duration (optional)</label>
              <input
                className={input}
                placeholder="e.g. 60 minutes"
                value={form.duration ?? ""}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
            <div>
              <label className={lbl}>Delivery time (optional)</label>
              <input
                className={input}
                placeholder="e.g. 2 weeks"
                value={form.delivery_time ?? ""}
                onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
              />
            </div>
            <div>
              <label className={lbl}>Location</label>
              <select
                className={input}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              >
                {LOCATIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={lbl}>Availability</label>
              <input
                className={input}
                placeholder="e.g. Weekdays, 9am–5pm"
                value={form.availability ?? ""}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
              />
            </div>
            <div>
              <label className={lbl}>Action button label</label>
              <input
                className={input}
                placeholder={defaultAction(form.category)}
                value={form.action_label ?? ""}
                onChange={(e) => setForm({ ...form, action_label: e.target.value })}
              />
            </div>
            <div>
              <label className={lbl}>Status</label>
              <select
                className={input}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured service
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.accepting_requests}
                onChange={(e) => setForm({ ...form, accepting_requests: e.target.checked })}
              />
              Accepting requests
            </label>
          </div>
          <div className="flex gap-2">
            <button disabled={busy} className="rounded-full bg-ink px-5 py-2.5 text-sm text-cloud disabled:opacity-50">
              {busy ? "Saving…" : "Save service"}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="rounded-full border border-line px-5 py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {rows.length === 0 && (
          <div className="rounded-xl border border-line bg-cloud p-6 text-sm text-muted-ink">
            No services yet. Visitors will see a standard contact form until you add one.
          </div>
        )}
        {rows.map((r, i) => (
          <div key={r.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-cloud p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-ink">{r.name}</span>
                {r.featured && <Star size={12} className="text-electric" />}
              </div>
              <div className="mt-1 text-xs text-muted-ink">
                {categoryLabel(r.category)} · {r.status}
                {!r.accepting_requests && " · not accepting"} · {priceSummary(r as never)} ·{" "}
                {actionLabel(r as never)} · {r.inquiry_count ?? 0} inquiries
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              <button onClick={() => move(i, -1)} className="rounded-md border border-line p-1.5" aria-label="Move up">
                <ArrowUp size={13} />
              </button>
              <button onClick={() => move(i, 1)} className="rounded-md border border-line p-1.5" aria-label="Move down">
                <ArrowDown size={13} />
              </button>
              <button
                onClick={() => quick(r.id, { featured: !r.featured })}
                className="rounded-md border border-line px-3 py-1.5 text-xs"
              >
                {r.featured ? "Unfeature" : "Feature"}
              </button>
              <button
                onClick={() => quick(r.id, { status: r.status === "active" ? "disabled" : "active" })}
                className="rounded-md border border-line px-3 py-1.5 text-xs"
              >
                {r.status === "active" ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => quick(r.id, { status: "archived" })}
                className="inline-flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-xs"
              >
                <Archive size={12} /> Archive
              </button>
              <button
                onClick={() => edit(r)}
                className="inline-flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-xs"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={async () => {
                  if (!confirm("Delete this service?")) return;
                  await del({ data: { id: r.id } });
                  refresh();
                }}
                className="inline-flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-xs text-destructive"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}