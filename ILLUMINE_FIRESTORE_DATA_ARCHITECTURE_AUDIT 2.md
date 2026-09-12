# ILLUMINE_FIRESTORE_DATA_ARCHITECTURE_AUDIT

## 1. Executive Summary
This document provides a comprehensive, read-only architectural audit of the Firebase and Firestore implementation within the Illumine platform. The audit was conducted using repository source code, configuration files, and Firestore rules. The architecture relies extensively on Firestore for NoSQL document storage, with security rules handling tenant isolation. However, the schema reveals complex relational dependencies—particularly in financial intelligence and multi-tenancy—that are difficult to maintain in NoSQL, making the eventual migration to a relational structure (PostgreSQL) highly recommended.

**Runtime Access:** [UNKNOWN] - Direct access to the live Firebase environment was not available. All findings are derived strictly from repository evidence (`[CODE]`, `[RULES]`, `[CONFIG]`).

## 2. Evidence Classification
- **[CODE]**: Observed directly in repository source code (e.g., `src/adapters/persistence`).
- **[RULES]**: Observed directly in Firestore security rules (`firestore.rules`).
- **[CONFIG]**: Observed in Firebase configuration (`firebase.json`, `firestore.indexes.json`).
- **[RUNTIME]**: [UNKNOWN] - Not accessed.
- **[INFERRED]**: Reasonably inferred from code patterns but not explicitly defined as a strict schema.
- **[UNKNOWN]**: Cannot be determined without runtime access.

## 3. Firebase Services
| Service | Active | Evidence | Relevance |
|---|---|---|---|
| Firestore | Yes | `[CONFIG]` `[CODE]` `[RULES]` | Core database for all domains. |
| Firebase Auth | Yes | `[CODE]` `[RULES]` | Core authentication and RBAC (`src/lib/firebase.ts`). |
| Firebase Storage | Yes | `[CODE]` | Used for attachments/documents, initialized in `firebase.ts`. |
| Firebase Functions | Yes | `[CONFIG]` | Identified via `firebase.json` rewrites (`/api/generate-advisory-parecer`). |
| Firebase Hosting | Yes | `[CONFIG]` | Frontend distribution (`firebase.json`). |
| Firebase App Check | [UNKNOWN] | - | No direct evidence in basic config. |

## 4. Firestore Collections
Based on `firestore.rules` `[RULES]` and adapters `[CODE]`:

| COLLECTION | PURPOSE | TENANT SCOPE | EVIDENCE |
|---|---|---|---|
| `clients` | Represents companies/tenants. | `ownerId`, `clientId` | `[RULES]` |
| `financial_entries` | Stores DRE, BP, Caixa lines. | `clientId` | `[RULES]`, `[CODE]` |
| `account_plans` | Chart of Accounts. | `clientId` | `[RULES]`, `[CODE]` |
| `diagnostico` | AI/Executive diagnoses. | `clientId`, `ownerId` | `[RULES]` |
| `okrs` | Objectives & Key Results. | `clientId`, `ownerId` | `[RULES]` |
| `payables` / `receivables` | Accounts Payable/Receivable. | `clientId` | `[RULES]` |
| `audit_events` | Governance/Audit trails. | `tenantId` | `[RULES]` |

*Note: Many other collections exist, but these form the core pillars.*

## 5. Document Schemas
*Reconstructed from `firestore.rules` validation logic `[RULES]` and Typescript models `[CODE]`.*

- **Client (`clients`)**: `fantasia`, `ownerId`, `regime`, `regimeReal`, `createdAt`, `updatedAt`.
- **Financial Entry (`financial_entries`)**: `clientId`, `type` (DRE/BP/CAIXA), `category`, `value`, `competence` (or `year`/`month`), `createdAt`.
- **Account Plan (`account_plans`)**: `clientId`, `code`, `name`, `type`, `level`, `planType` (accounting/managerial), `createdAt`.
- **Diagnostico (`diagnostico`)**: `clientId`, `descricao`, `eixo`, `swot`, `tipoRisco`, `gravidade`, `urgencia`, `tendencia`, `impactoFinanceiro`, `iveScore`, `updatedAt`.

**Inconsistencies Identified `[CODE]`:**
- Naming mixed conventions: `clientId` vs `tenantId`.
- Time formats: Some financial entries use `competence` (string), others use `year`/`month` (numbers).
- Schema overlap: `financial_entries` supports both manual (`isValidFinancialEntry`) and AI-imported formats (`isValidImportedFinancialEntry`) with slightly different fields.

## 6. Subcollections
**Status:** Minimal use of subcollections observed. `[CODE]`
Most collections are flat at the root level and linked via string IDs (`clientId`). This pattern (flat collections with foreign key-like fields) strongly indicates a relational mental model forced into a NoSQL database.

