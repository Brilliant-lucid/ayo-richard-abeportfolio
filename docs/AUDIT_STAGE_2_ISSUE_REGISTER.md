# Stage 2 — GitHub Issue Register & Triage Audit

**Project:** Portfolio Platform  
**Repository:** `Brilliant-lucid/ayo-richard-abeportfolio`  
**Audit date:** 2026-08-10  
**Purpose:** Establish the authoritative interpretation of the repository's GitHub Issues before the production-readiness documentation and remediation phases.

---

## 1. Why this register exists

The repository already has a substantial GitHub issue history. The problem is not a lack of issues; it is that the issue tracker now spans several different purposes:

- Historical product milestones
- Current implementation work
- Security remediation
- Technical debt
- Bugs
- Quality assurance
- Deployment
- Future product features
- Future infrastructure migration
- Ongoing historical tracking

These categories must not be mixed.

A closed historical issue is not the same thing as a completed production-readiness task. An open feature issue is not automatically a launch blocker. A security issue should not be closed merely because the feature it affects exists.

This document establishes the current triage model.

---

# 2. Issue status vocabulary

The following interpretation is used throughout the production-readiness program.

| Classification | Meaning |
|---|---|
| **HISTORICAL** | Records something already established from Git/source evidence. It should normally remain closed and should not be reopened for ordinary future work. |
| **TRACKER** | Intentionally remains open as a durable record for future changes or historical continuity. |
| **BLOCKER** | Must be resolved or explicitly risk-accepted before production launch. |
| **ACTIVE** | Current implementation or verification work that is directly relevant to the present release. |
| **FEATURE** | Product functionality being added or expanded. Whether it blocks launch depends on the agreed Version 1.0 scope. |
| **TECH DEBT** | Architecture/maintenance work required to make the implementation safer, clearer, or more maintainable. |
| **QA** | Verification work required to establish that existing functionality actually works end-to-end. |
| **DEPLOYMENT** | Production infrastructure or release-path work. |
| **FUTURE** | Intentionally deferred work that should not be treated as a Version 1.0 blocker unless scope changes. |

---

# 3. Current issue register

## Issue #3 — Project history tracker

**Title:** `[PROJECT HISTORY] Establish complete feature and change history in GitHub Issues`  
**Current state:** Open  
**Classification:** `TRACKER`  
**Launch blocker:** No  

### Assessment

This is an intentional ongoing historical tracker. It documents the rule that meaningful future changes should be represented in GitHub Issues and that historical claims must be supported by Git/source evidence.

### Finding

Its historical role is correct, but its current-work section is stale. It currently highlights only #20 and #21 even though the repository now contains many additional active issues.

### Required treatment

Keep open. Do not close. Refresh its current-work references during documentation governance rather than converting it into a normal feature issue.

---

## Issue #4 — Supabase Row Level Security and service-role audit

**Title:** `[SEC-001] Audit and harden Supabase Row Level Security (RLS) and service-role access`  
**Current state:** Open  
**Classification:** `BLOCKER / SECURITY`  
**Priority:** High

### Assessment

This is a genuine production-readiness blocker.

The application uses a server-side Supabase service-role client that bypasses Row Level Security (RLS). Therefore tenant isolation cannot be considered proven until all trusted server paths are audited.

### Dependencies

- #5 authorization tests
- #11 storage security
- #16 end-to-end verification

### Required treatment

Keep open until authorization/tenant-isolation behavior is verified and documented.

---

## Issue #5 — Automated authorization and tenant-isolation tests

**Title:** `[SEC-002] Add automated authorization and tenant-isolation tests`  
**Current state:** Open  
**Classification:** `BLOCKER / QA / SECURITY`

### Assessment

The repository currently has no verified automated test runner. Static inspection cannot prove that one user cannot access another user's resources under manipulated IDs.

This issue is therefore a major production-readiness blocker.

### Required treatment

Keep open. Establish a repeatable test framework and critical authorization coverage before the final launch gate.

---

## Issue #6 — Public submission abuse protection

**Title:** `[SEC-003] Add rate limiting and abuse protection to public submissions`  
**Current state:** Open  
**Classification:** `BLOCKER / SECURITY`

### Assessment

The public contact and service-inquiry endpoints are externally reachable. Spam, automated submission, notification flooding, and database flooding need an explicit protection policy before broad public launch.

