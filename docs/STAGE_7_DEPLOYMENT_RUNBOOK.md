# Stage 7 — Production Deployment Runbook

**Repository:** `Brilliant-lucid/ayo-richard-abeportfolio`  
**Status:** Controlled launch procedure  
**Audience:** Developer / Product Owner / Release Manager

## Before deployment

- [ ] Stage 5 security gates reviewed.
- [ ] Stage 6 QA gates reviewed.
- [ ] Production branch is the intended release source.
- [ ] No secrets are committed.
- [ ] Production environment variables are configured.
- [ ] Supabase production project confirmed.
- [ ] Database schema/migrations verified.
- [ ] Storage verified.
- [ ] OAuth callbacks verified.
- [ ] Email configuration verified.
- [ ] MCP configuration verified if enabled.
- [ ] Domain/DNS/TLS verified.
- [ ] Backup/recovery plan known.

## Release

1. Merge approved release changes.
2. Confirm deployment build starts.
3. Confirm build succeeds.
4. Confirm deployment becomes healthy.
5. Record deployment identifier/commit.

## Smoke test

- [ ] Homepage.
- [ ] Authentication.
- [ ] Admin protection.
- [ ] Public portfolio.
- [ ] Project page.
- [ ] Blog/case study where enabled.
- [ ] Media.
- [ ] Contact.
- [ ] Service inquiry.
- [ ] Email notification.
- [ ] MCP endpoint where enabled.
- [ ] robots.txt.
- [ ] sitemap.

## Release decision

**PASS:** All critical checks succeed.

**HOLD:** Any security, authentication, tenant-isolation, data-loss, or critical publishing check fails.

**ROLLBACK:** Production behavior is materially worse than the previous release and cannot be safely corrected forward.

## After deployment

- Monitor logs.
- Check authentication errors.
- Check public route errors.
- Check database errors.
- Check Storage errors.
- Check email delivery.
- Record incidents.
- Record known issues.

## Rollback

1. Stop further release activity.
2. Identify last known-good application release.
3. Roll back application deployment.
4. Assess database compatibility.
5. Restore database only when necessary and under the documented recovery procedure.
6. Re-run smoke tests.
7. Record the incident and root cause.