## 7. Relationship Map
`[INFERRED]` from `firestore.rules`:
- `User` (1) -> (N) `Client` (via `ownerId`)
- `Client` (1) -> (N) `financial_entries` (via `clientId`)
- `Client` (1) -> (N) `account_plans` (via `clientId`)
- `Client` (1) -> (N) `diagnostico` (via `clientId`)

**Classification:** All observed relationships are **REFERENCE-BASED (ID-BASED)**. There are no native NoSQL subcollection bindings for core data; it functions exactly like a SQL database lacking actual foreign key constraints.

## 8. Multi-Tenancy
**Current Tenant Entity:** The system uses `clients` as the primary company/tenant entity (`clientId`).
**Isolators:** `ownerId` (User ID of the creator), `clientId` (The workspace/company).
**Enforcement:**
- Client-side filtering via `where('clientId', '==', ...)` in Adapters `[CODE]`.
- Backend validation via `ownsClient(clientId)` in `firestore.rules` `[RULES]`.

**TENANT ISOLATION MATRIX:**
| Aspect | Enforced By | Mechanism |
|---|---|---|
| Reads | Rules + Code | `ownsClient(existing().clientId)` |
| Writes | Rules | `ownsClient(incoming().clientId)` |
| Admin Bypass | Rules | `isSuperAdmin()` bypasses all tenant checks |

## 9. Security Rules
Analyzed `firestore.rules` (594 lines) `[RULES]`:
- **Privileged Bypass:** `match /{allPaths=**} { allow read, write: if isSuperAdmin(); }`. This is a global, absolute bypass.
- **Tenant Restriction:** Handled via helper `ownsClient(clientId)`, which checks if `ownerId == request.auth.uid` OR if user is in `client_users`.
- **Validation:** Extensive schema validation hardcoded in rules (e.g., `isValidFinancialEntry`).
- **Risk:** High dependency on `incoming().clientId`. If the UI is compromised, bad data could be injected if it matches the allowed `clientId`.

## 10. Authentication & Custom Claims
- **Provider:** Firebase Auth (Email/Password, Google). `[CODE]`
- **Custom Claims:** `request.auth.token.role` is checked in rules (`hasRole('SUPER_ADMIN')`, `hasRole('GOVERNANCE_ADMIN')`).
- **Assignment:** [UNKNOWN/INFERRED] Custom claims in Firebase must be set via the Admin SDK, likely done via a Cloud Function upon user creation or manual admin action.

## 11. Firestore Adapters
Located in `src/adapters/persistence/` `[CODE]`.
- **`FirestoreFinancialEntriesAdapter`**: Queries `financial_entries` by `clientId`, `type`, and `year`. High risk of N+1 or large reads if years aren't batched properly.
- **`FirestoreAccountPlansAdapter`**: Includes complex migration logic (`migrateLegacyAccounts`), fetching all docs to find missing `planType`, then batch updating. This mixes business migration with persistence.
- **`LegacyTenantContextAdapter`**: Assigns a hardcoded `LEGACY_SINGLE_TENANT_ID`. Indicates legacy single-tenant assumptions still exist in parts of the runtime.

## 12. Financial Data Architecture
`[CODE]` and `[RULES]`:
- **Source Data:** Financial statements imported via AI (`aiService.ts` -> `parseFinancialStatementWithAI`).
- **Storage:** `financial_entries` and `account_plans`.
- **Calculations/Indicators:** Likely processed on the client side (Zustand/React) and saved back to `indicators` or `financial_positions`.
- **Access:** Restricted strictly to the `ownerId` or `client_users`.

## 13. Governance Data
`[RULES]`: 
- Collections: `diagnostico`, `okrs`, `diretrizes`, `report_notes`.
- Tenant Boundary: All isolated by `clientId` and `ownerId`. 

## 14. Executive Intelligence Data
`[CODE]`: 
- AI outputs from Gemini (e.g., `generateGovernanceDiagnosis`) map directly to the `diagnostico` schema. 
- Generated data is persisted in Firestore, but [UNKNOWN] if historical versions of AI generations are kept (no versioning fields observed in `firestore.rules`).

## 15. Auditability
`[RULES]`:
- Most critical collections enforce `createdAt` and `updatedAt`.
- Many enforce `createdBy` (e.g., `isValidAccountPlan`, `isValidFinancialEntry`).
- `audit_events` and `security_audit_logs` exist for systemic auditing.
- Missing: Soft deletes (`deletedAt`). Deletions in adapters use `deleteDoc` (hard delete).

## 16. Data Quality
`[INFERRED]`: 
- NoSQL lacks foreign key constraints. Deleting a `client` using `FirestoreClientsAdapter.deleteClientCascade` attempts to clean up related collections manually in the client. If the connection drops mid-cascade, **orphan documents** will remain permanently.
- Hardcoded rule schemas (e.g., `data.type in ['Ativo', 'Passivo']`) prevent bad data, but changing an enum requires updating the DB rules and redeploying.

