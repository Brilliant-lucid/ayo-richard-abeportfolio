import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter, Mail, ArrowRight } from "lucide-react";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Templates", href: "#showcase" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#faq" },
      { label: "Documentation", href: "#faq" },
      { label: "Blog", href: "#showcase" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#faq" },
      { label: "Careers", href: "#about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#faq" },
      { label: "Terms of Service", href: "#faq" },
    ],
  },
];

export function LandingFooter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="border-t border-line bg-cloud">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-electric" />
              <span className="font-display text-xl text-ink">Portfolio Platform</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-ink-soft">
              One powerful link for your work, credibility and opportunities.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSent(true);
              }}
              className="mt-6 max-w-sm"
            >
              <label htmlFor="newsletter" className="text-xs font-medium uppercase tracking-[0.18em] text-muted-ink">
                Newsletter
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-full border border-line bg-surface/50 px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted-ink focus:border-electric"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-cloud transition-transform hover:scale-105"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
              {sent && <p className="mt-2 text-xs text-electric">Thanks — you're on the list.</p>}
            </form>
            <div className="mt-6 flex items-center gap-2">
              {[
                { Icon: Twitter, label: "Twitter" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Github, label: "GitHub" },
                { Icon: Mail, label: "Email" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#about"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-electric/50 hover:text-ink"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-ink">{col.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm text-ink-soft transition-colors hover:text-ink">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted-ink sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Portfolio Platform. All rights reserved.</span>
          <span>Built for professionals who ship.</span>
        </div>
      </div>
    </footer>
  );
}
