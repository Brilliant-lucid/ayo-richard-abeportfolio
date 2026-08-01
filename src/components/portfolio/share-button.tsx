import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Share this page"
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
      }
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />} {copied ? "Copied" : "Share"}
    </button>
  );
}
