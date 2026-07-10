import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Reset password" }, { name: "robots", content: "noindex" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery token from the URL hash automatically
    // and fires PASSWORD_RECOVERY. We also check the current session.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-cloud p-8">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-electric">Reset password</div>
          <h1 className="mt-2 font-display text-3xl text-ink">Set a new password</h1>
        </div>
        {ready && !hasSession ? (
          <div className="space-y-3">
            <p className="text-sm text-ink-soft">
              This reset link is invalid or expired. Request a new one from the sign-in page.
            </p>
            <Link to="/auth" className="block w-full rounded-full bg-ink py-2.5 text-center text-sm font-medium text-cloud">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-ink">New password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-ink">Confirm password</label>
              <input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 w-full rounded-md border border-line bg-cloud px-3 py-2 text-sm focus:border-electric focus:outline-none" />
            </div>
            <button disabled={loading || !ready} className="w-full rounded-full bg-ink py-2.5 text-sm font-medium text-cloud disabled:opacity-50">
              {loading ? "Updating…" : "Update password"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}