# Stage 11F — Dependency & Supply-Chain Audit

## Objective

Reduce production risk from application dependencies, build tooling, SDKs, third-party scripts, and transitive packages.

## Inventory

- [ ] Production dependencies inventoried.
- [ ] Development dependencies inventoried.
- [ ] Unused packages identified.
- [ ] Duplicate packages identified.
- [ ] Deprecated packages identified.
- [ ] Known vulnerabilities reviewed.
- [ ] Lockfile verified.
- [ ] Build scripts reviewed.
- [ ] Third-party browser scripts reviewed.

## Review criteria

For important dependencies, evaluate:

- Maintenance status.
- Security history.
- Version compatibility.
- License implications.
- Runtime impact.
- Permissions/access.
- Replacement difficulty.

## Secrets and SDKs

Verify that SDKs do not require privileged credentials in browser code.

## Recurring maintenance

After launch establish:

- Automated vulnerability checks where practical.
- Monthly dependency review.
- Critical security patch process.
- Lockfile update process.
- Removal of unused packages.

## Completion evidence

Record audit date, tooling/output, critical findings, remediation, accepted risks, and next review date.
