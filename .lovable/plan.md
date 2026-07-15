## Goal
Redesign only `src/routes/_public.projects.$slug.tsx` into a premium, polished case-study page. No changes to admin, editors, schema, auth, or other routes.

## Data source
Continue using `getProjectBySlug` for the current project. Add a lightweight call to `listProjects` (already cached by the projects index route) via `queryOptions` to derive Previous/Next by `display_order`. No new server functions.

## Page structure (in order)
1. Back to Projects link (kept)
2. **Hero**: category eyebrow, title (`title || name`), summary, meta row (Roles, Tools, Category, Timeframe from `start_date`/`end_date`/`ongoing`), primary CTA "View Live Project" (`live_link`), secondary "Case Study" (`case_study_link`), plus `additional_links` as labeled buttons — never raw URLs. Featured image below as a wide, rounded hero visual with `image_alt`.
3. **Key Results** — metric cards (only if `metrics[]` non-empty), rendered near top under hero.
4. **Overview** — `overview || description` (readable prose column, max-w-2xl-ish).
5. **The Challenge** — `challenge || problem`.
6. **Goals & Constraints** — two-column on desktop when both short, stacked on mobile; each hidden individually if empty.
7. **Process** — rendered as rich HTML if the stored content is HTML (via `dangerouslySetInnerHTML` inside a `prose` container), otherwise `whitespace-pre-wrap`. Detection: string starts with `<`.
8. **The Solution** — same rich/plain handling.
9. **Project Gallery** — responsive grid from `gallery[]` with captions + alt, `loading="lazy"`, fixed aspect ratio to prevent layout shift. Hidden if empty.
10. **Results and Impact** — `results` text (rich/plain). Metric cards only re-shown here if Key Results wasn't rendered up top (avoid duplication).
11. **Learnings** — `learnings` (rich/plain), hidden if empty.
12. **Project Links** — consolidated button row of live/case study/additional links with icons inferred from URL host (github, appstore, play.google, figma, generic external). Hidden if none.
13. **Prev / Next / All Projects** — derived from `listProjects` ordered by `display_order`; each shows thumbnail + title + direction label. Hide side when none.
14. **Contact CTA** — small section with heading + button opening the existing contact dialog (`openContactDialog` from `@/lib/contact-dialog-store`).
15. Footer is provided by `_public` shell — unchanged.

## Rendering helpers (local to the file)
- `RichOrPlain({ html }: { html: string })` — renders trusted admin HTML via `prose prose-neutral max-w-none` when it looks like HTML, else preserves line breaks.
- `Section({ title, children })` — semantic `<section>` with consistent heading style; caller decides whether to render (empty-state gating stays outside).
- `formatTimeframe(start, end, ongoing)` — "Mar 2024 – Present" / "2023 – 2024" / single date; hidden if all null.
- `linkIcon(url)` — returns lucide icon based on host.

## Visual/UX
- Use existing tokens (`ink`, `cloud`, `electric`, `line`, `surface`, `muted-ink`, `font-display`). No new colors.
- Wider hero image (full column width, `rounded-2xl`), generous vertical rhythm (`space-y-16` between major blocks, tighter within).
- Metadata pills instead of boxed "Meta" cards for a cleaner look.
- All external links: `target="_blank" rel="noreferrer noopener"`.
- Every section conditionally rendered — no empty headings.
- Mobile: single column, full-width CTAs, stacked metadata, prev/next stacked.
- Semantic `<article>`, `<header>`, `<section>`, single `<h1>`, `<h2>` per section.

## SEO / head
Keep existing `head()` (title, description, og:title/description/image). No changes.

## Compatibility
- Legacy records (only `name`/`description`/`problem`/`role`/`tools`) render cleanly via the `new || legacy` fallback already in place.
- URLs unchanged; route path unchanged; loader signature unchanged.

## Files touched
- `src/routes/_public.projects.$slug.tsx` — rewritten.

No other files modified. No schema changes. No new dependencies (tiptap output is plain HTML; Tailwind Typography classes already work via existing `prose` usage in RichText preview styling — if `prose` isn't configured, fallback styling is inlined via utility classes on child elements).

## Verification checklist
- Full-content project, minimal project, no metrics, no gallery, no external links, long HTML process/solution, multiple images, desktop/tablet/mobile, prev/next edges (first & last project), keyboard nav, lazy image loading, existing `/projects/<slug>` URLs still resolve.