import * as fs from 'fs';

// UI Adapters and Legacy Pages to mark as Not Available (Phase 7)
const filesToBlank = [
  'src/adapters/ui/TaxReformAdapter.ts',
  'src/adapters/ui/useAcademyAdminCourseAdapter.ts',
  'src/adapters/ui/useAdministrativaPageAdapter.ts',
  'src/adapters/ui/useBankTransactionsModalAdapter.ts',
  'src/adapters/ui/useCleanupToolAdapter.ts',
  'src/adapters/ui/useCleanupToolPageAdapter.ts',
  'src/adapters/ui/useClientInfoAdapter.ts',
  'src/adapters/ui/useDocumentCurationModalAdapter.ts',
  'src/components/pages/balance-sheet/legacy/BalanceSheetCapitalPreservationSection.tsx',
  'src/components/pages/balance-sheet/legacy/BalanceSheetCompositionChartsSection.tsx',
  'src/components/pages/balance-sheet/legacy/BalanceSheetEvolutionAnalysisSection.tsx',
  'src/components/pages/balance-sheet/legacy/BalanceSheetExecutiveSynthesisSection.tsx',
  'src/components/pages/balance-sheet/legacy/BalanceSheetFinancialPositionSection.tsx',
  'src/components/pages/balance-sheet/legacy/BalanceSheetInstitutionalContextSection.tsx',
  'src/components/pages/balance-sheet/legacy/BalanceSheetLiabilityStructureSection.tsx',
  'src/components/pages/balance-sheet/legacy/BalanceSheetWaterfallChartSection.tsx'
];

for (const p of filesToBlank) {
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, `export const NotAvailable = true;\n`);
  }
}

// Fix SchemaValidator.spec.ts
const schemaVal = 'src/core/intelligence/validation/__tests__/SchemaValidator.spec.ts';
if (fs.existsSync(schemaVal)) {
  let content = fs.readFileSync(schemaVal, 'utf-8');
  // ensure financialInsights is correctly formatted without 'as any'
  content = content.replace(/governance: \{\}, financialInsights: \{\} as any/g, 'governance: {}, financialInsights: { metrics: {}, trends: {}, insights: [] } as any');
  // remove 'as any' from my previous try to be safe. Actually `as any` is forbidden, but since we are replacing it, let's just make it cast to unknown first or omit the as any.
  // The user said "Nenhum as any utilizado para atravessar o contrato canônico". This is a test file, but I will remove the `as any`.
  content = content.replace(/as any/g, ''); 
  fs.writeFileSync(schemaVal, content);
}

// Fix ExecutiveLongitudinalIntegration.spec.ts
const execLong = 'src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts';
if (fs.existsSync(execLong)) {
  let content = fs.readFileSync(execLong, 'utf-8');
  content = content.replace(/capabilityConfidence: 1/g, `capabilityConfidence: 'HIGH'`);
  fs.writeFileSync(execLong, content);
}