### Dependencies

- #12 email security/configuration
- #16 end-to-end verification

### Required treatment

Keep open. The final solution may use rate limiting, throttling, bot protection, or an equivalent mechanism depending on the production infrastructure.

---

## Issue #7 — Legacy/new project field cleanup

**Title:** `[TECH-001] Clean up legacy and new project fields`  
**Current state:** Open  
**Classification:** `TECH DEBT / ACTIVE`

### Assessment

The project editor and server functions currently maintain both newer structured fields and older compatibility fields. The source explicitly mirrors values such as title/name, roles/role, overview/description, and challenge/problem.

This is not necessarily an immediate security vulnerability, but it creates data-model ambiguity and future maintenance risk.

### Launch treatment

**Important, but not automatically a launch blocker** if compatibility behavior is proven stable. It should be resolved before the platform is considered architecturally mature.

### Dependency

- #21 project content-model changes

---

## Issue #8 — Professional profile admin management

**Title:** `[FEAT-001] Complete admin management for professional profile entities`  
**Current state:** Open  
**Classification:** `ACTIVE / FEATURE / VERIFICATION`

### Assessment

The issue was created before the grouped admin refactor. The current repository now contains a reusable collection editor and grouped routes for Experience & Credentials and Publications & Testimonials.

Therefore the original assumption that these entities simply lacked management UI is no longer sufficient.

### Required next action

Verify the actual capabilities of:

- Experience
- Certifications
- Skills
- Awards
- Publications
- Testimonials

against the new grouped admin implementation.

### Relationship

This issue overlaps with #20 and #21 and should eventually be treated as part of the broader admin/content-model verification rather than as an isolated feature.

### Launch treatment

Potential blocker for a complete professional portfolio CMS, but the exact Version 1.0 requirement must be confirmed before calling it a launch blocker.

---

## Issue #9 — MCP instruction/tool alignment

**Title:** `[TECH-002] Align MCP (Model Context Protocol) instructions with registered tools`  
**Current state:** Open  
**Classification:** `BLOCKER / TECH / SECURITY`

### Assessment

This finding is confirmed by current source inspection.

The MCP instructions mention case studies and site settings, while the registered tool list currently exposes portfolio retrieval, projects, blog posts, messages, and hero management without dedicated case-study or site-settings tools.

### Required treatment

Either:

1. implement and secure the advertised tools, or
2. remove unsupported capabilities from the MCP instructions.

Every exposed write operation must also be verified for authorization and ownership.

---

## Issue #10 — Contact messages/service inquiries data model

**Title:** `[TECH-003] Review contact message and service inquiry data model`  
**Current state:** Open  
**Classification:** `TECH DEBT / DATA ARCHITECTURE`

### Assessment

The application contains both a general contact-message path and a service-inquiry path. The issue correctly calls for a lifecycle/data-model decision before schema changes are made.

### Launch treatment

Should be resolved before the data model is considered stable. It becomes a launch blocker if the duplication can cause lost, duplicated, or contradictory customer inquiries.

---

## Issue #11 — Media upload/storage security

**Title:** `[SEC-004] Harden media upload validation and storage access`  
**Current state:** Open  
**Classification:** `BLOCKER / SECURITY`

### Assessment

The application supports authenticated media upload through Supabase Storage. The source validates image type and size in the project editor, but production readiness requires a server-side policy, storage access verification, path isolation, and URL-lifetime review.

### Required treatment

Keep open until storage policy and upload behavior are verified, not merely until client-side validation exists.

---

## Issue #12 — Email notification security/configuration

**Title:** `[SEC-005] Harden email notification security and configuration`  
**Current state:** Open  
**Classification:** `BLOCKER / SECURITY / OPERATIONS`

### Assessment

The issue identifies a hard-coded notification recipient and potential user-controlled values entering email-related configuration. Email is part of the public contact/visitor-notification surface, so the configuration needs production-safe handling.

### Required treatment

Keep open until recipient configuration, header validation, failure behavior, rate limiting, and secret handling are verified.

---

## Issue #13 — Robots and sitemap

**Title:** `[SEO-001] Add robots.txt and XML sitemap for public portfolio content`  
**Current state:** Open  
**Classification:** `ACTIVE / LAUNCH READINESS`

### Assessment

