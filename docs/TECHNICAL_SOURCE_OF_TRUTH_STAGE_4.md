# Stage 4 — Technical Source-of-Truth Register

**Date:** 2026-08-10

This register prevents future documentation from treating generated artifacts, UI labels, or product plans as technical authority.

| Area | Primary source | Secondary evidence | Do not treat as authority |
|---|---|---|---|
| Application dependencies | `package.json` | lockfile/toolchain config | README summaries |
| Routing | source route files + generated route tree | `docs/ARCHITECTURE.md` | Screenshots alone |
| Database shape | Supabase schema/migrations when available; generated `types.ts` as current evidence | server functions | Product documents alone |
| Authentication | auth middleware/client source + Supabase configuration | auth UI | UI labels |
| Authorization | server functions + database policies | security docs/issues | Client-side checks alone |
| Public content | public server/query functions | route components | Admin UI alone |
| Admin behavior | authenticated route components + server functions | issue descriptions | Product plans alone |
| Storage | server upload functions + Supabase Storage policy/config | UI upload controls | UI alone |
| MCP | registered tool source/registry | MCP instructions | Instruction text alone |
| Deployment | actual hosting/deployment configuration | build configuration | Nitro default target/comments |
| Product scope | approved product baseline/PRD | GitHub issues | Every open issue automatically |
| Historical status | Git history + issue/PR records | changelog | Current README wording |

## Current evidence limitation

The repository exposes generated Supabase types and a Supabase project reference, but the available repository interface did not expose a complete migration/policy directory during this audit. Therefore Stage 4 does not invent a column-level policy specification. Stage 5 must obtain and verify the actual Row Level Security (RLS) policies and migration history before treating them as authoritative.
