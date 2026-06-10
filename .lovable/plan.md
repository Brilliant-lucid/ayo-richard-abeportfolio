## Goal

Ship a premium, CMS-driven portfolio for Ayo Richard Abe — core public pages live, single-admin dashboard editing the highest-leverage content. Everything else stubbed against the same schema so we can expand without redesign.

## v1 scope

### Public pages (live, fully styled)
- **Home** — sidebar nav, hero (photo beside name + role line + intro + 2 CTAs), stats strip, What I Do, featured projects bento (5 tiles), featured case studies, recent blog posts, testimonial, contact CTA
- **About**
- **Projects** (index + dynamic `/projects/$slug`)
- **Case Studies** (index + dynamic `/case-studies/$slug`)
- **Blog** (index + dynamic `/blog/$slug`)
- **Contact** (info + validated form → stored in DB)

### Editable via CMS in v1
Hero content, Site Settings (name, social, contact), Projects, Case Studies, Blog Posts, Testimonials, Stats, Navigation visibility.

### Stubbed pages (route exists, hardcoded content, schema ready for v2)
Experience, Skills, Marketing Work, Certifications.

## Design

Build the **Editorial SaaS Aesthetic** prototype faithfully:
- Tokens verbatim into `src/styles.css`: bg `#fafbfc`, surface `#e8ecf1`, muted `#94a3b8`, accent `#3b82f6`, foreground `#0f172a` (zinc-900)
- Fonts: Instrument Serif (display) + Work Sans (body), loaded via `<link>` in `__root.tsx`
- Composition locked: fixed 256px left sidebar, max-w-5xl main content, 12-col bento for featured projects, dark navy contact CTA card
- Light + dark mode toggle (footer of sidebar); dark mode is an inversion of these tokens, not a separate direction

## Architecture (technical)

### Backend — Lovable Cloud
**Tables** (all RLS-enabled):

| Table | Public read | Auth required for write |
|---|---|---|
| `site_settings` (single row) | ✅ | admin only |
| `hero` (single row) | ✅ | admin only |
| `stats` | ✅ published | admin only |
| `projects` | ✅ published | admin only |
| `case_studies` | ✅ published | admin only |
| `blog_posts` | ✅ published | admin only |
| `testimonials` | ✅ | admin only |
| `nav_links` | ✅ visible | admin only |
| `contact_messages` | ❌ | insert open / read admin only |
| `experience`, `skills`, `certifications`, `marketing_work` | ✅ published | admin only (schema only in v1) |
| `user_roles` (enum: admin) | self-read | service-role only |

All public read goes through public server fns using `supabaseAdmin` with explicit column/WHERE filters (status='published'), not broad `anon` policies. Writes go through `requireSupabaseAuth` server fns that check `has_role(auth.uid(),'admin')`.

**Auth**: email/password only. Signup disabled (admin seeded via a one-time migration + manual `user_roles` insert). Single `/auth` route → on success, redirect to `/admin`.

**Storage**: one public bucket `media` for uploaded images (profile photo, project covers, blog featured images). Admin-only writes, public reads.

### Routes (TanStack Start)

```
src/routes/
  __root.tsx                         (fonts, providers, sidebar+main shell)
  index.tsx                          home
  about.tsx
  projects.index.tsx                 + projects.tsx (layout w/ Outlet)
  projects.$slug.tsx
  case-studies.index.tsx             + case-studies.tsx
  case-studies.$slug.tsx
  blog.index.tsx                     + blog.tsx
  blog.$slug.tsx
  contact.tsx
  experience.tsx  skills.tsx  marketing.tsx  certifications.tsx   (stub pages)
  auth.tsx
  _authenticated/route.tsx           (integration-managed)
  _authenticated/admin.tsx           admin layout (sidebar)
  _authenticated/admin.index.tsx     dashboard overview
  _authenticated/admin.hero.tsx
  _authenticated/admin.site.tsx
  _authenticated/admin.projects.tsx + admin.projects.$id.tsx (edit)
  _authenticated/admin.case-studies.tsx + .$id.tsx
  _authenticated/admin.blog.tsx + .$id.tsx
  _authenticated/admin.testimonials.tsx
  _authenticated/admin.stats.tsx
  _authenticated/admin.messages.tsx
```

Every leaf gets its own `head()` with route-specific title, description, og:title, og:description. Dynamic routes derive og:image from loader data (project cover, blog featured image). Canonical on leaves only.

### Data layer
- Server fns in `src/lib/cms/*.functions.ts`: public `list*` / `get*BySlug` (admin client, filtered to published) + protected `upsert*` / `delete*` / `uploadMedia` (auth middleware + role check).
- Loaders use `ensureQueryData` + `useSuspenseQuery`; mutations use `useMutation` + invalidate keys.
- Public route loaders call only public server fns (never `requireSupabaseAuth`) so SSR/prerender works.

### Admin UX
- Sidebar with sections, each list view: table + "New" button + row click → edit form
- Forms built with shadcn `form` + zod validation, image upload via storage helper
- Status: draft/published toggle on every editable item
- Rich text: Tiptap for blog post body and case-study sections
- Save = upsert + toast + invalidate queries

### Reusable components
`HeroBlock`, `StatsStrip`, `ProjectBentoCard`, `ProjectCard`, `CaseStudyCard`, `BlogCard`, `TestimonialCard`, `ContactCTA`, `Sidebar`, `AdminShell`, `ImageUploader`, `RichTextEditor`, `StatusBadge`, `RelatedContent`.

### Seed data
Five projects (MeetMind, BuMarS, Credan, Lucid Tech Internship Tracker, ISLO Markets) preloaded as published rows, plus hero text, default site settings, 4 stats, 2 sample case studies + 2 sample blog posts so the site looks complete on first visit.

## Out of scope for v1 (next iteration)
- CMS editing for Experience, Skills, Marketing Work, Certifications (schema exists, public pages will be hardcoded placeholders linking to the data once admin UIs ship)
- Image library / media browser (uploads work, but no gallery view)
- Drag-to-reorder
- Newsletter, Speaking, Resources expansion pages

## Validation checklist before "done"
- Home matches the prototype composition (sidebar width, bento layout, dark contact card)
- Profile photo in hero (never sidebar), above hero text on mobile
- Light + dark mode toggle works and persists
- Public routes prerender without auth
- Admin can sign in, edit hero/project/blog, upload an image, publish, and see it live
- Contact form writes a row admins can read in `/admin/messages`
- Lighthouse mobile passes, og tags present per route
