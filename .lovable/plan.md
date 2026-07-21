
## Goal

Right now `/` shows your portfolio and there's no way for a signed-in user to reach their own dashboard/profile from the public site. Make the platform truly multi-tenant on the surface: platform landing at `/`, personal portfolios at `/u/$username`, and an account affordance in the nav on every public page.

## 1. Platform landing at `/`

Rewrite `src/routes/_public.index.tsx` to be a platform marketing page (not Ayo's portfolio):

- Hero: "Create your portfolio in minutes" + primary CTA
  - Signed out → `Sign up` (goes to `/auth` in signup mode) and `Sign in`
  - Signed in → `Go to dashboard` (goes to `/admin`) and `View my portfolio` (`/u/{my-username}`)
- "How it works" (3 steps)
- "Featured portfolios" grid — a few published portfolios (pulled from `portfolios` where `is_published = true`) with avatar, display_name, tagline, link to `/u/$username`
- Footer CTA

New public server fn `listFeaturedPortfolios()` in `src/lib/cms/public.functions.ts` (publishable-key client, scoped `TO anon` on `portfolios` where `is_published = true`). Verify/adjust the existing RLS/GRANT on `portfolios` in a migration if the anon SELECT policy isn't already in place.

## 2. Personal portfolios at `/u/$username`

Create the missing `/u/$username` route tree (dashboard already links to it):

- `src/routes/u.$username.tsx` — layout that loads the owner by username + their site data (nav, settings, hero, stats), renders `PublicShell` scoped to that owner, `<Outlet />`
- `src/routes/u.$username.index.tsx` — the current home content (hero, projects & case studies, from-the-blog, testimonials)
- `src/routes/u.$username.about.tsx`, `u.$username.projects.index.tsx`, `u.$username.projects.$slug.tsx`, `u.$username.case-studies.*`, `u.$username.blog.*`

Refactor public data fns in `src/lib/cms/public.functions.ts` to take an `ownerId` (resolved from username) instead of implicit single-tenant. `getSiteData(ownerId)`, `listProjects(ownerId)`, etc. Each leaf route has its own `head()` with the owner's display_name/tagline and (for detail pages) the item's cover image as `og:image` / `twitter:image`.

404 if username doesn't exist or portfolio isn't published (and the viewer isn't the owner).

Keep the existing `_public.*` routes (Ayo's paths like `/about`, `/projects`) but redirect them to `/u/ayo/*` for backward compatibility — cleanest, since they're currently hardcoded to a single tenant.

## 3. Account menu in the public nav

Update `src/components/public-shell.tsx` (used by both `/` and `/u/$username`):

- On mount, read `supabase.auth.getUser()` (client-only) and subscribe to `onAuthStateChange` to keep the affordance in sync.
- Desktop sidebar footer + mobile top-bar:
  - Signed out → `Sign in` button (links to `/auth`)
  - Signed in → avatar + name button that opens a dropdown with:
    - Dashboard → `/admin`
    - My portfolio → `/u/{username}` (fetched once via a lightweight `getMyPortfolioSummary()` public-ish fn, or from `getMyPortfolio`)
    - Sign out (uses the existing sign-out sequence: cancel + clear queries, `supabase.auth.signOut()`, navigate to `/`)

The dropdown/menu uses existing tailwind primitives already in the shell — no new component library dependency.

## 4. Profile page in admin

New route `src/routes/_authenticated/admin.profile.tsx`:

- Form for: `username` (with availability check), `display_name`, `tagline`, `avatar_url` (uses existing `uploadMedia`), and the `is_published` toggle.
- Reuses `updateMyPortfolio` (already accepts display_name/tagline/avatar_url/is_published). Extend it to accept `username` with the same reserved-list + uniqueness validation used in `createMyPortfolio`, since username can now change.
- Add "Profile" as the first item in `src/components/admin-shell.tsx` sidebar (`/admin/profile`).

## Technical notes

- Data layer: `getSiteData`, `listProjects`, `listBlogPosts`, `listTestimonials`, `listStats`, `getHero` — every public reader takes `ownerId`. Loaders resolve `ownerId` from `params.username` via a new `getOwnerByUsername(username)` public fn (publishable-key client on `portfolios`, only rows where `is_published = true` unless the viewer is the owner).
- Admin functions already scope by `context.userId` — no changes needed there for the tenant boundary.
- `siteQueryOptions` currently exported from `src/routes/_public.tsx` becomes username-parameterized inside the `/u/$username` layout; the platform landing at `/` does not use it.
- `_public.tsx` layout keeps its role but its shell is repurposed to a lightweight "platform" shell for the landing (no per-user nav). The per-user `PublicShell` moves under the `/u/$username` layout.
- Migration (if needed): add `TO anon SELECT` policy on `portfolios` filtered by `is_published = true`, plus `GRANT SELECT ON public.portfolios TO anon`. Verify current policies before writing.

## Out of scope for this pass

- Social sharing of platform landing OG image (keep text meta only).
- Redesigning the admin dashboard beyond adding the Profile entry.
- Custom domains per user.
