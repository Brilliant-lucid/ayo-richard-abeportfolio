## Context / one correction

This app is **TanStack Start (React)**, not Laravel — there are no controllers, Blade views, or middleware. The equivalents are route files in `src/routes/` and server functions in `src/lib/cms/`. Everything below maps your requests onto that stack.

On URLs: wildcard subdomains (`username.example.com`) are not available on Lovable hosting — only individually connected domains. So I'll use the dedicated, independent portfolio URL space you allowed as an alternative:

```text
/                         platform landing + directory
/u/ayo                    a user's portfolio home
/u/ayo/projects           /u/ayo/projects/meetmind
/u/ayo/case-studies       /u/ayo/case-studies/<slug>
/u/ayo/blog               /u/ayo/blog/<slug>
/u/ayo/about
```

If you later connect a real custom domain per user, this same structure can be mapped to a subdomain without another rewrite.

## 1. Portfolio route namespace

Today only `/u/$username` exists (a single long page), while `/projects/$slug`, `/blog/$slug`, `/case-studies/$slug` are legacy single-tenant routes hardcoded to the default user "richard". That's why portfolio cards either 404 or show the wrong person's content.

- Convert `u.$username.tsx` into a layout route that loads the portfolio + site data once and renders the shared shell + `<Outlet />`.
- Add leaf routes: `index` (portfolio home), `about`, `projects`, `projects/$slug`, `case-studies`, `case-studies/$slug`, `blog`, `blog/$slug` — all under `/u/$username`.
- All data comes from the existing `public.functions.ts` server functions, passing `username` through, so a project of user A is never reachable under user B.
- Keep the old `/projects/*`, `/blog/*`, `/case-studies/*` paths working as **redirects** to the default portfolio's new URL, so existing shared links and search results don't break.
- All pages stay fully public (no auth), server-rendered.

## 2. Navigation

- Inside a portfolio, nav links, "back" buttons, prev/next project, and the logo all resolve to `/u/$username/...` — never to the platform landing page.
- When signed in and viewing your own portfolio, "Home" goes to your portfolio home; the account menu keeps Dashboard / Profile. Only **Sign out** returns to `/`.
- The platform landing page never auto-redirects into a portfolio.

## 3. Share links

- A small "Copy link" / Share control on each project, case study, and blog post page (and on the cards' hover state), copying the absolute public URL with a toast confirmation.
- Uses the Web Share API on mobile where available, clipboard copy otherwise.

## 4. OG / SEO metadata

Partially present today (blog detail has some tags), but titles are hardcoded to one person, and canonical / `og:url` / `twitter:image` / absolute image URLs are missing — which is why previews are wrong or blank.

Per public page, generated from loader data:
- `title`, `meta description`
- `og:title`, `og:description`, `og:image` (absolute URL from the item's featured/cover image), `og:type` (`article` for blog, `website`/`profile` otherwise), `og:url`
- `twitter:card = summary_large_image`, `twitter:image`
- `<link rel="canonical">` self-referencing the page
- JSON-LD: `Article` for blog posts, `CreativeWork` for projects/case studies, `Person` for the portfolio home
- Absolute URLs built server-side from the request origin so LinkedIn / X / WhatsApp / Facebook / Slack / Discord all resolve the image.

Note: platforms cache previews, so a re-share may need a refresh in their debugger.

## 5–6. Clickable cards

- Case study cards and blog cards on the portfolio home and index pages become links to their detail pages (blog cards are currently plain `div`s — that's the bug).
- Project cards keep working but now point at the username-scoped URL.

## 9. Review pass

- Verify every card, back button, and nav item resolves within the right portfolio.
- Confirm unauthenticated access to every public page, including direct deep links and refresh.
- Confirm draft/unpublished content and unpublished portfolios stay hidden (404).
- Update `sitemap.xml` to list published portfolios and their items.

## Technical notes

- New/edited files: `src/routes/u.$username.tsx` (→ layout), new `u.$username.*.tsx` leaves, redirect stubs for the old `_public.*` detail routes, `src/components/public-shell.tsx` (username-aware nav), a small `share-button` component, and an origin helper server fn for absolute URLs.
- `src/lib/cms/public.functions.ts` already accepts `username` on every read; no schema changes needed.
