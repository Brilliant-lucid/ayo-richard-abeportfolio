# Stage 11E — Email, SEO & Domain Verification

## Objective

Verify the public identity, discoverability, authentication callbacks, and communication infrastructure of the production platform.

## Domain

- [ ] Primary domain resolves correctly.
- [ ] HTTPS/TLS works.
- [ ] `www` behavior is intentional.
- [ ] Canonical host is defined.
- [ ] Redirects are correct.
- [ ] Preview domains do not become accidental canonical URLs.
- [ ] Authentication callbacks use correct production URLs.
- [ ] OAuth redirects are verified.
- [ ] MCP redirects are verified where applicable.

## Email authentication

Verify:

- Sender identity.
- Sender Policy Framework (SPF).
- DomainKeys Identified Mail (DKIM).
- Domain-based Message Authentication, Reporting, and Conformance (DMARC).
- Bounce behavior.
- Complaint behavior.
- Delivery logs.
- Retry behavior.
- Duplicate notification prevention.

## Email functional tests

- Registration email.
- Password reset.
- Product notifications.
- Contact/service notifications.
- Failure handling.

Only test emails that actually exist in the production product scope.

## SEO

Verify:

- `robots.txt`.
- Sitemap.
- Canonical URLs.
- Page titles.
- Meta descriptions.
- Open Graph metadata.
- Social preview metadata.
- Dynamic portfolio metadata.
- Project/case-study/blog metadata.
- 404 handling.
- Redirect handling.
- Indexability rules.

## Search engine verification

Configure and verify Google Search Console and other search tools where strategically relevant.

## Public portfolio test

Use an actual published test portfolio and verify:

- Direct URL works.
- Refresh works.
- Social preview renders.
- Search crawler can access intended public pages.
- Private content remains inaccessible.

## Evidence

Record domain checks, email authentication results, SEO inspection results, and representative screenshots/logs where useful.
