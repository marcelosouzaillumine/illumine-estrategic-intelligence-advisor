# Release Gate Checklist — Production Release Governance

This checklist must be completely validated and signed off before any code merge to the `main` branch or deployment to the production environment.

## 1. Technical Quality Gates

- [ ] **TypeScript Validation**: `npm run typecheck` completes with zero errors or warnings.
- [ ] **Unit Tests**: `npm test` runs all unit tests, with 100% of tests passing.
- [ ] **E2E Workflows**: Simulates end-to-end CFO session flow in staging successfully (`tests/e2e/staging-governance-flow.test.ts`).
- [ ] **Firestore Rules Compilation**: Security rules file `firestore.rules` compiles successfully.
- [ ] **Firestore Rules Unit Tests**: Emulated rules tests execute and pass successfully (`npm run test:rules`).
- [ ] **Production Hardening Audit**: `npm run production:hardening:audit` completes with no compliance warnings.

## 2. Institutional Governance Audits

- [ ] **Governance Audit**: No page-level threshold recalculation or bypasses of the interaction engine (`npm run governance:audit`).
- [ ] **Cognitive Audit**: Attention engines prioritize context correctly without flooding alerts (`npm run executive:cognitive:audit`).
- [ ] **Memory Audit**: Recurrence calculations use immutable registry, and history explorer behaves as fail-closed (`npm run institutional:memory:audit`).
- [ ] **Board Deck Generation Test**: Export systems (`BoardPackExportEngine`) compile PDFs cleanly with fiduciarily verified hashes.

## 3. Environment & Security Checks

- [ ] **Security Review**: No hardcoded API keys, private keys, or passwords committed to the repository (only configuration variables).
- [ ] **Tenant Isolation Validation**: Verified that no query fetches documents without explicit `tenantId` or `clientId` filtering.
- [ ] **Client-Side Role Escalation**: Checked that permission matrices cannot be edited or bypassed from UI components.
- [ ] **Demo Data Disclosure**: Staging data seeded is tagged as `DEMO` and has `environment: STAGING` properties.
- [ ] **Staging Smoke Test**: Checked staging database connections and authentication resolution under the staging mode.

## 4. Rollback & Staging Preparation

- [ ] **Rollback Plan Verified**: A detailed rollback strategy is documented and tested in case of index deployment or security rules failure.
- [ ] **Known Limitations**: Documented database size boundaries and query depth limits.
