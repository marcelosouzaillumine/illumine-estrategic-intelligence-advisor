import { describe, it, expect } from 'vitest';
import { FinancialIntelligenceCoordinator } from '../../orchestration/FinancialIntelligenceCoordinator';

describe('FinancialIntelligenceCoordinator with Calibration', () => {
  const coordinator = new FinancialIntelligenceCoordinator();

  it('should calibrate the unified context before passing to agent', () => {
    // Simulando uma contradição: O motor de caixa acusa "Lucro não convertido em caixa"
    // Mas o balanço diz que a liquidez é absurda, e o ROIC é baixo (IDLE_CAPITAL_RISK)
    const balanceSheetContext = {
      kpis: {
        liquidityImmediate: 8.0,
        cashBalance: 2000000
      }
    };
    
    const performanceContext = {
      kpis: {
        revenueGrowth: 0.02,
        roic: 0.04
      }
    };

    const cashFlowContext = {
      signals: {
        attentionPoints: ["Lucro não convertido em caixa"]
      }
    };

    const result = coordinator.orchestrate('Q1-2026', balanceSheetContext, performanceContext, cashFlowContext, {});

    // O diagnóstico bruto inicial seria LIQUIDITY_STRESS, 
    // mas com os KPIs injetados (alta liquidez e baixo ROIC), 
    // a Calibration Layer deve interceptar e gerar um IDLE_CAPITAL_RISK, 
    // mudando o texto final de "LIQUIDITY_STRESS" para "O volume de caixa está ocioso..."
    
    expect(result.financialReasoningStatus).toBeDefined();
    expect(result.financialReasoningStatus?.calibrated).toBe(true);
    
    // Como a liquidez foi detectada como > 1.5 e diagnóstico bruto era LIQUIDITY_STRESS, 
    // o validator deve marcar CONFLICT
    expect(result.financialReasoningStatus?.evidenceQuality).toBe('MEDIUM');
    expect(result.financialReasoningStatus?.contradictionsResolved).toBeGreaterThan(0);
    
    // O texto final foi resolvido
    expect(result.financialHealthProfile).toContain('Não foi identificada crise de liquidez');
  });
});
