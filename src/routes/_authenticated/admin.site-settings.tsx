import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSiteData } from "@/lib/cms/public.functions";
import { updateSiteSettings } from "@/lib/cms/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/site-settings")({ component: Page });

function Page() {
  const save = useServerFn(updateSiteSettings);
  const [s, setS] = useState<any>(null);
  useEffect(() => { getSiteData().then((d) => setS(d.settings)); }, []);
  if (!s) return <div>Loading…</div>;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await save({ data: { id: s.id, site_name: s.site_name, email: s.email, linkedin_url: s.linkedin_url, github_url: s.github_url, twitter_url: s.twitter_url, whatsapp_url: s.whatsapp_url, default_seo_title: s.default_seo_title, default_seo_description: s.default_seo_description, logo_url: s.logo_url } });
      toast.success("Saved");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  const F = (k: string, label: string) => (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-ink">{label}</label>
      <input value={s[k] ?? ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm" />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="font-display text-4xl">Site settings</h1>
      {F("site_name", "Site name")}
      {F("email", "Contact email")}
      <div className="grid gap-4 md:grid-cols-2">
        {F("linkedin_url", "LinkedIn URL")}
        {F("github_url", "GitHub URL")}
        {F("twitter_url", "Twitter URL")}
        {F("whatsapp_url", "WhatsApp URL")}
      </div>
      {F("default_seo_title", "Default SEO title")}
      {F("default_seo_description", "Default SEO description")}
      <button className="rounded-full bg-ink px-5 py-2.5 text-sm text-cloud">Save</button>
    </form>
  );
}