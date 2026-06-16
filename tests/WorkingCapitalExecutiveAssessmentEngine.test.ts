import { describe, it } from 'node:test';
import assert from 'node:assert';
import { WorkingCapitalExecutiveAssessmentEngine } from '../src/core/runtime/executive-consolidation/WorkingCapitalExecutiveAssessmentEngine';

describe('WorkingCapitalExecutiveAssessmentEngine - v3.1 Hotfix', () => {
  it('Should apply Severity Lock and force CRITICAL when liquidity is critical', () => {
    // liquidezReal < 1, liquidezSeca < 1, liquidezInst < 0.5
    const indicators = [
      { metricName: 'Liquidez Corrente', value: 0.32 },
      { metricName: 'Liquidez Seca', value: 0.28 },
      { metricName: 'Liquidez Imediata', value: 0.17 },
      { metricName: 'Ciclo Financeiro', value: 20 } // theoretically good cycle
    ];
    const bpSummary = { ativoCirculante: 500, passivoCirculante: 1500, caixaEquivalentes: 50 }; // CGL negative
    
    const result = WorkingCapitalExecutiveAssessmentEngine.assess(indicators, bpSummary);
    
    assert.strictEqual(result.healthStatus, 'CRITICAL', 'Status deve ser CRITICAL devido ao Severity Lock');
    assert.ok(
      result.executiveNarrative.toLowerCase().includes('consome caixa') || 
      result.executiveNarrative.toLowerCase().includes('erodindo') ||
      result.executiveNarrative.toLowerCase().includes('descasamento'), 
      'Narrativa deve reconhecer compressão'
    );
    assert.ok(!result.executiveNarrative.toLowerCase().includes('tesouraria folgada'), 'Não deve dizer tesouraria folgada');
  });

  it('Should return HEALTHY/EXCELLENT when liquidity is fine and metrics are good', () => {
    const indicators = [
      { metricName: 'Liquidez Corrente', value: 1.5 },
      { metricName: 'Liquidez Seca', value: 1.2 },
      { metricName: 'Liquidez Imediata', value: 0.6 },
      { metricName: 'Ciclo Financeiro', value: 45 }
    ];
    const bpSummary = { ativoCirculante: 1500, passivoCirculante: 1000, caixaEquivalentes: 300 }; // CGL positive
    
    const result = WorkingCapitalExecutiveAssessmentEngine.assess(indicators, bpSummary);
    
    assert.ok(['HEALTHY', 'EXCELLENT'].includes(result.healthStatus), 'Status deve ser Saudável ou Excelente');
  });
});
