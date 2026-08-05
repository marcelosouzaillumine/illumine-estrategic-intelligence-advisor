// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

test('BalanceSheet Evidence Traceability: Opinions are backed by explicit metric numbers', () => {
  const rawData = {
    patrimonialIntelligenceReport: {
      indicators: [
        { metricName: 'Liquidez Corrente', value: 1.25, familyName: 'Liquidez' },
        { metricName: 'Autonomia Financeira', value: 0.45, familyName: 'Estrutura' }
      ]
    }
  };

  const vm = BalanceSheetExecutiveViewModelBuilder.build(rawData);

  const opinion = vm.executiveOpinion || '';
  
  assert.ok(opinion.includes('1.25') || opinion.includes('1,25'), 'A opinião executiva deve citar o número da liquidez');
  assert.ok(opinion.includes('45.0%') || opinion.includes('45,0%'), 'A opinião executiva deve citar o número da autonomia');
});
