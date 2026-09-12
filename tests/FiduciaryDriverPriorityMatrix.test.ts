import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ExecutivePrimaryMotiveConsistencyEngine } from '../src/workspace/runtime/executive-consolidation/ExecutivePrimaryMotiveConsistencyEngine';
import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from '../src/workspace/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';

describe('Fiduciary Driver Priority Matrix v1.4', () => {

  const baseContext: ExecutiveAnalysisContext = {
    analysisYear: 2024,
    generatedAt: new Date().toISOString(),
    moduleContext: 'BP',
    activeFiduciaryRestrictions: [],
    fiduciaryClassification: 'SAUDÁVEL',
    mathematicalClassification: 'STABLE',
    globalScore: 85,
    primaryIndicators: {},
    technicalDrivers: {},
    contextualAlerts: []
  };

  it('Cenário 1: Cliente Saudável (Priority 5)', () => {
    const ctx = {
      ...baseContext,
      technicalDrivers: {
        liquidezReal: 3.5,
        liquidezSeca: 2.0,
        liquidezInstantaneaReal: 1.0,
        endividamentoGeral: 20,
        autonomiaFinanceira: 85,
        patrimonioLiquido: 5000000
      }
    };
    
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(ctx);
    assert.strictEqual(motive.severity, 'HEALTHY');
    assert.ok(motive.dominantStrength?.includes('Autonomia'));
  });

  it('Cenário 2: Cliente com Liquidez Crítica (Priority 1 bloqueando Priority 5)', () => {
    const ctx = {
      ...baseContext,
      technicalDrivers: {
        liquidezReal: 0.8, // Priority 1 Trigger
        liquidezSeca: 0.6,
        liquidezInstantaneaReal: 0.2,
        endividamentoGeral: 10,
        autonomiaFinanceira: 90, // Strong autonomy should be ignored due to Priority 1
        patrimonioLiquido: 5000000
      }
    };
    
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(ctx);
    assert.strictEqual(motive.severity, 'CRITICAL');
    assert.ok(motive.dominantStrength?.includes('Liquidez Real Crítica'));
    assert.ok(!motive.label?.includes('Autonomia'));
  });

  it('Cenário 3: Cliente com Lucro, mas FCO negativo (Priority 1 vencendo Priority 4)', () => {
    const ctx: ExecutiveAnalysisContext = {
      ...baseContext,
      moduleContext: 'DFC',
      technicalDrivers: {
        fco: -50000, // Priority 1 Trigger
        saldoTesouraria: 10000,
        runway: 2,
        dependenciaSocios: 0,
        conversaoReceitaCaixa: -0.1,
        lucroLiquido: 100000 // Positive, but shouldn't override FCO
      }
    };
    
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(ctx);
    assert.strictEqual(motive.severity, 'CRITICAL');
    assert.ok(motive.dominantStrength?.includes('Caixa Operacional Negativo'));
  });

  it('Cenário 4: Cliente com PL Positivo mas Liquidez Insuficiente', () => {
    const ctx = {
      ...baseContext,
      technicalDrivers: {
        liquidezReal: 0.9,
        liquidezSeca: 0.5,
        liquidezInstantaneaReal: 0.1,
        endividamentoGeral: 30,
        autonomiaFinanceira: 60,
        patrimonioLiquido: 1000000
      }
    };
    
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(ctx);
    assert.strictEqual(motive.severity, 'CRITICAL');
    assert.ok(motive.dominantStrength?.includes('Liquidez Real Crítica'));
  });

  it('Cenário 5: Cliente com Baixa Dívida mas PL Negativo (Priority 2)', () => {
    const ctx = {
      ...baseContext,
      technicalDrivers: {
        liquidezReal: 1.5,
        liquidezSeca: 1.2,
        liquidezInstantaneaReal: 0.8,
        endividamentoGeral: 20, // Low debt
        autonomiaFinanceira: -10,
        patrimonioLiquido: -50000 // Priority 2 Trigger
      }
    };
    
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(ctx);
    assert.strictEqual(motive.severity, 'CRITICAL');
    assert.ok(motive.dominantStrength?.includes('Patrimônio Líquido a Descoberto'));
  });

  it('Cenário 6: Driver Completeness Guard (Dados Insuficientes)', () => {
    const ctx = {
      ...baseContext,
      technicalDrivers: {
        liquidezReal: 1.5
        // missing required drivers for BP
      }
    };
    
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(ctx);
    assert.strictEqual(motive.severity, 'NEUTRAL');
    assert.strictEqual(motive.label, 'Dados Insuficientes');
  });

});
