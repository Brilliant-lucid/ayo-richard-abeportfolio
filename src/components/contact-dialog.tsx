import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitContactMessage } from "@/lib/cms/public.functions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { subscribeContactDialog } from "@/lib/contact-dialog-store";

export function ContactDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const submit = useServerFn(submitContactMessage);

  useEffect(() => subscribeContactDialog(() => {
    setDone(false);
    setOpen(true);
  }), []);

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
      setTimeout(() => setOpen(false), 800);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg rounded-2xl bg-cloud">
        <DialogHeader>
          <div className="text-xs uppercase tracking-[0.22em] text-electric">Contact</div>
          <DialogTitle className="font-display text-3xl text-ink">Let's talk.</DialogTitle>
          <DialogDescription className="text-ink-soft">
            For product, advisory, or growth engagements. I respond within two business days.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <Field name="name" label="Name" required />
          <Field name="email" label="Email" type="email" required />
          <Field name="subject" label="Subject" />
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-ink">Message</label>
            <textarea
              name="message"
              required
              minLength={5}
              rows={4}
              className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm text-ink focus:border-electric focus:outline-none"
            />
          </div>
          <button
            disabled={loading || done}
            className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud disabled:opacity-50"
          >
            {done ? "Sent ✓" : loading ? "Sending…" : "Send message"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-ink">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm text-ink focus:border-electric focus:outline-none"
      />
    </div>
  );
}