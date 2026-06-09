import { describe, it } from 'node:test';
import assert from 'node:assert';
import { WorkingCapitalIntelligenceEngine } from '../src/core/runtime/governance/bp/WorkingCapitalIntelligenceEngine';

describe('BP NaN Golden Test', () => {
  it('should not leak NaN when data is insufficient or invalid', () => {
    const summary = {
      clientes: NaN,
      estoques: 100,
      caixaEquivalentes: 50,
      fornecedores: 200,
      ativoTotal: 1000,
      ativoCirculante: 500,
      passivoCirculante: 300,
      passivoTotal: 600,
      patrimonioLiquido: 400
    };
    
    const dreData = [
      { id: 'ROB', value: 0 },
      { id: 'CUSTOS', value: 0 }
    ];

    const indicators = WorkingCapitalIntelligenceEngine.analyze(summary as any, dreData);
    
    const cicloFinanceiro = indicators.find(i => i.metricName === 'Ciclo Financeiro (Estimativa Indireta)');
    
    assert.strictEqual(cicloFinanceiro?.value, 'INSUFFICIENT_DATA');
    assert.ok(!Number.isNaN(cicloFinanceiro?.value));
  });
});
