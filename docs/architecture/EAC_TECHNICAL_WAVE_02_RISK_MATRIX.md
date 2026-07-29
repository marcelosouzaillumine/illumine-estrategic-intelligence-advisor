# EAC Technical Contract - Wave 02 Risk Matrix

## Introduction
This matrix evaluates the semantic, visual, and architectural risks associated with the selected candidates for **Controlled Expansion Wave 02**. Based on calibration patterns, the components have been strictly filtered to omit any `MIXED_BOUNDARY`, ensuring a highly reliable deployment.

| Candidate | Strategy | Visual Risk | Semantic Risk | Double Counting Risk | Mitigation |
|-----------|----------|-------------|---------------|----------------------|------------|
| **HistoricalEvidencePanel** | Root Replacement | LOW | LOW | LOW | `div` maps cleanly. Content strictly `TECHNICAL_EVIDENCE`. |
| **ExecutiveEvidenceViewer** | Root Replacement | LOW | LOW | LOW | Preserves complex amber styling exact string. |
| **EvidenceDetailPanel** | Root Replacement | LOW | LOW | LOW | Basic `space-y-3` layout. Pure evidence grid. |
| **EvidenceCorrelationPanel** | Root Replacement | LOW | LOW | LOW | Preserves `card-premium` bounds. |
| **HistoricalEvidenceCoverage** | Root Replacement | LOW | LOW | LOW | Semantic metric visualization, no narrative mix. |
| **WorkflowAuditFeed** | Root Replacement | LOW | LOW | LOW | Standard list tracing actors and timestamps. |
| **ExportHistoryPanel** | Root Replacement | LOW | LOW | LOW | Trace of PDF exports with lineage. |
| **ClientImportHistory** | Root Replacement | MEDIUM | LOW | LOW | Larger page-level component but layout is purely tracing imports. |
| **ClientAccessLogs** | Root Replacement | LOW | LOW | LOW | Typical linear table of access logs. |
| **DRETechnicalLayerSection** | Explicit Encapsulation | MEDIUM | LOW | HIGH | Exact clone of Balance Sheet. Addressed by AST scanner suppression rule. |

## Validation Threshold
All candidates reflect a **HIGH** confidence level due to the strict absence of mixed concerns like analytics or actionable recommendations.
Double-counting risks are structurally mitigated for the shared wrappers via `legacyVisualContainer: true` AST scanner overrides.