## 17. Query Architecture
`[CODE]`:
- **Broad Collection Queries:** `FirestoreClientsAdapter.subscribeToClients` pulls all clients for Master Admins. If the DB grows to thousands of clients, this will crash the client browser.
- **Missing Pagination:** No `.limit()` or cursor-based pagination was observed in the primary `getDocs` calls in adapters.
- **Risk:** MEDIUM to HIGH as data grows.

## 18. Firestore Indexes
`[CONFIG]`: `firestore.indexes.json` contains 9 composite indexes.
- E.g., `financial_entries` indexed by `clientId` + `createdAt` (DESC).
- These match the queries in the adapters, showing good hygiene for basic sorting.

## 19. Storage
`[CODE]`: `import { getStorage } from 'firebase/storage'` is present. 
- [UNKNOWN] what exact paths are used. No security rules for storage were provided in the evidence.

## 20. Legacy Architecture
`[CODE]`:
- `LegacyTenantContextAdapter` explicitly exists to handle legacy environments.
- `update_*.mjs`, `fix_*.cjs`: Over 30 ad-hoc maintenance scripts exist in the root (e.g., `fix_dlpa.mjs`, `fix-bs.mjs`). This indicates that data shape has changed often, requiring manual backfills without a formal migration framework.

## 21. Maintenance Scripts
`[CODE]`: 
- Examples: `fixDates.cjs`, `replace_logic.cjs`, `fix_mess.mjs`, `test_migrate.cjs`.
- Purpose: Mass updates to Firestore data.
- Relevance: Shows that NoSQL schema evolution is currently painful and requires ad-hoc Node.js scripts executed locally.

## 22. Data Volume
- [UNKNOWN] Runtime access unavailable. 

## 23. Migration Complexity
- **`financial_entries`**: HIGH. Massive volume of flat NoSQL documents that must be mapped to normalized SQL tables (Chart of Accounts -> Entries).
- **`clients` / `users`**: MEDIUM. Mapping `ownerId` and `client_users` to standard PostgreSQL RLS and M:N junction tables.
- **Overall:** VERY HIGH due to the lack of formal schema migrations historically.

## 24. PostgreSQL Requirements
The current architecture strongly points to the need for:
- **Foreign Keys:** To prevent orphan `financial_entries` when a `client` is deleted (replacing manual cascades).
- **RLS Policies:** To replace `firestore.rules` and enforce multi-tenancy at the database engine level securely.
- **Normalized Tables:** To separate the Chart of Accounts (`account_plans`) from actual transactional values (`financial_entries`).
- **Enums:** To lock down statuses and types without hardcoding them in rules.

## 25. Canonical Entity Candidates
1. `Tenant` / `Company` (from `clients`)
2. `User` (from Firebase Auth / `client_users`)
3. `AccountPlan` (from `account_plans`)
4. `FinancialEntry` (from `financial_entries`)
5. `GovernanceDiagnosis` (from `diagnostico`)
6. `Objective` & `KeyResult` (from `okrs`)

## 26. Data Governance
- **Access Control:** Good (RBAC + Rules).
- **Traceability:** Moderate (Timestamps + `createdBy`).
- **Archival/Deletion:** Poor (Hard deletes in client code).

## 27. Risk Register
| ID | RISK | SEVERITY | EVIDENCE | IMPACT | RECOMMENDED ACTION |
|---|---|---|---|---|---|
| R1 | Client-side Cascades | HIGH | `FirestoreClientsAdapter` | Orphan data if client closes browser mid-delete. | Move cascading deletes to backend/functions or FK constraints. |
| R2 | Unpaginated Queries | HIGH | `subscribeToClients` | OOM crashes on admin dashboard as clients scale. | Implement cursor pagination. |
| R3 | Schema Drift | MEDIUM | Root `fix_*.cjs` scripts | Inconsistent data states. | Move to a SQL DB with strict migrations. |
| R4 | Admin Rule Bypass | HIGH | `firestore.rules` | Compromised admin reads all tenants. | Limit admin bypass to specific audit endpoints. |

## 28. Migration Decision Support
**ARGUMENTS FOR MIGRATION (Supabase/Postgres):**
- The data is inherently relational (Companies -> Accounts -> Entries -> AI Diagnostics).
- Need for transactional guarantees (ACID) during complex financial calculations.
- Need for robust RLS that doesn't rely on client-side JS query filtering.
- Eliminates the need for manual `deleteDoc` cascading loops.

**ARGUMENTS AGAINST MIGRATION:**
- Current frontend relies heavily on Firestore real-time subscriptions (`onSnapshot`). Moving to Postgres requires refactoring all real-time listeners.

## 29. Recommended Next Steps
1. Review this document alongside the Repository Architecture Audit.
2. Formalize the Canonical Data Model based on Section 25.
3. Map the translation of Firestore `onSnapshot` to Supabase Realtime (or standard React Query hooks) before altering code.
4. DO NOT create migrations yet; proceed to Phase 3 planning.
