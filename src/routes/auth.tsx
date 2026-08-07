import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): { next?: string } =>
    typeof s.next === "string" ? { next: s.next } : {},
  head: () => ({
    meta: [
      { title: "Sign in or create your portfolio — Portfolio Platform" },
      {
        name: "description",
        content:
          "Sign in to manage your portfolio, services and inquiries — or create a free account and publish your professional portfolio in minutes.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [resetSent, setResetSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function signInWithGoogle() {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth" + (safeNext ? `?next=${encodeURIComponent(safeNext)}` : ""),
      });
      if (result.error) {
        toast.error(result.error.message ?? "Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      goNext();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  }

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
        if (password !== confirmPassword) {
          toast.error("Passwords don't match");
          setLoading(false);
          return;
        }
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
    <div className="relative flex min-h-screen items-center justify-center bg-cloud px-4">
      <Link
        to="/"
        className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-cloud px-3 py-1.5 text-xs text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={12} /> Back to home
      </Link>
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
        {mode === "signup" && (
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-ink">Confirm password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-[11px] text-destructive">Passwords don't match</p>
            )}
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
        {mode !== "forgot" && (
          <>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-[10px] uppercase tracking-wider text-muted-ink">or</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-cloud py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.2 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.2-.4-4.6H24v9.1h12.4c-.5 2.9-2.2 5.4-4.6 7l7.2 5.6c4.2-3.9 6.6-9.7 6.6-17.1z" />
                <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.9-6.1C1 16.3 0 20 0 24s1 7.7 2.6 10.8l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2 1.4-4.6 2.2-8.7 2.2-6.3 0-11.6-3.7-13.5-9.1l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
              {googleLoading ? "Connecting…" : "Continue with Google"}
            </button>
          </>
        )}
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