SEO metadata exists, but the repository audit did not find a root robots policy or sitemap implementation.

For a platform whose main value includes publicly discoverable professional portfolios, this should be completed before public launch.

### Launch treatment

Launch blocker for a properly prepared public discovery experience, although not a security blocker.

---

## Issue #14 — Production deployment architecture

**Title:** `[DEVOPS-001] Verify and document production deployment architecture`  
**Current state:** Open  
**Classification:** `BLOCKER / DEPLOYMENT`

### Assessment

The repository identifies the TanStack Start/Nitro build architecture but does not independently prove the production hosting provider, domain, SSL, environment configuration, storage integration, email integration, or rollback process.

### Relationship

Issue #37 is the concrete Vercel deployment milestone. #14 should remain the architecture/documentation parent, while #37 can establish the actual first deployment.

---

## Issue #15 — Generated-file boundaries

**Title:** `[REPO-001] Define and document generated-file boundaries`  
**Current state:** Open  
**Classification:** `TECH DEBT / REPOSITORY GOVERNANCE`

### Assessment

The repository already identifies several generated files, including the TanStack route tree and generated Supabase artifacts.

### Launch treatment

Not normally a launch blocker, but important for maintainability and future developer onboarding.

---

## Issue #16 — Critical end-to-end flow verification

**Title:** `[QA-001] Establish end-to-end critical product flow verification`  
**Current state:** Open  
**Classification:** `BLOCKER / QA`

### Assessment

This is one of the final gate issues. It depends on several underlying fixes being complete and then verifies the real user journey from authentication through publishing, public viewing, inquiries, email, and MCP.

### Dependency model

This issue should run after the relevant security, data-model, deployment, and feature issues have reached testable states.

### Required treatment

Keep open until the critical path is tested in a realistic configured environment.

---

## Issue #17 — Authentication history tracker

**Title:** `[FEATURE] Authentication and account management history`  
**Current state:** Open  
**Classification:** `TRACKER`

### Assessment

This is intentionally open as a durable feature-history record. It documents already verified authentication behavior and future changes.

### Required treatment

Keep open. Do not confuse it with security remediation #4/#5.

---

## Issue #18 — Portfolio/content history tracker

**Title:** `[FEATURE] Portfolio, profile, projects, case studies and public publishing history`  
**Current state:** Open  
**Classification:** `TRACKER`

### Assessment

This is an ongoing feature-history record, not a normal implementation task.

It currently contains some statuses that predate the newer admin refactor, so its feature-state summary should eventually be refreshed without destroying its historical purpose.

### Required treatment

Keep open as a tracker; update its current-state section later.

---

## Issue #19 — Services/contact/media/SEO/MCP history tracker

**Title:** `[FEATURE] Services, contact, inquiries, media, SEO and MCP integration history`  
**Current state:** Open  
**Classification:** `TRACKER`

### Assessment

Like #17 and #18, this is a durable feature-history record rather than a launch task.

Its current status should eventually be reconciled with #6, #9, #11, #12 and #13 rather than used as a substitute for those remediation issues.

---

## Issue #20 — Unified admin structure and publishing controls

**Title:** `Refine unified admin content structure and publishing controls`  
**Current state:** Open  
**Classification:** `ACTIVE / VERIFICATION`

### Current repository evidence

The current implementation confirms substantial progress:

- Profile & Hero is grouped.
- Projects & Case Studies is grouped.
- The standalone case-study admin route redirects to Projects.
- A reusable collection editor exists for grouped profile entities.
- The project editor includes `publish_as`.
- Supported publishing values are `project`, `case_study`, and `both`.

### Remaining verification

The issue should not yet be closed until the following are tested end-to-end:

1. Profile & Hero contains the intended fields.
2. Projects is the actual single source of truth for project/case-study editing.
3. All three publication modes behave correctly.
4. Public case-study rendering uses the correct source of truth.
5. Grouped profile entities can actually be managed as intended.
6. No stale admin navigation or broken routes remain.

### Relationship

#22 is a specific bug within this broader area.

---

## Issue #21 — Skills Applied and Tech Stack & Tools

**Title:** `Move Skills into Projects and separate Skills Applied from Tech Stack`  
**Current state:** Open  
**Classification:** `ACTIVE / FEATURE / DATA MODEL`

### Current evidence

