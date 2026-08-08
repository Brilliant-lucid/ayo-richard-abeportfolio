# Technical Debt & Security Audit

**Branch:** `feat/ai-code-review-agent`

**Audit scope:** Supabase authorization and Row Level Security (RLS), project-field migration, content-management coverage, Model Context Protocol (MCP), contact/inquiry data flow, automated testing, SEO, deployment configuration, generated files, and end-to-end authentication/upload/inquiry/email/MCP flows.

**Audit date:** 2026-08-08

## Executive summary

The repository has a coherent working architecture, but its trust boundaries are not yet as strong as they should be for a multi-user production platform.

The highest-priority issue is the application's heavy use of a Supabase **service-role client that bypasses Row Level Security (RLS)** for both authenticated management functions and public data functions. The application compensates for this in many places with explicit `owner_id` or `portfolio_id` filters, but this makes application code the primary authorization boundary. A missed filter becomes a potential cross-user data exposure or modification.

The second major area is the content model. Projects explicitly contain both legacy and newer fields and are synchronized in application code. This works as a compatibility layer, but it creates duplicated state and should eventually be replaced with one canonical representation.

The public contact and service-inquiry flows intentionally write to two tables. This preserves the existing Messages inbox, but it is a form of data duplication that can produce inconsistent state because the two inserts are not wrapped in a database transaction.

Automated tests are currently absent. As a result, authentication, authorization, ownership boundaries, uploads, inquiry routing, email notifications, public/private filtering, and MCP behavior are not protected by repeatable automated regression tests.

No application source code was modified as part of this audit.

## Severity model

- **Critical**: A credible path to secret compromise, unauthorized privileged access, or major cross-tenant exposure.
- **High**: A meaningful authorization, privacy, integrity, or availability risk that should be addressed before production hardening.
- **Medium**: Significant maintainability, correctness, abuse, or operational risk.
- **Low**: Cleanup, consistency, or developer-experience issue.
- **Needs verification**: The repository does not contain enough evidence to make a definitive claim.

---

## 1. Supabase service-role usage and Row Level Security (RLS)

### Finding: High

The repository contains a server-only Supabase client initialized with `SUPABASE_SERVICE_ROLE_KEY`. The code explicitly documents that this client bypasses RLS. [`src/integrations/supabase/client.server.ts`](../src/integrations/supabase/client.server.ts)

The authenticated CMS functions use this privileged client after `requireSupabaseAuth` validates the caller's bearer token. Examples include projects, hero, site settings, messages, media, blog posts, and services. [`src/lib/cms/admin.functions.ts`](../src/lib/cms/admin.functions.ts)

The public CMS functions also use the same privileged client for public reads and public form submissions. [`src/lib/cms/public.functions.ts`](../src/lib/cms/public.functions.ts)

### What is working

The authenticated server middleware validates the bearer token and extracts the authenticated user's ID. [`src/integrations/supabase/auth-middleware.ts`](../src/integrations/supabase/auth-middleware.ts)

Many privileged queries then explicitly scope records to `context.userId` or a portfolio ID. For example:

- Projects filter by `owner_id`.
- Hero and site settings filter by `owner_id`.
- Messages resolve the user's portfolio and filter by `portfolio_id`.
- Services filter by `owner_id`.
- Blog posts filter by `owner_id`.

This is good application-level authorization, but it is not equivalent to database-enforced isolation when the query is made with a service-role client.

### RLS status

**Needs verification.** The checked-in repository configuration exposes the Supabase project reference, and generated database types are present, but the audit could not establish the complete set of database RLS enablement statements and policies from the available repository file interface.

The MCP implementation is especially dependent on correct RLS because MCP tools use the publishable Supabase key together with the caller's bearer token rather than the service-role client. [`src/lib/mcp/supabase.ts`](../src/lib/mcp/supabase.ts)

### Required follow-up

1. Inspect every migration/schema definition for every tenant-bearing table.
2. Verify RLS is enabled on all exposed application tables.
3. Verify policies use the authenticated user identity and correct ownership relationship.
4. Verify storage policies for the `media` bucket.
5. Add automated cross-user authorization tests.
6. Consider reducing service-role usage and using the caller-scoped Supabase client where practical.
7. Keep service-role usage isolated to genuinely privileged operations such as Auth Admin API calls or controlled system workflows.

### Additional security concern

Because public functions use the service-role client, public filtering must remain perfect. A future `select("*")` or missing `status`/`owner_id` condition can bypass database-level protection.

For example, `listTestimonials` queries a published portfolio owner but does not filter testimonials by a `published` status, unlike the experience/certification/award/publication queries in the same function. [`src/lib/cms/public.functions.ts`](../src/lib/cms/public.functions.ts)

That should be verified against the actual testimonials schema and intended visibility rules.

---

## 2. Legacy vs new project fields

