# Welcome email on signup

A branded "you're in" email sent once, right after someone creates an account — not a verification email, but a warm intro: what the platform does, how to claim a username, publish a portfolio, and where the dashboard lives. With visuals (logo/wordmark, cover image, styled buttons) matching the site's Cloud White + Electric Blue look.

## One blocker first

Sending from your own brand requires a domain you own. There is no free or shared sender address. You said you don't have one yet, so step 1 is getting a domain (Project Settings -> Domains -> Buy new domain, or any registrar). Once it's added, the sender setup runs automatically — no manual DNS records to copy.

Until then I can build the template and the trigger, but nothing will actually be delivered.

## What gets built

1. **Email infrastructure** — sending queue, retry handling, bounce/complaint suppression, and one-click unsubscribe, all set up once for the project.
2. **Welcome email template** — a React email component styled to the portfolio brand:
   - Header with wordmark and Electric Blue accent
   - Headline: welcome + the person's name/email
   - A short "here's what you can do" block: claim your username, add projects and case studies, publish, share your link
   - Primary button to the dashboard, secondary link to the public directory
   - Hero/cover visual and a clean footer
3. **Trigger on signup** — after a successful email/password signup or Google sign-in that creates a new account, the app sends the welcome email once, keyed so retries or repeat logins never double-send.
4. **Unsubscribe page** — a branded page so footer links land somewhere that looks like the site.

## Re-engagement emails

Not part of this build. Lovable's email system only supports one-to-one emails triggered by a specific person's action; bulk "come back and see this feature" campaigns need a dedicated marketing tool (Mailchimp, Loops, Resend Broadcasts). When you're ready, I can add a way to export your signed-up users so you can load them into one.

## Technical notes

- Email infra via the project's built-in email queue (pgmq + cron processor), templates as React Email components in `src/lib/email-templates/`, registered in the template registry.
- Welcome send fires from a server route so it can run for signups without a session yet; idempotency key = user id + `welcome`, so it sends exactly once per account.
- Signup call sites touched: `src/routes/auth.tsx` (password signup and Google OAuth path) and the account-claim flow in the admin profile if a portfolio is created at the same time.
- Images referenced by absolute HTTPS URLs (email clients can't load bundled assets); template body background stays white per email-client constraints, with brand color used in accents and buttons.