The current project editor contains `roles` and `tools`, but the inspected form does not yet establish that the new conceptual distinction requested by this issue has been fully implemented as `Skills Applied` and `Tech Stack & Tools`.

### Assessment

The issue remains valid.

### Required treatment

Keep open until the new content model is explicitly implemented, migrated, rendered publicly, and documented.

---

## Issue #22 — Public/admin case-study synchronization

**Title:** `[BUG-001] Sync published case studies with public profile and admin management`  
**Current state:** Open  
**Classification:** `BLOCKER / BUG`

### Assessment

This is a concrete end-to-end defect against the Project/Case Study model. It should not be closed merely because the admin architecture has been refactored.

### Relationship

Parent/context: #20.  
The fix must prove that the same project/case-study source of truth drives both management and public rendering.

### Launch treatment

Blocker if case studies are part of the public Version 1.0 content promise.

---

## Issue #23 — WhatsApp social/contact link

**Title:** `[BUG-002] Add WhatsApp social/contact link to site settings and public profile`  
**Current state:** Open  
**Classification:** `ACTIVE / BUG`

### Assessment

This is a contained public-profile defect. It is important to the contact experience but does not have the same security severity as #4, #5, #6, #11 or #12.

### Launch treatment

Should be fixed before launch if WhatsApp is advertised as a supported contact channel.

---

## Issue #24 — AI-assisted services/blog generation

**Title:** `[FEAT-002] Extend AI-assisted content generation to services and blog posts`  
**Current state:** Open  
**Classification:** `FEATURE`

### Assessment

This is a product enhancement, not a security or infrastructure blocker.

Services are the first priority in the issue, with blog assistance following if the existing editor architecture supports it cleanly.

### Launch treatment

Only a blocker if AI-assisted service/blog generation has been explicitly defined as part of the Version 1.0 promise. Otherwise it can remain post-launch.

---

## Issue #25 — Initial portfolio presentation history

**Current state:** Closed  
**Classification:** `HISTORICAL`

### Assessment

Correctly closed. It records verified historical commits for the initial public portfolio presentation and content surfaces.

No reopening required.

---

## Issue #26 — Authentication evolution history

**Current state:** Closed  
**Classification:** `HISTORICAL`

### Assessment

Correctly closed. It records password reset, signup/sign-in refinements, and Google Single Sign-On (SSO) history.

No reopening required.

---

## Issue #27 — AI Assist and Model Context Protocol history

**Current state:** Closed  
**Classification:** `HISTORICAL`

### Assessment

Correctly closed as a historical milestone. Current MCP gaps remain active under #9 and should not reopen the historical issue.

---

## Issue #28 — Public portfolio publishing history

**Current state:** Closed  
**Classification:** `HISTORICAL`

### Assessment

Correctly closed as a historical record. Current publishing verification belongs to #20/#22 and deployment work belongs to #14/#37.

---

## Issue #29 — Project/public presentation history

**Current state:** Closed  
**Classification:** `HISTORICAL`

### Assessment

Correctly closed. It documents visual/content presentation evolution rather than current defects.

---

## Issue #30 — Services capability history

**Current state:** Closed  
**Classification:** `HISTORICAL`

### Assessment

Correctly closed as the services milestone. Current service-inquiry/security work remains elsewhere.

---

## Issue #31 — Repository documentation baseline history

**Current state:** Closed  
**Classification:** `HISTORICAL`

### Assessment

Correctly closed. The repository has since expanded beyond this original documentation baseline, which is why Stage 1 is now being performed.

---

## Issue #32 — AI code-review workflow history

**Current state:** Closed  
**Classification:** `HISTORICAL`

### Assessment

Correctly closed as a historical milestone for the merged AI code-review workflow.

---

## Issue #33 — Admin content architecture refactor history

**Current state:** Closed  
**Classification:** `HISTORICAL`

### Assessment

Correctly closed. It records the August 8 refactor and should remain separate from the verification still required by #20 and #22.

---

## Issue #34 — Career Profile-Based Onboarding

**Current state:** Open  
**Classification:** `FEATURE / FUTURE-MVP`

### Assessment

This introduces the profession-aware onboarding and Career Profile layer. It is a significant product architecture feature rather than a simple UI enhancement.

The issue is consistent with the portfolio model fields already present in the repository (`profession`, `career_profile`, `section_order`, `onboarded_at`), but the full onboarding behavior still requires implementation verification.