### Finding: Medium

The project schema contains two generations of fields.

Legacy-style fields include:

- `name`
- `role`
- `description`
- `problem`
- `solution`
- `process`
- `results`
- `tools`

Newer structured fields include:

- `title`
- `roles`
- `overview`
- `challenge`
- `goals`
- `constraints`
- `learnings`
- `metrics`
- `gallery`
- `additional_links`
- SEO fields
- visibility/publishing fields

The application explicitly mirrors selected newer values into legacy columns during project writes. [`src/lib/cms/admin.functions.ts`](../src/lib/cms/admin.functions.ts)

### Risk

There are multiple representations of the same business concepts. Future code can update one representation while reading another, creating stale or contradictory data.

The current compatibility logic only mirrors some fields. It does not establish a general synchronization mechanism for every legacy/new field pair.

### Recommendation

Before changing the schema:

1. Identify every reader of legacy fields.
2. Identify every reader of new fields.
3. Determine the canonical representation for each concept.
4. Migrate existing data once.
5. Remove compatibility writes only after all readers have been migrated.
6. Add a migration and regression tests rather than silently changing field semantics.

Do not remove legacy columns during this audit.

---

## 3. Missing admin management for professional-profile entities

### Finding: Medium

The public data layer clearly supports:

- Experience
- Certifications
- Skills
- Awards
- Publications
- Testimonials

`getPortfolioProfile` reads the first five entities for the public portfolio, and `listTestimonials` separately reads testimonials. [`src/lib/cms/public.functions.ts`](../src/lib/cms/public.functions.ts)

The generated route tree shows dedicated admin routes for profile, hero, projects, blog, case studies, services, site settings, and messages, but no corresponding admin routes for experience, certifications, skills, awards, publications, or testimonials. [`src/routeTree.gen.ts`](../src/routeTree.gen.ts)

### Status

These entities are **publicly consumable but not verified as fully manageable through the current admin UI**.

This is a product completeness issue, not automatically a security defect.

### Recommendation

Before implementing missing management interfaces, verify whether these records are:

- seeded manually,
- managed through another UI,
- populated through MCP,
- or intentionally read-only.

Then choose one canonical management path.

---

## 4. MCP instruction/tool mismatch

### Finding: Medium

The MCP instructions say the platform provides tools for:

- projects,
- case studies,
- blog posts,
- contact messages,
- hero,
- site settings.

However, the registered MCP tool list currently contains:

- `getPortfolio`
- `listProjects`
- `getProject`
- `upsertProject`
- `deleteProject`
- `listBlogPosts`
- `upsertBlogPost`
- `deleteBlogPost`
- `listMessages`
- `updateHero`

There are no registered case-study or site-settings tools in the inspected MCP registry. [`src/lib/mcp/index.ts`](../src/lib/mcp/index.ts)

### What is working

MCP tools use the caller's authentication token and explicitly verify authentication before querying data. [`src/lib/mcp/supabase.ts`](../src/lib/mcp/supabase.ts)

For example, the project list tool scopes records to the authenticated user's `owner_id`. [`src/lib/mcp/tools/list-projects.ts`](../src/lib/mcp/tools/list-projects.ts)

### Recommendation

Either:

1. register the missing tools, or
2. correct the MCP instructions to describe only the currently registered tools.

Add MCP contract tests that verify the advertised tool names match the actual registry.

---

## 5. Contact messages vs service inquiries

### Finding: Medium

The application has two related tables/flows:

- `contact_messages`
- `service_inquiries`

A service inquiry is intentionally mirrored into `contact_messages` so the existing Messages view remains useful. [`src/lib/cms/public.functions.ts`](../src/lib/cms/public.functions.ts)

### Current behavior

A service inquiry:

1. Resolves the target portfolio.
2. Validates an optional service ID belongs to that portfolio.
3. Inserts a `service_inquiries` row.
4. Inserts a derived `contact_messages` row.
5. Attempts to send an email notification.

### Risk

The two database writes are separate. If the inquiry insert succeeds but the contact-message insert fails, the system can contain a valid inquiry that is missing from the classic inbox.

Conversely, future changes to either representation can cause the two records to diverge.

### Recommendation

Choose one of these long-term models:

- **Canonical inquiry model:** Messages becomes a view/read model over inquiries and generic contacts.
- **Unified messages model:** One table represents every inbound conversation/request with typed metadata.
- **Transactional dual-write:** Keep both tables temporarily but move the dual write into a database transaction or controlled server-side operation with explicit failure handling.

Do not remove either table until all consumers have been mapped.

---

## 6. Automated tests

### Finding: High

`package.json` defines development, build, preview, lint, and format scripts, but no test script and no test runner dependency were verified. [`package.json`](../package.json)

### Risk

The application currently lacks automated regression protection for the areas with the highest consequences:

- authentication,
- user isolation,
- project ownership,
- public/private visibility,
- uploads,
- contact submissions,
- service inquiries,
- email notification behavior,
- MCP authentication and ownership.

### Recommendation

Introduce tests in stages rather than attempting a large test suite immediately:

1. Unit tests for schemas and pure helpers.
2. Server-function authorization tests.
3. Database/RLS tests for tenant isolation.
4. Public/private visibility tests.
5. MCP authentication and ownership tests.
6. Browser-level smoke tests for sign-in, project creation, upload, contact, and inquiry flows.

The first automated test milestone should focus on authorization boundaries rather than visual component coverage.

---

## 7. SEO gaps: sitemap and robots configuration

### Finding: Medium

The application has meaningful per-page metadata and structured-data implementation, including canonical URLs and social metadata on public content.

However, no repository-managed `robots.txt` or sitemap implementation was verified during the baseline audit.

### Recommendation

Implement these only after confirming the production hostname and URL strategy.

The sitemap should include only indexable public URLs and exclude:

- authentication pages,
- admin pages,
- private/unpublished content,
- MCP endpoints,
- other non-public infrastructure routes.

`robots.txt` should reflect the same canonical production URL strategy.

---

## 8. Production deployment configuration

### Finding: Medium / Needs verification

The Vite configuration uses the Lovable TanStack configuration and Nitro. The configuration comments state that Nitro uses Cloudflare as a default build target, but the repository does not establish that Cloudflare is the actual production deployment provider. [`vite.config.ts`](../vite.config.ts)

No definitive production deployment workflow was verified in the inspected repository configuration.

### Recommendation

Document the real production architecture separately from the local build configuration:

- hosting provider,
- build command,
- output/runtime target,
- environment variables,
- Supabase project/environment mapping,
- domain configuration,
- OAuth redirect URLs,
- storage configuration,
- email connector configuration,
- MCP public endpoint configuration.

Do not infer production hosting from Nitro's default target.

---

## 9. Generated-file boundaries

### Finding: Low to Medium

Several files explicitly identify themselves as generated:

- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/client.server.ts`
- `src/integrations/supabase/auth-middleware.ts`
- `src/routes/mcp.ts`
- `src/routeTree.gen.ts`

The MCP route and Supabase clients contain explicit generated-file warnings. The route tree also says it should not be manually edited. [`src/routes/mcp.ts`](../src/routes/mcp.ts), [`src/routeTree.gen.ts`](../src/routeTree.gen.ts), [`src/integrations/supabase/client.ts`](../src/integrations/supabase/client.ts), [`src/integrations/supabase/client.server.ts`](../src/integrations/supabase/client.server.ts)

The current `.gitignore` excludes build and local/generated directories such as `.tanstack`, `.nitro`, `.output`, and `dist`, but does not exclude the generated source files above. [`\.gitignore`](../.gitignore)

### Assessment

Committing generated source can be valid when the generator expects those artifacts to be versioned. The problem is not their presence alone. The issue is that the repository does not clearly document which generated source files are canonical outputs and how they should be regenerated.

### Recommendation

Document generated-file ownership:

- which files are generated,
- which command regenerates them,
- whether they are expected to be committed,
- which files developers must never edit manually.

Do not delete or ignore these files without confirming the Lovable/TanStack build workflow.

---

## 10. End-to-end flow audit

### 10.1 Authentication

**Code status: implemented, runtime verification pending.**

The authentication UI supports:

- email/password sign-in,
- email/password registration,
- Google OAuth,
- password reset.

The authenticated server middleware verifies bearer tokens and derives the user ID. [`src/routes/auth.tsx`](../src/routes/auth.tsx), [`src/integrations/supabase/auth-middleware.ts`](../src/integrations/supabase/auth-middleware.ts)

The redirect destination is restricted to same-origin relative paths, which reduces open-redirect risk in the `next` parameter.

**Runtime tests still needed:**

- successful sign-in,
- failed sign-in,
- sign-up with required email confirmation behavior,
- Google callback,
- password reset,
- expired token,
- access to another user's records.

### 10.2 Media upload

**Code status: implemented, security hardening needed.**

Authenticated uploads are routed through a server function, stored under a path prefixed with the authenticated user's ID, and returned as a signed URL. [`src/lib/cms/admin.functions.ts`](../src/lib/cms/admin.functions.ts)

The upload handler does not visibly enforce:

- maximum file size,
- an allow-list of MIME types,
- an allow-list of file extensions.

The signed URL lifetime is also extremely long relative to a normal temporary access URL.

**Recommendation:** add server-side size/type validation, safe extension handling, and a deliberate URL lifetime policy before production hardening.

### 10.3 Contact inquiry

**Code status: implemented, abuse protection needed.**

Public contact submission validates name, email, subject, and message, stores the message, and attempts an email notification. [`src/lib/cms/public.functions.ts`](../src/lib/cms/public.functions.ts)

No rate limiting, CAPTCHA/challenge, or equivalent abuse control was verified.

The notification email uses a configured connector, but the recipient address is currently hard-coded in application source. This is a maintainability/configuration concern and should be moved to environment-backed configuration or portfolio-owned settings.

The subject is also inserted into a raw email header. Input validation should reject or normalize CR/LF characters before values are placed into email headers.

### 10.4 Service inquiry

**Code status: implemented, transactional consistency and abuse controls needed.**

The public flow validates the portfolio and, when supplied, verifies that the selected service belongs to that portfolio before insertion. It then writes both `service_inquiries` and `contact_messages` and attempts an owner email notification. [`src/lib/cms/public.functions.ts`](../src/lib/cms/public.functions.ts)

The dual-write behavior is the main consistency concern. There is also no verified rate limit or anti-spam control.

### 10.5 Email notifications

**Code status: implemented, runtime verification pending.**

The application calls the Lovable connector gateway for Gmail delivery and reads connector credentials from environment variables. Contact notification failures are caught so a notification failure does not prevent the database write from succeeding. Inquiry and portfolio-visit notifications follow a similar pattern. [`src/lib/cms/public.functions.ts`](../src/lib/cms/public.functions.ts)

Important follow-up:

- verify connector credentials in each environment,
- verify OAuth/connector authorization,
- verify delivery and failure behavior,
- avoid treating an email send attempt as proof of delivery,
- centralize email construction and header sanitization.

### 10.6 MCP

**Code status: implemented, contract verification pending.**

The `/mcp` route is generated by the Lovable MCP integration. [`src/routes/mcp.ts`](../src/routes/mcp.ts)

The MCP registry uses Supabase OAuth issuer configuration and the `authenticated` audience. [`src/lib/mcp/index.ts`](../src/lib/mcp/index.ts)

Individual tools require an authenticated context and use the caller's bearer token with the publishable Supabase key. [`src/lib/mcp/supabase.ts`](../src/lib/mcp/supabase.ts)

The main unresolved issue is the mismatch between advertised capabilities and registered tools.

---

## Priority matrix

| Priority | Area | Action |
|---|---|---|
| High | Service-role/RLS boundary | Verify every RLS policy and reduce unnecessary service-role usage |
| High | Automated tests | Add authorization and tenant-isolation tests first |
| High | Public endpoint abuse | Add rate limiting and/or anti-spam protection for contact, inquiry, and visitor notification endpoints |
| High | Upload security | Add file size/type validation and review signed URL lifetime |
| Medium | Project schema | Establish canonical project fields and plan legacy migration |
| Medium | Inquiry/message duplication | Design a canonical inbound-message model or transactional dual-write |
| Medium | MCP contract | Align instructions with registered tools and add contract tests |
| Medium | SEO | Add sitemap and robots after confirming production hostname |
| Medium | Deployment | Document and verify actual production runtime/configuration |
| Medium | Public visibility | Verify every public query filters unpublished/private records correctly |
| Low | Generated files | Document generated-file ownership and regeneration workflow |
| Low | Admin profile coverage | Confirm intended management path for experience/certifications/skills/etc. |

---

## Recommended remediation order

### Phase 1: Security boundary

1. Inventory every table and storage bucket.
2. Verify RLS enablement and policies.
3. Audit every service-role query for ownership/visibility conditions.
4. Add cross-user authorization tests.
5. Harden public POST endpoints against spam and abuse.
6. Harden upload validation.
7. Sanitize all email header inputs.

### Phase 2: Data consistency

1. Map legacy and new project fields.
2. Select canonical fields.
3. Add migration tests.
4. Resolve contact/inquiry duplication strategy.

### Phase 3: Integration reliability

1. Add authentication flow tests.
2. Add email integration tests with mocked connector responses.
3. Add MCP contract/authentication tests.
4. Add upload tests.

### Phase 4: Operational completeness

1. Verify production hosting/runtime.
2. Document deployment environment variables.
3. Add sitemap/robots.
4. Document generated artifacts.

### Phase 5: Product completeness

1. Confirm management requirements for professional-profile entities.
2. Implement only the missing admin workflows that are actually required.

---

## Audit conclusion

The application is functional and the current code demonstrates deliberate ownership checks, authentication middleware, public/private publishing rules, and authenticated MCP tooling. The main architectural weakness is that privileged service-role access is used broadly, so correctness of application-level filters is carrying more security responsibility than a production multi-tenant system should ideally place on individual queries.

The safest next engineering task is therefore **not a feature build**. It is to verify the database authorization layer, establish automated tenant-isolation tests, and harden public input/upload/email boundaries. Once those controls are in place, the remaining data-model and product-completeness work can proceed with much lower risk.
