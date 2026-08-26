import { describe, it, expect } from 'vitest';
import { ExecutivePositionSummaryEngine } from '../../../../capabilities/financial/intelligence/narrative/ExecutivePositionSummaryEngine';
import { HistoricalNarrativeEngine } from '../../../../capabilities/financial/intelligence/historical/HistoricalNarrativeEngine';

describe('BalanceSheetRuntimeSemanticConsistency', () => {
  it('Scenario A: Saudável - Nenhuma exposição material identificada', () => {
    const summary = ExecutivePositionSummaryEngine.synthesize([], [], 'STRONG');
    expect(summary.status.classification).toBe('Posição analisada');
    expect(summary.status.narrative).toBe('Não existem alertas materiais isolados além do diagnóstico estrutural.');
  });

  it('Scenario B: Exposição - Summary menciona a exposição', () => {
    const signals: any = [
      {
        severity: 'critical',
        observation: { text: 'Baixa liquidez corrente' },
        interpretation: { text: 'Risco de liquidez' }
      }
    ];
    const summary = ExecutivePositionSummaryEngine.synthesize(signals, [], 'CRITICAL');
    expect(summary.status.classification).toBe('Vulnerabilidade crítica identificada');
    expect(summary.status.narrative).toContain('As métricas indicam exposição estrutural refletida na deterioração simultânea de múltiplos indicadores centrais.');
  });

  it('Scenario D: Deterioração - Historical Narrative = deterioração', () => {
    const movements: any = [
      {
        metric: 'Patrimônio Líquido',
        variation: { percentage: -10 },
        interpretation: '...'
      }
    ];
    
    const narrative = HistoricalNarrativeEngine.synthesize(movements, 4, 2022, 2025);
    expect(narrative.trajectory.classification).toBe('deteriorating');
    expect(narrative.executiveContext.observation).toContain('A estrutura apresentou deterioração progressiva no período analisado');
  });
});