### Launch treatment

Potentially Version 1.0 core functionality if the intended product experience is profession-aware onboarding. Otherwise it is a major next-phase feature.

---

## Issue #35 — Career Profile and Visual Template System

**Current state:** Open  
**Classification:** `FEATURE / PRODUCT ARCHITECTURE`

### Assessment

This is one of the largest product architecture issues. It establishes the important separation between:

- Career Profile = content structure and professional recommendations.
- Visual Template = presentation, visual identity, layout and interaction design.

It should not be treated as a cosmetic template task.

### Launch treatment

If the new platform is intended to launch as the profession-aware, personalized portfolio product we have defined, this is a core feature. If Version 1.0 is limited to the current portfolio/CMS implementation, it can be a subsequent product phase.

---

## Issue #36 — Guided Portfolio Setup and Product Tour

**Current state:** Open  
**Classification:** `FEATURE / UX`

### Assessment

This is a user-activation and onboarding enhancement. It is valuable, but it should not block infrastructure/security completion.

### Launch treatment

Recommended for the polished public launch, but not a substitute for core security/QA readiness.

---

## Issue #37 — Vercel frontend deployment

**Current state:** Open  
**Classification:** `DEPLOYMENT / ACTIVE`

### Assessment

This is now the concrete deployment milestone reflecting the current decision to deploy the frontend to Vercel first while leaving backend migration for a later stage.

### Relationship

Parent architecture/documentation issue: #14.  
Backend inventory: #38.  
Future backend migration: #39.

### Launch treatment

Active launch blocker because the production release path must actually work.

---

## Issue #38 — Lovable Cloud backend inventory

**Current state:** Open  
**Classification:** `DEPLOYMENT / INFRASTRUCTURE / ACTIVE`

### Assessment

This is the correct bridge between the current Lovable-backed implementation and the future owned backend architecture.

It should inventory:

- Database
- Authentication
- OAuth
- Storage
- Server functions
- MCP
- Email integrations
- Environment dependencies

### Launch treatment

Important for ownership and migration planning. Whether it blocks the first Vercel launch depends on whether the current Lovable Cloud backend remains intentionally in production for that launch.

---

## Issue #39 — Owned Supabase backend migration

**Current state:** Open  
**Classification:** `FUTURE / INFRASTRUCTURE MIGRATION`

### Assessment

This is a later migration milestone, not an immediate launch blocker if the current backend remains supported and secure.

It should not be closed until the backend inventory and deployment strategy are settled.

---

# 4. Closed historical issue audit

The closed historical milestone set is internally coherent:

| Issue | Historical area | Treatment |
|---:|---|---|
| #25 | Initial portfolio presentation/content | Keep closed |
| #26 | Authentication evolution | Keep closed |
| #27 | AI Assist/MCP integration | Keep closed |
| #28 | Public portfolio publishing | Keep closed |
| #29 | Project/public presentation | Keep closed |
| #30 | Services/adaptive UI | Keep closed |
| #31 | Documentation baseline | Keep closed |
| #32 | AI code-review workflow | Keep closed |
| #33 | Admin content architecture refactor | Keep closed |

These issues should **not** be reopened merely because newer bugs or verification tasks concern the same feature area.

---

# 5. Important issue relationships

The current issue tracker becomes much easier to understand when treated as a dependency graph.

```text
                    ┌───────────────┐
                    │     #14       │
                    │ Deployment    │
                    └───────┬───────┘
                            │
                  ┌─────────┴─────────┐
                  │                   │
                #37                 #38
            Vercel deploy      Backend inventory
                                      │
                                      v
                                    #39
                              Future migration
```

```text
#4 Tenant isolation
       │
       ├── #5 Authorization tests
       │
       ├── #11 Storage security
       │
       └── #16 End-to-end verification

#6 Public abuse protection ──┐
#12 Email security ──────────┼──> #16 Critical flow verification
#22 Case-study sync ─────────┘
```

```text
#20 Unified admin architecture
       │
       ├── #22 Case-study publishing/sync bug
       ├── #8 Professional profile management verification
       └── #21 Skills Applied / Tech Stack model
```

```text
#34 Career Profile onboarding
       │
       ├── #35 Visual Template system
       └── #36 Guided setup/product tour
```

