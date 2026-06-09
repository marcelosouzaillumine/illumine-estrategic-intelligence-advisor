# Architecture Compliance Audit - Board Investigation Workspace v1.0

## 1. Objective
This document acts as the formal attestation of architectural compliance for the "Board Investigation Workspace v1.0". The directive was to build an executive investigation boundary on top of the Institutional Knowledge Graph that *exclusively investigates* without performing any form of re-computation, synthesis, or inference.

## 2. Compliance Checklist

- [x] **No Generative AI or LLMs:** The workspace relies entirely on deterministic node loading from the `GraphRepository` and `CognitiveQueryEngine`. No generative synthesis or text generation is employed.
- [x] **No Local Metrics Computation:** The `ExecutiveInvestigationDashboard` explicitly receives aggregated metrics from the `BoardInvestigationRuntime`. No `reduce()`, counting, or score derivation is performed inside React components.
- [x] **Fail-Closed Presentation:** When nodes or edges are absent, the UI presents strict "not available" or "not found" indicators without attempting to invent or interpolate fallbacks.
- [x] **Fiduciary Read-Only Barrier:** The `BoardInvestigationRuntime` only fetches data. It has zero mutating methods and does not invoke Fiduciary Engines (e.g., Scenario Engine, Capital Governance Adapter).
- [x] **Tenant Sovereignty:** All reads traverse through `InstitutionalGraphQueryEngine` or `InstitutionalGraphRegistry.getRepository()`, strictly scoped by `tenantId`.

## 3. Component Details

### Domain & Runtime
- `InvestigationSession.ts` & `InvestigationContext.ts`: Strictly bind investigations to `tenantId`, `userId`, `correlationId`, and `lineageId`.
- `BoardInvestigationRuntime.ts`: Orchestrates reads. Computes metrics deterministically based solely on the returned arrays from the graph persistence layer.

### Presentation
- `BoardInvestigationViewModel.ts`: Acts as an inert data transformer matching backend models to UI expectations (`title`, `description`, `confidence`).
- `BoardInvestigationWorkspace.tsx`: Composes the UI and handles lifecycle events. 
- `ExecutiveInvestigationDashboard.tsx`: Follows the absolute rule: *display what is received, calculate nothing*.

### Observability
- The `InstitutionalObservabilityRegistry` captures `INVESTIGATION_STARTED` and `INVESTIGATION_ENDED` to form a complete audit trail of what the user investigated.

## 4. Conclusion
The "Board Investigation Workspace v1.0" successfully passes the structural audit. It guarantees that the UI operates exclusively as a cognitive lens over pre-computed institutional reality. All metrics, trajectories, and relationships presented are backed by the strict deterministic integrity of the platform's Sovereign Engines.
