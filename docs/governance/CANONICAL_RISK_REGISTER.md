# Canonical Risk Register™

| Risk ID | Risk | Probability | Impact | Domain | Component | Mitigation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CAE-RISK-001 | Cognitive Tenant Isolation Breach | Certain (100%) | CRITICAL | Multi-Tenant | `InstitutionalCopilotPage`, Embedding Service | Enforce strict `tenantId` pre-filters in RAG/Vector searches. | CLOSED (Certified via Adversarial Validation) |
| CAE-RISK-002 | Cognitive Observability Gap | High (80%) | HIGH | Observability | Copilot Engine | Implement atomic logging of (Prompt + Context + Identity + Trace ID). | OPEN |
| CAE-RISK-003 | Executive Memory Amnesia | Certain (100%) | HIGH | Experience | Copilot Engine | Implement persistent `HistoricalMemoryContext` per user/tenant. | OPEN |
| CAE-RISK-004 | Legacy UI Fragmentation | Medium (50%) | LOW | Frontend | Legacy Components (`Table`, `Button`) | T1 Transversal migration to `Executive` counterparts. | OPEN |
