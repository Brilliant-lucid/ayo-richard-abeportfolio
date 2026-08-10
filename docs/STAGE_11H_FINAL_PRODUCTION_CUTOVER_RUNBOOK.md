# Stage 11H — Final Production Cutover Runbook

## Objective

Provide a controlled procedure for moving the approved release candidate into production.

## T-24 hours

- [ ] Release candidate frozen.
- [ ] Critical issues resolved.
- [ ] Accepted risks recorded.
- [ ] Backup verified.
- [ ] Rollback release identified.
- [ ] Production environment variables verified.
- [ ] Domain/DNS/TLS verified.
- [ ] Provider health checked.
- [ ] Support/incident owner available.

## T-1 hour

- [ ] Confirm release commit/tag.
- [ ] Confirm build.
- [ ] Confirm migration status.
- [ ] Confirm smoke-test checklist.
- [ ] Confirm monitoring/log access.

## Deployment

1. Deploy approved release.
2. Confirm deployment health.
3. Apply database migration if required.
4. Verify database integrity.
5. Verify authentication.
6. Verify authorization.
7. Verify public portfolio.
8. Verify project/content pages.
9. Verify media.
10. Verify contact/service flow.
11. Verify email where applicable.
12. Verify MCP where enabled.
13. Verify robots.txt and sitemap.
14. Check production logs.

## Go decision

Proceed only if critical smoke tests pass and no new blocker appears.

## Rollback decision

Rollback when there is:

- Critical security exposure.
- Data corruption.
- Broken authentication.
- Broken core publishing.
- Material cross-tenant exposure.
- Severe production instability.

## First hour

Monitor continuously:

- Error rate.
- Authentication.
- Public routes.
- Database.
- Storage.
- Email.
- Traffic.

## First 24 hours

Record:

- Incidents.
- Support requests.
- Error trends.
- Performance anomalies.
- Infrastructure usage.
- User feedback.

## Cutover record

**Release:** `[ ]`  
**Commit/tag:** `[ ]`  
**Deployment time:** `[ ]`  
**Owner:** `[ ]`  
**Decision:** `[GO / HOLD / ROLLBACK]`  
**Rollback target:** `[ ]`  
**Evidence:** `[ ]`
