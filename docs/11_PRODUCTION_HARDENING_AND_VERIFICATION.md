# Stage 11 — Production Hardening & Verification

**Program:** Production Readiness & Documentation Program  
**Project:** Portfolio Platform  
**Status:** Execution and evidence phase

## 1. Purpose

Stage 11 is the final engineering hardening layer between the documented readiness framework and actual production launch.

Stages 1–10 define what the platform is, how it is built, secured, tested, deployed, operated, governed, and reviewed. Stage 11 proves those controls through practical verification.

> Documentation is not evidence. Stage 11 closes only when the relevant verification evidence exists.

## 2. Stage structure

Stage 11 has three execution documents and one master index:

### 11.1 — Data, Security & Recovery Verification

Covers production data cleanup/migration, security and abuse testing, backup validation, restore testing, and recovery evidence.

### 11.2 — Performance, Infrastructure & Cost Validation

Covers performance/load testing, dependency and supply-chain review, infrastructure capacity, scaling assumptions, and cost modelling.

### 11.3 — Production Cutover & Verification Runbook

Covers final domain, DNS, HTTPS/TLS, email, SEO, release deployment, smoke tests, rollback, launch monitoring, and cutover evidence.

## 3. Execution order

```text
11.1 Data, Security & Recovery
          ↓
11.2 Performance, Infrastructure & Cost
          ↓
11.3 Production Cutover & Verification
          ↓
Stage 10 Final Go / Conditional Go / No-Go
```

Some dependency and infrastructure checks may run in parallel, but the final cutover must wait for critical hardening evidence.

## 4. Evidence standard

Each verification item should produce appropriate evidence:

- Test output.
- Automated test results.
- Security findings.
- Migration/cleanup report.
- Restore report.
- Performance report.
- Provider configuration evidence.
- Logs.
- Screenshots where useful.
- Cost/capacity calculations.
- Release commit/tag.
- Final cutover record.

## 5. Launch-blocking principle

The following normally block production until resolved or explicitly accepted through Stage 10:

- Cross-tenant data access.
- Authentication bypass.
- Privileged secret exposure.
- Irrecoverable data-loss risk.
- Failed critical restore drill.
- Critical database migration failure.
- Critical public/private data exposure.
- Unacceptable core-route performance.
- Uncontrolled infrastructure cost exposure.
- Broken production domain or authentication callback.
- Critical email/security configuration failure where email is required for the launch journey.
- Critical dependency vulnerability without mitigation.

## 6. Master evidence register

| Area | Evidence | Result | Blocker | Owner | Date |
|---|---|---|---|---|---|
| Data | Migration/cleanup report | `[OPEN]` | `[ ]` | `[ ]` | `[ ]` |
| Security | Security/abuse test report | `[OPEN]` | `[ ]` | `[ ]` | `[ ]` |
| Recovery | Restore drill report | `[OPEN]` | `[ ]` | `[ ]` | `[ ]` |
| Performance | Load/performance report | `[OPEN]` | `[ ]` | `[ ]` | `[ ]` |
| Infrastructure | Provider/configuration evidence | `[OPEN]` | `[ ]` | `[ ]` | `[ ]` |
| Dependencies | Dependency audit report | `[OPEN]` | `[ ]` | `[ ]` | `[ ]` |
| Cost | Capacity/cost model | `[OPEN]` | `[ ]` | `[ ]` | `[ ]` |
| Cutover | Production release record | `[OPEN]` | `[ ]` | `[ ]` | `[ ]` |

## 7. Definition of Done

Stage 11 is complete when:

- [ ] Production data is clean and migration-safe.
- [ ] Security boundaries have been exercised.
- [ ] Abuse controls have been exercised.
- [ ] Database and media recovery have been tested.
- [ ] Public-route performance has been measured.
- [ ] Infrastructure capacity and failure assumptions have been reviewed.
- [ ] Domain/DNS/TLS behavior is verified.
- [ ] Email authentication and delivery are verified.
- [ ] SEO infrastructure is verified.
- [ ] Dependency/security audit is complete.
- [ ] Capacity and cost model is documented.
- [ ] Final cutover has a named owner and rollback target.
- [ ] Release evidence is stored.

## 8. Relationship to Stage 10

Stage 11 does not replace Stage 10.

```text
Stage 11
Hardening evidence
      ↓
Stage 10
Final launch decision
```

Stage 10 remains the formal **GO / CONDITIONAL GO / NO-GO** authority.

## 9. Recurring post-launch hardening

After launch, the same controls become recurring maintenance:

- Restore drills.
- Dependency audits.
- Security reviews.
- Performance checks.
- Cost reviews.
- Data cleanup.
- Incident exercises.

## 10. Final principle

The platform should not be considered production-ready simply because all documentation exists. It should be considered production-ready only when the critical claims in the readiness program have been exercised, verified, evidenced, and accepted.
