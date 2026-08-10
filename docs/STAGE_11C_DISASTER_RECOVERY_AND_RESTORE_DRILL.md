# Stage 11C — Disaster Recovery & Restore Drill

## Objective

Prove that the platform can recover from a serious infrastructure/data failure.

## Recovery assets

Recovery must cover:

- PostgreSQL database.
- Authentication-related data where applicable.
- Storage/media objects.
- Application configuration.
- Production environment secrets through the approved secret-management path.
- Domain/DNS configuration records.

## Drill scenarios

### Scenario A — Database failure

Simulate loss/corruption in a non-production recovery environment.

Verify:

- Backup identified.
- Restore succeeds.
- Schema is usable.
- User records exist.
- Portfolio records exist.
- Relationships work.

### Scenario B — Media loss

Verify that media can be recovered independently of database restoration.

### Scenario C — Application deployment failure

Deploy a deliberately known-bad release to a safe environment and demonstrate rollback to the previous release.

## Recovery objectives

Define before launch:

- Recovery Point Objective (RPO): maximum acceptable data loss window.
- Recovery Time Objective (RTO): maximum acceptable restoration window.

## Drill record

Record:

- Date.
- Starting state.
- Failure scenario.
- Backup used.
- Restore duration.
- Data loss observed.
- Media recovery result.
- Application recovery result.
- Smoke-test result.
- Failures discovered.
- Corrective actions.

## Completion rule

A backup strategy is not considered production-proven until a restore has been successfully performed and the restored application has passed critical smoke tests.
