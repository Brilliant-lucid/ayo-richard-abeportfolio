import { Link, useRouterState } from "@tanstack/react-router";
import { Github, Linkedin, Twitter, Mail, Moon, Sun, Menu, X, LogIn, LayoutDashboard, User, LogOut } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { openContactDialog } from "@/lib/contact-dialog-store";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

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

type MePortfolio = { username: string; display_name: string | null; avatar_url: string | null } | null;

function useMe() {
  const [me, setMe] = useState<{ id: string; email: string | null } | null | undefined>(undefined);
  const [portfolio, setPortfolio] = useState<MePortfolio>(null);
  useEffect(() => {
    let alive = true;
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!alive) return;
      if (!data.user) { setMe(null); setPortfolio(null); return; }
      setMe({ id: data.user.id, email: data.user.email ?? null });
      const { data: p } = await supabase
        .from("portfolios")
        .select("username, display_name, avatar_url")
        .eq("owner_id", data.user.id)
        .maybeSingle();
      if (alive) setPortfolio(p ?? null);
    }
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);
  return { me, portfolio };
}

function AccountMenu({ compact }: { compact?: boolean }) {
  const { me, portfolio } = useMe();
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();

  async function signOut() {
    setOpen(false);
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  if (me === undefined) {
    return <div className={compact ? "h-8 w-16 animate-pulse rounded-full bg-surface" : "h-9 w-full animate-pulse rounded-md bg-surface"} />;
  }

  if (me === null) {
    return (
      <Link
        to="/auth"
        className={compact
          ? "inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-cloud hover:opacity-90"
          : "flex w-full items-center justify-center gap-2 rounded-md bg-ink py-2 text-xs font-medium text-cloud hover:opacity-90"}
      >
        <LogIn size={12} /> Sign in
      </Link>
    );
  }

  const label = portfolio?.display_name || me.email || "Account";
  const initial = (portfolio?.display_name || me.email || "?").charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={compact
          ? "flex items-center gap-2 rounded-full border border-line px-2 py-1 text-xs text-ink hover:bg-surface"
          : "flex w-full items-center gap-2 rounded-md border border-line px-2 py-1.5 text-xs text-ink hover:bg-surface"}
      >
        {portfolio?.avatar_url ? (
          <img src={portfolio.avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-cloud">{initial}</span>
        )}
        <span className="max-w-[110px] truncate">{label}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={`absolute z-50 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-cloud shadow-lg ${compact ? "right-0" : "left-0"}`}>
            <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs text-ink hover:bg-surface">
              <LayoutDashboard size={12} /> Dashboard
            </Link>
            {portfolio && (
              <Link
                to="/u/$username"
                params={{ username: portfolio.username }}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-ink hover:bg-surface"
              >
                <User size={12} /> My portfolio
              </Link>
            )}
            <Link to="/admin/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs text-ink hover:bg-surface">
              <User size={12} /> Profile settings
            </Link>
            <button onClick={signOut} className="flex w-full items-center gap-2 border-t border-line px-3 py-2 text-left text-xs text-ink hover:bg-surface">
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
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
          {nav.map((n) => {
            const cls = `rounded-md px-3 py-2 text-sm text-left transition-colors ${
              isActive(n.href)
                ? "bg-surface text-ink font-medium"
                : "text-ink-soft hover:bg-surface/60 hover:text-ink"
            }`;
            if (n.href === "/contact") {
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => { setOpen(false); openContactDialog(); }}
                  className={cls}
                >
                  {n.label}
                </button>
              );
            }
            return (
              <Link key={n.id} to={n.href} onClick={() => setOpen(false)} className={cls}>
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="space-y-4">
        <AccountMenu />
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
        <div className="flex items-center gap-2">
          <AccountMenu compact />
          <button onClick={() => setOpen((v) => !v)} aria-label="Menu" className="rounded-md p-2 text-ink">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
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