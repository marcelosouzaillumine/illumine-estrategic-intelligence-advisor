# Legacy Mapping Specification

| Firestore Collection | Legacy Representation | Canonical PostgreSQL Entity | Migration Rule / Notes |
|---|---|---|---|
| `clients` | Single flattened workspace | `tenant.tenants` AND `tenant.companies` | SPLIT. Manual review required if 1 tenant actually represents multiple companies. Mark as `MIGRATION_REVIEW_REQUIRED` if unclear. |
| `client_users` | Firebase UIDs + Roles | `tenant.memberships` | LINK to `tenant.users` (which maps to Firebase UID) and `tenant.roles`. |
| `financial_entries` | Loose period dates | `finance.financial_entries` | MAP to dynamically generated `finance.financial_periods`. Must tie to `finance.accounts`. |
| `account_plans` | Client-specific COA | `finance.accounts` | MAP to a `finance.chart_of_accounts` root per company. |
| `diagnostico` | Overwritten unstructured AI | `intelligence.insights` & `intelligence.recommendations` | SPLIT. Create a `LEGACY_FIREBASE` record in `intelligence.ai_provenance` for these entries. |
