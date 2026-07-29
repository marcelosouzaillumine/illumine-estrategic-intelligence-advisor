# EAC Technical Contract - Wave 02 Candidates

## Wave 02A - Pure Boundaries
These components exhibit isolated cognitive boundaries (either Technical Evidence or Decision Trace), avoiding any mixed scenarios. They are perfect candidates for direct root replacement.

### 1. HistoricalEvidencePanel
- **Path:** `src/components/temporal/HistoricalEvidencePanel.tsx`
- **Classification:** `TECHNICAL_EVIDENCE`
- **Cognitive Subtype:** `data-provenance`
- **Root Elements:** `<div className="space-y-4">`
- **Migration Strategy:** Root Replacement

### 2. ExecutiveEvidenceViewer
- **Path:** `src/components/executive-delivery/ExecutiveEvidenceViewer.tsx`
- **Classification:** `TECHNICAL_EVIDENCE`
- **Cognitive Subtype:** `data-provenance`
- **Root Elements:** `<div className={cn("bg-amber-950/95...", className)}>`
- **Migration Strategy:** Root Replacement

### 3. EvidenceDetailPanel
- **Path:** `src/components/cognitive/EvidenceDetailPanel.tsx`
- **Classification:** `TECHNICAL_EVIDENCE`
- **Cognitive Subtype:** `data-provenance`
- **Root Elements:** `<div className="space-y-3">`
- **Migration Strategy:** Root Replacement

### 4. EvidenceCorrelationPanel
- **Path:** `src/components/war-room/EvidenceCorrelationPanel.tsx`
- **Classification:** `TECHNICAL_EVIDENCE`
- **Cognitive Subtype:** `data-provenance`
- **Root Elements:** `<div className="card-premium overflow-hidden...">`
- **Migration Strategy:** Root Replacement

### 5. HistoricalEvidenceCoverage
- **Path:** `src/components/institutional-memory/HistoricalEvidenceCoverage.tsx`
- **Classification:** `TECHNICAL_EVIDENCE`
- **Cognitive Subtype:** `audit-trail` (metrics on coverage)
- **Root Elements:** `<div className="card-premium p-6 bg-card/30...">`
- **Migration Strategy:** Root Replacement

### 6. WorkflowAuditFeed
- **Path:** `src/components/workflow-governance/WorkflowAuditFeed.tsx`
- **Classification:** `DECISION_TRACE`
- **Cognitive Subtype:** `audit-trail`
- **Root Elements:** `<div className="space-y-2">`
- **Migration Strategy:** Root Replacement

### 7. ExportHistoryPanel
- **Path:** `src/components/executive-delivery/ExportHistoryPanel.tsx`
- **Classification:** `DECISION_TRACE`
- **Cognitive Subtype:** `audit-trail`
- **Root Elements:** `<div className={cn("bg-white...", className)}>`
- **Migration Strategy:** Root Replacement

### 8. ClientImportHistory
- **Path:** `src/components/ClientImportHistory.tsx`
- **Classification:** `DECISION_TRACE`
- **Cognitive Subtype:** `audit-trail`
- **Root Elements:** `<div className="min-h-screen bg-slate-50 p-8 pb-32 font-sans text-foreground">`
- **Migration Strategy:** Root Replacement

### 9. ClientAccessLogs
- **Path:** `src/components/ClientAccessLogs.tsx`
- **Classification:** `DECISION_TRACE`
- **Cognitive Subtype:** `audit-trail`
- **Root Elements:** Assumed `<div>` (requires exact extraction)
- **Migration Strategy:** Root Replacement

---

## Wave 02B - Shared or Conditional Boundaries
Components in this tier share wrappers or are conditionally rendered inside other architectures.

### 10. DRETechnicalLayerSection
- **Path:** `src/components/pages/dre/DRETechnicalLayerSection.tsx`
- **Classification:** `TECHNICAL_EVIDENCE`
- **Cognitive Subtype:** `data-provenance`
- **Root Elements:** `<ExecutiveTechnicalLayer>`
- **Migration Strategy:** Explicit Encapsulation (like Balance Sheet)
