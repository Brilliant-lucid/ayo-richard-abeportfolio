import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitContactMessage } from "@/lib/cms/public.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ayo Richard Abe" },
      { name: "description", content: "Send a message. I read every one." },
      { property: "og:title", content: "Contact — Ayo Richard Abe" },
      { property: "og:description", content: "Send a message. I read every one." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const submit = useServerFn(submitContactMessage);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await submit({
        data: {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          subject: String(fd.get("subject") ?? ""),
          message: String(fd.get("message") ?? ""),
        },
      });
      setDone(true);
      toast.success("Message sent. I'll be in touch.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-electric">Contact</div>
        <h1 className="mt-3 font-display text-5xl leading-tight text-ink">Let's talk.</h1>
        <p className="mt-4 text-ink-soft">For product, advisory, or growth engagements. I respond within two business days.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-cloud p-6">
        <Field name="name" label="Name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="subject" label="Subject" />
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-ink">Message</label>
          <textarea name="message" required minLength={5} rows={6} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm text-ink focus:border-electric focus:outline-none" />
        </div>
        <button disabled={loading || done} className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud disabled:opacity-50">
          {done ? "Sent ✓" : loading ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-ink">{label}</label>
      <input name={name} type={type} required={required} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm text-ink focus:border-electric focus:outline-none" />
    </div>
  );
}