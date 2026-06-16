import test from 'node:test';
import assert from 'node:assert';
import { BalanceSheetExecutiveViewModelBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveViewModelBuilder';

test('BalanceSheet Recommendation Causality: Rules Trigger Properly', () => {
  const rawData = {
    patrimonialIntelligenceReport: {
      indicators: [
        { metricName: 'Liquidez Corrente', value: 0.5, familyName: 'Liquidez' }, // Critical
        { metricName: 'Autonomia Financeira', value: 0.8, familyName: 'Estrutura' }, // Robust
      ]
    }
  };

  const vm = BalanceSheetExecutiveViewModelBuilder.build(rawData);

  // Because liquidity is critical, the protection panel action should reflect immediately preserving cash
  const protectionPanel = vm.decisionPanels.protection;
  assert.ok(protectionPanel, 'Painel de proteção deve existir');
  assert.match(protectionPanel.action.toLowerCase(), /preservar caixa/, 'Ação deve estar atrelada à asfixia de liquidez.');

  // Check plan overrides
  const shortTermPlan = vm.planFinanceiro;
  assert.ok(shortTermPlan, 'Deve haver plano de curto prazo');
  assert.match(shortTermPlan.acao.toLowerCase(), /suspender saídas/, 'Plano deve refletir crise severa de liquidez');
});
