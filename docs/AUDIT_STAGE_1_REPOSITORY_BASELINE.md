# Stage 1 — Repository & Documentation Baseline Audit

**Project:** Portfolio Platform  
**Repository:** `Brilliant-lucid/ayo-richard-abeportfolio`  
**Default branch:** `main`  
**Audit date:** 2026-08-10  
**Audit scope:** Repository state, documentation, Git history, branches, pull requests, package configuration, and selected implementation evidence.

---

## 1. Audit objective

Establish a reliable technical and documentation baseline before the project enters the wider production-readiness program.

This document answers:

1. What repository is being treated as the source of truth?
2. What technology and application architecture are actually present?
3. What documentation already exists?
4. What implementation evidence is already verified?
5. What parts of the previous documentation baseline are still accurate?
6. What has changed since the previous documentation audit?
7. What must be verified in later production-readiness stages?

The audit intentionally separates **repository evidence** from **product plans** and **future intentions**.

---

## 2. Repository identity and current Git state

### Repository

- Owner: `Brilliant-lucid`
- Repository: `ayo-richard-abeportfolio`
- Visibility: Public
- Default branch: `main`
- Repository is not archived.
- The authenticated account has administrative access.

### Branches

The repository currently exposes two branches:

- `main`
- `new`

A direct comparison confirms that `new` and `main` are currently identical. There is no branch-level divergence to account for in this baseline.

### Latest observed commit on `main`

`d14a1331c7d0f7f9fbb4c82c53d5f386292ab326`

Commit message:

> `docs: link historical issue map to GitHub issues`

The latest observed commits are documentation/history work from 2026-08-08. The latest source-code feature milestone inspected before the documentation work is the admin content architecture refactor at commit `26c721aef64ae6102aabd76f0a8dcb64b447dddf`.

### Important baseline conclusion

The repository's current `main` branch contains the documentation/history baseline plus the application implementation that existed before and around the August 8 documentation work. There is no evidence in the current branch comparison of a newer divergent implementation branch that should replace `main` as the documentation source of truth.

---

## 3. Application identity

The repository is a **multi-user professional portfolio platform**, not merely a static personal portfolio template.

The current implementation separates the platform itself from individual user portfolios:

```text
/                         Platform landing site
/auth                     Authentication
/admin/*                  Authenticated portfolio management
/u/:username/*            Public user portfolio
/mcp                      Model Context Protocol endpoint
```

The application uses Supabase-backed records scoped by authenticated user ownership for multi-user portfolio management.

The current public portfolio URL model is **path-based username routing** (`/u/:username`). Subdomain-based portfolio URLs are not treated as implemented functionality in this baseline.

---

## 4. Verified technology stack

The repository currently declares and uses the following major technologies:

### Application

- TypeScript 5.8.x
- React 19.x
- TanStack Start
- TanStack Router
- TanStack React Query
- Vite 7.x
- Nitro

### UI

- Tailwind CSS 4
- Radix UI primitives
- Lucide React
- React Hook Form
- TipTap rich-text editor
- dnd-kit for drag-and-drop interactions
- Recharts

### Data and authentication

- Supabase JavaScript client
- Supabase Authentication
- PostgreSQL-backed Supabase database
- Supabase Storage
- Zod validation

### AI/integration layer

- AI SDK
- Lovable Cloud/Auth integration packages
- Lovable Model Context Protocol (MCP) integration
- Google Mail connector integration through the Lovable connector path

The exact dependency versions remain defined by `package.json`; this document describes the architectural stack rather than duplicating the full manifest.

---

## 5. Repository architecture

The application is currently a **full-stack TanStack Start application** rather than a separately deployed React frontend plus independent backend service.

High-level architecture:

```text
Browser
  |
  +-- Platform/public routes
  +-- Public portfolio routes
  +-- Authentication routes
  +-- Authenticated admin routes
          |
          v
   TanStack Start server functions
          |
          +-- Authenticated Supabase client
          +-- Server-only elevated Supabase client
          |
          v
   Supabase
   +-- Authentication
   +-- PostgreSQL data
   +-- Storage

   MCP endpoint
          |
          v
   Registered portfolio-management tools
```

Server functions form the primary application service layer.

---

## 6. Verified feature baseline

The existing feature inventory identifies the following implementation areas.

### Fully implemented or strongly evidenced

