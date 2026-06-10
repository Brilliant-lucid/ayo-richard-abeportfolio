# v1 Build Plan — UI, Routing, Admin

Backend, schema, seed data, and design tokens are already in place. This plan covers the remaining UI, routing, data layer, and admin work.

## 1. Data layer (`src/lib/cms/`)

Server functions, one file per collection:

- `settings.functions.ts` — `getSiteSettings`, `getHero`, `listNavLinks`, `listStats`
- `projects.functions.ts` — `listProjects`, `getProjectBySlug`, admin: `upsertProject`, `deleteProject`
- `caseStudies.functions.ts` — same shape
- `blog.functions.ts` — same shape
- `testimonials.functions.ts` — `listTestimonials`, admin upsert/delete
- `contact.functions.ts` — public `submitContactMessage`, admin `listMessages`, `markRead`
- `media.functions.ts` — admin `uploadMedia` (signed upload to `media` bucket)

Public reads use `supabaseAdmin` (imported inside handler) with `.eq('status','published')` filter so SSR/prerender works without a session. Admin writes use `requireSupabaseAuth` + `is_admin()` check.

## 2. Public routes & shell

- `__root.tsx` — load fonts (Instrument Serif, Work Sans), QueryClient provider, root `<Outlet />`, root `head()` with site defaults, `onAuthStateChange` listener, theme provider (light/dark).
- Public layout component `PublicShell` with fixed 256px left sidebar (logo, nav links from CMS, theme toggle, social icons) + main content area (`max-w-5xl`).
- Routes:
  - `index.tsx` — Home: hero (portrait + stats), bento grid of featured projects (MeetMind, BuMarS, etc.), testimonials strip, contact CTA card.
  - `about.tsx` — Long-form bio, experience/skills placeholders.
  - `projects.index.tsx` — Project grid.
  - `projects.$slug.tsx` — Project detail (loader-fed og:image).
  - `case-studies.index.tsx` + `case-studies.$slug.tsx`.
  - `blog.index.tsx` + `blog.$slug.tsx`.
  - `contact.tsx` — Contact form → `submitContactMessage`.
  - `auth.tsx` — Email/password sign-in (signup disabled).

Each route defines route-specific `head()` (title, description, og). Loaders use `ensureQueryData` + `useSuspenseQuery`. Every route has `errorComponent` + `notFoundComponent`.

## 3. Admin (`_authenticated/admin/`)

Integration-managed `_authenticated/route.tsx` already gates. Admin sublayout checks `is_admin()` via server fn; non-admins see "Not authorized".

- `admin/index.tsx` — Dashboard (counts, recent messages).
- `admin/site-settings.tsx`, `admin/hero.tsx` — singleton edit forms.
- `admin/projects.index.tsx` + `admin/projects.$id.tsx` (id=`new` or uuid) — list + edit.
- Same pattern for `case-studies`, `blog`, `testimonials`, `stats`, `nav-links`.
- `admin/messages.tsx` — inbox.
- Forms: shadcn `form` + zod + react-hook-form. Rich text via Tiptap for body fields. Image upload widget calls `uploadMedia`, stores public URL.
- Status toggle (draft/published) on every editable collection.

## 4. Auth flow

- `/auth` — email/password sign-in only (signup disabled at provider level later by user).
- After sign-in, redirect to `/admin`.
- Sign-out via header button → cancel queries, clear cache, `signOut()`, navigate `/auth`.

## 5. Out of scope (placeholders only)

Experience, Skills, Marketing Work, Certifications pages — schema seeded but rendered as static stubs in About. Drag-to-reorder, media library browser, newsletter — not built.

## Validation checklist

- Home matches Editorial SaaS Aesthetic prototype (sidebar + bento grid + dark contact CTA).
- Light + dark mode token inversion works.
- Public routes prerender without auth.
- Admin can create/edit/publish a project and see it on `/projects`.
- Contact form writes to `contact_messages`; admin sees it at `/admin/messages`.
- All routes have unique `head()` metadata; detail pages derive og:image from loader.

Reply "approve" to switch to build mode.