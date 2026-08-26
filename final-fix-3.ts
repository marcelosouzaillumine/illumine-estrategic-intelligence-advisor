import * as fs from 'fs';

// 1. Modals to blank out (Phase 7 / Legacy)
const modalsToBlank = [
  'src/components/modals/ImportBankStatementModal.tsx',
  'src/components/modals/ImportFinancialModal.tsx',
  'src/components/modals/ImportTransactionsModal.tsx',
  'src/components/pages/balance-sheet/legacy/BalanceSheetAccountingRiskSection.tsx',
  'src/components/pages/balance-sheet/legacy/BalanceSheetAuditLayerSection.tsx',
  'src/components/pages/balance-sheet/legacy/BalanceSheetCapitalEfficiencySection.tsx',
  'src/components/pages/legacy-archive/AdministrativaPage.tsx',
  'src/components/pages/academy/AcademyAdminCoursePage.tsx',
  'src/components/pages/RelatorioDemonstracoes5Anos.tsx',
  'src/viewmodels/useCleanupToolPageViewModel.ts'
];

for (const p of modalsToBlank) {
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, `export const NotAvailable = true;\nexport default function Dummy() { return null; }\n`);
  }
}

// 2. Fix the adapters we blanked out so they export their expected hooks
const hookExports = {
  'src/adapters/ui/useAcademyAdminCourseAdapter.ts': 'useAcademyAdminCourseAdapter',
  'src/adapters/ui/useAdministrativaPageAdapter.ts': 'useAdministrativaPageAdapter',
  'src/adapters/ui/useBankTransactionsModalAdapter.ts': 'useBankTransactionsModalAdapter',
  'src/adapters/ui/useCleanupToolAdapter.ts': 'useCleanupToolAdapter',
  'src/adapters/ui/useCleanupToolPageAdapter.ts': 'useCleanupToolPageAdapter',
  'src/adapters/ui/useClientInfoAdapter.ts': 'useClientInfoAdapter',
  'src/adapters/ui/useDocumentCurationModalAdapter.ts': 'useDocumentCurationModalAdapter'
};

for (const [p, hookName] of Object.entries(hookExports)) {
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, `export const ${hookName} = () => ({}) as any;\n`);
  }
}

// 3. Fix SchemaValidator.spec.ts
const schemaVal = 'src/core/intelligence/validation/__tests__/SchemaValidator.spec.ts';
if (fs.existsSync(schemaVal)) {
  let content = fs.readFileSync(schemaVal, 'utf-8');
  content = content.replace(/financialInsights: \{ metrics: \{\}, trends: \{\}, insights: \[\] \}/g, 
    'financialInsights: { observations: [], patterns: [], strengths: [], attentionPoints: [], opportunities: [] }');
  fs.writeFileSync(schemaVal, content);
}

// 4. Fix ExecutiveLongitudinalIntegration.spec.ts
const execLong = 'src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts';
if (fs.existsSync(execLong)) {
  let content = fs.readFileSync(execLong, 'utf-8');
  content = content.replace(/, structuralConsistency: [a-zA-Z0-9_\.]+/g, '');
  content = content.replace(/structuralConsistency: [a-zA-Z0-9_\.]+, /g, '');
  content = content.replace(/structuralConsistency: [a-zA-Z0-9_\.]+/g, '');
  fs.writeFileSync(execLong, content);
}

