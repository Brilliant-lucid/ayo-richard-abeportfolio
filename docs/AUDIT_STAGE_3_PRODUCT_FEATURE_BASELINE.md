# Stage 3 — Product & Feature Baseline

**Project:** Portfolio Platform  
**Repository:** `Brilliant-lucid/ayo-richard-abeportfolio`  
**Baseline date:** 2026-08-10  
**Program:** Production Readiness & Documentation Program (#40)  
**Evidence sources:** repository documentation, current source-code baseline, generated data types, and current GitHub issue register.

---

## 1. Purpose

Stage 3 establishes the product-level source of truth before the project moves into detailed architecture, data, security, user-experience, and launch documentation.

The purpose is not to rewrite the Product Requirements Document (PRD) yet. It is to answer a more fundamental question:

> **What product exists today, what capabilities are being actively built or repaired, and what belongs to the future roadmap?**

The baseline deliberately separates four states:

- **Implemented:** strong repository evidence exists for the capability.
- **Partial / needs verification:** meaningful implementation evidence exists, but completeness or end-to-end correctness is not established.
- **Active work:** represented by an open implementation, bug, security, quality, or deployment issue.
- **Future / proposed:** intended direction exists, but it must not be described as part of the current product until explicitly included in a Version 1.0 scope decision.

This distinction prevents product plans from being mistaken for implemented functionality.

---

## 2. Product identity

The application is a **multi-user professional portfolio platform**.

It is no longer accurately described as only a personal portfolio site or a static portfolio template. The current repository supports authenticated users managing portfolio records, publishing public professional profiles, presenting projects and professional content, receiving inquiries, and using Model Context Protocol (MCP) tooling for selected portfolio-management operations.

The product currently has four major surfaces:

```text
Platform
  /
  └── Marketing / discovery / account acquisition

Authenticated user workspace
  /auth
  /admin/*
  └── Portfolio management and publishing controls

Public professional identity
  /u/:username/*
  └── Published portfolio and public content

MCP integration
  /mcp
  └── Authenticated portfolio-management tools
```

The current public identity model is username/path based. A subdomain-per-portfolio architecture is not part of the verified current implementation baseline.

Repository evidence confirms this overall product model and the distinction between the platform landing site, authenticated management area, and public user portfolios. fileciteturn35file0L2-L2

---

## 3. Product evolution

The product's documented evolution is important to preserve because it explains why the current architecture contains both portfolio/CMS behavior and newer professional-identity concepts.

```text
Personal portfolio project
        ↓
Professional portfolio website
        ↓
Portfolio/CMS application
        ↓
Multi-user portfolio platform
        ↓
Professional identity platform
        ↓
Future identity / verification infrastructure
```

The final stage is a **future strategic direction**, not a current feature claim.

The historical development record is maintained separately through the project's history issues and historical milestone archive. Stage 3 therefore does not rewrite that history; it establishes the current product model that emerged from it.

---

## 4. Product capability map

### 4.1 Platform acquisition and discovery

**Status: Implemented**

The public landing page is the entry point for the platform itself. The existing feature inventory identifies platform value proposition, examples, workflow, features, pricing, frequently asked questions, testimonials, and calls to action as part of the landing experience.

**Current responsibility:** explain the platform and move visitors toward portfolio discovery or account creation.

**Verification boundary:** source code confirms the sections; production analytics, conversion performance, and real content still require runtime/product validation.

---

### 4.2 Account creation and authentication

**Status: Implemented, with production configuration dependencies**

Supported flows:

- Email/password registration.
- Email/password sign-in.
- Google OAuth.
- Password reset.
- Authenticated route protection.
- Server-side authenticated-user checks.

**Dependencies:** configured authentication provider and email delivery infrastructure.

**Important distinction:** authentication being implemented does not mean tenant isolation/security is fully verified. Security validation remains tracked separately in Issues #4 and #5.

The repository feature inventory explicitly identifies these flows as implemented. fileciteturn32file0L2-L2

---

## 5. Professional portfolio identity

### 5.1 Portfolio identity/profile

**Status: Implemented**

The current profile model supports core public identity information including:

- Username.
- Display name.
- Tagline.
- Avatar.
- Publication state.

The broader schema also contains newer profession-aware fields such as:

- `profession`
- `career_profile`
- `section_order`
- `onboarded_at`

Those fields establish architectural preparation for the Career Profile system, but their presence alone does not mean the full Career Profile onboarding system is implemented.

### 5.2 Public identity

**Status: Implemented**

Published portfolios are exposed through:

`/u/:username`

with nested public content routes.

**Current rule:** username/path routing is the source of truth for the current public URL architecture.

**Not current:** subdomain-per-user routing.

---

## 6. Hero and site presentation

### 6.1 Hero/profile presentation

**Status: Implemented**

The current data/rendering model supports professional introduction information such as:

- Profile image.
- Heading.
- Introduction.
- Availability.
- Location.
- Expertise.
- Industries.
- Mission.
- Experience years.
- Calls to action.

### 6.2 Site settings

**Status: Implemented**

Site-level configuration includes items such as:

- Site name.
- Email.
- Social links.
- Default search-engine optimization (SEO) values.
- Logo.

The August 2026 admin refactor groups Profile & Hero together while retaining Site settings as a separate management area.

---

## 7. Professional content model

The current portfolio is broader than a simple project gallery. It has a professional-content model covering work, credibility, services, and communication.

### 7.1 Projects

**Status: Implemented**

Projects currently support a substantial content model including:

- Draft/published/unlisted/archived states.
- Slugs.
- Featured status.
- Display ordering.
- Featured images.
- Galleries.
- Roles.
- Tools/categories.
- Problem.
- Solution.
- Process.
- Results.
- Goals.
- Constraints.
- Learnings.
- Metrics.
- Additional links.
- Live links.
- Case-study links/data.
- Publication date.
- SEO title/description.
- Canonical URL.
- Social image.
- Search-engine indexing control.
- Duplication.
- Media upload.

The repository currently retains legacy and newer project representations for compatibility. Cleanup is tracked separately under the technical-debt workstream.

The verified feature inventory confirms this project capability set. fileciteturn32file0L2-L2

### 7.2 Case studies

**Status: Partial / active verification**

Case studies are represented in the data and public rendering layers. The current architecture is moving toward Projects being the source of truth, with a `publish_as` model supporting:

- Project only.
- Case Study only.
- Project + Case Study.

However, public synchronization and complete administrative behavior are not yet considered verified. Issue #22 remains the active bug/verification record, while Issue #20 tracks the broader unified admin/publishing architecture.

### 7.3 Blog

**Status: Implemented**

Blog content supports:

- Title.
- Slug.
- Excerpt.
- Rich content.
- Category.
- Tags.
- Featured image.
- Publication state/date.
- Related project/case-study references.
- SEO title/description.

### 7.4 Experience

**Status: Partial / admin verification required**

Experience exists in the data/public rendering layer and is rendered publicly. Dedicated authenticated management must be verified through Issue #8 and the unified admin architecture work.

### 7.5 Certifications

**Status: Partial / admin verification required**

Certification records and public rendering exist. Complete authenticated management remains subject to verification.

### 7.6 Skills

**Status: Transitional / active redesign**

Skills exist in the current data/public rendering layer, but the product model is being intentionally changed.

The intended new model is:

```text
Skills Applied
    = professional capabilities demonstrated on a project

Tech Stack & Tools
    = technologies/tools used to execute the project
```

Issue #21 governs this change. A standalone generic Skills section should not be treated as the final product model until the issue is completed and verified.

### 7.7 Awards

**Status: Partial / admin verification required**

Awards are represented in the data/public presentation layer, but complete authenticated management is not yet verified.

### 7.8 Publications

**Status: Partial / admin verification required**

Publication records and public presentation are represented. Complete management requires verification under the grouped credentials/publications architecture.

### 7.9 Testimonials

**Status: Partial / admin verification required**

Testimonials are represented and publicly rendered. Complete authenticated management is not yet verified.

---

## 8. Services and professional conversion

### 8.1 Services

**Status: Implemented**

Portfolio owners can present professional services with structured information including:

- Category.
- Short description.
- Detailed description.
- Cover image.
- Pricing type.
- Starting price.
- Currency.
- Duration.
- Delivery time.
- Location.
- Availability.
- Featured state.
- Request acceptance.
- Custom action labels.
- Active/disabled/archived state.
- Ordering.

### 8.2 Contact

**Status: Implemented**

The public portfolio contains a contact flow allowing visitors to reach the portfolio owner.

### 8.3 Service inquiries

**Status: Implemented, data-model cleanup pending**

Visitors can submit structured service inquiries. Authenticated users can review resulting messages/inquiries.

The repository still contains an older general contact-message path alongside the newer service-inquiry flow. Issue #10 exists to determine and document the long-term data model rather than allowing multiple overlapping concepts to remain ambiguous.

### 8.4 WhatsApp contact

**Status: Active feature enhancement**

Issue #23 tracks a public WhatsApp contact link capability. This must be treated as an enhancement rather than retroactively described as already implemented.

---

## 9. Media

### Media uploads

**Status: Implemented / security verification pending**

Supabase Storage is used for uploaded portfolio media. The current implementation includes an upload path that returns a signed URL.

The feature is operationally present, but production readiness depends on verifying:

- File validation.
- Size limits.
- MIME/type restrictions.
- Ownership boundaries.
- Public/private access behavior.
- Deletion/orphan cleanup.
- Storage policies.

Issue #11 is the governing hardening work item.

---

## 10. Search-engine optimization and public discovery

### 10.1 Route metadata

**Status: Partially implemented**

Key public routes contain search-engine optimization metadata, canonical URLs, Open Graph metadata, Twitter cards, and structured data where implemented.

### 10.2 Robots and sitemap

**Status: Not implemented / active work**

A repository-managed `robots.txt` and XML sitemap were not found in the Stage 1 audit. Issue #13 governs this work.

### 10.3 Public indexing policy

The eventual policy must distinguish:

- Public published portfolio content.
- Draft content.
- Unlisted content.
- Authenticated/admin routes.
- Authentication pages.
- Platform utility routes.

The exact policy belongs to the SEO specification in a later stage.

---

## 11. Notifications

### Portfolio visitor notification

**Status: Partial / configuration-dependent**

The repository contains visitor-notification logic intended to notify a portfolio owner when their public portfolio is viewed. Browser-side throttling limits notification attempts.

Delivery depends on the configured mail integration.

Issue #12 governs email security/configuration hardening.

This should not be described as a fully production-verified notification service until actual delivery is tested.

---

## 12. Model Context Protocol (MCP)

**Status: Partial / active alignment work**

The platform contains an MCP endpoint with authenticated portfolio-management tools.

Verified tool categories include:

- Portfolio retrieval.
- Project listing/retrieval.
- Project create/update/delete.
- Blog listing/create/update/delete.
- Message listing.
- Hero update.

The MCP instruction layer currently advertises a broader capability set than the registered tools, notably around case studies and site settings.

Issue #9 is therefore a correctness/alignment issue, not evidence that MCP itself is absent.

---

## 13. Career Profile system

**Status: Planned / active product development**

Issue #34 defines the profession-aware onboarding and Career Profile foundation.

A Career Profile is intended to determine:

- Recommended sections.
- Section order.
- Default content blocks.
- Suggested calls to action.
- Recommended project types.
- Recommended service types.
- Default navigation.
- Empty-state guidance.

The architecture intentionally separates **profession** from **Career Profile**. Multiple professions may reuse one Career Profile.

Examples include:

- Software & Technology.
- Product & Design.
- Finance.
- Healthcare.
- Education.
- Business & Consulting.

The existence of `profession` and `career_profile` fields in the current schema should be treated as architectural preparation, not proof that the complete onboarding system is finished.

---

## 14. Visual Template System

**Status: Planned / active product development**

Issue #35 defines the visual template architecture.

The core product rule is:

> **Career Profile determines content structure and recommendations. Visual Template determines visual presentation.**

Visual Templates are expected to control:

- Layout.
- Typography.
- Color system/palettes.
- Cards.
- Spacing.
- Shapes.
- Imagery treatment.
- Navigation style.
- Animations/micro-interactions.
- Component appearance.
- Light/dark variations where appropriate.

The system should support genuinely different visual personalities rather than merely recoloring one layout.

Examples defined in the current product issue include:

- Minimal & Professional.
- Bold & Creative.
- Elegant & Premium.
- Modern Tech.
- Editorial.
- Friendly & Personal.
- Corporate.
- Creative Portfolio.

Profession should not force visual personality. A professional should be able to choose a presentation style independently of their Career Profile.

---

## 15. Guided onboarding and product tour

**Status: Planned / active product development**

Issue #36 defines a first-time setup experience that should guide users through:

1. Welcome.
2. Dashboard orientation.
3. Profile completion.
4. Experience and certifications.
5. Skills/capabilities.
6. Projects.
7. Services where relevant.
8. Portfolio preview.
9. Publishing and sharing.

The experience should be Career Profile-aware, track progress, provide useful empty states, and introduce the existing AI Assistant contextually.

The user must retain the ability to skip, pause, resume, and restart the experience.

---

## 16. AI assistance

**Status: Partially present; broader AI-assisted authoring is planned**

The current repository already contains AI/MCP-related integration infrastructure.

Issue #24 proposes AI-assisted services/blog generation, while Issue #36 expands contextual AI assistance into onboarding and content creation.

Potential AI-assisted content areas include:

- Professional biographies.
- Headlines.
- Project descriptions.
- Experience summaries.
- Achievement summaries.
- Service descriptions.
- Skill suggestions.
- Portfolio summaries.
- Calls to action.

These capabilities should not be documented as fully implemented until their respective issues are completed and verified.

---

## 17. Administration model

The current administrative information architecture has been consolidated around related professional-content groups:

```text
Profile & Hero
Projects & Case Studies
Services
Blog
Experience & Credentials
Publications & Testimonials
Messages
Site Settings
```

This is supported by the recent admin refactor, but Issue #20 remains open because the complete behavior still requires verification.

The key product rule is that the admin system should have clear sources of truth and should not expose multiple conflicting ways of managing the same content.

---

## 18. Current product-state matrix

| Capability | Current State | Governing Work | Version 1.0 Decision |
|---|---|---|---|
| Platform landing page | Implemented | — | Core |
| Registration/authentication | Implemented | #4, #5 security validation | Core |
| Portfolio identity | Implemented | — | Core |
| Public portfolio | Implemented | #16 QA | Core |
| Hero/site settings | Implemented | #20 verification | Core |
| Projects | Implemented | #7 cleanup, #16 QA | Core |
| Case studies | Partial | #20, #22 | Must decide/verify |
| Blog | Implemented | #16 QA | Core or optional based on final scope |
| Experience | Partial | #8, #20 | Core professional profile |
| Certifications | Partial | #8, #20 | Core professional profile |
| Skills | Transitional | #21 | Final model required before launch |
| Awards | Partial | #8, #20 | Scope decision |
| Publications | Partial | #8, #20 | Scope decision |
| Testimonials | Partial | #8, #20 | Scope decision |
| Services | Implemented | #10, #16 | Core/optional by user |
| Contact | Implemented | #10, #16 | Core |
| Service inquiries | Implemented | #10, #16 | Core if Services enabled |
| WhatsApp contact | Active enhancement | #23 | Scope decision |
| Media uploads | Implemented | #11 | Core |
| SEO metadata | Partial | #13 | Core |
| Robots/sitemap | Not implemented | #13 | Launch requirement |
| Visitor email notification | Partial | #12, #16 | Scope decision |
| MCP | Partial | #9, #16 | Integration capability, not necessarily user-facing core |
| Career Profiles | Planned | #34 | Future/product evolution unless completed for V1 |
| Visual Templates | Planned | #35 | Future/product evolution unless completed for V1 |
| Guided setup | Planned | #36 | Future/product evolution unless completed for V1 |
| AI authoring | Partial/planned | #24, #36 | Future/product evolution unless completed for V1 |
| Vercel deployment | Active | #37 | Launch infrastructure |
| Backend inventory | Active | #38 | Launch infrastructure |
| Owned Supabase migration | Future | #39 | Not V1 unless explicitly accelerated |

**Important:** the final Version 1.0 column is a preliminary classification for planning. It is not the final scope lock. The definitive Version 1.0 scope must be approved after technical and product review.

---

## 19. Core product versus platform expansion

The current product naturally divides into three layers.

### Layer A — Core portfolio platform

This is the foundation required to deliver the basic product promise:

- Account.
- Professional identity.
- Portfolio creation.
- Professional content.
- Projects.
- Public publishing.
- Contact.
- Media.
- Basic SEO.

### Layer B — Professional conversion and differentiation

These make the platform more commercially useful and differentiated:

- Services.
- Structured inquiries.
- Case studies.
- Testimonials.
- Publications.
- Analytics/visitor intelligence in future.
- AI assistance.

### Layer C — Scalable professional identity platform

These represent the longer-term platform direction:

- Career Profiles.
- Large profession mapping system.
- Visual Template System.
- Guided portfolio generation.
- Professional verification.
- Verification APIs/infrastructure.
- Broader professional identity capabilities.

The presence of Layer C issues in GitHub does **not** mean Layer C is already part of the current production product.

---

## 20. Version 1.0 scope principle

Stage 3 intentionally does not declare every open issue a Version 1.0 requirement.

A feature becomes part of Version 1.0 only when all three questions can be answered positively:

1. **Product necessity:** Is it required to deliver the defined Version 1.0 promise?
2. **Technical readiness:** Can it be securely and reliably supported in production?
3. **Operational readiness:** Can it be tested, documented, supported, and maintained?

This is especially important for:

- Career Profiles.
- Visual Templates.
- Guided onboarding.
- AI authoring.
- MCP expansion.
- Future verification infrastructure.

---

## 21. Product boundaries identified for later documentation

The following questions must be resolved in later stages rather than guessed now:

### Identity

- What exactly is a portfolio owner's public professional identity?
- Which fields are always public?
- Which fields are optional?
- Which fields can be hidden?

### Publishing

- What is the exact meaning of draft, published, unlisted, and archived?
- How do Project and Case Study publication modes interact?

### Content ownership

- What happens to all content when a user deletes their account?
- What happens to uploaded media?
- Are public URLs permanently reusable?

### Templates

- What is stored as user content versus template configuration?
- How is content preserved when templates change?

### Career Profiles

- How are professions mapped?
- Can users override recommendations?
- How are profile changes applied to existing portfolios?

### Services

- What is the canonical inquiry record?
- How do contact requests differ from service inquiries?

### Notifications

- Which events generate emails?
- What are the delivery guarantees and retry expectations?

### MCP

- Which operations are intentionally exposed?
- What authentication/authorization boundary applies?
- Is MCP a core customer feature or an administrative/integration capability?

These become formal requirements in later stages.

---

## 22. Stage 3 findings

### Finding 1 — The product is already broader than a portfolio builder

The current application has a real content management and professional-conversion layer, including services, inquiries, publishing controls, and public professional identity.

### Finding 2 — Several professional entities exist publicly but are not yet fully verified administratively

Experience, certifications, skills, awards, publications, and testimonials require management/source-of-truth verification.

### Finding 3 — Projects are becoming the central work-content model

The Project/Case Study consolidation is already reflected in the current architecture, but publishing synchronization must be proven before the migration is considered complete.

### Finding 4 — Skills are undergoing a deliberate semantic redesign

The final model is intended to distinguish professional capabilities from technologies/tools. This is not merely a UI rename.

### Finding 5 — Career Profiles and Visual Templates are separate product systems

They must remain separate in future documentation and implementation:

```text
Profession
   ↓
Career Profile
   ↓
Content recommendations / structure

Visual Template
   ↓
Presentation / visual identity
```

### Finding 6 — The current product is not yet Version 1.0 locked

The platform has enough implementation to establish a strong baseline, but scope decisions remain around several incomplete and future capabilities.

### Finding 7 — Security and runtime verification remain independent gates

Feature implementation cannot be used as proof of production readiness. This follows the source-of-truth rule established in Stages 1 and 2.

---

## 23. Stage 3 conclusion

The product baseline is now established.

The current platform can accurately be described as:

> **A multi-user professional portfolio platform that lets people create, manage, publish, and share a professional identity and body of work, with support for projects, case studies, professional credentials, services, inquiries, content publishing, media, SEO, and selected AI/MCP integrations.**

The architecture is already moving toward a broader professional identity platform through Career Profiles, visual personalization, guided onboarding, and future verification capabilities, but those must remain explicitly separated from the currently verified product.

### Next stage

**Stage 4 — Technical Architecture & Data Documentation**

Stage 4 will turn the product baseline into a detailed technical model covering:

- System architecture.
- Application layers.
- Route architecture.
- Server functions.
- Database schema/data dictionary.
- Relationships.
- Authentication flow.
- Authorization boundaries.
- Storage architecture.
- MCP architecture.
- External integrations.
- Environment configuration.
- Current technical debt.
- Source-of-truth ownership for each entity.

That stage should be completed before writing the final Technical Requirements Document (TRD), because the TRD needs to describe the actual architecture rather than an assumed one.
