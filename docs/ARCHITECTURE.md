# Architecture

## Overview

The application is a React/TypeScript professional portfolio platform built with TanStack Start. TanStack Router provides file-based routing, TanStack React Query handles client/server data loading and caching, and Supabase provides authentication, database persistence, and file storage.

The repository contains both platform-level pages and multi-user portfolio pages. A portfolio is resolved by its username, while authenticated management operations are scoped to the authenticated Supabase user ID.

## Major layers

```text
Browser
  |
  +--> Public platform routes (/)
  |
  +--> Public portfolio routes (/u/:username/*)
  |
  +--> Auth routes (/auth, /reset-password)
  |
  +--> Authenticated admin routes (/admin/*)
          |
          v
   TanStack Start server functions
          |
          +--> Supabase authenticated client / auth middleware
          |
          +--> Supabase admin client for trusted server operations
          |
          v
   Supabase Auth + PostgreSQL + Storage
```

## Routing

The generated TanStack Router tree confirms these main route families:

### Public/platform

- `/` — platform landing page.
- `/about` — platform/about page.
- `/contact` — platform contact page.
- `/projects` and `/projects/:slug` — platform-level project routes.
- `/case-studies` and `/case-studies/:slug` — platform-level case-study routes.
- `/blog` and `/blog/:slug` — platform-level blog routes.

### Authentication

- `/auth` — sign-in, sign-up, Google OAuth, and password-reset request UI.
- `/reset-password` — password reset destination.

### Public portfolio

- `/u/:username` — portfolio shell and public navigation.
- `/u/:username/about`
- `/u/:username/projects`
- `/u/:username/projects/:slug`
- `/u/:username/case-studies`
- `/u/:username/case-studies/:slug`
- `/u/:username/blog`
- `/u/:username/blog/:slug`

A public portfolio is only resolved when the corresponding `portfolios` record is published.

### Authenticated administration

The `/admin` route is nested under an authentication guard. Confirmed child routes include:

- `/admin`
- `/admin/profile`
- `/admin/hero`
- `/admin/site-settings`
- `/admin/projects`
- `/admin/projects/:id`
- `/admin/blog`
- `/admin/blog/:id`
- `/admin/case-studies`
- `/admin/services`
- `/admin/messages`

## Authentication and authorization

The client uses Supabase Auth. The auth page supports:

- Email/password sign-up.
- Email/password sign-in.
- Google OAuth through the Lovable authentication package.
- Password reset emails.

The authenticated route wrapper calls `supabase.auth.getUser()` and redirects unauthenticated users to `/auth`.

Server-side management functions use a `requireSupabaseAuth` middleware. That middleware reads a Bearer token from the request, creates a Supabase client using the publishable key, validates the token with `getClaims`, and passes the authenticated user ID into the server-function context.

A separate server-only Supabase admin client uses the service-role key and therefore bypasses Row Level Security (RLS). It is used by trusted server functions for operations that require elevated access. The client module itself is explicitly server-oriented and must not be exposed to browser code.

## Data model

The generated Supabase TypeScript definitions confirm a portfolio-oriented schema including, among others:

- `portfolios` — portfolio owner identity, username, display name, tagline, avatar, and publication state.
- `hero` — hero/profile presentation data.
- `site_settings` — site name, contact/social links, default SEO values, and logo.
- `nav_links` — configurable navigation entries.
- `stats` — portfolio statistics.
- `projects` — project content, publishing, ordering, media, case-study data, links, metrics, visibility, and SEO fields.
- `case_studies` — structured case-study content.
- `blog_posts` — blog content, publication state, related content, and SEO fields.
- `experience` — professional experience.
- `certifications` — certification records and credential information.
- `skills` — skills/capabilities.
- `awards` — awards.
- `publications` — publications.
- `testimonials` — testimonials.
- `marketing_work` — marketing work records.
- `contact_messages` — public contact messages associated with a portfolio.
- `services` — service offerings and service inquiry configuration.

