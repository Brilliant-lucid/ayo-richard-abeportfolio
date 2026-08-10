# Implementation Roadmap

## Purpose

This document is the execution order for the current portfolio-platform remediation and refinement work. It is the source of truth for **what should be done first, what depends on what, and when migration and verification must happen**.

GitHub Issues describe the individual pieces of work. This document describes the dependency chain and implementation sequence so work is not completed out of order.

## Current scope

This roadmap currently coordinates:

- #20 — Refine unified admin content structure and publishing controls
- #22 — Sync published case studies with public profile and admin management
- #8 — Complete admin management for professional profile entities
- #51 — Refine public portfolio information architecture and responsive presentation
- #16 — End-to-end critical product flow verification

---

# Execution order

```text
PHASE 0
Baseline + schema/data audit
        |
        v
PHASE 1
Migration + compatibility preparation
        |
        v
PHASE 2
Admin information architecture + content model
        |
        +--------------------+
        |                    |
        v                    v
PHASE 3A              PHASE 3B
Project/Case Study     Professional entities
source-of-truth        management
        |                    |
        +---------+----------+
                  |
                  v
PHASE 4
Public information architecture + responsive UX
                  |
                  v
PHASE 5
End-to-end QA + regression verification
                  |
                  v
PHASE 6
Documentation + cleanup + release readiness
```

The phases are intentionally ordered. Do not begin broad public-UI work before the underlying data/source-of-truth behavior is stable.

---

# Phase 0 — Baseline and data audit

**Goal:** Understand the existing schema, routes, legacy fields, relationships, and current public/admin data sources before changing them.

### Tasks

1. Review the current Supabase schema and generated types.
2. Identify all Project and Case Study fields and relationships.
3. Identify legacy Project fields that are still mirrored for compatibility.
4. Identify current `publish_as` behavior.
5. Identify current Profile, Hero, Experience, Skills, Certifications, Awards, Publications, and Testimonials data sources.
6. Trace every relevant admin query/write to its public query/rendering counterpart.
7. Identify hard-coded/demo content currently appearing on the public portfolio.
8. Record existing routes that will be removed, merged, redirected, or preserved.
9. Establish a backup/export point before any destructive schema or data change.

### Dependencies

None. This is the starting point.

### Exit gate

Do not proceed until the team can answer:

- Where does every affected piece of data live?
- Which fields are legacy?
- Which fields are authoritative?
- Which public sections consume which records?
- Which records need migration?

---

# Phase 1 — Migration and compatibility preparation

**Goal:** Make the data model safe to change before changing the admin or public experience.

This phase comes **before UI refactoring** because the new admin and public behavior must operate against a stable source of truth.

## 1.1 Project and Case Study migration

Confirm and, where required, migrate the Project/Case Study model so it can represent:

- Project Title
- Case Study Title
- Project-only publishing
- Case Study-only publishing
- Project + Case Study publishing
- Existing project/case-study relationships
- Existing slugs and public URLs
- Existing media and SEO data

### Migration rules

- Never overwrite an existing Project Title with a Case Study Title.
- Never lose existing case-study content while introducing the new title field.
- Preserve existing IDs and relationships wherever possible.
- Preserve public URLs unless a verified redirect is required.
- Backfill Case Study Title from the safest existing source only where appropriate.
- Keep legacy compatibility fields until all application reads/writes have been migrated and verified.

## 1.2 Profile/Hero data preparation

Map existing Hero/Profile fields to their intended destinations:

### Hero

- Name
- Headline/tagline
- Eyebrow
- Short introduction
- Image
- Availability
- Location where appropriate
- Primary CTA
- Secondary CTA

### Professional highlights

- Experience
- Industries
- Expertise
- Availability where appropriate

### About

- Full introduction
- Bio
- Vision/Mission
- Experience
- Credentials
- Other detailed professional information

Do not delete fields merely because they move out of the homepage. First establish their new destination and confirm that existing data remains accessible.

## 1.3 Backup and rollback

Before applying any production migration:

- Confirm database backup/recovery availability.
- Record the pre-migration schema state.
- Record affected row counts.
- Record representative records for Projects, Case Studies, Profile/Hero, and professional entities.
- Prepare a rollback strategy for every destructive change.

### Dependencies

Phase 0 complete.

### Exit gate

