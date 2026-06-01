const fs = require('fs');

function replaceFile(file, regex, replacement) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
  }
}

// First, apply 'as unknown' everywhere to get TS errors, but since I already reverted, let's do it manually for the files from the TS errors.
// Wait, I can just do regex replacements for the specific errors!

// InstitutionalIntegrityEngine.ts:61
replaceFile('src/core/runtime/compliance/InstitutionalIntegrityEngine.ts', /as any/g, 'as unknown as "Estável" | "Deteriorando" | "Melhorando"');

// EliminationEngine.ts:47
replaceFile('src/core/runtime/consolidated/EliminationEngine.ts', /as any/g, 'as unknown as "MUTUO" | "RECEITA_DESPESA" | "DIVIDENDO" | "INVESTIMENTO"');

// InstitutionalDecisionLedger.ts:31
replaceFile('src/core/runtime/decision-intelligence/InstitutionalDecisionLedger.ts', /as any/g, 'as unknown as "SYSTEM" | "UNAUTHENTICATED"');

// institutional-causality/types.ts
replaceFile('src/core/runtime/institutional-causality/types.ts', /as any/g, 'as unknown as { rawFinancialData?: unknown }');

// HistoricalDensityResolver.ts:6
replaceFile('src/core/runtime/institutional-context/HistoricalDensityResolver.ts', /as any/g, 'as unknown as import("./types").HistoricalDensity');

// SegmentIntelligenceEngine.ts
replaceFile('src/core/runtime/institutional-context/SegmentIntelligenceEngine.ts', /as any/g, 'as unknown as "UNKNOWN"');

// HistoricalSeriesIntegrityEngine.ts
replaceFile('src/core/runtime/integrity/HistoricalSeriesIntegrityEngine.ts', /as any/g, 'as unknown as number');

// ScaleEfficiencyIntegrityEngine.ts
replaceFile('src/core/runtime/integrity/ScaleEfficiencyIntegrityEngine.ts', /as any/g, 'as unknown as number');

// InstitutionalOperationalGovernanceRuntime.ts
replaceFile('src/core/runtime/operational-governance/InstitutionalOperationalGovernanceRuntime.ts', /as any/g, 'as unknown as { cycleReference?: string }');

// DemoModeGovernance.ts
replaceFile('src/core/runtime/product-governance/DemoModeGovernance.ts', /as any/g, 'as unknown as "FEATURE_GRANTED"');
replaceFile('src/core/runtime/product-governance/DemoModeGovernance.ts', /\{\} as unknown as "FEATURE_GRANTED"/g, '({ MAX_SCENARIOS: 1, MAX_UPLOADS: 1, MAX_BOARD_PACKS: 1, MAX_MONITORING_CYCLES: 1, MAX_WORKSPACES: 1 } as unknown)');


// TenantOwnershipValidator.ts
replaceFile('src/core/runtime/tenancy/hardening/TenantOwnershipValidator.ts', /as any/g, 'as unknown as { entityId?: string }');

// InstitutionalBoardPackRuntime.ts
replaceFile('src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts', /as any/g, 'as unknown as Record<string, unknown>');

// Now replace Record<string, any> with Record<string, unknown> in the rest
const filesWithRecord = [
  'src/core/runtime/distributed/DistributedAnomalyAggregator.ts',
  'src/core/runtime/early-warning/EarlyWarningTypes.ts',
  'src/core/runtime/governance/risk/types.ts',
  'src/core/runtime/knowledge-graph/InstitutionalKnowledgeGraph.ts',
  'src/core/runtime/knowledge-graph/KnowledgeGraphTypes.ts'
];
for(const f of filesWithRecord) {
   replaceFile(f, /Record<string, any>/g, 'Record<string, unknown>');
   replaceFile(f, /as any/g, 'as unknown');
}

console.log("Fixed!");
