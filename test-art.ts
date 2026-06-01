import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { ExecutiveIntelligenceRuntime } from './src/core/runtime/executive-intelligence-runtime.ts';

const baseDfcData = [
  { id: '1', category: 'Atividades Operacionais', amount: 100000, type: 'INFLOW', priority: 1, periodicity: 'RECURRING', description: 'Recebimentos' },
  { id: '2', category: 'Atividades Operacionais', amount: -500000, type: 'OUTFLOW', priority: 1, periodicity: 'RECURRING', description: 'Pagamentos' },
  { id: '3', category: 'Atividades de Financiamento', amount: 600000, type: 'INFLOW', priority: 2, periodicity: 'OCCASIONAL', description: 'Aporte' }
];

const engine = new ExecutiveIntelligenceRuntime();
const report = engine.generateExecutiveReport({
  rawFinancialData: {
    periodStart: '2023-01-01', periodEnd: '2023-12-31', monthsCount: 12,
    bpSummary: { caixaEquivalentes: 500000 }
  },
  dfcDataForRuntime: baseDfcData,
  metadata: { historicalCyclesAvailable: 4 }
} as any);

console.log('Artificial:', report.cashSustainabilityReport?.artificialLiquidityDetected);
console.log('Runway:', report.cashSustainabilityReport?.universalIndicators?.cashRunwayInstitucional?.months);
