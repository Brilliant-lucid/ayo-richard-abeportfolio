# Stage 7 — Production Infrastructure & Deployment Readiness

**Project:** Portfolio Platform  
**Repository:** `Brilliant-lucid/ayo-richard-abeportfolio`  
**Baseline date:** 2026-08-10  
**Program:** Production Readiness & Documentation Program (#40)

## 1. Purpose

Stage 7 turns the application architecture into an operational production plan.

It documents how the platform should move from source code to a controlled production environment, including hosting, domain, environment variables, database, Storage, authentication, email, Model Context Protocol (MCP), deployment automation, monitoring, backups, rollback, and incident response.

This document deliberately distinguishes:

- **Implemented/configured in repository**
- **Configured externally but requiring verification**
- **Required production setup**
- **Future infrastructure improvement**

The existence of a deployment configuration file is not treated as proof that the deployed production system is healthy.

---

# 2. Current deployment architecture

The current repository is a full-stack TanStack Start application.

```text
GitHub repository
       │
       ▼
Build / validation
       │
       ▼
TanStack Start + Nitro output
       │
       ▼
Production hosting runtime
       │
       ├───────────────┐
       ▼               ▼
Supabase           External integrations
Auth/DB/Storage    OAuth / Mail / MCP / AI
```

The repository contains Vite/TanStack Start/Nitro configuration, but the final production hosting configuration must be verified against the actual deployment provider.

The project has an active Vercel deployment workstream under Issue #37, so Vercel is treated as the intended production hosting target for the current launch plan, not as a claim that every production setting has already been verified.

---

# 3. Production environment model

The platform should maintain clear environment boundaries.

Recommended minimum model:

```text
Development
    ↓
Preview / QA
    ↓
Production
```

## Development

Used for:

- Feature development.
- Local debugging.
- Safe experimental changes.
- Developer-owned test data.

## Preview / QA

Used for:

- Pull request validation.
- Integration testing.
- Security testing.
- Release candidate verification.

## Production

Used only for:

- Real users.
- Real portfolios.
- Real professional content.
- Real contact/inquiry traffic.

Production data must never be casually used as a development database.

---

# 4. Hosting architecture

## Intended provider

**Vercel** is the current intended production host.

The application must be deployed as a server-capable TanStack Start/Nitro application, not treated as a static-only frontend.

## Hosting responsibilities

The hosting layer is responsible for:

- Application runtime.
- HTTPS/TLS termination.
- Domain routing.
- Environment variables.
- Deployment builds.
- Preview deployments.
- Production deployments.
- Logs.
- Runtime errors.
- Deployment history/rollback.

The exact Vercel project, production domain, deployment branch, build command, output behavior, and server-function runtime must be verified before the production sign-off.

---

# 5. Domain architecture

Current public portfolio routing is:

```text
/platform-domain/u/:username
```

This is the currently evidenced URL architecture.

A future subdomain model such as:

```text
username.platform-domain.com
```

must be treated as a separate routing and DNS project.

## Production domain requirements

The launch must define:

- Primary platform domain.
- `www` behavior.
- Canonical redirect behavior.
- HTTPS enforcement.
- Preview domain policy.
- Authentication callback URLs.
- OAuth redirect URLs.
- MCP OAuth redirect URLs if applicable.
- Sitemap host.
- robots.txt host.

No domain should be considered production-ready until DNS and TLS are verified from the live environment.

---

# 6. Environment variable architecture

Environment variables must be divided into public and secret values.

## Public/browser-safe configuration

Examples:

- Supabase project URL.
- Supabase publishable key.
- Public application URL where required.

## Server-only secrets

Examples:

- Supabase service-role key.
- Mail provider credentials.
- MCP OAuth secrets.
- AI provider secrets.
- Other integration credentials.

## Rules

1. Secrets must never be committed to Git.
2. Secrets must never be embedded into browser bundles.
3. Production secrets must be stored in the hosting provider's secure environment configuration.
4. Preview/development secrets must be isolated from production.
5. Secret rotation must be documented.
6. Removed/rotated secrets must be invalidated at the provider where applicable.

The final environment variable inventory must be generated from actual source references and external provider settings before launch.

---

# 7. Supabase production architecture

Supabase currently provides three critical infrastructure functions:

```text
Supabase
 ├── Authentication
 ├── PostgreSQL
 └── Storage
```

## Production requirements

- Correct production project selected.
- Authentication providers configured.
- OAuth callback URLs configured.
- Database schema verified.
- Row Level Security (RLS) policies verified.
- Storage bucket policies verified.
- Database backups enabled/understood.
- Service-role key stored only server-side.
- Production URL configuration verified.
- Email/authentication settings verified.

## Future infrastructure

Issue #39 tracks migration toward independently owned backend infrastructure. That is not a prerequisite for documenting the current production architecture, but the current deployment must clearly record who owns the active Supabase project and credentials.

---

# 8. Database deployment and migration strategy

Database changes must follow:

```text
Migration source
      ↓
Development database
      ↓
QA/preview database
      ↓
Production database
      ↓
Verification
```

Production database changes must not be performed casually through the live dashboard without a reproducible record.

## Migration requirements

Every production migration should have:

- Migration identifier.
- Purpose.
- Up/change operation.
- Data migration/backfill if applicable.
- Rollback or recovery strategy.
- Compatibility consideration.
- Verification query/test.

This is particularly important for the Project/Case Study schema migration.

---

# 9. Storage deployment strategy

The media architecture uses Supabase Storage.

Production verification must cover:

- Bucket existence.
- Bucket visibility.
- Object ownership.
- Upload restrictions.
- Maximum file size.
- MIME/type restrictions.
- Signed URL behavior.
- Delete authorization.
- Orphaned object cleanup.
- Storage quotas/cost controls.

The Storage layer is a production security boundary, not simply a file bucket.

---

# 10. Authentication deployment

Production authentication must verify:

### Email/password

- Registration.
- Login.
- Logout.
- Password reset.
- Invalid credentials.
- Expired session.
- Session persistence.

### Google OAuth

- Correct client configuration.
- Correct callback URL.
- Production domain included.
- Preview domain policy defined.
- Account linking behavior understood.

### Security

- No authentication secrets exposed client-side.
- Protected admin routes reject unauthenticated users.
- Authenticated users cannot cross tenant boundaries.

---

# 11. Email/notification deployment

Email functionality is an external dependency.

Production setup must verify:

- Provider/connector credentials.
- Sender identity.
- Recipient behavior.
- Delivery success.
- Failure behavior.
- Rate limiting.
- Abuse protection.
- No secret leakage in email content.

The platform must distinguish between:

```text
Application event
      ↓
Notification decision
      ↓
Email provider
      ↓
Delivery
```

A successful database write does not automatically mean an email was delivered.

---

# 12. MCP deployment

The Model Context Protocol (MCP) endpoint is part of the application architecture.

Production verification must establish:

- Endpoint availability.
- Authentication.
- OAuth configuration where required.
- Tool registry.
- Tool authorization.
- Tenant isolation.
- Rate limits.
- Error handling.
- Production callback URLs.
- Documentation parity with registered tools.

The current repository already identifies a mismatch between the broader MCP instructions and the narrower registered tool set. Issue #9 remains relevant to deployment sign-off.

---

# 13. Build and deployment pipeline

The minimum release pipeline should be:

```text
Developer change
      ↓
GitHub branch
      ↓
Pull request
      ↓
Static checks
      ↓
Automated tests
      ↓
Preview deployment
      ↓
QA/security verification
      ↓
Approval
      ↓
Production deployment
      ↓
Smoke tests
      ↓
Monitoring
```

## Required checks

At minimum:

- Type checking/build.
- Linting.
- Formatting validation where applicable.
- Unit tests once implemented.
- Integration tests once implemented.
- End-to-end smoke tests.
- Production environment validation.

The current repository does not yet prove a complete automated test pipeline, so this pipeline is a production requirement rather than a claim of current completion.

---

# 14. GitHub Actions / Continuous Integration and Continuous Deployment (CI/CD)

A production-grade workflow should automate repeatable checks.

Recommended workflow responsibilities:

### Pull request workflow

- Install dependencies.
- Validate lockfile.
- Run type/build check.
- Run lint.
- Run tests.
- Report failure.

### Main/production workflow

- Run all PR checks.
- Build release artifact.
- Deploy to production.
- Execute smoke tests.
- Record deployment.

Deployment credentials must be stored as GitHub/Vercel secrets or provider-managed credentials, not repository files.

The exact workflow implementation belongs to the deployment implementation issue rather than being fabricated by documentation.

---

# 15. Preview deployment policy

Every meaningful production-bound change should have a preview environment when supported.

Preview deployments should:

- Use non-production credentials/data where possible.
- Be clearly identifiable.
- Not send real production emails accidentally.
- Not mutate production data.
- Not expose production service-role credentials unnecessarily.

If preview environments share a database, this must be explicitly documented and treated as a risk.

---

# 16. Monitoring and observability

Production requires visibility into:

- Application errors.
- Server errors.
- Authentication failures.
- Database failures.
- Storage failures.
- Email failures.
- MCP failures.
- Deployment failures.
- Unexpected traffic spikes.

At minimum, the team needs:

```text
Error logs
Deployment logs
Database/provider logs
Health/smoke checks
Incident record
```

Future improvements may include dedicated application monitoring and alerting, but the minimum operational logging must be available from the hosting and infrastructure providers.

---

# 17. Health checks and smoke tests

After every production deployment, verify:

1. Platform homepage loads.
2. Authentication page loads.
3. Login works.
4. Admin route is protected.
5. Public portfolio loads.
6. Published project loads.
7. Blog/case-study routes load where applicable.
8. Media assets load.
9. Contact submission works.
10. Service inquiry works where enabled.
11. Email notification is triggered where configured.
12. MCP endpoint behaves according to its contract.
13. robots.txt is available.
14. sitemap is available.
15. No critical browser/server errors appear.

These become the release smoke-test checklist.

---

# 18. Rollback strategy

A production release must be reversible.

```text
Current production
       ↓
New release
       ↓
Smoke-test
       │
   ┌───┴────┐
   │        │
 PASS     FAIL
   │        │
   ▼        ▼
Keep     Rollback
release    ↓
          Previous release
```

## Important database rule

Application rollback and database rollback are not automatically the same operation.

A database migration must therefore be backward-compatible with the deployment strategy wherever possible.

For destructive migrations, the recovery plan must be explicitly documented before deployment.

---

# 19. Backup and recovery

Production data includes:

- User accounts.
- Portfolio data.
- Projects.
- Case Studies.
- Blog content.
- Professional records.
- Contact messages.
- Service inquiries.
- Media.

Recovery planning must cover both:

**Database data** and **Storage objects**.

A database backup that does not recover media does not fully recover the platform.

The production checklist must establish:

- Backup provider/settings.
- Retention period.
- Recovery point objective (RPO).
- Recovery time objective (RTO).
- Restore procedure.
- Restore testing frequency.

---

# 20. Incident response

Production incidents should follow:

```text
Detect
  ↓
Classify
  ↓
Contain
  ↓
Recover
  ↓
Verify
  ↓
Document
  ↓
Prevent recurrence
```

## Severity guidance

### P0 — Critical

Examples:

- Cross-user data exposure.
- Production authentication compromise.
- Database corruption/loss.
- Critical security vulnerability.

### P1 — Major

Examples:

- Login unavailable.
- Public portfolios unavailable.
- Core publishing broken.
- Contact/inquiry system unavailable.

### P2 — Moderate

Examples:

- Non-critical admin feature broken.
- Specific content type unavailable.
- Email notifications delayed.

### P3 — Minor

Examples:

- Visual issue.
- Non-critical copy/metadata problem.

Security incidents should immediately override normal feature priorities.

---

# 21. Production cost controls

The production architecture must monitor usage and cost across:

- Hosting.
- Database.
- Storage.
- Bandwidth.
- Email.
- AI APIs.
- MCP/compute if usage grows.

Particularly important for a multi-tenant platform:

```text
User growth
    ↓
Database growth
Storage growth
Bandwidth growth
Email volume
AI usage
    ↓
Operating cost
```

Usage limits and quotas should be introduced before uncontrolled usage becomes a financial risk.

---

# 22. Production security gates

Production deployment must not be considered approved until these are satisfied:

- [ ] No committed secrets.
- [ ] Production secrets isolated.
- [ ] Service-role key server-only.
- [ ] Tenant isolation verified.
- [ ] Row Level Security (RLS) verified where applicable.
- [ ] Storage authorization verified.
- [ ] Authentication callbacks verified.
- [ ] Password reset verified.
- [ ] Public/private data exposure reviewed.
- [ ] MCP authorization verified.
- [ ] Production domain verified.
- [ ] HTTPS verified.
- [ ] Backups understood.
- [ ] Rollback procedure documented.
- [ ] Monitoring/logging available.
- [ ] Smoke tests pass.

---

# 23. Deployment readiness matrix

| Area | Current baseline | Required before production | Status |
|---|---|---|---|
| Application build | Configured | Successful production build | Verify |
| Vercel | Intended target | Project/domain/runtime verified | Open |
| Domain | Current URL architecture documented | DNS/TLS/canonical behavior | Open |
| Environment variables | Source references identified | Production inventory + secrets | Open |
| Supabase Auth | Implemented | Production provider/callback verification | Open |
| PostgreSQL | Implemented | Schema/RLS/migrations verified | Open |
| Storage | Implemented | Bucket/policy/security verification | Open |
| Email | Integration exists | Production delivery verification | Open |
| MCP | Endpoint/tooling exists | Auth/tool parity/security verification | Open |
| CI/CD | Not fully proven | Automated release checks | Open |
| Testing | Baseline documented | Automated suite + smoke tests | Open |
| Monitoring | Provider logs expected | Operational monitoring | Open |
| Backups | Provider-dependent | Restore strategy/testing | Open |
| Rollback | Concept documented | Tested procedure | Open |
| SEO | Requirements identified | robots/sitemap/deployed metadata | Open |

---

# 24. Production launch sequence

The recommended launch order is:

### Phase A — Code readiness

1. Finish active feature/security issues.
2. Remove or isolate obsolete development artifacts.
3. Resolve TypeScript/build/lint errors.
4. Establish automated tests.
5. Complete security verification.

### Phase B — Infrastructure

6. Confirm Vercel project.
7. Configure production domain.
8. Configure production environment variables.
9. Confirm Supabase production project.
10. Confirm database schema/migrations.
11. Confirm Storage buckets/policies.
12. Configure OAuth.
13. Configure email.
14. Configure MCP.

### Phase C — Release candidate

15. Deploy preview.
16. Run QA suite.
17. Run security tests.
18. Run tenant-isolation tests.
19. Run public portfolio tests.
20. Run contact/service inquiry tests.
21. Run SEO checks.

### Phase D — Production

22. Deploy production.
23. Run smoke tests.
24. Verify logs.
25. Verify authentication.
26. Verify public portfolio.
27. Verify contact/inquiry flow.
28. Verify MCP where enabled.
29. Monitor immediately after release.

### Phase E — Post-launch

30. Monitor errors.
31. Monitor infrastructure usage.
32. Monitor storage/database growth.
33. Review user reports.
34. Record incidents.
35. Begin post-launch optimization.

---

# 25. Existing issue traceability

Stage 7 directly relates to:

- **#12** Email configuration/security.
- **#13** SEO infrastructure.
- **#16** End-to-end testing.
- **#37** Vercel deployment.
- **#38** Backend infrastructure inventory.
- **#39** Independent Supabase/backend ownership.

It also depends on:

- **#4/#5** Tenant isolation and authorization testing.
- **#7** Project schema cleanup.
- **#9** MCP alignment.
- **#10** Contact/inquiry architecture.
- **#11** Storage security.

Stage 7 does not close these issues merely because deployment documentation exists.

---

# 26. Stage 7 conclusion

The platform now has a documented operational path from repository to production.

The key principle is:

> **Deployment is not simply putting the application on Vercel. Production readiness means the application, infrastructure, secrets, data, authentication, storage, integrations, monitoring, recovery, and release process all work together safely.**

The remaining work is therefore no longer a vague 'deploy the site' task. It is a set of verifiable production gates.

### Next stage

**Stage 8 — Product Operations, Support, Analytics & Growth Readiness**

Stage 8 should cover what happens after deployment:

- Admin operations.
- User support.
- Analytics.
- Product metrics.
- Error/reporting workflows.
- User feedback.
- Content moderation/abuse handling.
- Subscription/payment readiness if introduced.
- Usage limits.
- Communication lifecycle.
- Documentation for administrators.
- Operational runbooks.
- Launch monitoring.
- Post-launch success metrics.
