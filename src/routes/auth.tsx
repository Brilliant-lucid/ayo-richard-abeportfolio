import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/cms/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign in — Admin" }] }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      try { await claimFirstAdmin(); } catch {}
      toast.success("Signed in");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-cloud p-8">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-electric">Admin</div>
          <h1 className="mt-2 font-display text-3xl text-ink">{mode === "signin" ? "Sign in" : "Create account"}</h1>
          <p className="mt-1 text-xs text-muted-ink">The first account becomes the admin automatically.</p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-ink">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-ink">Password</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none" />
        </div>
        <button disabled={loading} className="w-full rounded-full bg-ink py-2.5 text-sm font-medium text-cloud disabled:opacity-50">
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-center text-xs text-muted-ink hover:text-ink">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}