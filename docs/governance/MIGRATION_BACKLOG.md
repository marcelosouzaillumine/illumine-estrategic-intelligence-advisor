# Migration Backlog™
**CAE-BASELINE-001**

## Finding #1: Cognitive Tenant Isolation (CRITICAL)
- **Rule Violated**: Cognitive Tenant Isolation™
- **Evidence**: `InstitutionalCopilotPage.tsx`
- **Transformation Type**: T2 (Structural Refactoring)
- **Action**: Overhaul RAG query generation to explicitly mandate `tenantId` filtering before LLM context injection.

## Finding #2: Copilot Historical Amnesia (HIGH)
- **Rule Violated**: Institutional Memory Continuity
- **Evidence**: Copilot Engine
- **Transformation Type**: T2 (Structural Refactoring)
- **Action**: Implement `ExecutiveMemoryState` persisted across sessions.

## Finding #3: UI Component Drift (MEDIUM)
- **Rule Violated**: Canonical Visual Constitution
- **Evidence**: `Table`, `Button`, `KpiCard` imports in legacy files.
- **Transformation Type**: T1 (Transversal Transformation)
- **Action**: Bulk replace legacy tags with `ExecutiveTable`, `ExecutiveAction`, `ExecutiveMetricCard`.
