# Portfolio Platform

A multi-user professional portfolio platform built with React, TanStack Start, and Supabase. Authenticated users can manage a public professional portfolio, projects, case studies, blog posts, profile information, services, and contact inquiries. Published portfolios are available through username-based public routes.

## What it does

The application separates the public marketing site from individual portfolio sites:

- `/` is the platform landing page.
- `/auth` handles account access.
- `/admin/*` is the authenticated management area.
- `/u/:username/*` exposes a published user's portfolio and public content.

The current implementation is a working portfolio/CMS application rather than a generic static portfolio template. The code supports multiple portfolio owners through Supabase-backed records keyed by the authenticated user's ID.

## Current feature summary

Confirmed from the current source code:

- Email/password sign-up and sign-in.
- Google OAuth sign-in through the Lovable authentication integration.
- Password-reset email flow.
- Authenticated admin area protected by Supabase authentication.
- Portfolio identity management: username, display name, tagline, avatar, and publish state.
- Public username-based portfolio pages.
- Hero/profile information and site settings.
- Projects with publishing states, ordering, images, galleries, links, metrics, case-study data, and SEO fields.
- Case studies and public case-study pages.
- Blog posts with publishing state and SEO fields.
- Certifications, experience, skills, awards, publications, testimonials, and portfolio stats are represented in the data/public rendering layer.
- Services with categories, pricing, availability, request acceptance, featured state, ordering, and image upload.
- Public contact and service-inquiry flows.
- Authenticated message/inquiry management.
- Media uploads through Supabase Storage.
- Portfolio visitor notification by email, subject to the configured mail integration and the application's throttling logic.
- Search/social metadata and structured data on key public pages.
- Lovable Model Context Protocol (MCP) integration with portfolio-management tools.

Some data entities are clearly supported by the public rendering/data layer but do not have a dedicated management route in the current route tree. See [`docs/FEATURES.md`](docs/FEATURES.md) for the distinction.

## Technology stack

- TypeScript 5.x
- React 19
- TanStack Start / TanStack Router
- TanStack React Query
- Vite 7
- Tailwind CSS 4
- Supabase for authentication, PostgreSQL-backed data, and Storage
- Zod for server-function input validation
- TipTap for rich-text editing
- Radix UI primitives and Lucide React icons
- Lovable integrations for authentication, MCP, and mail connectivity

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how these pieces fit together.

## Repository structure

```text
src/
├── components/              Reusable UI and portfolio/landing components
├── integrations/            Supabase and Lovable integrations
├── lib/                     CMS functions, queries, configuration, MCP tools, utilities
├── routes/                  TanStack file-based routes
├── routeTree.gen.ts         Generated TanStack Router route tree
└── server.ts                Server entry/error handling wrapper

supabase/
└── config.toml              Supabase project configuration

docs/
├── ARCHITECTURE.md
├── DEVELOPMENT.md
├── FEATURES.md
└── SETUP.md
```

## Local setup

### Prerequisites

- Node.js compatible with the installed Vite/TanStack toolchain.
- npm.
- A Supabase project connected to the application.
- The environment variables described in [`docs/SETUP.md`](docs/SETUP.md).

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

The development script starts Vite.

### Other verified scripts

```bash
npm run build
npm run build:dev
npm run preview
npm run lint
npm run format
```

There is currently no test script in `package.json`, and no test runner is declared there.

## Environment configuration

The application expects Supabase and integration credentials through environment variables. Secret values must remain outside the repository. Variable names and their purposes are documented in [`docs/SETUP.md`](docs/SETUP.md).

## Deployment

The repository is configured around TanStack Start and Nitro through the Lovable Vite/TanStack configuration. The Vite configuration points the server entry at `src/server.ts` and enables the Lovable MCP plugin. A specific production hosting target is **not verifiable from the repository configuration inspected for this baseline**, so this documentation does not claim a particular deployed infrastructure.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system structure and data flow
- [`docs/FEATURES.md`](docs/FEATURES.md) — verified feature inventory and status
- [`docs/SETUP.md`](docs/SETUP.md) — local setup and environment configuration
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — development workflow and conventions
- [`CHANGELOG.md`](CHANGELOG.md) — observable project history

## Current status

**Active development / working baseline.** The repository contains a functioning portfolio platform with public portfolio rendering, authenticated management routes, Supabase-backed persistence, service inquiries, and MCP tooling. The codebase also contains legacy compatibility fields and generated integration files, so some areas need further cleanup and verification before being treated as a stable production architecture.

## Known limitations and audit notes

- No automated test command is currently defined.
- No `robots.txt` or `sitemap.xml` was found at the inspected public paths.
- Some project fields retain legacy and newer representations for backward compatibility.
- The server-side Supabase admin client bypasses Row Level Security (RLS) and therefore requires strict server-only use.
- The MCP instructions mention capabilities that are broader than the currently registered MCP tool list.
- A production deployment target and deployment pipeline were not verifiable from the inspected repository configuration.

These are documented findings, not changes made by this audit.