Migration is safe to apply, existing data has a known destination, and rollback/recovery is understood.

---

# Phase 2 — Admin information architecture and content model

**Primary issue:** #20

**Goal:** Make the authenticated dashboard correctly represent the underlying content model.

### Order

1. Complete Profile & Hero grouping.
2. Establish explicit field-to-public-section mapping.
3. Complete Projects & Case Studies as the single management experience.
4. Add/verify separate Project Title and Case Study Title.
5. Implement/verify the three publishing modes.
6. Remove or safely redirect stale standalone Case Study administration routes.
7. Complete grouped professional-entity management.
8. Remove stale navigation and route references.
9. Preserve existing data and URLs.

### Important rule

The admin UI should be built around the **data model**, not the current visual homepage.

A field can remain available in admin even if it no longer appears on the homepage.

### Dependencies

Phase 1 migration/model preparation complete.

---

# Phase 3A — Project and Case Study source-of-truth synchronization

**Primary issue:** #22

**Depends on:** Phase 2

**Goal:** Ensure Projects & Case Studies are fully synchronized between admin, database, and public portfolio.

### Required behavior

| Publishing mode | Projects | Case Studies |
|---|---|---|
| Project only | Visible | Hidden |
| Case Study only | Hidden | Visible using Case Study Title |
| Project + Case Study | Visible using Project Title | Visible using Case Study Title |

### Tasks

1. Verify admin writes.
2. Verify database records.
3. Verify ownership/portfolio filtering.
4. Verify publish status filtering.
5. Verify Project Title rendering.
6. Verify Case Study Title rendering.
7. Remove/replace dummy public Case Study data.
8. Verify ordering.
9. Verify project and case-study detail pages.
10. Verify existing links and slugs.

### Exit gate

Create one test record for each publishing mode and confirm that each appears exactly where expected.

---

# Phase 3B — Professional entity management

**Primary issue:** #8

**Depends on:** Phase 2

**Goal:** Establish reliable management and public rendering for professional-profile entities.

### Entities

- Experience
- Skills
- Certifications
- Awards
- Publications
- Testimonials

### Tasks

For each applicable entity:

1. Identify source of truth.
2. Confirm authenticated management path.
3. Confirm ownership and authorization.
4. Confirm create/edit/delete behavior where supported.
5. Confirm ordering where applicable.
6. Confirm publish/hide behavior where applicable.
7. Confirm public rendering consumes managed records.
8. Remove static/demo testimonial content.

### Exit gate

A test record created/edited in admin can be traced through persistence to the correct public section.

---

# Phase 4 — Public information architecture and responsive UX

**Primary issue:** #51

**Depends on:** Phases 2, 3A, and 3B

**Goal:** Refine the public portfolio only after the underlying data relationships are trustworthy.

## 4.1 Homepage

Keep the Hero focused on:

- Identity
- Headline
- Short introduction
- Image
- Availability
- Appropriate location information
- CTAs

Remove the default large numeric metric block.

Replace it with compact, data-driven professional highlights such as:

- Experience
- Industries
- Expertise
- Availability

## 4.2 About

Move the detailed professional story into the About page:

1. Full professional introduction
2. Bio
3. Vision/Mission
4. Experience
5. Industries
6. Expertise/skills
7. Certifications/credentials
8. Other appropriate professional information

Avoid duplicating the same long-form content on the homepage.

## 4.3 CTA behavior

Public CTA labels and destinations must come from the Profile & Hero configuration.

No hard-coded destination should override an explicitly configured user destination.

## 4.4 Projects on mobile

Use:

- Horizontal scrolling/swiping
- Scroll snapping where appropriate
- Partial next-card visibility
- Optional pagination indicator
- No autoplay
- Touch and keyboard accessibility

The actual cards must use published backend Project records.

## 4.5 Blogs

Preserve the existing Blog presentation unless another verified issue requires a change.

## 4.6 Testimonials

Render managed testimonial records rather than static/demo content.

### Exit gate

The public portfolio presents the correct information hierarchy and all visible dynamic content is backed by verified managed data.

---

# Phase 5 — End-to-end QA and regression verification

**Primary issue:** #16

**Depends on:** Phases 1–4

**Goal:** Verify the complete user journey rather than testing individual features in isolation.

### Critical flow

