# ILLUMINE_REPOSITORY_ARCHITECTURE_AUDIT

## 1. Executive Summary
This document presents the findings of a read-only technical audit of the Illumine platform repository. The current architecture relies heavily on Firebase (Firestore and Auth) with a Vite/React frontend. While the repository demonstrates an evolution toward Clean Architecture principles with distinct domain, core, and adapter layers, significant technical debt remains in the form of legacy multi-tenancy models and numerous hotfix scripts at the root level. The target architecture's reliance on Supabase is not yet implemented, indicating a transitional phase.

## 2. Technology Stack
- **Frontend Framework:** React 19, Vite
- **Styling:** Tailwind CSS (v4), Radix UI, Shadcn UI
- **State Management:** Zustand
- **Database & Auth:** Firebase (Firestore, Authentication, Storage)
- **AI/LLM:** Google GenAI (Gemini)
- **Language:** TypeScript
- **Package Manager:** npm

## 3. Repository Architecture
The repository is structured as a monolithic frontend application with extensive client-side business logic and Firebase adapter integrations.
- **Root Directory:** Contains Vite, Tailwind, Firebase config, and a massive number of ad-hoc scripts (e.g., `fix_bs.mjs`, `fix_mess.mjs`), suggesting significant recent refactoring or data patching.
- **`/src` Directory:** Houses the core application logic, structured around capabilities, domains, and adapters.
- **`/tests` Directory:** Contains rules tests for Firestore and specific unit/integration tests.

## 4. Application Architecture
The application follows a modular, partially domain-driven design structure:
- **Presentation Layer:** `/src/pages`, `/src/components`, `/src/viewmodels`
- **Business Logic:** `/src/services`, `/src/domain`, `/src/capabilities`
- **Data Access/Infrastructure:** `/src/adapters/persistence` (Firestore adapters)
- **Core Systems:** `/src/core/runtime`, `/src/core/constitution`

## 5. Domain Map
- **Financial Intelligence:** Account plans, financial entries (DRE, BP, Caixa), payables, receivables.
- **Governance:** OKRs, diagnoses, guidelines (mission, vision), meeting minutes, action items.
- **Tenancy/Identity:** Client/Tenant management, user memberships, roles.
- **Advisory/Intelligence:** AI-driven diagnosis generation, financial statement parsing.

## 6. Database Dependencies
The platform is currently **100% dependent on Firebase/Firestore**.
- **Supabase / PostgreSQL:** Defined in `.env.example` but **NOT implemented** in the active `src/` codebase. There are no SQL migrations or Postgres clients in use.
- **Firestore Collections:** `clients`, `financial_entries`, `account_plans`, `indicators`, `diagnostico`, `okrs`, `payables`, `receivables`, `tenants`, `tenant_memberships`, `audit_events`.
- **Database Rules:** Enforced via `firestore.rules` (594 lines), defining access based on `ownerId`, `clientId`, and RBAC tokens (`isSuperAdmin()`, `isGovernanceAdmin()`).

## 7. Multi-Tenant Assessment
**Status: Partially Enforced (Transitional)**
- **Evidence:** The codebase contains a `LegacyTenantContextAdapter` assigning a `LEGACY_SINGLE_TENANT_ID`, indicating a migration from single-tenant to multi-tenant.
- **Data Isolation:** Enforced at the Firestore Rules layer using `ownsClient(clientId)` and `isOwner(existing())`. 
- **Identifiers:** Uses a mix of `tenantId`, `clientId`, and `ownerId`. The presence of `client_users` and `tenant_memberships` suggests parallel or evolving multi-tenancy models.

## 8. Authentication & Authorization
- **Authentication:** Handled exclusively by Firebase Auth (`src/lib/firebase.ts`), supporting Google Popup and Email/Password.
- **Authorization:** Handled client-side via React Contexts (`ExecutiveContext`) and server-side via `firestore.rules`.
- **Roles:** Defined in rules: `SUPER_ADMIN`, `GOVERNANCE_ADMIN`, `ADVISOR`, `CLIENT_ADMIN`, `AUDITOR`.

