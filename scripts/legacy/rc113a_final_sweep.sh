#!/bin/bash
FILES=(
  "src/core/runtime/compliance/InstitutionalIntegrityEngine.ts"
  "src/core/runtime/consolidated/EliminationEngine.ts"
  "src/core/runtime/decision-intelligence/InstitutionalDecisionLedger.ts"
  "src/core/runtime/distributed/DistributedAnomalyAggregator.ts"
  "src/core/runtime/early-warning/EarlyWarningTypes.ts"
  "src/core/runtime/governance/risk/types.ts"
  "src/core/runtime/institutional-causality/types.ts"
  "src/core/runtime/institutional-context/HistoricalDensityResolver.ts"
  "src/core/runtime/institutional-context/SegmentIntelligenceEngine.ts"
  "src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts"
  "src/core/runtime/institutional-reporting/engines/FiduciaryTimelineEngine.ts"
  "src/core/runtime/institutional-reporting/engines/GovernanceReportingEngine.ts"
  "src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureEngine.ts"
  "src/core/runtime/institutional-reporting/engines/InstitutionalExplainabilityAppendixEngine.ts"
  "src/core/runtime/institutional-reporting/engines/InstitutionalLineageAppendixEngine.ts"
  "src/core/runtime/integrity/HistoricalSeriesIntegrityEngine.ts"
  "src/core/runtime/integrity/ScaleEfficiencyIntegrityEngine.ts"
  "src/core/runtime/knowledge-graph/InstitutionalKnowledgeGraph.ts"
  "src/core/runtime/knowledge-graph/KnowledgeGraphTypes.ts"
  "src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts"
  "src/core/runtime/product-governance/DemoModeGovernance.ts"
  "src/core/runtime/tenancy/hardening/TenantOwnershipValidator.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i '' 's/as any/as unknown/g' "$file"
    sed -i '' 's/Record<string, any>/Record<string, unknown>/g' "$file"
    echo "Fixed $file"
  fi
done
