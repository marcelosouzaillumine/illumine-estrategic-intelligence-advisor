const fs = require('fs');

const files = [
  'src/core/runtime/compliance/InstitutionalIntegrityEngine.ts',
  'src/core/runtime/consolidated/EliminationEngine.ts',
  'src/core/runtime/decision-intelligence/InstitutionalDecisionLedger.ts',
  'src/core/runtime/distributed/DistributedAnomalyAggregator.ts',
  'src/core/runtime/early-warning/EarlyWarningTypes.ts',
  'src/core/runtime/executive-intelligence-runtime.ts',
  'src/core/runtime/governance/risk/types.ts',
  'src/core/runtime/institutional-context/HistoricalDensityResolver.ts',
  'src/core/runtime/institutional-context/SegmentIntelligenceEngine.ts',
  'src/core/runtime/institutional-reporting/engines/GovernanceReportingEngine.ts',
  'src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureEngine.ts',
  'src/core/runtime/institutional-reporting/engines/InstitutionalExplainabilityAppendixEngine.ts',
  'src/core/runtime/institutional-reporting/engines/InstitutionalLineageAppendixEngine.ts',
  'src/core/runtime/integrity/HistoricalSeriesIntegrityEngine.ts',
  'src/core/runtime/integrity/ScaleEfficiencyIntegrityEngine.ts',
  'src/core/runtime/knowledge-graph/InstitutionalKnowledgeGraph.ts',
  'src/core/runtime/knowledge-graph/KnowledgeGraphTypes.ts',
  'src/core/runtime/tenancy/hardening/TenantOwnershipValidator.ts'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/as any/g, 'as unknown');
    content = content.replace(/Record<string,\s*any>/g, 'Record<string, unknown>');
    fs.writeFileSync(file, content);
  }
}
console.log('Fixed 18 files');
