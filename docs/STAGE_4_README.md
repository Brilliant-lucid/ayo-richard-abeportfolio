# Stage 4 — Quick Reference

Stage 4 establishes the technical truth of the current portfolio platform.

## Current architecture

**TanStack Start full-stack application → server functions → Supabase Auth/PostgreSQL/Storage**

## Public architecture

`/u/:username/*` resolves published user portfolios.

## Authenticated architecture

`/admin/*` is protected and manages portfolio-owned content.

## Integration architecture

`/mcp` exposes a limited registered Model Context Protocol (MCP) tool set.

## Highest-risk boundaries

1. Tenant isolation.
2. Supabase service-role access bypassing Row Level Security (RLS).
3. Storage permissions and upload validation.
4. Public/private content filtering.
5. Project/Case Study migration.
6. Contact/service-inquiry consistency.
7. MCP authentication and tool alignment.

## Main Stage 4 documents

See `STAGE_4_INDEX.md` for the full document set.

## Next

Stage 5 — Data Lifecycle, Security & Privacy Architecture.