- Platform landing page
- Email/password authentication
- Google OAuth authentication
- Password reset
- Authenticated administration
- Portfolio identity/profile management
- Hero/profile presentation
- Site settings
- Project management
- Project publishing states
- Project ordering
- Project duplication
- Project media/gallery support
- Project metrics
- Project SEO fields
- Public username-based portfolio routes
- Blog management and public blog rendering
- Services management
- Service inquiries
- Public contact flow
- Authenticated messages/inquiry management
- Supabase Storage media upload
- Public metadata/canonical/social metadata on key routes
- Structured data on key public pages
- MCP endpoint and a set of authenticated portfolio-management tools

### Partially implemented or requiring verification

- Case-study management/public synchronization
- Experience management
- Certification management
- Skills management
- Awards management
- Publications management
- Testimonials management
- Visitor email notification delivery
- SEO completeness
- MCP capability alignment
- Production deployment architecture

### Known gaps

- No automated test runner/test script is declared in `package.json`.
- No repository-managed root `robots.txt` was found in the inspected baseline.
- No repository-managed XML sitemap was found in the inspected baseline.
- Project data contains legacy and newer representations for several concepts.
- Server-side elevated Supabase access bypasses Row Level Security (RLS), making application-level ownership checks critical.
- MCP instructions advertise capabilities beyond the currently registered tool set.
- Production hosting/deployment pipeline is not fully verifiable from repository configuration alone.

---

## 7. Authentication and authorization baseline

The source verifies:

- Email/password sign-up.
- Email/password sign-in.
- Google OAuth.
- Password reset.
- Authenticated route protection.
- Server-side authentication middleware.
- Authenticated user identification before protected server operations.

The application also contains a server-only Supabase service-role client.

### Security significance

The service-role client bypasses Supabase Row Level Security (RLS). This does not automatically make the design insecure, but it means that every trusted server operation using that client must enforce the correct user/portfolio ownership boundary.

This is already represented by the open security issues and must remain a production-readiness blocker until verified.

---

## 8. Data model baseline

The generated Supabase types and application source show a portfolio-oriented schema including:

- `portfolios`
- `hero`
- `site_settings`
- `nav_links`
- `stats`
- `projects`
- `case_studies`
- `blog_posts`
- `experience`
- `certifications`
- `skills`
- `awards`
- `publications`
- `testimonials`
- `marketing_work`
- `contact_messages`
- `services`

The portfolio model also contains fields introduced for profession-aware onboarding/profile behavior, including `profession`, `career_profile`, `section_order`, and `onboarded_at`.

The project model contains both newer structured fields and legacy compatibility fields. Current project writes still mirror values between representations. This is tracked as technical debt rather than assumed to be harmless permanent architecture.

---

## 9. Admin architecture baseline

The August 8 admin refactor introduced a grouped information architecture:

- Profile & Hero
- Projects & Case Studies
- Services
- Blog
- Experience & Credentials
- Publications & Testimonials
- Messages
- Site settings

The repository also retains a legacy authenticated case-study route, but the route now redirects to `/admin/projects`, explicitly treating Projects as the source of truth for case studies.

The project editor currently contains a `publish_as` field with the following modes:

- `project`
- `case_study`
- `both`

This is important evidence that the Project/Case Study consolidation has progressed beyond a design-only proposal.

However, end-to-end behavior still requires explicit verification before the corresponding GitHub issue is closed.

---

## 10. MCP baseline

The current MCP implementation registers these tools:

- Get portfolio
- List projects
- Get project
- Upsert project
- Delete project
- List blog posts
- Upsert blog post
- Delete blog post
- List messages
- Update hero

The MCP instructions currently mention:

- Projects
- Case studies
- Blog posts
- Contact messages
- Hero
- Site settings

The registered tools do not currently include dedicated case-study or site-settings tools.

Therefore the documentation/tooling mismatch is confirmed and remains an active technical issue.

---

## 11. Documentation already present

The repository already contains a meaningful documentation baseline:

- `README.md`
- `CHANGELOG.md`
- `docs/ARCHITECTURE.md`
- `docs/FEATURES.md`
- `docs/SETUP.md`
- `docs/DEVELOPMENT.md`
- `docs/HISTORY.md`
- `docs/DEVELOPMENT_HISTORY.md`

The original baseline was created during the August 7–8 audit and then extended with historical issue mapping.

### Quality assessment

The existing documentation is **useful and evidence-based**, but it is not yet the complete production documentation system proposed for the project.

It currently explains what the application is and several important implementation details. It does not yet provide the complete set of:

