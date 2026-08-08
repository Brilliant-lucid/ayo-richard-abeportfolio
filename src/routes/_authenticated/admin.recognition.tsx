import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import type { ProfileTable } from "@/lib/cms/profile-tables";

export const Route = createFileRoute("/_authenticated/admin/recognition")({
  head: () => ({ meta: [{ title: "Publications & Testimonials — Admin" }] }),
  component: Page,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div>Not found</div>,
});

const TABS: { key: ProfileTable; label: string }[] = [
  { key: "publications", label: "Publications" },
  { key: "testimonials", label: "Testimonials" },
];

function Page() {
  const [tab, setTab] = useState<ProfileTable>("publications");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Publications & Testimonials</h1>
        <p className="mt-2 text-ink-soft">External proof, recognition and credibility that back up your work.</p>
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
