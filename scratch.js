const assert = require('assert');
const { BalanceSheetExecutiveViewModelBuilder } = require('./dist/src/core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder.js');

const rawReport = {
  patrimonialIntelligenceReport: { assessments: {}, indicators: [] },
  rawFinancialData: {
    financialIndicators: [],
    bpSummary: {
      ativoTotal: 1000,
      passivoCirculante: 800,
      passivoTotal: 900,
      patrimonioLiquido: 100,
      caixaEquivalentes: 50,
      ativoCirculante: 400
    }
  },
  context: { analysisYear: 2022 }
};

const vm = BalanceSheetExecutiveViewModelBuilder.build(rawReport, 'safe', 2022, undefined, [
  { metricName: 'Capital de Giro Líquido', value: 21021.98 },
  { metricName: 'Necessidade de Capital de Giro', value: 9157.00 },
  { metricName: 'Saldo de Tesouraria', value: 11864.98 }
]);

console.log(JSON.stringify(vm.technicalLayer, null, 2));
