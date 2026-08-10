# Stage 9 — Legal, Compliance, Privacy & Trust

**Program:** Production Readiness & Documentation Program  
**Project:** Portfolio Platform  
**Status:** Readiness framework defined; final legal review required

> This is a product and engineering readiness document, not legal advice. Final legal language, applicability, and regulatory conclusions require qualified legal counsel.

## 1. Purpose

The Portfolio Platform stores, processes, and publicly publishes professional identity information. Stage 9 defines the legal, privacy, data-governance, and trust controls surrounding that activity.

The platform must distinguish between public professional information, private account/application data, sensitive security information, and data processed by third-party providers.

## 2. Required policy set

As applicable to the launch model, the production product should have:

1. Terms of Service.
2. Privacy Policy.
3. Acceptable Use / Community Guidelines.
4. Cookie and analytics disclosure where applicable.
5. Copyright/takedown procedure.
6. Data request procedure.
7. Security contact and incident process.

Final wording should be reviewed before being relied upon as a legal contract, notice, or compliance statement.

## 3. Terms of Service scope

Terms should address account eligibility, user responsibilities, accuracy of professional information, user-generated content, public publication, acceptable use, prohibited conduct, intellectual property, third-party services, availability, suspension/termination, disclaimers, limitations of liability where lawful, governing law, and contact information.

## 4. User-generated content

Users retain ownership of content they create, subject to the limited rights required for the platform to host, process, display, cache, and distribute that content through its functionality.

The policy and product model should clearly define user ownership, the platform license, removal rights, prohibited content, third-party intellectual property responsibility, and public publication implications.

## 5. Privacy Policy scope

The Privacy Policy should explain:

### Data categories

- Account information.
- Profile information.
- Professional portfolio content.
- Public portfolio activity.
- Contact/service inquiry data.
- Technical and security logs.
- Analytics data where used.

### Purposes

- Account operation.
- Portfolio publishing.
- Communication.
- Security.
- Service improvement.
- Analytics.
- Abuse prevention.
- Legal obligations where applicable.

### Third parties

The actual production provider inventory should identify hosting, database/authentication, Storage, email, analytics, Artificial Intelligence (AI), Model Context Protocol (MCP), and other processors that receive user data.

## 6. Data classification

### Public

Published name, headline, biography, projects, skills, certifications, social links, and other fields intentionally published by the user.

### Private

Account identifiers, drafts, private settings, private messages, inquiries, and non-public portfolio data.

### Sensitive/security

Authentication credentials, tokens, service-role keys, OAuth secrets, and security information that could facilitate exploitation.

Sensitive/security data must never be exposed through public portfolio rendering.

## 7. Publication model

The product must make the distinction between:

**Save as draft**

and

**Publish publicly**

clear to users.

Public rendering must use an explicit public-data boundary. It must not expose private fields simply because a query selected an entire database record.

## 8. User data rights

Depending on applicable law and jurisdiction, procedures may be required for access, correction, deletion, export/portability, restriction/objection, and withdrawal of consent where consent is the applicable legal basis.

Requests must be authenticated sufficiently to prevent unauthorized disclosure or deletion.

## 9. Account deletion and data lifecycle

Deletion behavior must explicitly define the treatment of:

- Authentication identity.
- Profile and portfolio.
- Projects.
- Case Studies.
- Blogs.
- Experience.
- Certifications.
- Skills.
- Awards.
- Publications.
- Testimonials.
- Contact messages.
- Service inquiries.
- Media objects.
- Analytics identifiers.

The lifecycle must distinguish **delete**, **anonymize**, **retain for a defined reason**, and **expire from backup retention**.

## 10. Retention schedule

Retention should be defined by data category, not one indefinite rule.

| Category | Retention decision |
|---|---|
| Active account data | While account exists + defined post-deletion window |
| Draft content | While retained by user/product policy |
| Contact/service data | Business/legal-defined period |
| Security logs | Security-defined period |
| Analytics | Analytics-defined period |
| Backups | Infrastructure-defined period |
| Deleted media | Defined cleanup process |

Exact periods require product and legal approval.

## 11. Third-party processor inventory