## 9. Environment Variables
Identified in `.env.example`:
- **Server/API:** `VITE_ADVISORY_API_URL`, `APP_URL`
- **AI Providers:** `DEEPSEEK_API_KEY`, `OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `VITE_GEMINI_API_KEY` (in `aiService.ts`)
- **Future DB (Not active):** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Integrations:** `GITHUB_TOKEN`, `CLICKUP_API_KEY`, `N8N_API_KEY`
- **Deployment:** `RAILWAY_TOKEN`, `VERCEL_TOKEN`
- **Safety:** No secrets are hardcoded in the codebase, but the presence of many API keys suggests distributed service integrations.

## 10. AI Architecture
**Status: Centralized around Google GenAI**
- **Implementation:** `src/services/aiService.ts`
- **Capabilities:**
  1. **Financial Parsing:** Parses raw text from balance sheets and DREs into structured JSON (`parseFinancialStatementWithAI`).
  2. **Governance Diagnosis:** Generates C-level institutional diagnoses based on indicator scores (`generateGovernanceDiagnosis`).
- **Models:** Uses `gemini-2.0-flash`. Prompts are hardcoded in the service.

## 11. Financial Intelligence Architecture
- **Data Model:** Financial entries are categorized by type (`DRE`, `BP`, `CAIXA`) and competence (month/year).
- **Adapters:** `FirestoreFinancialAdapter`, `FirestoreCashFlowAdapter`, `FirestoreAccountPlansAdapter`.
- **AI Normalization:** Raw documents are sent to Gemini to extract normalized entries, which are then stored in Firestore.

## 12. API & Integrations
- **Firebase:** Core data and auth layer.
- **Gemini:** Core intelligence engine.
- **Internal APIs:** Mentions of `/api/generate-advisory-parecer` in env, likely running via Firebase Cloud Functions or Vercel Edge functions.

## 13. Security Findings
- **INFORMATIONAL:** Firebase config is exposed in `firebase-applet-config.json` and `.env` (standard for Firebase client apps, but requires strict rules).
- **MEDIUM:** `firestore.rules` relies heavily on `clientId` parameter passing. A compromised client could attempt ID manipulation, though rules check `ownerId`.
- **MEDIUM:** `isSuperAdmin()` bypasses all security rules (`allow read, write: if isSuperAdmin();`). If an admin account is compromised, the entire database is exposed.

## 14. Technical Debt
- **High Debt in Root Directory:** Over 30 ad-hoc `.cjs`, `.mjs`, and `.js` scripts (e.g., `fixDates.cjs`, `replace_logic.cjs`, `fix_mess.mjs`). This pollutes the root and indicates fragile manual interventions.
- **Transitional Tenancy:** Coexistence of `FirestoreTenantAdapter` and legacy `clientId` access patterns.
- **Bloated Typecheck Logs:** Dozens of `recovery_typecheck_*.log` files in root.

## 15. Testing
- **Unit/Integration:** Configured via Vite/Vitest (`vitest` in package.json) and `tsc` for typechecking.
- **Scripts:** `test:fiduciary` and `test:rules` (tests Firestore rules locally using Firebase emulator).
- **Coverage:** Financial integrity audits and structural audits exist as standalone scripts rather than standard test suites.

## 16. Deployment Architecture
- **Platform:** Vercel (indicated by `vercel.json` and `.env` tokens).
- **Assumptions:** Single Page Application (SPA) routing, client-side rendering with Vite. Cloud functions might be used for backend API routes (`firebase.json` indicates Firebase hosting/functions setup).

## 17. Scalability Assessment
- **Current Bottleneck:** Complex analytical queries (e.g., aggregating years of financial data across tenants) will be expensive and slow on Firestore due to its NoSQL nature.
- **Future Growth:** The intended migration to PostgreSQL/Supabase is critical to support the relational complexity of financial and governance reporting.

## 18. Illumine Target Architecture Alignment
- **Multi-tenant architecture:** PARTIALLY ALIGNED (Transitioning).
- **Financial/Governance Intelligence:** ALIGNED.
- **Enterprise-grade security/Supabase:** NOT ALIGNED (Still on Firebase).
- **Intelligence Engines:** ALIGNED (Gemini integration exists).

## 19. Risk Register
1. **Migration Risk:** Transitioning from NoSQL (Firestore) to Relational (Supabase) will require massive data modeling and code refactoring across all `adapters/persistence`.
2. **Security Risk:** Super Admin bypass in Firestore rules.
3. **Operational Risk:** Over-reliance on root-level `.mjs`/`.cjs` scripts for data fixes and deployments.

## 20. Recommended Next Steps
1. **Clean Root Directory:** Move all `fix_*` and `audit_*` scripts into a dedicated `/scripts/maintenance` folder.
2. **Database Migration Strategy:** Design the target PostgreSQL schema for Supabase before writing any migration scripts.
3. **Consolidate Tenancy:** Deprecate `LegacyTenantContextAdapter` and standardise on a single multi-tenant approach.
