import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from './src/core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

const fakeRawReport = {
  context: { analysisYear: 2024, stage: 'Maturidade' },
  patrimonialIntelligenceReport: {
    assessments: {},
    indicators: [{ code: 'LC', value: 2.5 }]
  },
  rawFinancialData: {
    financialIndicators: [
      { metricName: 'Liquidez Corrente', value: 2.5 },
    ]
  },
  bpSummary: { ativoTotal: 1000, ativoCirculante: 500, passivoCirculante: 200, patrimonioLiquido: 600 }
};

const originalAssert = (BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity;
(BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = (vm: any) => vm;

const vm = BalanceSheetExecutiveViewModelBuilder.build(fakeRawReport, 'safe', 2024);
console.log('strategicSeverity:', vm.strategicSeverity);

(BalanceSheetExecutiveViewModelBuilder as any).assertFinancialNarrativePurity = originalAssert;
