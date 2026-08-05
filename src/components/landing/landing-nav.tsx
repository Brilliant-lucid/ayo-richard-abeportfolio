import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Menu, X, ArrowUpRight } from "lucide-react";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
];

export function LandingNav({ signedIn }: { signedIn: boolean | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-cloud/80 backdrop-blur-xl shadow-[0_1px_20px_-12px_rgba(15,23,42,0.4)]"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 md:px-6">
        <Link to="/" className="group inline-flex min-w-0 items-center gap-2">
          <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-electric animate-pulse" />
          <span className="truncate font-display text-lg tracking-tight text-ink md:text-xl">
            Portfolio Platform
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm text-ink-soft transition-colors hover:bg-surface/70 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <span className="mx-2 h-5 w-px bg-line" />
          {signedIn ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cloud transition-transform hover:scale-[1.03]"
            >
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          ) : (
            <>
              <Link to="/auth" className="rounded-full px-3.5 py-2 text-sm text-ink-soft hover:text-ink">
                Sign In
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cloud shadow-lg shadow-ink/15 transition-transform hover:scale-[1.03]"
              >
                Create Portfolio <ArrowUpRight size={14} />
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-cloud/95 px-5 pb-5 pt-3 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm text-ink-soft hover:bg-surface/70 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            {signedIn ? (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-cloud"
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-full border border-line px-4 py-2.5 text-sm text-ink"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-cloud"
                >
                  Create Portfolio <ArrowUpRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}