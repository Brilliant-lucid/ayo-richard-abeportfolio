# Stage 4 — Technical Gaps Register

These are not guesses about missing features. They are explicit evidence gaps identified during the architecture audit.

| Gap | Why it matters | Required evidence |
|---|---|---|
| Complete Supabase migrations | Needed for authoritative schema history | Migration files/database export |
| Complete RLS policies | Needed for tenant-security verification | Policy definitions + runtime tests |
| Storage policies | Needed for media security | Bucket/object policies + tests |
| Full column-level schema | Needed for final data dictionary | Schema/migrations |
| Production host configuration | Needed for deployment runbook | Hosting project/config |
| Environment variable inventory | Needed for reproducible deployment | Source references + deployment config |
| Runtime email delivery | Needed for notification claims | Working provider/config + test |
| OAuth production configuration | Needed for authentication readiness | Provider settings + callback test |
| MCP production auth | Needed for integration readiness | Endpoint/auth/runtime test |
| Automated test suite | Needed for regression protection | Test runner + test results |
| Complete admin CRUD coverage | Needed for CMS completeness | Route/server-function/runtime evidence |
| Account deletion behavior | Needed for data lifecycle | Implemented deletion flow + tests |
| Media deletion/orphan cleanup | Needed for storage lifecycle | Storage cleanup behavior |
| Public/private field matrix | Needed for privacy | Query/serialization review |

These gaps are intentionally carried forward into Stage 5 and later deployment/QA stages rather than being silently filled with assumptions.
