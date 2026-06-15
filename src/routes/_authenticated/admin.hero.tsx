import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { updateHero, uploadMedia, getMyHero } from "@/lib/cms/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/hero")({ component: Page });

function Page() {
  const save = useServerFn(updateHero);
  const upload = useServerFn(uploadMedia);
  const [h, setH] = useState<any>(null);
  useEffect(() => { getMyHero().then((d) => setH(d ?? { heading: "" })); }, []);
  if (!h) return <div>Loading…</div>;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await save({ data: { eyebrow: h.eyebrow, heading: h.heading, intro: h.intro, profile_image_url: h.profile_image_url, cta_primary_label: h.cta_primary_label, cta_primary_href: h.cta_primary_href, cta_secondary_label: h.cta_secondary_label, cta_secondary_href: h.cta_secondary_href } });
      toast.success("Saved");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  async function onUpload(f: File) {
    const fd = new FormData(); fd.append("file", f);
    const r = await upload({ data: fd });
    setH({ ...h, profile_image_url: r.url });
  }

  const F = (k: string, label: string, multi = false) => (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-ink">{label}</label>
      {multi
        ? <textarea rows={3} value={h[k] ?? ""} onChange={(e) => setH({ ...h, [k]: e.target.value })} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm" />
        : <input value={h[k] ?? ""} onChange={(e) => setH({ ...h, [k]: e.target.value })} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm" />
      }
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="font-display text-4xl">Hero</h1>
      {F("eyebrow", "Eyebrow")}
      {F("heading", "Heading", true)}
      {F("intro", "Intro", true)}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-ink">Profile image</label>
        {h.profile_image_url && <img src={h.profile_image_url} alt="" className="mt-2 h-24 w-24 rounded-md object-cover" />}
        <div className="mt-2 flex gap-2">
          <input value={h.profile_image_url ?? ""} onChange={(e) => setH({ ...h, profile_image_url: e.target.value })} className="flex-1 rounded-md border border-line bg-cloud px-3 py-2 text-sm" />
          <label className="cursor-pointer rounded-md border border-line px-3 py-2 text-xs">Upload<input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} /></label>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {F("cta_primary_label", "Primary CTA label")}
        {F("cta_primary_href", "Primary CTA href")}
        {F("cta_secondary_label", "Secondary CTA label")}
        {F("cta_secondary_href", "Secondary CTA href")}
      </div>
      <button className="rounded-full bg-ink px-5 py-2.5 text-sm text-cloud">Save</button>
    </form>
  );
}