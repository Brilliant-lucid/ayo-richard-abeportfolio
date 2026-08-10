# Stage 11A — Production Data Migration & Cleanup

## Objective

Prepare the current database and media for production without carrying development/test artifacts, broken relationships, stale records, or incompatible schema assumptions into the live environment.

## Scope

- Users/accounts.
- Profiles.
- Projects.
- Case Studies.
- Blog/content.
- Experience.
- Certifications.
- Skills.
- Awards.
- Publications.
- Testimonials.
- Services.
- Contact messages.
- Service inquiries.
- Media/storage objects.
- Legacy fields and records.

## Phase 1 — Inventory

- [ ] Export schema/table inventory.
- [ ] Identify foreign-key relationships.
- [ ] Identify nullable/required fields.
- [ ] Identify legacy fields.
- [ ] Identify test/demo accounts.
- [ ] Identify orphaned records.
- [ ] Identify orphaned media.
- [ ] Identify duplicate records.
- [ ] Identify invalid URLs.
- [ ] Identify records created only for development.

## Phase 2 — Classification

Every record should be classified as:

- Keep.
- Migrate.
- Transform.
- Archive.
- Delete.
- Investigate.

No destructive cleanup should occur without a backup/export.

## Phase 3 — Migration rehearsal

Run the migration against a copy/non-production environment.

Measure:

- Rows before.
- Rows after.
- Failed transformations.
- Orphans before/after.
- Media before/after.
- URL integrity.
- Public rendering.

## Phase 4 — Production cutover

1. Freeze writes where necessary.
2. Create verified backup.
3. Run migration.
4. Run integrity checks.
5. Run application smoke tests.
6. Verify public portfolios.
7. Verify media.
8. Record migration result.

## Rollback/recovery

Do not assume a database rollback is safe after application schema changes. Use the documented recovery plan and restore from the pre-migration backup when required.

## Completion evidence

- Migration script/version.
- Before/after counts.
- Cleanup report.
- Backup identifier.
- Integrity-test output.
- Smoke-test result.
- Release commit/tag.
