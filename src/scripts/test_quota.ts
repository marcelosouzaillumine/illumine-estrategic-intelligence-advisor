import { buildBPHierarchy } from '../lib/bpEngine';
import { calculateFinancialMetrics } from '../lib/financial-engine';
import { inferBusinessIdentity } from '../lib/business-identity-engine';
import { evaluateMasterCausality } from '../lib/master-causal-engine';
import { InstitutionalContextEngine } from '../core/runtime/institutional-context/InstitutionalContextEngine';
import { InstitutionalMemoryEngine } from '../core/runtime/institutional-memory/InstitutionalMemoryEngine';
import { InstitutionalCausalityOrchestrator } from '../core/runtime/institutional-causality/InstitutionalCausalityOrchestrator';
import { ExecutivePriorityCascadeResolver } from '../core/runtime/institutional-causality/ExecutivePriorityCascadeResolver';
import { StructuralCapitalOrchestrator } from '../core/runtime/structural-capital/StructuralCapitalOrchestrator';

const cycles = [
  {
    year: 2023,
    bpData: [
      { code: '1.1.1', accountName: 'Caixa', value: 100 },
      { code: '1.1.2', accountName: 'Estoque', value: 100 },
      { code: '2.1.1', accountName: 'Fornecedores', value: 100 },
      { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
    ]
  },
  {
    year: 2024,
    bpData: [
      { code: '1.1.1', accountName: 'Caixa', value: 90 },
      { code: '1.1.2', accountName: 'Estoque', value: 120 },
      { code: '2.1.1', accountName: 'Fornecedores', value: 120 },
      { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
    ]
  },
  {
    year: 2025,
    bpData: [
      { code: '1.1.1', accountName: 'Caixa', value: 50 },
      { code: '1.1.2', accountName: 'Estoque', value: 150 },
      { code: '2.1.1', accountName: 'Fornecedores', value: 200 },
      { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
    ]
  }
];

const payload = {
  isMockData: false,
  historicalCyclesCount: 3,
  runtimeHistory: cycles,
  rawFinancialData: {
    segmentoEmpresa: 'Varejo',
    bpSummary: {
      ativoTotal: 1000,
      ativoCirculante: 500,
      passivoCirculante: 400,
      passivoTotal: 600,
      patrimonioLiquido: 400,
      caixaEquivalentes: 50,
      estoques: 150
    }
  },
  bpData: [
    { code: '1.1.1', accountName: 'Caixa', value: 50 },
    { code: '1.1.2', accountName: 'Estoque', value: 150 }
  ]
};

const hierarchy = buildBPHierarchy(payload.bpData);
const bpSummary = hierarchy.summary;

const memoryProfile = InstitutionalMemoryEngine.buildMemory(payload.runtimeHistory);
const causalityProfile = InstitutionalCausalityOrchestrator.evaluate(payload.runtimeHistory);
const institutionalContext = InstitutionalContextEngine.resolve(payload);

let focusAreas = [...institutionalContext.recommendationBoundaries.focusAreas];
console.log('1. Initial focusAreas:', focusAreas);

if (memoryProfile.historicalDensityRequirement === 'SUFFICIENT') {
  if (memoryProfile.decisionPatterns.length > 0) {
    focusAreas.push(...memoryProfile.decisionPatterns);
  }
  if (memoryProfile.deteriorationSignals.length > 0) {
    focusAreas.push(...memoryProfile.deteriorationSignals);
  }
}
console.log('2. FocusAreas after memory:', focusAreas);

let advisory = {
  executiveSummary: 'Summary',
  actionMatrix: focusAreas,
  priorityFocus: focusAreas[0] || 'Focus'
};

console.log('3. Advisory before Cascade Resolver:', advisory.actionMatrix);
advisory = ExecutivePriorityCascadeResolver.resolve(advisory, causalityProfile);
console.log('4. Advisory after Cascade Resolver:', advisory.actionMatrix);

const structuralCapital = StructuralCapitalOrchestrator.analyze(bpSummary, institutionalContext);
console.log('5. Structural Capital Severity:', structuralCapital.severity);
console.log('6. Structural Capital Signals:', structuralCapital.signals);

advisory.actionMatrix = StructuralCapitalOrchestrator.reprioritizeAdvisory(
  structuralCapital,
  advisory.actionMatrix
);
console.log('7. Final Action Matrix:', advisory.actionMatrix);
