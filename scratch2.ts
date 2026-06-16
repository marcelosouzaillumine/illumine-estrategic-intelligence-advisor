import { BalanceSheetExecutiveFactsBuilder } from './src/core/runtime/executive-consolidation/BalanceSheetExecutiveFactsBuilder';

const bpSummary = {
  ativoTotal: 1000,
  ativoCirculante: 500,
  passivoCirculante: 250,
  patrimonioLiquido: 500,
  passivoTotal: 500
};

const financialIndicators = [
  { metricName: 'Liquidez Corrente', value: 2.0 }
];

let executiveReport = {
  patrimonialIntelligenceReport: {
    assessments: [],
    indicators: []
  }
};

const rep = executiveReport as any;
if (!rep.rawFinancialData) rep.rawFinancialData = {};
rep.rawFinancialData.bpSummary = bpSummary;
rep.rawFinancialData.financialIndicators = financialIndicators;

const finalIndicators = rep.patrimonialIntelligenceReport.indicators && rep.patrimonialIntelligenceReport.indicators.length > 0 ? rep.patrimonialIntelligenceReport.indicators : (rep.rawFinancialData?.financialIndicators || []);

const facts = BalanceSheetExecutiveFactsBuilder.build(executiveReport as any, finalIndicators);
console.log(facts);