For every production provider record:

- Provider.
- Data processed.
- Purpose.
- Relevant location/region.
- Data Processing Agreement (DPA) status where applicable.
- Security documentation.
- Retention behavior.
- Subprocessors where relevant.
- Replacement/exit strategy.

## 12. Jurisdiction and Nigeria readiness

The platform should not assume that all users are governed by one jurisdiction. Applicability depends on business establishment, user location, target markets, processing activities, and data categories.

Because the platform is being developed in Nigeria, legal review should specifically assess applicable Nigerian privacy and data-protection requirements, including the Nigeria Data Protection Act and the Nigeria Data Protection Commission (NDPC), as applicable to the business and processing activities.

No registration, appointment, assessment, or other legal requirement should be claimed as applicable without an appropriate legal assessment.

## 13. Cookies and analytics

If cookies, advertising identifiers, or similar tracking technologies are used, document what is used, whether consent is required, what happens before consent, how preferences are stored and changed, and retention.

Do not implement a generic cookie banner that does not reflect actual product behavior or legal requirements.

## 14. Copyright and takedown

Portfolios may contain images, text, project material, publications, and third-party brands. The platform should provide a documented complaint and takedown process:

```text
Complaint
 ↓
Evidence recorded
 ↓
Claim reviewed
 ↓
Temporary restriction where necessary
 ↓
Decision
 ↓
Restore / remove
 ↓
Decision recorded
```

## 15. Impersonation and professional misrepresentation

Potential cases include identity impersonation, false professional claims, fabricated certifications, and unauthorized company representation.

The platform should not automatically certify claims simply because a user entered them.

## 16. Professional verification

Verification should maintain explicit states:

```text
Unverified claim
      ↓
Verification requested
      ↓
Evidence submitted
      ↓
Review
      ↓
Verified / Rejected / Needs review
```

Verification evidence should not be public by default. Verification records should retain source, timestamp, scope, review method, expiration/review rules where applicable, revocation path, and audit history.

## 17. Artificial Intelligence (AI) and Model Context Protocol (MCP) data handling

Where AI or MCP features process user information, document:

- Data sent to the provider/service.
- Purpose.
- Provider retention/training behavior where applicable.
- User controls where appropriate.
- Human review expectations.
- Output limitations.
- Confidential-data handling.

Private user information must not be sent externally merely for technical convenience.

## 18. Security incident and privacy escalation

Potential incidents include cross-tenant access, credential leakage, account takeover, malicious uploads, data exfiltration, unauthorized MCP access, and database compromise.

The response process must connect technical incident handling with applicable legal/privacy notification requirements.

## 19. Age eligibility

Terms and product design should define age eligibility and treatment of minors. If the product is not designed for children, marketing and onboarding should not intentionally target children, and requests involving minors should follow the documented policy.

## 20. Trust signals

Trust indicators must be evidence-based.

Appropriate examples include verified identity, verified professional credentials, verified organization relationships, or documented evidence supplied by the user.

Avoid automatically generated badges or claims such as "certified" when no actual verification has occurred.

## 21. Privacy and security by design

Every new feature should answer:

1. What data does it collect?
2. Who can access it?
3. Why is it collected?
4. How long is it retained?
5. Is it public or private?
6. Is it sent to a third party?
7. Can the user delete it?
8. What happens when the account is deleted?

## 22. Readiness checklist

- [ ] Terms of Service drafted and reviewed.
- [ ] Privacy Policy drafted and reviewed.
- [ ] Acceptable Use/Community Guidelines drafted.
- [ ] Cookie/analytics behavior documented.
- [ ] Data classification approved.
- [ ] Publication boundary verified.
- [ ] Account deletion behavior defined.
- [ ] Data request procedure defined.
- [ ] Retention schedule defined.
- [ ] Third-party processor inventory complete.
- [ ] Copyright/takedown process defined.
- [ ] Impersonation process defined.
- [ ] Professional verification rules defined.
- [ ] AI/MCP data handling documented where applicable.
- [ ] Security incident legal escalation defined.
- [ ] Jurisdiction-specific legal review completed before relying on final policies.
