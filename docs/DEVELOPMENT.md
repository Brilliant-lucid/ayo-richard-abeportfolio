# Development Guide

## Repository structure

The application is organized as a TanStack Start project:

```text
src/
├── components/              Shared UI and portfolio/landing components
├── integrations/            Supabase and Lovable integrations
├── lib/
│   ├── cms/                 Server functions and portfolio queries
│   ├── mcp/                 Model Context Protocol tools and configuration
│   ├── services-config.ts   Service categories/form/pricing configuration
│   └── site-url.ts          Public URL helpers
├── routes/                  File-based TanStack routes
└── server.ts                Server entry/error wrapper
```

Generated files include the TanStack route tree and Supabase-generated types/client files. Follow their source comments and do not edit generated files directly unless the generating workflow explicitly requires it.

## Development commands

Verified commands from `package.json`:

```bash
npm run dev
npm run build
npm run build:dev
npm run preview
npm run lint
npm run format
```

There is no verified automated test command in the current package manifest.

## Coding conventions observed

### TypeScript

The project uses TypeScript with strict mode enabled in `tsconfig.json`. It uses ES modules, bundler module resolution, a React JSX transform, and the `@/*` path alias to `src/*`.

### React and routing

Routes are defined with `createFileRoute` and follow TanStack Router's file-based naming convention. Route data commonly uses TanStack React Query query options and server functions.

### Server functions

Server functions are defined with `createServerFn`. Administrative operations generally use:

1. Zod input validation.
2. `requireSupabaseAuth` middleware.
3. An authenticated user ID from server-function context.
4. Supabase operations scoped to that user ID.

Public server functions resolve a published portfolio from a username and then query public content by the portfolio owner's ID.

### Validation

Zod is used for server-function input schemas. Existing schemas validate UUIDs, slugs, enum values, strings, arrays, and structured objects depending on the operation.

### Styling

The project uses Tailwind CSS utility classes. Shared UI primitives are provided through Radix-based components and project components.

### Formatting and linting

ESLint is configured for TypeScript/React and includes Prettier integration. React Hooks rules and React Refresh checks are configured. `@typescript-eslint/no-unused-vars` is explicitly disabled.

## Adding or modifying a feature

For a typical portfolio feature:

1. Identify the data entity and existing Supabase types.
2. Inspect the relevant public query/server function.
3. Inspect the corresponding authenticated admin server function and route if management is required.
4. Validate server input with Zod.
5. Scope authenticated writes to the current user's ID.
6. Add or update the public route/component when the feature is publicly visible.
7. Add route metadata when the page is publicly indexable.
8. Reuse existing media upload and service/configuration helpers where applicable.
9. Run `npm run lint`.
10. Run `npm run build`.
11. Update documentation and changelog when the behavior is meaningful.

This workflow describes the patterns already present in the repository. It is not a statement of a formal team policy.

## Important files

### Application entry/configuration

- `package.json` — scripts and dependency versions.
- `vite.config.ts` — Lovable/TanStack Start configuration and MCP plugin.
- `tsconfig.json` — TypeScript configuration and path aliases.
- `eslint.config.js` — linting rules.
- `src/server.ts` — server entry/error handling wrapper.

### Authentication

- `src/routes/auth.tsx` — authentication UI.
- `src/routes/_authenticated/route.tsx` — authenticated route guard.
- `src/integrations/supabase/client.ts` — browser Supabase client.
- `src/integrations/supabase/auth-middleware.ts` — server authentication middleware.
- `src/integrations/supabase/client.server.ts` — elevated server-side Supabase client.

### CMS/application services

- `src/lib/cms/admin.functions.ts` — authenticated management operations.
- `src/lib/cms/public.functions.ts` — public/server-side portfolio data operations.
- `src/lib/cms/portfolio.functions.ts` — portfolio-specific management operations.
- `src/lib/cms/portfolio-queries.ts` — React Query data definitions.
- `src/lib/services-config.ts` — service categories, pricing, locations, and form behavior.

### Public portfolio

- `src/routes/u.$username.tsx` — public portfolio shell and visitor notification behavior.
- `src/routes/u.$username.index.tsx` — public portfolio homepage.
- `src/routes/u.$username.projects.$slug.tsx` — public project detail page.
- `src/components/portfolio/*` — public portfolio presentation components.

### MCP

- `src/routes/mcp.ts` — MCP HTTP route.
- `src/lib/mcp/index.ts` — MCP definition and registered tools.
- `src/lib/mcp/tools/*` — individual MCP tools.

## Database considerations

Supabase is the source of persistence. The generated database types should be treated as the current application-facing schema contract, but they are generated artifacts rather than the database's migration history.

The project model contains legacy and newer fields together. For example, project writes mirror newer fields into older columns for backward compatibility. Developers changing the project model should understand both representations before modifying schema or server logic.

## Security considerations

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.
- Keep Lovable and mail connector credentials out of source control.
- Use the existing authentication middleware for authenticated server operations.
- Preserve owner scoping on administrative database queries.
- Treat generated Supabase admin client code as server-only.
- Be careful when changing public server functions because they intentionally use elevated database access to resolve published portfolio data.

## Generated files

The following kinds of files are generated and explicitly marked as such in the repository:

- `src/routeTree.gen.ts` — generated by TanStack Router.
- `src/integrations/supabase/types.ts` — generated Supabase database types.
- `src/integrations/supabase/client.ts` and related generated Supabase integration files.
- `src/routes/mcp.ts` — generated by the Lovable MCP Vite plugin.

Do not make manual edits to generated files unless the generation process is intentionally being changed.

## Testing and verification

No automated test suite was verified. Until one exists, the minimum source-change verification path is:

```bash
npm run lint
npm run build
```

For changes involving authentication, Supabase, Storage, MCP, or external mail services, static checks alone are not sufficient to prove the external integration works. Those flows require an appropriately configured environment for end-to-end verification.

## Branching and Git workflow

The repository does not contain a sufficiently explicit branching policy to document one as an established team rule. The current audit was performed on `feat/ai-code-review-agent`, as requested. Future feature work should continue to follow the repository's actual Git workflow rather than assuming a policy that is not documented.

## Current development considerations

- There are no automated tests in the package scripts.
- Several public profile entities have rendering support without an obvious dedicated admin CRUD route.
- The project data model carries legacy compatibility fields.
- MCP instructions and registered tools are not fully aligned.
- A complete deployment pipeline is not verifiable from the repository.
- SEO metadata exists, but root `robots.txt` and `sitemap.xml` were not found.
