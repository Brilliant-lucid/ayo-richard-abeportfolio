# Stage 4 — Data Dictionary Baseline

**Project:** Portfolio Platform  
**Repository:** `Brilliant-lucid/ayo-richard-abeportfolio`  
**Date:** 2026-08-10

This document records the currently evidenced database entities at an architectural level. It is intentionally not a copy of generated TypeScript types. Exact column-level contracts must remain derived from the generated Supabase definitions and database migrations until a formal schema specification is produced.

## 1. Ownership convention

Most professional-content entities use an `owner_id` concept tying records to the authenticated portfolio owner. This is a central tenant boundary.

The generated Supabase types explicitly expose owner fields on entities such as awards and blog posts. fileciteturn39file0L2-L2

## 2. Entity catalogue

| Entity | Purpose | Public role | Admin role | Key concerns |
|---|---|---|---|---|
| `portfolios` | User's portfolio identity and publication state | Resolves public portfolio | Identity management | Username uniqueness, deletion, publication |
| `hero` | Hero/professional introduction | Public profile | Hero editing | Ownership, public field selection |
| `site_settings` | Site configuration and defaults | Public presentation | Site configuration | SEO/social exposure |
| `nav_links` | Portfolio navigation | Public navigation | Navigation management | Ordering, allowed destinations |
| `stats` | Portfolio statistics | Public presentation | Stats management | Derived vs manual values |
| `projects` | Professional work | Public work | Project CRUD | Legacy/new fields, publication |
| `case_studies` | Structured case-study content | Public case studies | Case-study management/transition | Project source of truth |
| `blog_posts` | Professional writing | Public content | Blog CRUD | Publication, SEO, related content |
| `experience` | Work history | Public credentials | Admin management | CRUD completeness |
| `certifications` | Credentials | Public credentials | Admin management | CRUD completeness |
| `skills` | Professional capabilities | Public profile/project context | Admin management | Semantic redesign under #21 |
| `awards` | Awards | Public credentials | Admin management | CRUD completeness |
| `publications` | Published works | Public credentials | Admin management | CRUD completeness |
| `testimonials` | Social proof | Public social proof | Admin management | CRUD completeness |
| `marketing_work` | Marketing work | Public profile/work | Admin management | Scope/relationship definition |
| `contact_messages` | General visitor messages | Private to owner | Message management | Overlap with service inquiries |
| `services` | Service offerings and inquiry configuration | Public services | Service CRUD | Pricing/availability/inquiry relationship |

## 3. Common data concerns

### Publication

Publicly rendered content must have an explicit publication/status rule.

### Ownership

Owner-scoped records must be protected from cross-tenant access.

### Ordering

Several content entities use display ordering. Ordering rules should be documented consistently rather than implemented differently by feature.

### Timestamps

Created/updated/publication timestamps should have consistent semantics across content entities.

### Slugs

Public slug-bearing entities require uniqueness and collision rules within their relevant portfolio scope.

### Media

Media references must have a defined ownership and deletion lifecycle.

## 4. Transitional models

### Projects

The project entity contains newer structured information alongside legacy compatibility fields. The current application mirrors values to preserve compatibility.

### Case studies

Case-study records exist, but the product is transitioning toward a project-centric source of truth with explicit publication mode.

### Contact/inquiries

General contact messages and service inquiries overlap and require a canonical data model decision.

## 5. Required future schema specification

The final schema document must provide, for every table:

- Column name
- Type
- Nullability
- Default
- Primary key
- Foreign key
- Unique constraint
- Check constraint
- Indexes
- Row Level Security (RLS) policies
- Owner relationship
- Public/private classification
- Lifecycle behavior
- Delete behavior
- Migration history

That full specification belongs after the security/data-lifecycle audit, so the documented constraints reflect the final security model rather than merely copying current generated types.
