import { Link, useRouterState } from "@tanstack/react-router";
import { Github, Linkedin, Twitter, Mail, Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

type Nav = { id: string; label: string; href: string };
type Settings = {
  site_name: string;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
} | null;

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };
  return { dark, toggle };
}

export function PublicShell({
  children,
  nav,
  settings,
}: {
  children: ReactNode;
  nav: Nav[];
  settings: Settings;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  const Sidebar = (
    <aside className="flex h-full w-64 shrink-0 flex-col justify-between border-r border-line bg-cloud px-6 py-8">
      <div>
        <Link to="/" onClick={() => setOpen(false)} className="block">
          <div className="font-display text-2xl leading-none text-ink">{settings?.site_name ?? "Ayo Richard Abe"}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-ink">Portfolio</div>
        </Link>
        <nav className="mt-10 flex flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.id}
              to={n.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                isActive(n.href)
                  ? "bg-surface text-ink font-medium"
                  : "text-ink-soft hover:bg-surface/60 hover:text-ink"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-muted-ink">
          {settings?.linkedin_url && (
            <a href={settings.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-electric"><Linkedin size={16} /></a>
          )}
          {settings?.github_url && (
            <a href={settings.github_url} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-electric"><Github size={16} /></a>
          )}
          {settings?.twitter_url && (
            <a href={settings.twitter_url} target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-electric"><Twitter size={16} /></a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} aria-label="Email" className="hover:text-electric"><Mail size={16} /></a>
          )}
        </div>
        <button
          onClick={toggle}
          className="flex w-full items-center gap-2 rounded-md border border-line px-3 py-2 text-xs text-ink-soft hover:bg-surface"
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
          {dark ? "Light mode" : "Dark mode"}
        </button>
        <div className="text-xs text-muted-ink">© {new Date().getFullYear()} {settings?.site_name ?? "Ayo Richard Abe"}</div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen w-full bg-cloud text-ink">
      <div className="hidden md:block">{Sidebar}</div>

      {/* Mobile header */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-cloud/90 px-4 backdrop-blur md:hidden">
        <Link to="/" className="font-display text-lg">{settings?.site_name ?? "Ayo Richard Abe"}</Link>
        <button onClick={() => setOpen((v) => !v)} aria-label="Menu" className="rounded-md p-2 text-ink">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 top-14 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-[calc(100vh-3.5rem)] w-64 bg-cloud">{Sidebar}</div>
        </div>
      )}

      <main className="min-w-0 flex-1 pt-14 md:pt-0">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-12 md:py-16">
          {children}
        </div>
      </main>
    </div>
  );
}