The exact generated schema contains additional columns and relationships. The documentation intentionally describes it at a useful architectural level rather than duplicating generated TypeScript types.

## Public data flow

Public portfolio server functions first resolve a published portfolio by username. They then use the portfolio owner's ID to retrieve content.

Examples:

1. A request for `/u/:username` loads the portfolio and site data.
2. Public query functions resolve the published portfolio.
3. Related records are fetched by `owner_id`.
4. TanStack React Query caches the results for the route components.
5. Portfolio components render the returned data.

Published content is filtered by status in the public server functions. For example, published projects, case studies, blog posts, experience, certifications, awards, and publications are selected for public rendering.

## Authenticated data flow

Admin forms call TanStack Start server functions. Management functions validate input with Zod, authenticate the request with `requireSupabaseAuth`, and then perform database operations scoped to `context.userId`.

The project management layer also contains compatibility logic. New project fields can be mirrored into older columns such as `name`, `role`, `description`, and `problem`, indicating that the project schema has evolved without fully removing older representations.

## Media uploads

Authenticated media uploads use a server function that accepts `FormData`, uploads the file to the Supabase Storage `media` bucket under a user-specific path, and returns a long-lived signed URL.

This mechanism is used by profile/avatar and service management flows and is available as a shared administrative upload function.

## Public contact and service inquiries

The public portfolio includes a contact dialog. When services are available, the dialog can present bookable services and service-specific form information. Service inquiries are submitted through a server function and stored in the services/contact data layer.

A separate contact-message path remains present in the server functions, including email notification through a Lovable Google Mail connector when the required environment configuration is available.

## Visitor notifications

The public portfolio layout contains visitor-notification logic. It limits notifications to once per 12 hours per browser and portfolio using `localStorage`, excludes the portfolio owner when the visitor is authenticated as that owner, and calls a server function to notify the portfolio owner through the configured mail connector.

This is an implemented mechanism, but its actual email delivery depends on external integration credentials and service availability.

## SEO and public metadata

Several public routes generate route-level metadata including:

- HTML title.
- Meta description.
- Open Graph title/description/type/URL.
- Twitter card metadata.
- Canonical URLs.
- Schema.org JSON-LD on the platform and portfolio/project pages.
- Project social images when available.

The repository audit did not find a root `robots.txt` or `sitemap.xml` implementation. These should therefore not be described as implemented features.

## MCP integration

The repository exposes an MCP (Model Context Protocol) endpoint at `/mcp` and generated supporting discovery routes. The MCP configuration uses Supabase OAuth issuer metadata and registers tools for portfolio retrieval, projects, blog posts, messages, and hero management.

The registered tool list currently includes:

- Get portfolio.
- List/get/upsert/delete projects.
- List/upsert/delete blog posts.
- List messages.
- Update hero.

The MCP instructions mention case studies and site settings as well, but those are not present in the currently registered tool list inspected for this baseline. That mismatch is documented as a finding rather than treated as implemented MCP capability.

## Build and server architecture

`vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, configures TanStack Start to use `src/server.ts` as its server entry, and enables the Lovable MCP Vite plugin.

`src/server.ts` wraps the generated TanStack server entry and normalizes certain catastrophic server-side rendering errors into an HTML error response.

## Generated files

Some files are generated by tooling and should not be edited directly, including the TanStack route tree and generated Supabase client/type files. The source comments explicitly identify these generated files.

## Architectural findings

- The application is currently a TanStack Start full-stack application rather than a separate frontend/backend service pair.
- Supabase is the persistence/auth/storage boundary.
- Server functions form the main application service layer.
- The application uses both user-authenticated and elevated admin Supabase clients.
- The database schema contains evidence of an evolving project model with legacy compatibility fields.
- MCP is integrated directly into the TanStack application rather than as a separate service.
