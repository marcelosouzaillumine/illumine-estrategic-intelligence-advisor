import { executiveRuntime } from '../core/runtime/executive-intelligence-runtime';

const cycles = [
  {
    year: 2023,
    scores: { composite: 80 },
    bpData: [
      { code: '1.1.1', accountName: 'Caixa', value: 100 },
      { code: '1.1.2', accountName: 'Estoque', value: 100 },
      { code: '2.1.1', accountName: 'Fornecedores', value: 100 },
      { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
    ]
  },
  {
    year: 2024,
    scores: { composite: 75 },
    bpData: [
      { code: '1.1.1', accountName: 'Caixa', value: 90 },
      { code: '1.1.2', accountName: 'Estoque', value: 120 },
      { code: '2.1.1', accountName: 'Fornecedores', value: 120 },
      { code: '3', accountName: 'Patrimônio Líquido', value: 100 }
    ]
  },
  {
    year: 2025,
    scores: { composite: 70 },
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

const report = executiveRuntime.generateExecutiveReport(payload);
console.log('Action Matrix:', report.advisory.actionMatrix);
console.log('Causality globalConfidence:', report.institutionalCausality?.confidenceProfile.globalConfidence);
console.log('Causality historicalDensityRequirement:', report.institutionalCausality?.historicalDensityRequirement);
console.log('Causality propagationVectors:', report.institutionalCausality?.propagationVectors);