- Product requirements
- Full data lifecycle specification
- Complete security model
- Threat model
- Detailed API contract
- Full user-flow documentation
- Template/Career Profile specification
- Production deployment runbook
- Backup/recovery plan
- QA/regression matrix
- Operational runbooks
- Legal/business readiness documentation
- Comprehensive launch checklist
- Definitive issue-to-feature traceability matrix

Those belong to later stages.

---

## 12. Documentation consistency findings

The documentation baseline itself now contains some stale references because the issue tracker expanded after the original documentation was written.

### `docs/HISTORY.md`

It lists only Issues #20 and #21 as current work, while the repository now contains many additional open issues covering security, technical debt, QA, SEO, deployment, onboarding, templates, AI assistance, and backend migration.

### `docs/DEVELOPMENT_HISTORY.md`

It correctly acknowledges that security, authorization, storage, rate limiting, MCP alignment, SEO, deployment, and end-to-end verification are tracked by open issues, but it does not enumerate the current issue register.

### Issue #3

Issue #3 similarly describes #20 and #21 as current/post-baseline work while the issue tracker now contains a substantially larger active backlog.

### Conclusion

These documents are not wrong about the historical milestones. They are **outdated as current-work indexes** and should be refreshed during the documentation-governance stage.

No historical issue should be rewritten merely to make the current backlog look cleaner. Historical records must remain historical records.

---

## 13. Pull-request baseline

Two pull requests are visible in the repository history:

### PR #1

A README proposal for the Personal Identity Platform. It was closed without being merged.

### PR #2

The AI code-review/documentation baseline pull request. It was merged on 2026-08-08 and established the repository audit documentation.

The merged PR explicitly stated that no application source code, database schema, dependencies, or configuration were changed by the documentation audit.

---

## 14. Generated-file boundary

The repository identifies generated artifacts including:

- `src/routeTree.gen.ts`
- Generated Supabase type/client artifacts
- Generated MCP route support

These must remain distinguished from source-of-truth files in future documentation.

---

## 15. Production-readiness baseline

At the end of Stage 1, the project should **not yet be labelled production-ready**.

The repository has a working application baseline, but the following areas remain unresolved or unverified:

1. Tenant isolation/security verification
2. Automated authorization tests
3. Public submission abuse protection
4. Legacy project-field cleanup
5. Professional-profile admin completeness
6. MCP tool/instruction alignment
7. Contact/inquiry data-model decision
8. Media upload hardening
9. Email security/configuration
10. SEO robots/sitemap
11. Production deployment verification
12. Generated-file boundaries
13. End-to-end critical-flow testing
14. Career Profile onboarding
15. Visual template system
16. Guided setup/product tour
17. Vercel deployment milestone
18. Lovable Cloud backend inventory
19. Future owned-Supabase migration

The issue register in Stage 2 determines which of these are launch blockers, feature work, future roadmap items, or historical records.

---

## 16. Stage 1 conclusion

The repository is sufficiently understood to move into Stage 2.

### Baseline confidence

**High** for:

- Repository identity
- Default branch
- Application architecture
- Main technology stack
- Existing documentation set
- Historical milestone records
- Major implemented feature areas
- Current MCP registered tool list
- Major known technical/security findings

**Requires runtime/environment verification** for:

- Production deployment
- External OAuth configuration
- Email delivery
- Storage policy behavior
- Tenant isolation under hostile/incorrect IDs
- Full Project/Case Study publishing behavior
- Complete admin CRUD behavior for all profile entities
- MCP authorization behavior
- End-to-end user journey

### Rule for later stages

No feature should be marked production-ready solely because source code exists. Where behavior depends on external configuration or runtime interaction, the documentation must explicitly identify the verification requirement.

---

## 17. Evidence references

Primary repository evidence used for this baseline:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/FEATURES.md`
- `docs/SETUP.md`
- `docs/DEVELOPMENT.md`
- `docs/HISTORY.md`
- `docs/DEVELOPMENT_HISTORY.md`
- `CHANGELOG.md`
- `package.json`
- `src/lib/mcp/index.ts`
- `src/routes/_authenticated/admin.projects.$id.tsx`
- `src/routes/_authenticated/admin.case-studies.tsx`
- Commit `26c721aef64ae6102aabd76f0a8dcb64b447dddf`
- Latest observed commit `d14a1331c7d0f7f9fbb4c82c53d5f386292ab326`
- GitHub Issues #3–#39 as applicable
- GitHub Pull Requests #1–#2
