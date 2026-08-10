# Stage 4 — Issue Impact Matrix

This matrix records how existing issues affect the technical architecture.

| Issue | Technical impact | Risk if ignored | Stage 4 relationship |
|---|---|---|---|
| #4 | Tenant isolation / authorization | Cross-user access | Direct architectural blocker |
| #5 | Automated authorization verification | Security regressions | Direct verification gate |
| #7 | Project schema cleanup | Duplicate/stale data | Data architecture debt |
| #8 | Professional-content admin coverage | Incomplete CMS | Application completeness |
| #9 | MCP registry/instructions | Broken integration expectations | Integration correctness |
| #10 | Contact/inquiry model | Inconsistent data | Data-model debt |
| #11 | Storage hardening | Unauthorized/malicious uploads | Security boundary |
| #12 | Email configuration/security | Notification failure/exposure | Integration boundary |
| #13 | SEO infrastructure | Poor discoverability/indexing | Public delivery |
| #16 | End-to-end testing | Unknown regressions | Runtime validation |
| #20 | Unified admin architecture | Conflicting content sources | Application architecture |
| #21 | Skills/project content model | Semantic/data inconsistency | Product/data architecture |
| #22 | Project/Case Study synchronization | Incorrect public publishing | Content integrity |
| #23 | WhatsApp contact | New external communication path | Product enhancement |
| #24 | AI-assisted services/blog | New AI integration path | Future capability |
| #34 | Career Profiles | New content orchestration layer | Future architecture |
| #35 | Visual Templates | Presentation abstraction | Future architecture |
| #36 | Guided onboarding | User setup orchestration | Future application layer |
| #37 | Vercel deployment | Production runtime | Infrastructure gate |
| #38 | Backend inventory | Infrastructure ownership clarity | Infrastructure gate |
| #39 | Owned Supabase migration | Long-term backend control | Future infrastructure |

## Rule

Issues that modify architecture must be reflected in the corresponding architecture/data documents when implemented. Issues that only propose future functionality must not be used as evidence that the functionality currently exists.
