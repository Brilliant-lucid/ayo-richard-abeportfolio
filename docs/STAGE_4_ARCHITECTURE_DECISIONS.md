# Stage 4 — Architecture Decisions & Constraints

**Date:** 2026-08-10  
**Status:** Baseline decisions for subsequent production-readiness work

## ADR-001 — Full-stack TanStack Start is the current application architecture

**Decision:** Treat TanStack Start as the current application/server architecture.

**Reason:** The repository uses TanStack Start server functions and Nitro/server configuration. The current system is not a separately deployed React frontend and API backend.

**Consequence:** Deployment documentation must preserve the server runtime requirements of TanStack Start/Nitro.

## ADR-002 — Supabase is the current infrastructure boundary

**Decision:** Supabase remains the current authentication, PostgreSQL, and Storage boundary for the audited baseline.

**Reason:** The application and generated types directly depend on Supabase.

**Consequence:** Security, data lifecycle, backup, and migration planning must account for Supabase-specific behavior.

## ADR-003 — Username paths are the current public portfolio URL model

**Decision:** `/u/:username/*` is the current public portfolio routing model.

**Reason:** This is what the current route architecture implements.

**Consequence:** Subdomains must not be documented as an existing feature. If introduced later, it becomes an explicit routing/deployment migration.

## ADR-004 — Authenticated user identity is the tenant boundary

**Decision:** Portfolio-owned records are conceptually scoped to the authenticated Supabase user/owner.

**Reason:** Generated schema and server functions use owner identifiers throughout the content model.

**Consequence:** Every privileged server operation must preserve this boundary.

## ADR-005 — Service-role access is a privileged exception

**Decision:** The Supabase service-role client remains server-only and is treated as a high-risk privileged boundary.

**Reason:** It bypasses Row Level Security (RLS).

**Consequence:** Stage 5 must audit every service-role query/mutation and determine whether caller-scoped access can replace elevated access.

## ADR-006 — Projects are moving toward the central work-content source of truth

**Decision:** Treat the current Project/Case Study consolidation as an active architectural migration.

**Reason:** The admin model and `publish_as` behavior indicate a project-centric direction.

**Consequence:** No final database cleanup should occur until all readers/writers and publication behavior are mapped.

## ADR-007 — Legacy project fields remain temporarily for compatibility

**Decision:** Do not remove legacy project fields during the current readiness audit.

**Reason:** Existing application code still mirrors values for compatibility.

**Consequence:** Migration must be evidence-driven and tested.

## ADR-008 — Contact and service inquiries are currently overlapping models

**Decision:** Treat the dual-model arrangement as transitional until Issue #10 defines the canonical architecture.

**Reason:** Service inquiries are also represented in the contact/messages layer.

**Consequence:** The final data model must explicitly define consistency and transactional behavior.

## ADR-009 — MCP is an integration surface, not evidence of complete feature parity

**Decision:** Document only registered MCP tools as implemented capabilities.

**Reason:** The instruction text is broader than the actual registered tool list.

**Consequence:** Issue #9 remains open until documentation and registry agree.

## ADR-010 — Generated source is not hand-authored architecture

**Decision:** Generated route/type artifacts are outputs of the toolchain and must be documented as such.

**Reason:** The repository contains generated route/type artifacts with generated-file warnings.

**Consequence:** Developer documentation must explain regeneration and editing boundaries.

## ADR-011 — Version 1.0 scope is not automatically equal to the entire backlog

**Decision:** Open issues are not automatically Version 1.0 requirements.

**Reason:** Some issues represent security hardening, future infrastructure, technical debt, or strategic expansion.

**Consequence:** Product scope must be locked after the baseline and readiness/security review.
