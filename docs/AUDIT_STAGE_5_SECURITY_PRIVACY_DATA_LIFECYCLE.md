# Stage 5 — Security, Privacy & Data Lifecycle Architecture

**Project:** Portfolio Platform  
**Repository:** `Brilliant-lucid/ayo-richard-abeportfolio`  
**Baseline date:** 2026-08-10  
**Program:** Production Readiness & Documentation Program (#40)

## 1. Purpose

Stage 5 converts the Stage 4 architecture into a security and data-lifecycle control model.

It answers:

- Who owns each record?
- Who may read it?
- Who may create, update, or delete it?
- What is public?
- What is private?
- What happens when content is unpublished?
- What happens when an account is deleted?
- How are files protected and removed?
- Where does Row Level Security (RLS) enforce isolation?
- Where does application authorization enforce isolation?
- Where does the privileged service-role client bypass RLS?
- How are abuse, spam, and malicious inputs controlled?
- What must be tested before production?

This document does **not** claim that controls are implemented merely because they are required. It separates verified controls from controls requiring implementation or runtime evidence.

---

# 2. Security posture summary

## Overall assessment: NOT PRODUCTION-READY

The repository has meaningful security controls, but the current architecture places substantial trust in application-level authorization because the server-side service-role client bypasses RLS.

The existing security audit identifies this as the highest-priority architectural concern. Many server functions compensate by explicitly filtering by authenticated `owner_id` or `portfolio_id`, but a missed filter can become a cross-tenant exposure. fileciteturn114file0L2-L2

### Highest-risk areas

| Area | Current assessment | Production gate |
|---|---|---|
| Authentication | Implemented, runtime verification required | Must pass auth tests |
| Tenant isolation | Application-level controls exist; RLS status incomplete | **Blocking** |
| Service-role access | Broadly used | **High-risk** |
| Public/private filtering | Mostly explicit; field-level matrix incomplete | **Blocking** |
| Storage | User-scoped paths exist | Hardening required |
| Contact/inquiries | Functional, dual-write model | Consistency + abuse controls |
| MCP | Authenticated/scoped tools exist | Contract/auth tests |
| Automated tests | Not verified as present | **Blocking for confidence** |
| Account deletion | Lifecycle not fully verified | Must define and test |
| Backups/recovery | External infrastructure concern | Must document |

---

# 3. Security principles

## SEC-001 — Tenant isolation

A user must never access or mutate another user's portfolio data, even when the attacker knows:

- another user's identifier,
- another portfolio ID,
- a record ID,
- a username,
- a slug,
- a public URL,
- or a guessed Storage path.

## SEC-002 — Authentication is not authorization

A valid login only establishes identity.

Every protected operation must additionally establish that the authenticated user is authorized to access the target resource.

## SEC-003 — Client code is untrusted

React/browser checks are usability controls, not security controls.

Authorization must occur server-side and/or at the database policy layer.

## SEC-004 — Service-role access is exceptional

The Supabase service-role key bypasses RLS. It must remain server-only and every operation using it must have explicit authorization reasoning.

## SEC-005 — Public means intentionally public

A record being stored in a database does not make it public.

Public routes must explicitly select content intended for publication.

## SEC-006 — Delete means complete lifecycle handling

Deleting a database row is not necessarily equivalent to deleting all associated media, derived records, logs, notifications, and cached/public representations.

## SEC-007 — Secrets never reach the client

Service-role keys, mail credentials, OAuth secrets, AI credentials, and MCP secrets must never be exposed in browser bundles.

---

# 4. Identity and account lifecycle

## 4.1 Account creation

Current identity provider: Supabase Authentication.

Supported authentication paths include email/password and Google OAuth, with password reset support. The current codebase provides authentication UI and server token validation, but production provider behavior still requires runtime verification. fileciteturn114file0L2-L2

## 4.2 Account states

The platform should explicitly model these lifecycle states even if they are implemented through provider state rather than an application enum:

```text
Invited/Created
      ↓
Active
      ↓
Suspended (future/admin control if needed)
      ↓
Deletion requested
      ↓
Deletion processing
      ↓
Deleted/anonymized
```

## 4.3 Account deletion requirement

A production deletion process must define what happens to:

- Auth identity
- Portfolio
- Hero/profile data
- Projects
- Case Studies
- Blog posts
- Experience
- Certifications
- Skills
- Awards
- Publications
- Testimonials
- Services
- Contact messages
- Service inquiries
- Media files
- External integrations
- MCP authorization
- Search-engine indexed pages

No claim of complete account deletion is made until this lifecycle is implemented and tested.

---

# 5. Data classification model

Every stored field should eventually receive one classification.

| Classification | Meaning | Example |
|---|---|---|
| Public | Intentionally visible to anonymous visitors | Published project title |
| Public profile | Public only when portfolio is published | Professional bio |
| Private owner | Visible only to authenticated owner | Inbox messages |
| Sensitive | Requires additional protection/minimization | Contact details, auth metadata |
| Secret | Must never reach browser/public output | Service-role key |
| Operational | Internal infrastructure information | Provider configuration |

The final column-level data dictionary must use these categories.

---

# 6. Public/private data matrix

## Public portfolio data

Potentially public when the portfolio is published:

- Portfolio username
- Professional name
- Headline
- Bio/about content
- Location if intentionally configured
- Availability if intentionally configured
- Social links
- Published projects
- Published case studies
- Published blog posts
- Published experience
- Published certifications
- Published skills
- Published awards
- Published publications
- Published testimonials
- Published services
- Public SEO metadata

## Private data

Must not be returned through public portfolio queries:

- Contact messages
- Service inquiries
- Owner administrative identifiers where unnecessary
- Internal status data
- Draft/unpublished content
- Internal moderation/admin metadata
- Authentication tokens
- Provider credentials
- Service-role keys
- Internal error details

## Needs explicit field-level review

- Email address shown on a professional profile
- Phone number
- Internal project IDs
- Media object identifiers
- Analytics/notification metadata
- Service pricing metadata

The final implementation should expose only fields required by the public interface.

---

# 7. Tenant isolation model

The tenant boundary is the authenticated Supabase user ID.

Conceptually:

```text
Authenticated User ID
        ↓
Portfolio Owner
        ↓
Owner-scoped records
```

Every protected query must answer:

> Why is this caller allowed to access this exact record?

A query that selects by only `id`, `slug`, or another guessable value is insufficient unless the ownership/publication rule is independently enforced.

---

# 8. Authorization control matrix

| Operation | Authentication | Ownership | Publication check | RLS required/desired |
|---|---:|---:|---:|---:|
| View published portfolio | No | Public owner resolution | Yes | Yes |
| View draft portfolio | Yes | Yes | N/A | Yes |
| Create project | Yes | Caller | N/A | Yes |
| Update project | Yes | Caller owns record | N/A | Yes |
| Delete project | Yes | Caller owns record | N/A | Yes |
| Publish project | Yes | Caller owns record | N/A | Yes |
| Create blog post | Yes | Caller | N/A | Yes |
| Update profile | Yes | Caller | N/A | Yes |
| Read inbox | Yes | Caller owns portfolio | N/A | Yes |
| Submit contact message | No | Target portfolio only | Published target | Public insert policy/function |
| Submit service inquiry | No | Target portfolio/service relationship | Published target | Public insert policy/function |
| Upload media | Yes | Caller path/record | N/A | Yes |
| Delete media | Yes | Caller owns object | N/A | Yes |
| MCP project mutation | Yes/MCP auth | Token owner | N/A | Yes |
| Admin/system operation | Yes | Explicit privileged role | N/A | Restricted server boundary |

---

# 9. Row Level Security (RLS) strategy

RLS is the preferred database-level defense for tenant isolation.

The Stage 4 audit could not verify the complete migration/policy set through the available repository interface, so the following is a **required target model**, not a claim about current policy implementation. fileciteturn117file0L2-L2

For owner-scoped tables, the intended model is conceptually:

```text
authenticated user
      ↓
auth.uid()
      ↓
record.owner_id = auth.uid()
```

Where records are portfolio-scoped rather than directly owner-scoped:

```text
auth.uid()
   ↓
portfolio ownership
   ↓
record.portfolio_id
```

### RLS verification checklist

For every tenant-bearing table:

- RLS enabled.
- SELECT policy verified.
- INSERT policy verified.
- UPDATE policy verified.
- DELETE policy verified.
- Anonymous behavior verified.
- Cross-tenant denial tested.
- Service-role behavior explicitly understood.

---

# 10. Service-role client audit

The service-role client is the largest trust-boundary concern.

Current repository evidence shows it is used for authenticated management operations and public operations. fileciteturn114file0L2-L2

## Required classification

Every service-role operation must be classified as:

1. **Essential privileged operation**
2. **Could use caller-scoped client**
3. **Public operation requiring tightly constrained server logic**
4. **Unnecessary elevated access and should be removed**

### Required rule

A developer must not introduce a service-role query merely because it is convenient.

---

# 11. Public query security

Public functions are security-sensitive because they are reachable without an authenticated user.

Every public query must explicitly define:

- Which portfolio it resolves.
- Whether the portfolio is published.
- Which content status is allowed.
- Which fields are returned.
- Whether related records inherit publication state.

The existing audit identified a specific concern around testimonials because its query did not visibly apply the same publication filtering used by several other profile entities. This must be verified against the actual schema and intended product behavior. fileciteturn114file0L2-L2

---

# 12. Storage security

Current uploads are stored under user-scoped paths and returned through signed URLs. However, the audit did not verify robust file-size/type validation. fileciteturn114file0L2-L2

## Required controls

### Upload

- Authenticate uploader.
- Associate upload with owner.
- Enforce maximum size.
- Validate MIME type server-side.
- Validate extension.
- Reject executable/dangerous file classes.
- Sanitize filename/path components.
- Generate server-controlled object paths.

### Read

- Public assets should be deliberately public.
- Private assets should require authorization/signed access.
- Signed URL lifetime must be intentional.

### Delete

- Verify object ownership.
- Delete database references appropriately.
- Remove orphaned objects.

---

# 13. Contact and service inquiry security

These are public write endpoints and therefore abuse-sensitive.

Required controls:

- Input validation.
- Length limits.
- Email format validation.
- CR/LF header-injection protection.
- Rate limiting.
- Spam detection/challenge where necessary.
- Abuse logging where appropriate.
- No internal error leakage.
- Safe email rendering.
- Owner notification without exposing owner credentials.

The existing audit specifically identifies the lack of verified rate limiting/CAPTCHA-equivalent protection and the hard-coded notification recipient as issues to address. fileciteturn114file0L2-L2

---

# 14. Contact/inquiry consistency

The service inquiry flow currently writes to both `service_inquiries` and `contact_messages`.

This is a transitional compatibility model.

Required future behavior:

```text
Visitor submission
      ↓
Canonical transaction
      ↓
Canonical inquiry/message
      ↓
Optional inbox projection
      ↓
Notification
```

If dual writes remain temporarily, failure handling must be explicit and observable.

---

# 15. MCP security

MCP is an authenticated integration surface.

Required controls:

- Authenticate every MCP request.
- Establish the caller identity.
- Scope every tool to the caller's portfolio.
- Reject missing/expired/invalid credentials.
- Prevent tool parameters from overriding caller ownership.
- Avoid service-role access unless absolutely required.
- Validate input schemas.
- Limit dangerous operations.
- Keep tool registry and documentation synchronized.
- Log security-relevant failures without secrets.

The existing MCP implementation already uses caller authentication and ownership filtering in inspected tools, but contract and runtime verification remain required. fileciteturn114file0L2-L2

---

# 16. Secrets management

Secrets include:

- Supabase service-role key.
- Email connector credentials.
- OAuth client secrets.
- MCP authentication secrets.
- AI provider credentials.
- Deployment credentials.

Rules:

1. Store only in secure environment configuration.
2. Never commit secrets.
3. Never expose server-only variables to browser code.
4. Rotate compromised credentials immediately.
5. Document ownership and rotation responsibility.
6. Keep development and production credentials separate.

---

# 17. Data lifecycle

## Creation

Validate data before persistence.

## Update

Verify authentication and ownership before mutation.

## Publication

Publishing changes public visibility but must not alter ownership.

## Unpublishing

Public routes must stop returning the content.

## Deletion

Delete or anonymize according to the entity's lifecycle policy.

## Account deletion

Cascade or explicitly clean up owned data and Storage objects.

## Retention

The platform should define retention for:

- Contact messages.
- Service inquiries.
- Notification events.
- Security logs.
- Deleted accounts.
- Orphaned media.

No arbitrary retention period should be invented without product/legal/business approval.

---

# 18. Backup and recovery

The production system must define:

- Database backup strategy.
- Storage backup/retention strategy.
- Recovery Point Objective (RPO).
- Recovery Time Objective (RTO).
- Restore testing frequency.
- Incident ownership.

RPO means the maximum acceptable amount of recent data that could be lost after a failure.

RTO means the maximum acceptable time to restore service after a failure.

These are operational requirements, not currently verified repository features.

---

# 19. Privacy requirements

The platform collects professional profile data and visitor-submitted contact information.

Privacy-by-design requirements include:

- Collect only necessary visitor data.
- Do not expose visitor messages publicly.
- Do not expose authentication data.
- Provide a clear account deletion process.
- Define data retention.
- Document third-party processors/integrations.
- Avoid unnecessary analytics collection.
- Keep production secrets out of client code.

A final legal/privacy policy is a product/legal deliverable and should not be generated from technical assumptions alone.

---

# 20. Threat model

| Threat | Attack path | Impact | Primary control |
|---|---|---|---|
| Cross-tenant read | Guess record ID/portfolio | High | RLS + owner checks |
| Cross-tenant mutation | Manipulate ID in request | Critical | RLS + owner checks |
| Draft leakage | Public query missing status | High | Publication filters |
| Secret exposure | Client bundle/env mistake | Critical | Server-only secrets |
| Malicious upload | Dangerous file upload | High | Type/size validation |
| Spam contact | Public endpoint automation | Medium | Rate limit/challenge |
| Email injection | CR/LF in header data | High | Header sanitization |
| MCP abuse | Unauthorized tool call | High | Auth + owner scope |
| Orphaned media | Deleted record leaves file | Medium | Lifecycle cleanup |
| Data inconsistency | Inquiry dual-write failure | Medium | Transaction/canonical model |
| Account remnants | Deletion leaves data | High | Deletion workflow |
| Credential compromise | Leaked service key | Critical | Secret management + rotation |

---

# 21. Security test matrix

Before production, automated or repeatable tests must cover:

### Authentication

- Valid login.
- Invalid credentials.
- Expired session.
- Password reset.
- OAuth callback.
- Logout/session invalidation.

### Authorization

- User A cannot read User B's project.
- User A cannot update User B's project.
- User A cannot delete User B's project.
- User A cannot access User B's messages.
- User A cannot delete User B's media.
- MCP caller cannot operate on another portfolio.

### Publication

- Draft content is not public.
- Unlisted content follows documented behavior.
- Archived content is not unintentionally public.
- Unpublished portfolio is not publicly exposed.

### Storage

- Oversized upload rejected.
- Invalid MIME rejected.
- Unauthorized deletion rejected.
- Cross-user object access rejected.

### Public forms

- Invalid payload rejected.
- Rate limit enforced.
- Header injection rejected.
- Service belonging to another portfolio rejected.

### Account lifecycle

- Account deletion removes required data.
- Media cleanup occurs.
- Public URLs stop resolving.
- Authentication identity is removed/anonymized according to policy.

---

# 22. Production security gates

The following should block production release if unresolved:

1. Unverified tenant isolation.
2. Unverified RLS policy coverage.
3. Any confirmed cross-tenant access path.
4. Public leakage of private/draft content.
5. Service-role key exposure.
6. Unsafe file upload path.
7. Uncontrolled privileged MCP mutation.
8. Missing critical authentication behavior.
9. Missing critical account deletion behavior.
10. Critical security regression test failures.

---

# 23. Stage 5 conclusion

The platform has a credible security foundation, but it currently depends too heavily on application-level correctness around privileged database access.

The most important production transition is therefore:

> **Move from “we believe every server function filters correctly” to “database policies, server authorization, tests, and runtime verification collectively prove tenant isolation.”**

Stage 5 therefore establishes the security target and the exact verification model needed for production sign-off.

**Next:** Stage 6 — Quality Assurance, Testing & Reliability Architecture.
