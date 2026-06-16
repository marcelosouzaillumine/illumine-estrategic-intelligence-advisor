import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CapitalStructureExecutiveAssessmentEngine } from '../src/core/runtime/executive-consolidation/CapitalStructureExecutiveAssessmentEngine';

describe('CapitalStructureExecutiveAssessmentEngine - v3.1 Hotfix', () => {
  it('Should return EXCELLENT/HEALTHY when endividamentoGeral <= 20 and dependenciaCapitalTerceiros <= 0.30', () => {
    const indicators = [
      { metricName: 'Autonomia Financeira', value: 80 },
      { metricName: 'Endividamento Geral', value: 15 },
      { metricName: 'Dependência de Capital de Terceiros', value: 0.15 }
    ];
    const bpSummary = { passivoTotal: 1000, passivoCirculante: 100 };
    
    const result = CapitalStructureExecutiveAssessmentEngine.assess(indicators, bpSummary);
    
    assert.ok(result.healthStatus === 'EXCELLENT' || result.healthStatus === 'HEALTHY', 'Status deve ser Excelente ou Saudável');
    assert.ok(!result.executiveNarrative.toLowerCase().includes('alavancagem elevada'), 'Não pode conter narrativa de alavancagem elevada');
  });

  it('Should not classify as WARNING just because of dependency if dependency <= 0.30x', () => {
    const indicators = [
      { metricName: 'Autonomia Financeira', value: 60 },
      { metricName: 'Endividamento Geral', value: 35 },
      { metricName: 'Dependência de Capital de Terceiros', value: 0.21 }
    ];
    const bpSummary = { passivoTotal: 1000, passivoCirculante: 400 };
    
    const result = CapitalStructureExecutiveAssessmentEngine.assess(indicators, bpSummary);
    
    assert.notStrictEqual(result.healthStatus, 'WARNING', 'Não deve ser WARNING se dependência for baixa');
  });

  it('Should classify as WARNING or CRITICAL when dependenciaCapitalTerceiros > 1.00', () => {
    const indicators = [
      { metricName: 'Autonomia Financeira', value: 30 },
      { metricName: 'Endividamento Geral', value: 85 },
      { metricName: 'Dependência de Capital de Terceiros', value: 1.5 }
    ];
    const bpSummary = { passivoTotal: 1000, passivoCirculante: 800 };
    
    const result = CapitalStructureExecutiveAssessmentEngine.assess(indicators, bpSummary);
    
    assert.ok(['WARNING', 'CRITICAL'].includes(result.healthStatus), 'Status deve ser Warning ou Critical devido à alta dependência');
  });
});
