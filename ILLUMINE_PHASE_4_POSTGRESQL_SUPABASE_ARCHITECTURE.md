# ILLUMINE_PHASE_4_POSTGRESQL_SUPABASE_ARCHITECTURE

## 1. Executive Summary
This document defines the **Phase 4: PostgreSQL / Supabase Architecture & Migration Design** for the Illumine Executive Governance Platform. It translates the conceptually approved 7-Layer Canonical Model (SOURCE → FACT → METRIC → GOVERNANCE → DECISION → ACTION → OUTCOME) into a rigorous physical and logical PostgreSQL design. 

This design enforces structural Tenant isolation via Row-Level Security (RLS), ensures mathematical immutability for closed financial periods, guarantees AI provenance, and establishes a secure, auditable foundation for executive decision-making. No code or database changes are executed in this phase; this is purely a technical blueprint.

## 2. PostgreSQL Schema Architecture
To maintain domain boundaries and simplify permissions, the database will be divided into specific PostgreSQL schemas:
1. `tenant` - Core multitenancy, RBAC, workspaces, and companies.
2. `finance` - Chart of accounts, financial periods, transactions, adjustments, and metrics.
3. `governance` - Insights, recommendations, decisions, actions, and AI provenance.
4. `audit` - Append-only system logs, history tables, and impersonation events.
5. `legacy` - Temporary staging tables for raw Firebase data cleansing prior to migration.

## 3. Logical-to-Physical Entity Mapping & Tables
The 7-Layer Governance Architecture does not mean 7 tables. It maps to the following physical structure:

### 3.1. Tenant & Identity (`tenant` schema)
- `tenant`: `id` (PK), `name`, `status`, `created_at`
- `company`: `id` (PK), `tenant_id` (FK), `name`, `tax_id`, `status`
- `user`: `id` (PK - mapped to Firebase UID), `email`, `name`, `status`
- `membership`: `id` (PK), `user_id` (FK), `tenant_id` (FK), `role_id` (FK)
- `role`: `id` (PK), `name` (e.g., EXECUTIVE, ADVISOR), `permissions` (JSONB)

### 3.2. Financial Architecture (`finance` schema)
* **SOURCE:** 
  - `raw_import`: `id`, `company_id`, `source_type`, `payload` (JSONB), `import_hash`, `imported_at`
* **FACT:**
  - `chart_of_account`: `id`, `company_id`, `name`, `version`
  - `account`: `id`, `chart_of_account_id`, `code`, `name`, `type`
  - `financial_period`: `id`, `company_id`, `period_date` (DATE), `status` (OPEN/CLOSED), `closed_at`
  - `financial_entry`: `id`, `period_id` (FK), `account_id` (FK), `raw_import_id` (FK, optional), `amount`, `type`
  - `adjustment_entry`: `id`, `financial_entry_id` (FK), `amount_diff`, `rationale`, `audit_event_id` (FK)
* **METRIC:**
  - `metric_definition`: `id`, `name`, `formula`, `version`
  - `metric_value`: `id`, `period_id` (FK), `metric_definition_id` (FK), `value`, `calculated_at`

### 3.3. Governance & Decision Architecture (`governance` schema)
* **GOVERNANCE:**
  - `insight`: `id`, `company_id`, `metric_value_id` (FK, optional), `description`
  - `recommendation`: `id`, `insight_id` (FK), `description`, `ai_provenance_id` (FK, nullable)
  - `ai_provenance`: `id`, `provider`, `model`, `prompt_hash`, `context_hash`, `generated_at`
* **DECISION:**
  - `decision`: `id`, `company_id`, `recommendation_id` (FK), `decided_by` (FK), `rationale`, `decided_at`, `status` (IMMUTABLE)
* **ACTION & OUTCOME:**
  - `action_plan`: `id`, `decision_id` (FK), `title`, `status`, `deadline`
  - `action_item`: `id`, `action_plan_id` (FK), `assigned_to` (FK), `status`
  - `outcome_review`: `id`, `decision_id` (FK), `review_date`, `actual_metric_id` (FK), `variance_analysis`

## 4. Keys, Constraints, and Indexes
- **Primary Keys:** UUID v7 or v4 for all entities to prevent ID enumeration and ease distributed generation.
- **Foreign Keys:** Enforced strictly across all relations (e.g., `company_id` referencing `tenant.company(id)`).
- **Constraints:**
  - `UNIQUE(company_id, period_date)` on `financial_period` to prevent duplicate months.
  - `CHECK (amount >= 0)` where logically applicable.
  - `CHECK (status IN ('OPEN', 'CLOSED'))` for periods.
- **Index Strategy:** 
  - B-Tree indexes on all Foreign Keys.
  - Composite indexes on highly queried paths: `(company_id, period_id)`.
  - GIN indexes on JSONB fields like `raw_import.payload` for auditability.

## 5. Tenant Isolation & RLS Architecture
**Security Boundary:** RLS (Row-Level Security) is the absolute data boundary. It is NOT application logic.
- **Policy Definition:** Every table (except master role dictionaries) will have an `RLS` policy tied to `tenant_id` or `company_id`.
- **JWT Context:** Since we are keeping Firebase Auth temporarily, we will pass the Firebase UID to Supabase via a custom JWT or application session variable (`set_config('request.jwt.claim.sub', ...)`).
- **Membership Check:** RLS policies will verify if `auth.uid()` exists in `tenant.membership` for the requested `tenant_id`.

