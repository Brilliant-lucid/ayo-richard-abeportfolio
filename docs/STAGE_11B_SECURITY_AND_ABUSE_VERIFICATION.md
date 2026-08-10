# Stage 11B — Security & Abuse Verification

## Objective

Exercise the actual application's security boundaries rather than relying only on code inspection.

## Identity tests

- [ ] Registration abuse.
- [ ] Login abuse.
- [ ] Password reset abuse.
- [ ] Session expiry.
- [ ] Logout/session invalidation.
- [ ] OAuth callback validation.
- [ ] Account linking edge cases.

## Authorization tests

For two test users, verify:

- [ ] User A cannot read User B private data.
- [ ] User A cannot update User B profile.
- [ ] User A cannot edit User B project.
- [ ] User A cannot publish/unpublish User B content.
- [ ] User A cannot delete User B records.
- [ ] User A cannot access another user's private media.
- [ ] Admin-only operations reject normal users.

## Tenant isolation

Attempt direct identifier manipulation against routes/API operations.

Test:

- Sequential identifiers.
- Random identifiers.
- User IDs.
- Project IDs.
- Storage object paths.
- Query parameters.

Expected result: unauthorized resources are inaccessible regardless of whether identifiers are guessed.

## Storage tests

- [ ] Unauthorized upload blocked.
- [ ] Unauthorized deletion blocked.
- [ ] Private object access blocked.
- [ ] File type restrictions work.
- [ ] Size limits work.
- [ ] Malicious filename/path behavior is safe.

## Input/security tests

Test application boundaries for:

- Injection attempts.
- Cross-site scripting (XSS) payloads.
- Malicious URLs.
- HTML/script content.
- Unexpected Unicode.
- Oversized inputs.
- Repeated submissions.

## Contact/service abuse

- [ ] Spam throttling.
- [ ] Duplicate submission handling.
- [ ] Email notification abuse protection.
- [ ] Malicious links.
- [ ] Oversized payloads.

## MCP security

- [ ] Unauthenticated access rejected.
- [ ] Unauthorized tool calls rejected.
- [ ] Tenant boundaries enforced.
- [ ] Tool input validation verified.
- [ ] Rate limits considered.
- [ ] Sensitive operations audited.

## Reporting

Every finding must include:

- Finding ID.
- Severity.
- Reproduction steps.
- Affected boundary.
- Impact.
- Evidence.
- Fix.
- Retest result.

Critical findings block launch until resolved or explicitly accepted under Stage 10.
