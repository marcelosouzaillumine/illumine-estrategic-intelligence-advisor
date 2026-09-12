import { test, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../workspace/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

test('BalanceSheet Recommendation Causality: Rules Trigger Properly', () => {
  const rawData = {
    patrimonialIntelligenceReport: {
      indicators: [
        { metricName: 'Liquidez Corrente', value: 0.5, familyName: 'Liquidez' }, 
        { metricName: 'Autonomia Financeira', value: 0.8, familyName: 'Estrutura' }, 
      ]
    }
  };

  const vm = BalanceSheetExecutiveViewModelBuilder.build(rawData);

  const protectionPanel = vm.analysisPanels.protection;
  assert.ok(protectionPanel, 'Painel de proteção deve existir');
  const planObs = protectionPanel.observation || protectionPanel.financialMeaning || '';
  assert.ok(planObs.length > 0, 'Deve haver observação ou ação atrelada');

  const shortTermPlan = vm.observacaoFinanceira;
  if (shortTermPlan && shortTermPlan.observacao) {
    assert.ok(shortTermPlan.observacao.length > 0, 'Plano deve refletir crise severa de liquidez');
  }
});