## 6. Financial Integrity & Period Closing
- **Closing Mechanism:** When a `financial_period` is set to `CLOSED`, an `INSTEAD OF UPDATE/DELETE` trigger locks the `financial_entry` rows associated with it.
- **Adjustments/Reversals:** Corrections to closed periods require inserting a row into `adjustment_entry`. A database view (`v_financial_statement`) will dynamically calculate the net value (`financial_entry.amount` + `adjustment_entry.amount_diff`) ensuring historical transparency.

## 7. Audit, History & Versioning Architecture
- **Soft Delete:** Applied via a `deleted_at` timestamp on master data (`tenant`, `company`, `user`, `account`). A global view or RLS policy will automatically filter out `deleted_at IS NOT NULL`.
- **Immutability:** `financial_entry` (closed), `decision`, `ai_provenance`, and `audit_event` DO NOT have soft delete. They are structurally immutable.
- **Triggers:** A generic function `fn_audit_log_changes()` will be attached to transactional tables (e.g., `action_plan`) to record JSON diffs (old vs new) into `audit.history_log`.

## 8. Impersonation & Platform Support
- **Service Role:** Global `SUPER_ADMIN` bypass is eliminated from standard RLS.
- **Explicit Impersonation:** To support a client, a Platform Operator creates a record in `audit.impersonation_session` containing `operator_id`, `target_tenant_id`, and `reason`. The session generates a temporary scoped token that complies with standard RLS but logs all actions with `impersonated_by = operator_id`.

## 9. Supabase & Integration Considerations
- **Firebase Auth (Transitional):** Kept to isolate database migration from identity migration risk. The backend (Vite/Node) will authenticate via Firebase, retrieve the UID, and securely query Supabase.
- **Realtime:** Supabase Realtime will replace Firestore `onSnapshot`. We must subscribe to the specific RLS-filtered channels (e.g., `action_plan` status changes). Financial entries do not need realtime subscriptions; they are batch-loaded.
- **Edge Functions:** Replaces Firebase Cloud Functions. Used strictly for triggering AI (Gemini) to ensure the prompt/context generation happens server-side and writes the `ai_provenance` securely.

## 10. Firebase-to-PostgreSQL Mapping & Legacy Migration
- `clients` → Split into `tenant` and `company`.
- `client_users` → `membership`.
- `financial_entries` (Flattened) → Mapped to `financial_period` (created dynamically), `account`, and `financial_entry`.
- `diagnostico` → Split into `insight` and `recommendation`. 
  - **Legacy AI Mark:** Migrated `diagnostico` rows will be inserted with an `ai_provenance_id` pointing to a special "LEGACY_FIREBASE" provenance record (Model = UNKNOWN, Hash = NULL).

## 11. Data Cleansing & Validation Strategy
1. **Extraction:** Export Firestore collections to raw JSON lines.
2. **Staging:** Load raw JSON into the `legacy` schema in PostgreSQL.
3. **Cleansing (SQL):** Use SQL scripts to identify orphaned records, invalid dates, and string-to-number mismatches before casting them into the canonical schemas.
4. **Validation:** Run checksum queries (e.g., Total Revenue in Firebase vs Total Revenue in Postgres `v_financial_statement`).
5. **Rollback:** The migration script operates in a transaction. If validation fails, `ROLLBACK`. The Firebase DB is completely untouched (Read-Only source).

## 12. Security, Scalability, and Performance
- **Scalability:** The separation of Raw Data (JSONB) from Normalized Facts (Numeric columns) ensures aggregate queries (SUM, AVG) run in milliseconds over millions of rows, solving the NoSQL analytical bottleneck.
- **Views:** Materialized Views will be used for complex Executive Dashboards (e.g., pre-calculating monthly EBITDA per company) and refreshed nightly or via triggers.
- **Backups:** Supabase Point-in-Time Recovery (PITR) is mandatory for the production instance.

---

## 13. Final Deliverables (Summary)

### A. Recommended PostgreSQL Architecture
- Schemas: `tenant`, `finance`, `governance`, `audit`, `legacy`.
- Strict RLS, Triggers for history, Views for financial nets.

### B. Security & RLS Model
- Replaces implicit application logic with hard database rules. Firebase Auth UID is mapped to Supabase sessions. SUPER_ADMIN is replaced by audited Impersonation Sessions.

### C. Migration Strategy
- Extract (Firebase) -> Load (Postgres Staging/Legacy) -> Cleanse (SQL) -> Transform (Canonical Schema) -> Validate (Checksums). Firebase remains active and read-only during extraction.

### D. Decisions Requiring Marcelo's Approval
1. **Supabase Realtime Mapping:** Do we agree that only operational layers (Actions, Insights) need Realtime websockets, and Financials (BP/DRE) can be standard fetch/polling to save bandwidth?
2. **Auth Integration Strategy:** Do we agree to use a custom JWT or a secure backend proxy to map the Firebase UID into Supabase context during the transition phase?

### E. Open Architectural Decisions
1. What is the exact mapping heuristic to split the current `clients` table into `tenant` (billing) vs `company` (business) for existing legacy records?
2. Should `outcome_review` be triggered automatically by time (e.g., 90 days after decision) or initiated manually by the Executive?

### F. Recommended Implementation Sequence (Phase 5 Plan)
1. **DDL Creation:** Write the raw SQL scripts for schemas, tables, and constraints.
2. **Security:** Implement RLS policies and Audit triggers.
3. **Migration Scripts:** Build the ETL scripts from Firebase JSON to Postgres.
4. **Dry-Run Migration:** Run the ETL on a staging DB and validate data checksums.
5. **Adapter Refactoring:** Begin swapping Firestore Adapters in the application codebase to Supabase/REST adapters.
