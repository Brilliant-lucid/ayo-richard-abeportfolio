# Stage 4 — Technical Architecture & Data Baseline

**Project:** Portfolio Platform  
**Repository:** `Brilliant-lucid/ayo-richard-abeportfolio`  
**Baseline date:** 2026-08-10  
**Program:** Production Readiness & Documentation Program (#40)  
**Source of truth:** current `main` branch plus repository documentation and generated Supabase types inspected during Stages 1–4.

---

## 1. Purpose

Stage 4 converts the product baseline into a technical source of truth.

It documents the architecture that actually exists today, rather than the architecture the platform may eventually adopt.

The document therefore distinguishes:

- **Verified architecture** — supported by current repository evidence.
- **Architecture requiring runtime verification** — source evidence exists but deployment/external behavior has not been proven.
- **Technical debt** — working compatibility or transitional architecture that should not be mistaken for the final design.
- **Future architecture** — planned changes such as an independently owned Supabase environment or deployment changes.

This document is a baseline. It is not yet the final Technical Requirements Document (TRD), database migration plan, threat model, or deployment runbook.

---

# 2. Current system architecture

The application is a **full-stack TanStack Start application**.

It is not currently documented as a separate React frontend plus independent backend service.

```text
                           ┌─────────────────────────┐
                           │        Browser          │
                           └────────────┬────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
              ▼                         ▼                         ▼
       Platform routes           Public portfolios        Authenticated admin
          `/...`                 `/u/:username/*`             `/admin/*`
              │                         │                         │
              └─────────────────────────┼─────────────────────────┘
                                        ▼
                           ┌─────────────────────────┐
                           │     TanStack Start      │
                           │   server/application    │
                           │        layer            │
                           └────────────┬────────────┘
                                        │
                     ┌──────────────────┼──────────────────┐
                     │                  │                  │
                     ▼                  ▼                  ▼
              Authenticated       Server/admin       MCP endpoint
              Supabase client       Supabase client      `/mcp`
                     │                  │                  │
                     └──────────────────┼──────────────────┘
                                        ▼
                           ┌─────────────────────────┐
                           │        Supabase         │
                           │                         │
                           │ Authentication          │
                           │ PostgreSQL database     │
                           │ Storage                 │
                           └─────────────────────────┘
```

The existing architecture documentation confirms this application/service/data arrangement and identifies Supabase as the authentication, PostgreSQL, and Storage boundary. fileciteturn36file0L2-L2

---

# 3. Application technology stack

## 3.1 Runtime/application

- TypeScript
- React
- TanStack Start
- TanStack Router
- TanStack React Query
- Vite
- Nitro

## 3.2 UI/application libraries

- Tailwind CSS
- Radix UI primitives
- Lucide React
- React Hook Form
- TipTap
- dnd-kit
- Recharts
- Zod

## 3.3 Backend/data/integration

- Supabase Authentication
- Supabase PostgreSQL
- Supabase Storage
- Supabase JavaScript client
- Lovable integrations
- Google Mail connector integration
- Model Context Protocol (MCP)
- AI SDK/integration infrastructure

The exact dependency versions remain defined by `package.json`. This document intentionally describes architectural responsibilities rather than duplicating the dependency manifest.

---

# 4. Application layers

## Layer 1 — Route/UI layer

Responsible for:

- Rendering platform pages.
- Rendering authentication interfaces.
- Rendering authenticated administration pages.
- Rendering public portfolios.
- Collecting user input.
- Managing route-level loading/error states.
- Calling server functions/query functions.

Representative route families:

```text
/
/about
/contact
/projects
/case-studies
/blog
/auth
/reset-password
/u/:username/*
/admin/*
/mcp
```

## Layer 2 — Server/application layer

Responsible for:

- Authentication checks.
- Request validation.
- Business rules.
- Database operations.
- Media operations.
- Public content queries.
- Administrative mutations.
- Notification triggers.
- MCP operations.

TanStack Start server functions are the primary service boundary.

## Layer 3 — Data/infrastructure layer

Supabase currently provides:

- Authentication.
- PostgreSQL persistence.
- Storage.

The application uses both normal authenticated Supabase access and a server-only elevated client.

---

# 5. Route architecture

## 5.1 Platform routes

The current architecture documentation identifies these platform-level routes:

| Route | Responsibility | Visibility |
|---|---|---|
| `/` | Platform landing page | Public |
| `/about` | Platform/about content | Public |
| `/contact` | Platform contact | Public |
| `/projects` | Platform-level project content | Public |
| `/projects/:slug` | Platform project detail | Public |
| `/case-studies` | Platform case studies | Public |
| `/case-studies/:slug` | Platform case-study detail | Public |
| `/blog` | Platform blog | Public |
| `/blog/:slug` | Platform blog detail | Public |

## 5.2 Authentication routes

| Route | Responsibility |
|---|---|
| `/auth` | Sign-in, sign-up, Google OAuth, password reset request |
| `/reset-password` | Password reset destination |

## 5.3 Public portfolio routes

| Route | Responsibility |
|---|---|
| `/u/:username` | Portfolio home |
| `/u/:username/about` | Public about/profile content |
| `/u/:username/projects` | Public project listing |
| `/u/:username/projects/:slug` | Public project detail |
| `/u/:username/case-studies` | Public case-study listing |
| `/u/:username/case-studies/:slug` | Public case-study detail |
| `/u/:username/blog` | Public blog listing |
| `/u/:username/blog/:slug` | Public blog detail |

Public portfolio resolution depends on the portfolio being published.

## 5.4 Authenticated routes

Confirmed management families include:

```text
/admin
/admin/profile
/admin/hero
/admin/site-settings
/admin/projects
/admin/projects/:id
/admin/blog
/admin/blog/:id
/admin/case-studies
/admin/services
/admin/messages
```

The admin route is protected by authentication middleware.

## 5.5 MCP routes

The application exposes `/mcp` and generated MCP support/discovery routes.

The exact externally accessible MCP route behavior remains a runtime verification item.

---

# 6. Authentication architecture

## 6.1 Authentication provider

Supabase Authentication is the current identity provider.

Supported methods:

- Email/password.
- Google OAuth.
- Password-reset email.

## 6.2 Authenticated browser flow

Conceptually:

```text
User
  ↓
/auth
  ↓
Supabase Auth
  ↓
Authenticated session
  ↓
/admin/* route guard
  ↓
Portfolio management
```

## 6.3 Server authentication flow

Protected server operations use an authentication middleware that validates the caller and passes the authenticated user identifier into the server-function context.

The architectural requirement is:

> Every protected mutation must establish the authenticated user before performing an owner-scoped operation.

## 6.4 Elevated server client

A server-only Supabase service-role/admin client exists for trusted operations.

This client bypasses Supabase Row Level Security (RLS).

Therefore:

```text
Service-role access
       ↓
No database-level tenant protection from RLS
       ↓
Application must enforce ownership
       ↓
Every mutation/query becomes security-sensitive
```

This is a major production-readiness boundary and is already reflected in the security workstream.

---

# 7. Multi-tenant ownership model

The application is multi-user.

The primary ownership concept is the authenticated Supabase user ID.

The public discovery concept is the portfolio username.

Conceptually:

```text
Supabase Auth User
       │
       │ 1:1 / ownership relationship
       ▼
Portfolio Owner
       │
       ▼
Portfolio
       │
       ├── Hero
       ├── Site Settings
       ├── Projects
       ├── Case Studies
       ├── Blog Posts
       ├── Experience
       ├── Certifications
       ├── Skills
       ├── Awards
       ├── Publications
       ├── Testimonials
       ├── Services
       └── Contact / Inquiry records
```

The generated Supabase types show `owner_id` fields across portfolio content entities, confirming that ownership is a central data-model concept. fileciteturn39file0L2-L2

### Security rule

A user must never be able to read or mutate another user's portfolio data by supplying another user's identifier, record identifier, slug, or username.

This is a requirement for later authorization tests, not a claim that the entire requirement has already been proven at runtime.

---

# 8. Database architecture

## 8.1 Core entities

The current generated schema contains at least the following major public tables/entities:

| Entity | Primary responsibility | Ownership concept |
|---|---|---|
| `portfolios` | Portfolio identity and publication state | Owner/user |
| `hero` | Professional hero/profile presentation | Owner/portfolio |
| `site_settings` | Site-level configuration | Owner/portfolio |
| `nav_links` | Navigation configuration | Owner/portfolio |
| `stats` | Portfolio statistics | Owner/portfolio |
| `projects` | Professional project work | Owner |
| `case_studies` | Structured case studies | Owner |
| `blog_posts` | Professional writing | Owner |
| `experience` | Professional experience | Owner |
| `certifications` | Credentials | Owner |
| `skills` | Professional capabilities | Owner |
| `awards` | Awards | Owner |
| `publications` | Publications | Owner |
| `testimonials` | Social proof | Owner |
| `marketing_work` | Marketing work records | Owner |
| `contact_messages` | Public contact messages | Portfolio/owner |
| `services` | Service offerings/inquiry configuration | Owner |

The generated type definitions are the current schema evidence. fileciteturn39file0L2-L2

## 8.2 Content status

Several content entities use a shared `content_status` enum/model.

The product must distinguish at minimum between content intended for public publication and content that is not public.

Projects additionally expose a richer state model including draft, published, unlisted, and archived behavior.

The exact cross-entity state contract requires formalization in the later data specification.

---

# 9. Data relationships

The conceptual relationship graph is:

```text
User
 │
 └── Portfolio
      │
      ├── Profile / Hero / Settings
      ├── Navigation / Stats
      ├── Projects
      │     └── optional Case Study representation
      ├── Case Studies
      ├── Blog Posts
      │     ├── related Project
      │     └── related Case Study
      ├── Experience
      ├── Certifications
      ├── Skills
      ├── Awards
      ├── Publications
      ├── Testimonials
      ├── Marketing Work
      ├── Services
      │     └── Service inquiries
      └── Contact messages
```

### Important transitional relationship

Projects currently contain both newer structured fields and legacy fields.

The application mirrors values between representations for compatibility.

This means the database currently contains **architectural history** and is not yet a clean final normalized model.

The cleanup must preserve existing user data while establishing one authoritative representation.

---

# 10. Project / Case Study architecture

This is currently one of the most important architectural transitions.

The intended model is:

```text
                 Project
                   │
            publish_as mode
          /        |         \
         /         |          \
   project     case_study      both
      │             │            │
      ▼             ▼            ▼
Project page   Case-study page  Both
```

The current implementation contains a `publish_as` concept supporting:

- `project`
- `case_study`
- `both`

The administrative architecture has also moved toward Projects as the central source of truth.

However, the final synchronization behavior must be verified before the migration is considered complete.

**Relevant active work:** Issues #20, #21, and #22.

---

# 11. Project legacy compatibility

The current project architecture contains duplicated/legacy concepts.

Examples include older fields such as:

- `name`
- `role`
- `description`
- `problem`

alongside newer structured project representations.

The server-side project management layer mirrors values between old and new fields.

### Current state

**Working compatibility architecture, not final architecture.**

### Required future state

```text
Single canonical project model
          ↓
Single source of truth
          ↓
Public project representation
          ↓
Optional case-study representation
```

Migration must include:

- Existing-data audit.
- Backfill strategy.
- Null/legacy handling.
- Read-path migration.
- Write-path migration.
- Validation.
- Removal timeline for legacy columns.

This is Issue #7 territory and should not be silently folded into unrelated feature work.

---

# 12. Public data flow

A public portfolio request follows this conceptual flow:

```text
GET /u/:username
        ↓
Resolve published portfolio by username
        ↓
Obtain portfolio owner ID
        ↓
Load owner-scoped public records
        ↓
Filter by publication/status rules
        ↓
Return data to route
        ↓
TanStack React Query cache
        ↓
Portfolio components
        ↓
Rendered public page
```

The same ownership principle applies to nested public routes.

### Public data rule

Public routes must never expose:

- Draft-only content.
- Private content.
- Another user's content.
- Internal credentials/secrets.
- Service-role information.
- Internal administrative metadata that has not intentionally been made public.

The exact field-level public/private matrix belongs in the security/data-lifecycle stage.

---

# 13. Authenticated management data flow

The administrative flow is:

```text
Admin UI
   ↓
Form / action
   ↓
Zod validation
   ↓
Authentication middleware
   ↓
Authenticated user ID
   ↓
Owner-scoped business logic
   ↓
Supabase database/storage operation
   ↓
Result
   ↓
Admin UI refresh/cache update
```

### Required invariant

Authentication and ownership must occur **before** a trusted elevated database operation.

The existence of the service-role client means that client-side filtering is never sufficient as a security boundary.

---

# 14. Media/storage architecture

Supabase Storage currently provides media storage.

The documented upload flow is:

```text
Authenticated admin
       ↓
FormData upload
       ↓
Server upload function
       ↓
User-specific storage path
       ↓
Supabase Storage `media` bucket
       ↓
Signed URL
       ↓
Application record/rendering
```

### Current implementation status

Media upload is implemented.

### Production hardening still required

- MIME validation.
- Extension validation.
- File-size limits.
- Image dimension limits where appropriate.
- Malicious-file considerations.
- Ownership checks.
- Delete authorization.
- Orphan-file cleanup.
- Signed URL lifetime decision.
- Public/private bucket policy verification.
- Storage quota strategy.

These requirements are primarily governed by Issue #11 and the later security/data-lifecycle stage.

---

# 15. Contact and inquiry architecture

The current application has two related concepts:

```text
General contact message

Service inquiry
```

Both represent visitor-to-professional communication.

The current server layer contains an older contact-message path and a newer service-inquiry flow.

### Architectural concern

There must ultimately be a clear canonical model defining:

- Which table is authoritative.
- Which fields belong to all inquiries.
- Which fields are service-specific.
- How status is tracked.
- How email notifications are triggered.
- How messages are displayed to the owner.
- How spam/abuse is handled.

Issue #10 exists to resolve this architectural overlap.

---

# 16. Notification architecture

Visitor notification currently works conceptually as:

```text
Visitor views public portfolio
        ↓
Client-side throttle check
        ↓
Visitor notification server function
        ↓
Mail integration
        ↓
Portfolio owner notification
```

The current browser throttle uses `localStorage` and limits notification attempts for a portfolio to approximately once per 12 hours per browser.

### Architectural limitation

Client-side throttling is not a complete abuse-prevention mechanism because the client is untrusted.

A production design should decide whether server-side throttling, event logging, or another anti-abuse mechanism is required.

---

# 17. Model Context Protocol architecture

The application exposes an MCP endpoint directly from the TanStack application.

Current conceptual flow:

```text
MCP client
    ↓
/mcp
    ↓
MCP authentication/OAuth configuration
    ↓
Registered tools
    ↓
Server-side portfolio operations
    ↓
Supabase
```

Current registered operations include:

- Get portfolio.
- List projects.
- Get project.
- Upsert project.
- Delete project.
- List blog posts.
- Upsert blog post.
- Delete blog post.
- List messages.
- Update hero.

The instructions currently mention broader capabilities than the registered tools. This is an explicit architecture/documentation mismatch and remains governed by Issue #9.

---

# 18. External integrations

The current architecture includes or references the following external boundaries:

| Integration | Responsibility | Current state |
|---|---|---|
| Supabase Auth | Authentication | Implemented |
| Supabase PostgreSQL | Persistence | Implemented |
| Supabase Storage | Media | Implemented |
| Google OAuth | Social sign-in | Implemented/configuration-dependent |
| Google Mail connector | Notifications/contact email | Implemented/configuration-dependent |
| Lovable integration | Authentication/MCP/mail infrastructure | Current dependency |
| MCP | External portfolio-management integration | Partial |
| AI SDK/infrastructure | AI-assisted capabilities | Partial/planned |

The exact production ownership and contractual dependencies of these integrations must be documented before deployment.

---

# 19. Environment configuration

The application relies on environment variables for external services and secrets.

At minimum, the architecture requires secure configuration for:

- Supabase URL.
- Supabase publishable/client key.
- Supabase service-role key where elevated operations are used.
- Mail connector credentials/configuration.
- MCP/OAuth configuration where required.
- AI/integration credentials where enabled.

### Security rule

Service-role credentials and other privileged secrets must never be exposed to browser bundles or committed to Git.

The final environment-variable inventory should be generated from actual source references and deployment configuration during the deployment stage rather than guessed here.

---

# 20. Build/server architecture

The repository uses Vite and TanStack Start configuration with a server entry at `src/server.ts`.

The server entry provides an application-level wrapper around the generated TanStack server entry and handles certain catastrophic server-side rendering errors.

The build/deployment architecture therefore currently depends on:

```text
Vite
  ↓
TanStack Start
  ↓
Nitro/server output
  ↓
Hosting runtime
```

A definitive production hosting target is still a Stage 10/deployment verification item. The repository alone should not be treated as proof of the final production topology.

---

# 21. Generated artifacts

The repository contains generated artifacts such as:

- TanStack route tree.
- Generated Supabase TypeScript definitions/client artifacts.
- Generated MCP-related route support.

### Rule

Generated files are outputs, not primary architecture sources.

Source changes should be made in their generating/source modules and regenerated through the project's normal tooling.

The exact generated-file workflow should be formalized during development/deployment documentation.

---

# 22. Architectural source-of-truth matrix

| Domain | Current source of truth | Transitional concern |
|---|---|---|
| Authentication | Supabase Auth | External provider configuration |
| User identity | Supabase Auth user | Need final identity/account deletion specification |
| Portfolio identity | `portfolios` | Public username uniqueness rules need formalization |
| Hero | `hero` / related profile model | Admin consolidation |
| Site configuration | `site_settings` | MCP alignment |
| Projects | `projects` | Legacy/new field duplication |
| Case Studies | `case_studies` + Project publishing architecture | Consolidation in progress |
| Blog | `blog_posts` | Related-content consistency |
| Experience | `experience` | Admin management verification |
| Certifications | `certifications` | Admin management verification |
| Skills | `skills` | Semantic redesign under #21 |
| Awards | `awards` | Admin management verification |
| Publications | `publications` | Admin management verification |
| Testimonials | `testimonials` | Admin management verification |
| Services | `services` | Inquiry relationship cleanup |
| Contact | `contact_messages` and service inquiry path | Canonical model unresolved |
| Media | Supabase Storage | Security/cleanup hardening |
| Public routing | TanStack Router | Subdomain architecture not current |
| MCP | `/mcp` + registered tools | Instructions/tool mismatch |
| Deployment | Vite/TanStack/Nitro config | Hosting target not yet fully verified |

---

# 23. Current architectural debt

The following should be treated as known technical debt rather than accidental omissions:

1. Project legacy/new field duplication.
2. Project/Case Study source-of-truth transition.
3. Contact/service-inquiry model overlap.
4. Partial management coverage for professional profile entities.
5. MCP instruction/tool mismatch.
6. Service-role client ownership risk.
7. Storage hardening requirements.
8. Lack of automated test infrastructure.
9. Missing robots/sitemap implementation.
10. External Lovable integration dependency.
11. Production hosting/deployment topology not fully documented.
12. Generated artifact boundaries requiring formal development guidance.

---

# 24. Architecture that should NOT be assumed

The following are specifically **not** current architectural facts:

### Separate frontend and backend

Not the current implementation. The current app is full-stack TanStack Start.

### User subdomains

Not currently verified. Current public URLs use `/u/:username`.

### Owned/independent Supabase infrastructure

Not current. Future migration work is tracked separately.

### Complete Career Profile engine

Not current. Schema preparation exists, but the full feature remains active product development.

### Complete Visual Template System

Not current. It is an active product initiative, not a verified production subsystem.

### Complete MCP coverage

Not current. Registered tools are narrower than the instruction set.

### Fully automated test suite

Not current. No test runner was verified in the package baseline.

---

# 25. Runtime verification requirements

Static repository inspection cannot prove all production behavior.

The following require runtime verification:

1. Authentication session behavior.
2. Google OAuth configuration.
3. Password reset delivery.
4. Tenant isolation.
5. Authorization under malicious/incorrect IDs.
6. Storage bucket policies.
7. File upload restrictions.
8. File deletion ownership.
9. Project/Case Study publication synchronization.
10. Service inquiry persistence and retrieval.
11. Email notification delivery.
12. MCP authentication and authorization.
13. Public/private field exposure.
14. Production build behavior.
15. Production server runtime.
16. Hosting-specific server behavior.
17. SEO output in deployed pages.
18. Public portfolio routing and cache behavior.

These become test cases in the QA and security stages.

---

# 26. Technical requirements emerging from Stage 4

The architecture implies the following non-negotiable requirements for production:

### TR-001 — Tenant isolation

Every user-owned resource must be protected against cross-user access and mutation.

### TR-002 — Privileged server boundary

Service-role Supabase access must remain server-only and must be preceded by authenticated ownership/business-rule checks.

### TR-003 — Canonical content models

Each major professional-content entity must have one documented source of truth.

### TR-004 — Safe publication

Only intentionally published public content may be exposed through public portfolio routes.

### TR-005 — Storage ownership

Uploaded files must be associated with the correct user and protected against unauthorized operations.

### TR-006 — Reliable inquiry model

Contact and service inquiry records must have a documented canonical relationship.

### TR-007 — Integration boundaries

External authentication, mail, MCP, and AI dependencies must have explicit configuration, failure, and security behavior.

### TR-008 — Deployment reproducibility

A production deployment must be reproducible from documented environment/configuration requirements.

### TR-009 — Generated-file discipline

Generated artifacts must not become manual sources of truth.

### TR-010 — Runtime verification

Critical security and publishing behavior must be verified with actual tests rather than static inspection alone.

---

# 27. Stage 4 findings

## Finding 1 — The architecture is already coherent at a high level

The platform has a recognizable full-stack boundary:

**TanStack Start → server functions → Supabase → public/admin/MCP surfaces.**

## Finding 2 — Security depends heavily on application-level authorization

Because privileged Supabase access bypasses Row Level Security (RLS), authorization correctness is one of the highest-risk architectural areas.

## Finding 3 — The database contains product evolution

The schema is not yet a clean final representation. Projects especially contain legacy compatibility structures.

## Finding 4 — Projects are becoming the central work-content abstraction

The Project/Case Study transition is architectural, not merely cosmetic.

## Finding 5 — The application has multiple external dependencies

Authentication, email, MCP, AI, and Lovable integration paths must be explicitly accounted for in production planning.

## Finding 6 — Runtime testing is now the critical next layer

Stages 1–4 establish what the repository says and what source code supports. They do not prove that the production environment behaves correctly.

---

# 28. Stage 4 conclusion

The technical architecture baseline is now established.

The current architecture can be summarized as:

> **A multi-tenant full-stack TanStack Start application in which route/UI layers communicate with server-side application functions, those functions authenticate and authorize users, and Supabase provides identity, PostgreSQL persistence, and Storage. Public portfolios are resolved by username, authenticated content is owner-scoped, and MCP is integrated directly into the application as an external management interface.**

The major technical risks are no longer unknowns. They are identifiable workstreams:

- Tenant isolation.
- Privileged database access.
- Legacy project schema.
- Project/Case Study synchronization.
- Contact/inquiry model.
- Storage hardening.
- MCP alignment.
- Deployment topology.
- Automated testing.

### Next stage

**Stage 5 — Data Lifecycle, Security & Privacy Architecture**

Stage 5 should go deeper into the highest-risk part of this architecture:

- Complete data dictionary.
- Public/private field matrix.
- Data ownership.
- Creation/update/deletion lifecycle.
- Account deletion.
- Media deletion.
- Tenant isolation.
- Row Level Security (RLS).
- Service-role boundaries.
- Threat model.
- Authentication security.
- Authorization test matrix.
- Abuse/rate limiting.
- Privacy considerations.
- Backup/recovery requirements.
