import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/admin/case-studies")({
  component: () => (
    <div className="space-y-3">
      <h1 className="font-display text-4xl">Case studies</h1>
      <p className="text-ink-soft">Case study editor coming in the next iteration. For now, edit via the database.</p>
    </div>
  ),
});