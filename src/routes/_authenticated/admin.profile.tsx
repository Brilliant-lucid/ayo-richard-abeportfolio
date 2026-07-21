import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { getMyPortfolio, updateMyPortfolio } from "@/lib/cms/portfolio.functions";
import { uploadMedia } from "@/lib/cms/admin.functions";
import { toast } from "sonner";
import { Upload, ExternalLink, Copy } from "lucide-react";
import { Link } from "@tanstack/react-router";

const portfolioQO = queryOptions({ queryKey: ["my-portfolio"], queryFn: () => getMyPortfolio() });

export const Route = createFileRoute("/_authenticated/admin/profile")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQO),
  head: () => ({ meta: [{ title: "Profile — Admin" }] }),
  component: ProfilePage,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div>Not found</div>,
});

function ProfilePage() {
  const { data: portfolio } = useSuspenseQuery(portfolioQO);
  const qc = useQueryClient();
  const update = useServerFn(updateMyPortfolio);
  const upload = useServerFn(uploadMedia);

  const [username, setUsername] = useState(portfolio?.username ?? "");
  const [displayName, setDisplayName] = useState(portfolio?.display_name ?? "");
  const [tagline, setTagline] = useState(portfolio?.tagline ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(portfolio?.avatar_url ?? null);
  const [isPublished, setIsPublished] = useState(!!portfolio?.is_published);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (portfolio) {
      setUsername(portfolio.username);
      setDisplayName(portfolio.display_name ?? "");
      setTagline(portfolio.tagline ?? "");
      setAvatarUrl(portfolio.avatar_url ?? null);
      setIsPublished(!!portfolio.is_published);
    }
  }, [portfolio]);

  const shareUrl = portfolio
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/u/${portfolio.username}`
    : "";

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await upload({ data: fd as never });
      setAvatarUrl(res.url);
      toast.success("Avatar uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        display_name: displayName.trim(),
        tagline: tagline.trim() || null,
        avatar_url: avatarUrl,
        is_published: isPublished,
      };
      if (username && username !== portfolio?.username) payload.username = username.trim().toLowerCase();
      await update({ data: payload as never });
      await qc.invalidateQueries({ queryKey: ["my-portfolio"] });
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied");
  }

  if (!portfolio) {
    return <div className="text-sm text-ink-soft">No portfolio yet.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Profile</h1>
        <p className="mt-2 text-ink-soft">Manage your account, username, and how your portfolio appears.</p>
      </div>

      <section className="rounded-2xl border border-line bg-cloud p-6">
        <div className="text-xs uppercase tracking-wider text-muted-ink">Your shareable link</div>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <div className="font-display text-lg text-ink break-all">{shareUrl}</div>
          <div className="flex gap-2">
            <button onClick={copyLink} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs hover:bg-surface">
              <Copy size={12} /> Copy
            </button>
            <Link to="/u/$username" params={{ username: portfolio.username }} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs hover:bg-surface">
              <ExternalLink size={12} /> Open
            </Link>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-ink">
          Status: {isPublished ? <span className="text-electric">Published</span> : <span>Unpublished (private)</span>}
        </div>
      </section>

      <form onSubmit={onSave} className="space-y-6 rounded-2xl border border-line bg-cloud p-6">
        <div className="flex items-start gap-6">
          <div className="shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-24 w-24 rounded-2xl object-cover ring-1 ring-line" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-surface font-display text-3xl text-ink-soft">
                {(displayName || username).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs hover:bg-surface">
              <Upload size={12} /> {uploading ? "Uploading…" : "Upload avatar"}
              <input type="file" accept="image/*" onChange={onAvatarChange} className="hidden" disabled={uploading} />
            </label>
            {avatarUrl && (
              <button type="button" onClick={() => setAvatarUrl(null)} className="ml-2 text-xs text-muted-ink hover:text-ink">Remove</button>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Username" hint="Lowercase letters, numbers and dashes. Changing this changes your link.">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none"
            />
          </Field>
          <Field label="Display name">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none"
            />
          </Field>
        </div>

        <Field label="Tagline" hint="A short line that describes what you do.">
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            maxLength={160}
            className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none"
          />
        </Field>

        <label className="flex items-center gap-3 rounded-md border border-line bg-surface/40 px-4 py-3">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          <span className="text-sm">
            <span className="font-medium text-ink">Publish my portfolio</span>
            <span className="ml-2 text-xs text-muted-ink">Anyone with your link can view it.</span>
          </span>
        </label>

        <div className="flex justify-end">
          <button disabled={saving} className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-cloud disabled:opacity-50">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-ink">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-ink">{hint}</p>}
    </div>
  );
}