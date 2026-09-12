import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../workspace/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';
import { BalanceSheetExecutiveFactsBuilder } from '../../workspace/runtime/executive-consolidation/BalanceSheetExecutiveFactsBuilder';

describe('BP v7.18 - Evidence Based Narratives', () => {
  it('Should inject quantitative metrics into opinion when available', () => {
    const rawReport = {
      patrimonialIntelligenceReport: {
        assessments: [],
        indicators: [
          { metricName: 'Liquidez Corrente', value: 1.6, familyName: 'Liquidez', classification: 'Saudável' },
          { metricName: 'Liquidez Imediata', value: 1.0, familyName: 'Liquidez', classification: 'Saudável' },
          { metricName: 'Liquidez Seca', value: 1.0, familyName: 'Liquidez', classification: 'Saudável' },
          { metricName: 'Autonomia Financeira', value: 0.8, familyName: 'Estrutura de Capital', classification: 'Saudável' }
        ],
        analysisPanels: {
          protection: { type: 'protection', title: 'test', recommendation: 'test', status: 'HEALTHY' },
          capital: { type: 'capital', title: 'test', recommendation: 'test', status: 'HEALTHY' },
          efficiency: { type: 'efficiency', title: 'test', recommendation: 'test', status: 'HEALTHY' }
        },
        scoreBreakdown: {
          globalScore: 90
        }
      },
      rawFinancialData: {
        financialMetrics: {
        }
      },
      institutionalView: { maturity: { stageLabel: 'Estabilidade' } },
      context: { stage: 'Estabilidade' }
    };

    const facts = BalanceSheetExecutiveFactsBuilder.build(rawReport, rawReport.patrimonialIntelligenceReport?.indicators || []);
    const vm = BalanceSheetExecutiveViewModelBuilder.build(rawReport, 'unsafe');
    
    assert.strictEqual(vm.executiveOpinion.includes('Liquidez Real'), false); // it should not invent if limited evidence (real liq missing here)
    assert.strictEqual(vm.executiveOpinion.includes('80.0%'), true);
  });
});
