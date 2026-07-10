## Goal
Redesign only the **Edit Project** admin page (`src/routes/_authenticated/admin.projects.$id.tsx`) into a polished, sectioned CMS-style editor. Preserve all existing data, routes, auth, and the public site's current appearance. Extend the schema minimally (additive only) to support the new fields, and update the public project page just enough to render the new structured content when present.

## Schema changes (single additive migration)

Add nullable columns to `public.projects` — no destructive changes, existing data untouched:

- `title text` — new canonical field; backfilled from `name`. `name` stays as-is for compatibility.
- `roles text[]` — backfilled by splitting existing `role` on commas.
- `image_alt text`
- `gallery jsonb` — array of `{ url, alt, caption }`.
- `start_date date`, `end_date date`, `ongoing boolean default false`.
- `additional_links jsonb` — array of `{ label, url }`.
- `overview text` — backfilled from `description` where present.
- `challenge text` — backfilled from `problem`.
- `goals text`, `constraints text`, `learnings text`.
- `metrics jsonb` — array of `{ value, label, note }`.
- `visibility text default 'public'` — one of `public|unlisted|private`.
- `publish_date timestamptz`.
- `seo_title text`, `seo_description text`, `social_image_url text`, `canonical_url text`, `index_allowed boolean default true`.
- `archived_at timestamptz`.

Extend `content_status` enum to also allow `unlisted` and `archived` (kept alongside `draft`, `published`).

Old columns (`name`, `role`, `problem`, `description`) stay in the DB so nothing breaks; the editor writes to both old and new fields for now.

## Server function changes (`src/lib/cms/admin.functions.ts`)

- Widen `projectSchema` with the new optional fields above.
- On save, mirror writes: `title → name`, `roles → role` (joined string), `challenge → problem`, `overview → description`. Existing consumers keep working.
- Add `duplicateProject`, `archiveProject`, `setProjectStatus` server fns for the header actions.
- No changes to `listAllProjects` / `getProjectById` shape besides the extra columns flowing through.

## Public page (`src/routes/_public.projects.$slug.tsx`)

Minimal, backward-compatible tweaks only:
- Prefer `overview` over `description`, `challenge` over `problem`, when present.
- If `metrics` present, render a small metric grid above Results.
- If `gallery` present, render thumbnails below the featured image.
- Everything else unchanged.

## Editor redesign (`src/routes/_authenticated/admin.projects.$id.tsx`)

Full rewrite of this one file into a sectioned editor using existing tokens (`ink`, `cloud`, `line`, `electric`, `font-display`) — no new visual system.

**Sticky header**
- Title "Edit Project" + current project name + status badge (Draft / Published / Unlisted / Archived).
- Actions: Preview (opens `/projects/<slug>` in new tab), Save Draft, Publish/Update, More menu (Duplicate, Unpublish, Archive, Delete — all wired to real server fns, with confirm dialogs on destructive actions).
- Sticky on scroll; also mirrored as a bottom action bar on mobile.

**Layout**
- Two-column on desktop (main content left, Publishing/SEO panels right), single column on mobile.

**Sections**

1. **Project Details** — Title (required), Slug (auto-generated from title, editable, live URL preview `/{username}/projects/{slug}`, lowercase/URL-safe/uniqueness validation against sibling slugs on the owner), Short Summary (textarea + 200-char counter), Category (searchable dropdown: Crypto, Fintech, SaaS, E-commerce, Consumer, Internal Tools, Other; free-type allowed), Roles (multi-select chip input with presets + custom), Technologies & Tools (chip input, Enter/comma to add, removable, drag-reorder via `@dnd-kit/sortable`), Timeframe (start/end date + Ongoing toggle disabling end date).

2. **Media** — Featured Image (drag-and-drop zone reusing `uploadMedia`, Choose File, Import from URL, preview, Replace, Remove, type/size validation, "Recommended 16:9, ≤2MB" helper), Image Alt Text, Gallery (multi-upload, thumbnail grid, drag-reorder, per-item caption + alt, remove).

3. **Project Links** — Live Project URL, External Case Study URL (marked optional with helper text), Additional Links (repeatable list of `{label, url}` with Add/Remove/Reorder). All URL fields validated; auto-prepend `https://` on blur when missing.

4. **Case Study** — Rich-text fields for Overview, The Challenge, Goals, Constraints, Process, Solution, Results & Impact, Learnings. Rich-text editor: lightweight — use `@tiptap/react` + StarterKit + Link + Image (small install). Metrics editor under Results: repeatable cards with Value / Label / Optional note. Old `description` field is hidden from the UI but preserved; if `overview` is empty and `description` has content, prefill Overview with it on load (does not overwrite until user saves).

**Right column (desktop) — Publishing Settings**
- Status (Draft / Published / Unlisted / Archived).
- Featured toggle.
- Publish date/time.
- Visibility (Public / Unlisted / Private).
- Display order (numeric, with a note that drag-reorder on the projects list is the preferred way — out of scope for this task).

**Collapsed "SEO and Sharing" panel**
- SEO title, meta description (+counter), social image (upload/URL), canonical URL, "Allow search-engine indexing" toggle. Defaults auto-derived from title/summary/featured image when fields are empty.

**UX behaviors**
- React Hook Form + zod resolver for validation; inline field errors.
- `beforeunload` + router `blocker` when form is dirty ("You have unsaved changes").
- Toast on save success/failure; disabled buttons + spinner during save.
- Autosave draft every 30s when dirty and status is `draft` (silent, with subtle "Saved · 12:04" indicator).
- Confirm dialogs for Delete and Archive.
- All controls keyboard-accessible; visible focus rings.

## Files touched

- **New migration** — additive columns + enum extension on `public.projects`, with backfill from `name`/`role`/`problem`/`description`.
- **Edit** `src/lib/cms/admin.functions.ts` — extend schema, mirror-write old fields, add `duplicateProject` / `archiveProject` / `setProjectStatus`.
- **Rewrite** `src/routes/_authenticated/admin.projects.$id.tsx` — the new editor.
- **Small edit** `src/routes/_public.projects.$slug.tsx` — prefer new fields, render metrics/gallery when present.
- **New deps** (via `bun add`): `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@dnd-kit/core`, `@dnd-kit/sortable`, `react-hook-form`, `@hookform/resolvers`. (zod, sonner, lucide already present.)

## Explicitly out of scope

- Admin projects list drag-reorder (mentioned as a preference — separate task).
- Public site redesign.
- Templates/themes/custom domains (Phase 3).

## Verification checklist (post-build)

Create + edit + save draft + publish + unpublish + archive + duplicate + delete a project; upload/replace/remove featured image; add/remove tag chips; drag-reorder tools; add/remove/reorder gallery items and additional links; add metrics; slug uniqueness + URL validation; unsaved-changes warning; autosave indicator; existing legacy project (comma-separated tools/role) loads cleanly; public project page still renders old records unchanged and shows new structured content for updated records; mobile layout single-column with sticky bottom action bar.