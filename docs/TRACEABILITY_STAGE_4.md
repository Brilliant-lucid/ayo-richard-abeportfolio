# Stage 4 — Architecture Traceability

This map connects technical architecture areas to the existing readiness program.

| Technical area | Evidence | Related work | Later validation |
|---|---|---|---|
| Tenant isolation | owner-scoped entities/server operations | #4, #5 | Security + authorization tests |
| Service-role Supabase access | server-only elevated client | #4, #5 | Full privileged-query audit |
| Project schema | legacy + structured fields | #7 | Migration/read-write audit |
| Admin completeness | current route architecture | #8, #20 | CRUD verification |
| MCP | registered tools vs instructions | #9 | MCP contract/auth tests |
| Contact/inquiry model | dual message/inquiry flow | #10 | Canonical data model |
| Storage | Supabase Storage media bucket | #11 | Upload/security tests |
| Email | connector-based notification | #12 | Delivery/security tests |
| SEO | route metadata; missing robots/sitemap | #13 | Deployed SEO verification |
| Public portfolio | `/u/:username/*` | #16 | Full public-flow regression |
| Career Profile | schema preparation + planned UX | #34 | Product/UX implementation |
| Visual templates | planned presentation architecture | #35 | Rendering/regression tests |
| Guided onboarding | planned admin onboarding | #36 | User acceptance testing |
| Deployment | TanStack/Nitro configuration | #37, #38 | Production deployment verification |
| Backend ownership | current Supabase/Lovable dependency | #38, #39 | Infrastructure inventory/migration plan |

## Traceability rule

No technical architecture item is considered production-ready solely because the source file exists. It must have:

1. documented behavior,
2. ownership/security boundaries,
3. runtime or automated verification where appropriate,
4. a known failure mode,
5. an operational owner/process.
