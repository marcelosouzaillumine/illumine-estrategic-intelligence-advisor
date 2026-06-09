import { executiveRuntime } from './src/core/runtime/executive-intelligence-runtime.ts';
import { CalibrationEngine } from './src/core/runtime/calibration/CalibrationEngine.ts';
import { HistoricalCycleData } from './src/core/runtime/institutional-memory/types.ts';

CalibrationEngine.resetToDefault();
const cycles: HistoricalCycleData[] = [
  { year: 2023, scores: { composite: 80 }, bpData: [] },
  { year: 2024, scores: { composite: 75 }, bpData: [] },
  { year: 2025, scores: { composite: 70 }, bpData: [] }
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
    { code: '1.1.2', accountName: 'Estoque', value: 150 },
    { code: '2.1.1', accountName: 'Fornecedores', value: 400 }
  ]
};

const report = executiveRuntime.generateExecutiveReport(payload);
console.log("ACTION MATRIX:");
console.dir(report.advisory.actionMatrix, { depth: null });
console.log("PRIORITY FOCUS:", report.advisory.priorityFocus);
