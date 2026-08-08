import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Upload } from "lucide-react";
import { ChipInput } from "@/components/editor/ChipInput";
import { uploadMedia } from "@/lib/cms/admin.functions";
import {
  listProfileRows,
  upsertProfileRow,
  deleteProfileRow,
} from "@/lib/cms/profile-admin.functions";
import { PROFILE_TABLES, REQUIRED_KEYS, type ProfileTable, type FieldSpec } from "@/lib/cms/profile-tables";

type Row = Record<string, any>;

export function CollectionEditor({ table }: { table: ProfileTable }) {
  const spec = PROFILE_TABLES[table];
  const load = useServerFn(listProfileRows);
  const save = useServerFn(upsertProfileRow);
  const remove = useServerFn(deleteProfileRow);

  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setRows(await load({ data: { table } }));
  }
  useEffect(() => {
    setRows(null);
    setEditing(null);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function startNew() {
    const blank: Row = {};
    for (const f of spec.fields) blank[f.key] = f.type === "chips" ? [] : "";
    blank["display_order"] = rows?.length ?? 0;
    if (spec.fields.some((f) => f.type === "status")) blank["status"] = "published";
    if (table === "publications") blank["kind"] = "article";
    setEditing(blank);
  }

  async function onSave() {
    if (!editing) return;
    for (const key of REQUIRED_KEYS[table]) {
      if (!String(editing[key] ?? "").trim()) {
        toast.error(`${spec.fields.find((f) => f.key === key)?.label ?? key} is required`);
        return;
      }
    }
    setBusy(true);
    try {
      const values: Row = {};
      for (const f of spec.fields) {
        let v = editing[f.key];
        if (f.type === "number") v = v === "" || v == null ? null : Number(v);
        values[f.key] = v;
      }
      await save({ data: { table, id: editing["id"] ?? null, values } });
      toast.success("Saved");
      setEditing(null);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    try {
      await remove({ data: { table, id } });
      toast.success("Deleted");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <p className="text-sm text-ink-soft">{spec.description}</p>
        <button
          onClick={startNew}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs text-cloud"
        >
          <Plus size={13} /> Add {spec.singular}
        </button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-electric/40 bg-cloud p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-display text-lg">{editing["id"] ? `Edit ${spec.singular}` : `New ${spec.singular}`}</div>
            <button onClick={() => setEditing(null)} className="text-muted-ink hover:text-ink"><X size={16} /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {spec.fields.map((f) => (
              <div key={f.key} className={f.half ? "" : "md:col-span-2"}>
                <FieldInput field={f} value={editing[f.key]} onChange={(v) => setEditing({ ...editing, [f.key]: v })} />
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="rounded-full border border-line px-4 py-2 text-xs">Cancel</button>
            <button disabled={busy} onClick={onSave} className="rounded-full bg-ink px-5 py-2 text-xs text-cloud disabled:opacity-50">
              {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-line rounded-2xl border border-line bg-cloud">
        {rows === null && <div className="p-6 text-sm text-muted-ink">Loading…</div>}
        {rows?.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-ink">
            Nothing here yet. Add your first {spec.singular} to show this section on your portfolio.
          </div>
        )}
        {rows?.map((r) => (
          <div key={r["id"]} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <div className="truncate font-medium">{r[spec.titleKey] || "Untitled"}</div>
              <div className="truncate text-xs text-muted-ink">
                {[...spec.subtitleKeys.map((k) => r[k]), r["status"]].filter(Boolean).join(" · ")}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => {
                  const next: Row = { id: r["id"] };
                  for (const f of spec.fields) next[f.key] = r[f.key] ?? (f.type === "chips" ? [] : "");
                  setEditing(next);
                }}
                className="rounded-md border border-line p-2 text-muted-ink hover:text-ink"
                aria-label="Edit"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => onDelete(r["id"])}
                className="rounded-md border border-line p-2 text-muted-ink hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: FieldSpec; value: any; onChange: (v: any) => void }) {
  const upload = useServerFn(uploadMedia);
  const cls = "mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none";
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-ink">{field.label}</label>
      {field.type === "textarea" && (
        <textarea rows={4} value={value ?? ""} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {(field.type === "text") && (
        <input value={value ?? ""} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {field.type === "date" && (
        <input type="date" value={value ? String(value).slice(0, 10) : ""} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {field.type === "number" && (
        <input type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {field.type === "status" && (
        <select value={value ?? "published"} onChange={(e) => onChange(e.target.value)} className={cls}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="unlisted">Unlisted</option>
          <option value="archived">Archived</option>
        </select>
      )}
      {field.type === "chips" && (
        <div className="mt-1">
          <ChipInput values={Array.isArray(value) ? value : []} onChange={onChange} placeholder="Type and press Enter" />
        </div>
      )}
      {field.type === "image" && (
        <div className="mt-1 flex items-center gap-2">
          {value ? <img src={value} alt="" className="h-10 w-10 rounded-md object-cover ring-1 ring-line" /> : null}
          <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="https://…" className="flex-1 rounded-md border border-line bg-cloud px-3 py-2 text-sm" />
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-line px-3 py-2 text-xs">
            <Upload size={12} /> Upload
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const fd = new FormData();
                fd.append("file", f);
                try {
                  const r = await upload({ data: fd as never });
                  onChange(r.url);
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Upload failed");
                }
              }}
            />
          </label>
        </div>
      )}
      {field.hint && <p className="mt-1 text-[11px] text-muted-ink">{field.hint}</p>}
    </div>
  );
}
