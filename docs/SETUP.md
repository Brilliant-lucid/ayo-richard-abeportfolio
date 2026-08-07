# Local Setup

This guide documents the setup that can be verified from the repository. Secret values are intentionally omitted.

## Prerequisites

- Node.js.
- npm.
- A Supabase project.
- Supabase Auth configured for the authentication methods you intend to use.
- Supabase Storage with the `media` bucket expected by the upload code.
- External Lovable/Google Mail integration credentials if email notifications are required.

The repository does not declare an `engines` field in `package.json`, so an exact Node.js version is not specified there. The toolchain currently declares Vite 7, TypeScript 5.8, React 19, and TanStack Start 1.x.

## Installation

From the repository root:

```bash
npm install
```

## Environment variables

The application reads the following environment variables in source code. Values must be supplied through the local/deployment environment and must not be committed.

### Supabase

| Variable | Purpose | Used by |
|---|---|---|
| `VITE_SUPABASE_URL` | Browser/build-time Supabase URL. | `src/integrations/supabase/client.ts` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser/build-time Supabase publishable key. | `src/integrations/supabase/client.ts` |
| `SUPABASE_URL` | Server-side Supabase project URL. | Server client/auth middleware |
| `SUPABASE_PUBLISHABLE_KEY` | Server-side publishable key used by authenticated server functions. | `src/integrations/supabase/auth-middleware.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase service-role credential used by the elevated admin client. | `src/integrations/supabase/client.server.ts` |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project reference used by the MCP OAuth issuer configuration. | `src/lib/mcp/index.ts` |

### Mail integration

| Variable | Purpose | Used by |
|---|---|---|
| `LOVABLE_API_KEY` | Credential for the Lovable connector gateway used for Google Mail requests. | `src/lib/cms/public.functions.ts` |
| `GOOGLE_MAIL_API_KEY` | Credential for the Google Mail connector connection. | `src/lib/cms/public.functions.ts` |

Do not put actual credentials in documentation, source code, or committed `.env` files.

## Supabase configuration

The repository contains `supabase/config.toml` with the project reference. The generated application types are in `src/integrations/supabase/types.ts`.

The source code expects Supabase Auth, PostgreSQL tables, and a Storage bucket named `media` to be available. The repository audit did not establish a complete clean-database bootstrap procedure from migrations, so a developer should use the project's connected Supabase environment or inspect the Supabase history before attempting a fresh database reconstruction.

## Development server

```bash
npm run dev
```

This maps to `vite dev` in `package.json`.

## Build

Production-style build:

```bash
npm run build
```

Development-mode build:

```bash
npm run build:dev
```

Preview the built application:

```bash
npm run preview
```

The Vite configuration delegates most TanStack Start/Nitro setup to `@lovable.dev/vite-tanstack-config` and uses `src/server.ts` as the server entry.

## Code quality

Run ESLint:

```bash
npm run lint
```

Format the repository with Prettier:

```bash
npm run format
```

## Tests

There is currently no `test` script in `package.json`, and no test runner was verified during this audit. Do not document a test command until one is added to the project.

## Authentication setup

The application supports:

1. Email/password registration.
2. Email/password login.
3. Google OAuth.
4. Password reset.

The exact Google OAuth provider configuration is external to the repository and must be configured in the connected authentication environment.

## Email notifications

Contact and visitor notifications can use the Lovable Google Mail connector. If the relevant credentials are absent, the source code skips notification delivery rather than exposing a credential or failing the main portfolio operation in several notification paths.

## Storage

Authenticated uploads are handled through `uploadMedia` in `src/lib/cms/admin.functions.ts`. Files are uploaded to the Supabase Storage bucket `media` using a path scoped to the authenticated user ID.

## MCP setup

The application exposes an MCP (Model Context Protocol) endpoint at `/mcp`. The Vite configuration enables the Lovable MCP plugin, while the MCP implementation uses Supabase OAuth issuer metadata.

MCP clients must authenticate as supported by the configured OAuth issuer. No secret client credentials are documented here.

## Troubleshooting checklist

If the application fails to start or authenticate locally:

1. Confirm all required Supabase environment variables exist.
2. Confirm the values point to the intended Supabase project.
3. Confirm Supabase Auth is configured for the providers being tested.
4. Confirm the database schema matches the generated `src/integrations/supabase/types.ts` expectations.
5. Confirm the `media` Storage bucket exists if testing uploads.
6. Run `npm run lint` to identify source-level issues.
7. Run `npm run build` to verify the production build path.

## Production deployment

A complete production deployment target was not verifiable from the inspected repository. The project is configured for TanStack Start/Nitro through the Lovable configuration package, but this document intentionally does not prescribe a hosting provider without repository evidence.
