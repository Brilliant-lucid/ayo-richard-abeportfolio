# Stage 7 — Infrastructure Inventory

| Component | Current role | Intended production owner/state | Verification required |
|---|---|---|---|
| GitHub | Source control | Repository | Branch/protection/release policy |
| Vercel | Application hosting | Intended production host | Project/domain/runtime |
| Supabase Auth | Identity | Production Supabase project | Providers/callbacks |
| Supabase PostgreSQL | Application data | Production Supabase project | Schema/RLS/backups |
| Supabase Storage | Media | Production Supabase project | Buckets/policies/limits |
| Google OAuth | Social authentication | External provider | Production OAuth config |
| Mail connector/provider | Notifications | External provider | Sender/delivery/security |
| MCP | External management interface | Application endpoint | Auth/tool/rate-limit verification |
| AI provider/integration | AI-assisted features | Feature-dependent | Credential/cost/failure policy |
| DNS/domain provider | Public routing | Production domain | DNS/TLS/canonical records |
| CI/CD | Release automation | GitHub/Vercel/provider | Workflow implementation |
| Monitoring/logging | Operations | Hosting/provider + future tooling | Alerts/retention |

## Ownership rule

Every production dependency must have a named owner, credential owner, billing owner, recovery path, and documented replacement/migration path where practical.

The inventory must be updated whenever an external service is added, removed, or replaced.