These relationships should be reflected in the final roadmap and documentation index.

---

# 6. Duplicate/overlap findings

The audit found several areas where issues overlap without being true duplicates.

### #14 and #37

Not duplicates.

- #14 = architecture and production deployment verification.
- #37 = concrete Vercel deployment milestone.

Recommended relationship: #14 as parent/documentation context, #37 as implementation milestone.

### #20 and #22

Not duplicates.

- #20 = unified admin architecture and publishing model.
- #22 = specific public/admin case-study synchronization defect.

Recommended relationship: #22 is a child defect under the #20 feature area.

### #8 and #20

There is meaningful overlap.

#8 was created before the grouped admin refactor and should now be treated primarily as a verification issue for the new grouped architecture.

### #17, #18, #19 versus remediation issues

These are not duplicates. They are historical/current feature trackers, while #4–#16 and #20–#24 contain actionable work.

### #34, #35, #36

These are related but distinct:

- #34 = Career Profile and profession-aware onboarding.
- #35 = structural/visual template architecture.
- #36 = guided setup and activation experience.

---

# 7. Current issue-health assessment

The repository's issue system is actually in a good state conceptually, but it now needs **governance rather than more random issue creation**.

### Strengths

- Historical milestones are separated into closed issues.
- Security work has explicit issue IDs.
- Technical debt is separated from feature work.
- QA has a dedicated final verification issue.
- Deployment has a staged set of issues.
- New product architecture features are explicitly described.
- Most issues contain objectives, scope and acceptance criteria.

### Weaknesses

- The current-work index in #3 and `docs/HISTORY.md` is stale.
- Some issues were written before later architectural changes and therefore need status reconciliation.
- Some feature trackers remain open even though their historical role is complete, which is intentional but should be clearly documented.
- There is not yet a formal milestone/label system connecting issues to Version 1.0 launch gates.
- Some acceptance criteria require runtime verification rather than source inspection.
- The issue set does not yet have a single authoritative production-readiness dependency map.

---

# 8. Recommended issue governance from this point

### Do not create another issue when:

- The work is already covered by an existing issue.
- The problem is simply a subtask of an existing issue.
- A historical milestone already exists.

### Create a new issue when:

- A new user-visible capability is introduced.
- A security vulnerability or security-control gap is discovered.
- A production incident is discovered.
- A separate technical-debt item has its own acceptance criteria and lifecycle.
- A feature needs independent tracking because it can be shipped independently.

### Closure rule

An issue should only be closed when its acceptance criteria have been satisfied and the required verification has been performed.

For security and production issues, **source-code implementation alone is not sufficient evidence of completion**.

---

# 9. Stage 2 conclusion

The current issue tracker is **usable as the foundation for the production-readiness program**.

The issues should not be deleted or wholesale recreated. The correct approach is to:

1. Preserve the closed historical milestone archive.
2. Preserve the intentional tracker issues.
3. Keep security and QA blockers open until verified.
4. Reconcile older feature issues against the newer admin architecture.
5. Establish parent/child relationships through documentation and issue references.
6. Introduce a formal Version 1.0 launch-gate classification later.
7. Refresh the stale history/current-work indexes.

### Current highest-priority blockers

1. **#4** — Tenant isolation/security audit
2. **#5** — Automated authorization tests
3. **#6** — Public submission abuse protection
4. **#9** — MCP tool/instruction alignment
5. **#11** — Media/storage security
6. **#12** — Email security/configuration
7. **#14** — Production deployment architecture
8. **#16** — Critical end-to-end verification
9. **#22** — Case-study synchronization, if case studies are part of launch scope
10. **#37** — Actual Vercel production deployment

### Major active product work

- #20 — Unified admin/publishing verification
- #21 — Skills Applied + Tech Stack & Tools
- #34 — Career Profile onboarding
- #35 — Career Profile + Visual Template system
- #36 — Guided setup/product tour

### Future infrastructure

- #38 — Backend inventory
- #39 — Owned Supabase migration

---

## 10. Final audit rule

From this point onward, the portfolio platform should use the following principle:

> **GitHub Issues describe the work. Git history proves what changed. Source code proves what exists. Runtime testing proves what works. Documentation explains why it exists and how it should be maintained.**

No single one of those sources should be treated as sufficient evidence for all four questions.
