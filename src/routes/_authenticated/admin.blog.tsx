import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: () => (
    <div className="space-y-3">
      <h1 className="font-display text-4xl">Blog</h1>
      <p className="text-ink-soft">Blog post editor coming in the next iteration. For now, edit posts via the database.</p>
    </div>
  ),
});