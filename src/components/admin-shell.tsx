import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, FileText, Briefcase, Inbox, Settings, LogOut, Sparkles, Home } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ReactNode } from "react";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/hero", label: "Hero", icon: Sparkles },
  { to: "/admin/projects", label: "Projects", icon: Briefcase },
  { to: "/admin/case-studies", label: "Case studies", icon: FileText },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/messages", label: "Messages", icon: Inbox },
  { to: "/admin/site-settings", label: "Site settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();

  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to : pathname.startsWith(to));

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen w-full bg-cloud text-ink">
      <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-line bg-cloud px-4 py-6 md:flex">
        <div>
          <div className="px-3 font-display text-xl">Admin</div>
          <nav className="mt-8 flex flex-col gap-1">
            {items.map((it) => (
              <Link key={it.to} to={it.to} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${isActive(it.to, it.exact) ? "bg-surface text-ink font-medium" : "text-ink-soft hover:bg-surface/60"}`}>
                <it.icon size={14} /> {it.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-2 px-3">
          <Link to="/" className="flex items-center gap-2 text-xs text-muted-ink hover:text-ink"><Home size={12} /> View site</Link>
          <button onClick={signOut} className="flex items-center gap-2 text-xs text-muted-ink hover:text-ink"><LogOut size={12} /> Sign out</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-12">{children}</div>
      </main>
    </div>
  );
}