1. Sign up/sign in.
2. Complete Profile & Hero.
3. Configure CTA labels and destinations.
4. Create/update professional entities.
5. Create a Project.
6. Create Case Study content.
7. Test Project-only publishing.
8. Test Case Study-only publishing.
9. Test Project + Case Study publishing.
10. Upload media.
11. Visit the public portfolio.
12. Verify homepage information hierarchy.
13. Verify About page content.
14. Verify Projects.
15. Verify Case Studies.
16. Verify Blogs.
17. Verify Testimonials.
18. Verify Services and contact flow.
19. Test mobile layout and horizontal Project scrolling.
20. Verify authentication and ownership boundaries.
21. Verify Model Context Protocol (MCP) operations where applicable.

### Required regression checks

- Existing portfolio URLs still work.
- Existing published records are not lost.
- Draft content remains private.
- One user's records never appear on another user's portfolio.
- CTA configuration is respected.
- No dummy data remains in dynamic public sections.
- No stale admin navigation remains.
- No broken Case Study links remain.

### Minimum automated verification

```bash
npm run lint
npm run build
```

Where external services are involved, perform environment-based end-to-end checks as well.

### Exit gate

No critical regression remains open. Any discovered independent defect becomes a new issue rather than being silently folded into an unrelated task.

---

# Phase 6 — Documentation, cleanup, and release readiness

**Depends on:** Phase 5

### Tasks

1. Update `docs/FEATURES.md` statuses.
2. Update `docs/ARCHITECTURE.md` where the final data model or routing changed.
3. Update `docs/DEVELOPMENT.md` if the implementation workflow changed.
4. Update this roadmap with completed phases and any deferred work.
5. Update `CHANGELOG.md` with meaningful user-facing changes.
6. Remove obsolete compatibility code only after confirming no remaining reads/writes depend on it.
7. Remove stale routes/components only after migration and regression verification.
8. Confirm SEO/public routes and redirects where relevant.
9. Close the relevant GitHub Issues only after their acceptance criteria and the final QA gate are satisfied.

---

# Dependency matrix

| Issue | Work | Depends on | Can start |
|---|---|---|---|
| #20 | Admin IA + content model | Phase 0–1 | After migration preparation |
| #22 | Project/Case Study synchronization | #20 + migration | After Project/Case Study model is stable |
| #8 | Professional entity management | Phase 0–1, admin IA | In parallel with #22 after Phase 2 foundations |
| #51 | Public UX/information architecture | #20 + #22 + #8 | After source-of-truth behavior is verified |
| #16 | End-to-end QA | #20 + #22 + #8 + #51 | Last |

## Parallelization rule

After Phase 2 is complete, **#22 and #8 can progress in parallel** because they concern different data domains. **#51 should wait for both**, because the public presentation depends on trustworthy Project/Case Study and professional-entity data.

---

# Migration rules of record

These rules apply to all implementation work in this roadmap:

1. **Preserve before replacing.** Existing data must have a verified destination before old fields/routes are removed.
2. **Migrate before switching reads.** Add/backfill new fields before changing application reads to depend on them.
3. **Switch writes only after the new representation is verified.**
4. **Keep compatibility fields temporarily when necessary.** Remove them only after a verified cleanup pass.
5. **Do not silently change public URLs.** Preserve existing URLs or provide explicit redirects.
6. **Do not use UI appearance as evidence of data correctness.** Verify the database/source-of-truth path.
7. **Do not remove static/demo content until the real source is confirmed.**
8. **Do not close a migration-related issue until representative existing records have been verified.**
9. **Every destructive migration must have a recovery strategy.**
10. **The public portfolio must always be filtered by the correct portfolio owner and publication state.**

---

# Definition of done for this roadmap

The work is complete when:

- The new admin information architecture is stable.
- Existing data has been safely migrated or intentionally preserved through compatibility handling.
- Project and Case Study publishing behavior is deterministic.
- Project Title and Case Study Title are independent where required.
- Professional entities have verified management/source-of-truth paths.
- The homepage is focused and no longer duplicates the full About content.
- Professional highlights are data-driven.
- CTAs respect admin configuration.
- Projects and Case Studies are backed by real published data.
- Mobile Project browsing is horizontally scrollable without autoplay.
- Testimonials are managed rather than static/demo.
- End-to-end QA passes.
- Documentation reflects the final architecture.
- Only then should the related issues be closed.
