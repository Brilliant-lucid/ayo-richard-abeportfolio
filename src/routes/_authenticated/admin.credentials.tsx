import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import type { ProfileTable } from "@/lib/cms/profile-tables";

export const Route = createFileRoute("/_authenticated/admin/credentials")({
  head: () => ({ meta: [{ title: "Experience & Credentials — Admin" }] }),
  component: Page,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div>Not found</div>,
});

const TABS: { key: ProfileTable; label: string }[] = [
  { key: "experience", label: "Experience" },
  { key: "skills", label: "Skills" },
  { key: "certifications", label: "Certifications" },
  { key: "awards", label: "Awards" },
];

function Page() {
  const [tab, setTab] = useState<ProfileTable>("experience");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Experience & Credentials</h1>
        <p className="mt-2 text-ink-soft">Your professional history, capabilities, credentials and achievements — all in one place.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-4 py-1.5 text-xs ${tab === t.key ? "border-ink bg-ink text-cloud" : "border-line text-ink-soft hover:bg-surface"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <CollectionEditor table={tab} />
    </div>
  );
}
