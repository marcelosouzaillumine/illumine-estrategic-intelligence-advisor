# Canonical Debt Map™
**CAE-BASELINE-001**

## 1. Security Debt (Critical)
- **Isolation Breach**: Cognitive inference lacks `tenantId` boundaries in RAG.

## 2. Governance Debt (High)
- **Amnesia**: Lack of persisted historical context between Copilot sessions.
- **Traceability Gap**: Decision Traces exist but are not linked to full cognitive observability logs.

## 3. UI/UX Debt (Medium)
- **Legacy Components**: Remnants of `Button`, `Table`, `KpiCard` spread across non-core views.
- **Render Overhead**: Deep prop-drilling and redundant API calls in legacy dashboards.
