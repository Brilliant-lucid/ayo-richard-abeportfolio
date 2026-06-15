# Multi-tenant Portfolio Platform

Convert the current single-owner site into a platform where anyone can sign up, edit their own portfolio in a settings dashboard, and get a shareable link.

## Defaults I picked

- **Shareable URL**: `yoursite.com/u/<username>`. No DNS / wildcard subdomain work; works immediately on the existing domain. Each user picks their username at signup and gets a "Copy share link" button in settings.
- **Existing content**: Richard becomes the first user. All current data (hero, projects, case studies, blog, etc.) is migrated under his account and served at `/u/richard`. The root `/` becomes a platform landing page (intro + "Create your portfolio" CTA + featured published portfolios).
- **Signup**: Open to anyone. Email/password + Google (already wired).
- **Publishing**: Each portfolio has a `is_published` toggle. Unpublished portfolios are private (only the owner can view); published ones are reachable at `/u/<username>` by anyone with the link.

If any default is wrong, tell me before phase 1 starts.

## Phases

### Phase 1 — Auth, ownership, settings dashboard
1. New `portfolios` table: `owner_id` (FK auth.users, unique), `username` (unique, slug), `display_name`, `tagline`, `avatar_url`, `is_published`, timestamps. Seed Richard with `username='richard'`.
2. Add `owner_id uuid` (FK auth.users) to every CMS table: `hero`, `projects`, `case_studies`, `blog_posts`, `experience`, `certifications`, `skills`, `stats`, `testimonials`, `marketing_work`, `nav_links`, `site_settings`. Backfill existing rows to Richard.
3. Rewrite RLS: owners can full-CRUD their own rows; public can SELECT only rows belonging to a published portfolio. Drop the admin-only write policies.
4. Replace `/admin/*` with `/settings/*` — same editors, scoped to `auth.uid()`. Remove the "claim first admin" / `user_roles` admin gate; every signed-in user is just the owner of their own portfolio.
5. Onboarding: after signup, if the user has no `portfolios` row, prompt for a username (validated unique + slug-safe + reserved words blocked) and create it.
6. Settings home shows the user's shareable link with a Copy button and a Publish toggle.

### Phase 2 — Public shareable portfolio routes
1. Move public routes under `/u/$username/...`:
   - `_public.u.$username.index.tsx` (home)
   - `.projects.index.tsx` + `.$slug.tsx`, `.case-studies.*`, `.blog.*`, `.about.tsx`
2. Public server fns gain a `username` arg, look up the portfolio, return 404 if missing/unpublished.
3. Root `/` becomes the platform landing: hero, "Create your portfolio" CTA, featured published portfolios.
4. Redirect old paths (`/projects`, `/blog`, etc.) → `/u/richard/...` so existing links keep working.
5. Per-portfolio SEO: `head()` reads owner's display name + tagline + avatar for OG tags (so shared links preview nicely on WhatsApp/Twitter/LinkedIn).

### Phase 3 — Polish & templates (later)
1. Preview-vs-published distinction in settings (edit draft, then publish).
2. Theme picker / template variants (current layout = "Default", add 1–2 more).
3. Custom domain mapping per portfolio (user-owned domain → their `/u/<username>`).
4. Username change with redirect from old slug.

## Technical notes

- Every CMS table: `owner_id uuid not null references auth.users(id) on delete cascade`, indexed. Composite unique on `(owner_id, slug)` so two users can both have `/projects/my-app`.
- Storage `media` bucket: paths reworked to `<userId>/...`; RLS so users write only under their own prefix, public read.
- Public server fns stay admin-elevated (`supabaseAdmin` loaded inside the handler) with explicit `owner_id` + `is_published` filters. No broad `anon` policies. Authed writes use `requireSupabaseAuth` and force `owner_id = context.userId`.
- Username regex `^[a-z0-9][a-z0-9-]{1,30}$`; reserved: `admin`, `auth`, `api`, `u`, `settings`, `about`, `projects`, `case-studies`, `blog`, `contact`.
- Phase 1 migration: add `owner_id` nullable → backfill to Richard → set NOT NULL → swap RLS. Single transaction, no data loss.
- Removed: `is_admin()`, `claim_first_admin()`, `user_roles` table, `/admin` gate. Ownership via `auth.uid() = owner_id` replaces role checks. (A `platform_admin` role can be re-added later for moderation.)

## What you'll see after phase 1

- `/` still shows Richard's portfolio (landing page comes in phase 2).
- Sign up at `/auth` → pick a username → land on `/settings` with empty editors for your own portfolio + a "Copy share link" showing `yoursite.com/u/<your-username>`.
- Old `/admin` URLs redirect to `/settings`.
- Your edits only touch your own rows; Richard's content stays untouched.

Approve and I'll start phase 1.
