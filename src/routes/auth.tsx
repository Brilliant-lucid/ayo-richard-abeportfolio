import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign in — Admin" }] }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  // Only allow same-origin relative paths.
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  const goNext = () => {
    if (safeNext) window.location.href = safeNext;
    else navigate({ to: "/admin" });
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) goNext();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password" + (safeNext ? `?next=${encodeURIComponent(safeNext)}` : ""),
        });
        if (error) throw error;
        setResetSent(true);
        toast.success("Check your email for a reset link");
        return;
      }
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + (safeNext ?? "/admin") },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      toast.success("Signed in");
      goNext();
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
          <div className="text-xs uppercase tracking-[0.22em] text-electric">Portfolio platform</div>
          <h1 className="mt-2 font-display text-3xl text-ink">
            {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Reset password"}
          </h1>
          <p className="mt-1 text-xs text-muted-ink">
            {mode === "forgot"
              ? "Enter your email and we'll send you a link to set a new password."
              : "Sign up to create your own shareable portfolio."}
          </p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-ink">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none" />
        </div>
        {mode !== "forgot" && (
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-muted-ink">Password</label>
              {mode === "signin" && (
                <button type="button" onClick={() => { setMode("forgot"); setResetSent(false); }} className="text-[11px] text-muted-ink hover:text-ink">
                  Forgot password?
                </button>
              )}
            </div>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none" />
          </div>
        )}
        {mode === "forgot" && resetSent && (
          <p className="rounded-md border border-line bg-surface/50 px-3 py-2 text-xs text-ink-soft">
            If an account exists for {email}, a reset link is on its way. Check your inbox (and spam).
          </p>
        )}
        <button disabled={loading} className="w-full rounded-full bg-ink py-2.5 text-sm font-medium text-cloud disabled:opacity-50">
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
        {mode === "forgot" ? (
          <button type="button" onClick={() => { setMode("signin"); setResetSent(false); }} className="w-full text-center text-xs text-muted-ink hover:text-ink">
            Back to sign in
          </button>
        ) : (
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-center text-xs text-muted-ink hover:text-ink">
            {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
        )}
      </form>
    </div>
  );
}