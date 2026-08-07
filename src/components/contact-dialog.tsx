import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowUpRight, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { submitServiceInquiry } from "@/lib/cms/public.functions";
import { servicesQO } from "@/lib/cms/portfolio-queries";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { subscribeContactDialog } from "@/lib/contact-dialog-store";
import {
  FORM_SPECS,
  actionLabel,
  categoryForm,
  categoryLabel,
  priceSummary,
  type FieldSpec,
  type ServiceRow,
} from "@/lib/services-config";
import { DEFAULT_USERNAME } from "@/lib/site-url";

type Target = { service: ServiceRow | null };

export function ContactDialog({ username }: { username?: string } = {}) {
  const user = username || DEFAULT_USERNAME;
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const submit = useServerFn(submitServiceInquiry);

  const { data: services = [] } = useQuery({ ...servicesQO(user), enabled: open }) as {
    data: ServiceRow[] | undefined;
  };
  const bookable = services.filter((s) => s.status === "active" && s.accepting_requests);

  useEffect(
    () =>
      subscribeContactDialog((serviceId) => {
        setDone(false);
        setTarget(null);
        setPendingServiceId(serviceId ?? null);
        setOpen(true);
      }),
    [],
  );

  // A service id can arrive before the services list has loaded.
  useEffect(() => {
    if (!pendingServiceId) return;
    const svc = services.find((s) => s.id === pendingServiceId);
    if (svc) {
      setTarget({ service: svc });
      setPendingServiceId(null);
    }
  }, [pendingServiceId, services]);

  const spec = target ? FORM_SPECS[target.service ? categoryForm(target.service.category) : "general"] : null;
  const showChooser = !target && bookable.length > 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!spec) return;
    const fd = new FormData(e.currentTarget);
    const details: Record<string, string> = {};
    for (const f of spec.fields) {
      const v = String(fd.get(f.name) ?? "").trim();
      if (v && !["name", "email", "subject", "message"].includes(f.name)) details[f.label] = v;
    }
    setLoading(true);
    try {
      await submit({
        data: {
          username: user,
          serviceId: target?.service?.id ?? null,
          kind: target?.service ? categoryForm(target.service.category) : "general",
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          subject: String(fd.get("subject") ?? "") || target?.service?.name || "",
          message: String(fd.get("message") ?? ""),
          details,
        },
      });
      setDone(true);
      toast.success("Sent — you'll get a reply soon.");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setOpen(false), 900);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  // No services → plain contact form straight away.
  useEffect(() => {
    if (open && !target && !pendingServiceId && bookable.length === 0) setTarget({ service: null });
  }, [open, target, pendingServiceId, bookable.length]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[88vh] max-w-lg overflow-y-auto rounded-2xl bg-cloud">
        {showChooser ? (
          <>
            <DialogHeader>
              <div className="text-xs uppercase tracking-[0.22em] text-electric">Contact</div>
              <DialogTitle className="font-display text-3xl text-ink">How would you like to connect?</DialogTitle>
              <DialogDescription className="text-ink-soft">
                Choose the option that fits — you'll get a form tailored to it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {bookable.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setTarget({ service: s })}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-cloud p-4 text-left transition-colors hover:border-electric/50 hover:bg-surface"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{actionLabel(s)}</span>
                    <span className="block truncate text-xs text-muted-ink">
                      {s.name} · {categoryLabel(s.category)} · {priceSummary(s)}
                    </span>
                  </span>
                  <ArrowUpRight size={15} className="shrink-0 text-muted-ink" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTarget({ service: null })}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface/50 p-4 text-left transition-colors hover:border-electric/50"
              >
                <span>
                  <span className="block text-sm font-medium text-ink">General Inquiry</span>
                  <span className="block text-xs text-muted-ink">Something else — just send a message</span>
                </span>
                <MessageSquare size={15} className="shrink-0 text-muted-ink" />
              </button>
            </div>
          </>
        ) : spec ? (
          <>
            <DialogHeader>
              {bookable.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTarget(null)}
                  className="mb-1 inline-flex w-fit items-center gap-1.5 text-xs text-muted-ink hover:text-ink"
                >
                  <ArrowLeft size={12} /> All options
                </button>
              )}
              <div className="text-xs uppercase tracking-[0.22em] text-electric">
                {target?.service ? categoryLabel(target.service.category) : "Contact"}
              </div>
              <DialogTitle className="font-display text-3xl text-ink">
                {target?.service?.name ?? spec.title}
              </DialogTitle>
              <DialogDescription className="text-ink-soft">
                {target?.service?.short_description ||
                  "Send a message — it lands straight in the inbox and gets a reply within two business days."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-3">
              {spec.fields.map((f) => (
                <Field key={f.name} {...f} />
              ))}
              <button
                disabled={loading || done}
                className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cloud disabled:opacity-50"
              >
                {done ? "Sent ✓" : loading ? "Sending…" : target?.service ? actionLabel(target.service) : spec.submit}
              </button>
            </form>
          </>
        ) : (
          <div className="py-10 text-center text-sm text-muted-ink">Loading…</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ name, label, type = "text", required, placeholder }: FieldSpec) {
  const cls =
    "mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm text-ink focus:border-electric focus:outline-none";
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-ink">{label}</label>
      {type === "textarea" ? (
        <textarea name={name} required={required} rows={4} placeholder={placeholder} className={cls} />
      ) : (
        <input name={name} type={type} required={required} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}