import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, ChevronDown, ChevronUp, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { generateProjectFields, type AiAssistFields } from "@/lib/cms/ai-assist.functions";

type Props = {
  currentValues: Record<string, unknown>;
  onApply: (fields: AiAssistFields) => void;
};

const CHECKLIST: Array<{ label: string; hint: string }> = [
  { label: "Title & one-line summary", hint: "What is the project called and what does it do?" },
  { label: "Category / industry", hint: "Fintech, SaaS, Crypto, Consumer, etc." },
  { label: "Your role(s)", hint: "PM, Design, Growth, Engineering…" },
  { label: "Tools & tech", hint: "Figma, React, Postgres, WebSockets…" },
  { label: "Timeframe", hint: "Start date, end date (or ongoing)" },
  { label: "Links", hint: "Live URL, case study, deck, GitHub…" },
  { label: "Challenge / problem", hint: "What was broken or missing?" },
  { label: "Goals & constraints", hint: "What were you optimizing for? What limits?" },
  { label: "Process", hint: "Research, iterations, key decisions" },
  { label: "Solution", hint: "What you shipped" },
  { label: "Results / metrics", hint: "Concrete numbers: users, revenue, %" },
  { label: "Learnings", hint: "What surprised you or you'd do differently" },
];

export function ProjectAiAssist({ currentValues, onApply }: Props) {
  const [open, setOpen] = useState(true);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [brainDump, setBrainDump] = useState("");
  const [overwrite, setOverwrite] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = useServerFn(generateProjectFields);

  async function run() {
    if (brainDump.trim().length < 10) {
      toast.error("Add a bit more detail — even a few sentences help.");
      return;
    }
    setBusy(true);
    try {
      const res = await generate({
        data: { brainDump, existing: currentValues, overwrite },
      });
      const fields = (res as { fields: AiAssistFields }).fields;
      onApply(fields);
      const filled = Object.entries(fields).filter(
        ([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0) && v !== "",
      ).length;
      toast.success(`AI filled ${filled} field${filled === 1 ? "" : "s"}. Review before saving.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI request failed");
    } finally {
      setBusy(false);
    }
  }

  function copyChecklist() {
    const text = CHECKLIST.map((c) => `- ${c.label}: ${c.hint}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <section className="rounded-2xl border border-electric/30 bg-electric/5 p-4 md:p-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-electric/10 p-1.5 text-electric">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="font-display text-base text-ink">AI Assist</div>
            <div className="text-xs text-muted-ink">
              Dump raw notes — AI fills the fields below for you.
            </div>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-muted-ink" /> : <ChevronDown size={16} className="text-muted-ink" />}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {/* Checklist */}
          <div className="rounded-xl border border-line bg-cloud">
            <button
              type="button"
              onClick={() => setChecklistOpen((v) => !v)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ink"
            >
              <span className="font-medium">What to include (checklist)</span>
              {checklistOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {checklistOpen && (
              <div className="border-t border-line px-3 py-3">
                <ul className="space-y-1.5 text-xs text-muted-ink">
                  {CHECKLIST.map((c) => (
                    <li key={c.label}>
                      <span className="text-ink">{c.label}</span> — {c.hint}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={copyChecklist}
                  className="mt-3 inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs text-ink hover:bg-surface"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy checklist"}
                </button>
              </div>
            )}
          </div>

          <textarea
            value={brainDump}
            onChange={(e) => setBrainDump(e.target.value)}
            placeholder={`Paste anything — notes, a Loom transcript, bullet points. Example:\n\n"MeetMind is an AI interviewer I built at HNG. Role: PM + Eng. Stack: Next.js, OpenAI, Postgres. Ran 4 months. 2K users, 35% completion lift. Problem: hiring managers couldn't scale first-round interviews…"`}
            rows={7}
            disabled={busy}
            className="w-full resize-y rounded-xl border border-line bg-cloud px-3 py-2 text-sm text-ink placeholder:text-muted-ink focus:border-electric focus:outline-none disabled:opacity-60"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted-ink">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-line accent-electric"
              />
              Overwrite existing values
            </label>
            <button
              type="button"
              onClick={run}
              disabled={busy || brainDump.trim().length < 10}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-cloud hover:opacity-90 disabled:opacity-50"
            >
              {busy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              {busy ? "Thinking…" : "Fill fields with AI"}
            </button>
          </div>

          <p className="text-[11px] text-muted-ink">
            AI won't touch featured image, gallery, status, visibility, or SEO image. Always review before saving.
          </p>
        </div>
      )}
    </section>
  );
}