## Why I can't tell you the password
Passwords are stored as one-way hashes in the auth system. Nobody — not me, not the platform — can read the original. The only options are to reset it via email or to set a new one via an admin action.

## What I'll build

### 1. "Forgot password?" on the sign-in page
On `src/routes/auth.tsx`, add a **Forgot password?** link below the password field. Clicking it swaps the form into a "reset" mode: enter email → call `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" })` → show "Check your email" confirmation.

### 2. New `/reset-password` route
Create `src/routes/reset-password.tsx` (public, `ssr: false`):
- Detects the recovery token in the URL hash that Supabase appends.
- Shows a "Set new password" form (new password + confirm).
- Calls `supabase.auth.updateUser({ password })`.
- On success: toast + redirect to `/admin`.
- Guards against being opened without a recovery session (shows "Link expired, request a new one").

### 3. Get you back in right now
As part of this change, I'll run a one-time admin password reset for your account (`ayorichardabe@…` — confirm the email on file) using the auth admin API. You pick the new password, or I generate a temporary one you change on first login. This does NOT get committed to code — it's a single privileged call.

## Technical notes
- Reset email uses the built-in Lovable Cloud auth email template — no email domain setup required for the default template to work.
- `/reset-password` must be a top-level public route (not under `_authenticated/`) so the recovery link works before the session is established.
- No schema changes, no RLS changes, no new server functions.

## What I need from you
1. Confirm the email address on your admin account so I reset the right user.
2. Either provide a new password you want set, or say "generate one" and I'll return a temporary password in chat that you change immediately after signing in.
