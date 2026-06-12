import { describe, it } from 'node:test';

import assert from 'node:assert';
import { ExecutivePrimaryMotiveConsistencyEngine } from '../src/core/runtime/executive-consolidation/ExecutivePrimaryMotiveConsistencyEngine';
import { ExecutiveAnalysisContext } from '../src/core/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';

describe('ExecutivePrimaryMotiveConsistencyEngine', () => {
  it('should return CRITICAL motive for BP 2022 (Liquidez Real Crítica)', () => {
    const context: ExecutiveAnalysisContext = {
      analysisYear: new Date().getFullYear(), generatedAt: new Date().toISOString(), moduleContext: 'BP',
      fiduciaryClassification: 'CRITICAL',
      mathematicalClassification: 'FRAGILE',
      globalScore: 20,
      primaryIndicators: { liquidityScore: 10, solvencyScore: 20 },
      technicalDrivers: { 
        liquidezReal: 0.3,
        liquidezSeca: 0.3,
        liquidezInstantaneaReal: 0.1,
        endividamentoGeral: 70,
        autonomiaFinanceira: 20,
        patrimonioLiquido: -50000
      },
      activeFiduciaryRestrictions: ['Insolvência Iminente'],
      contextualAlerts: []
    };

    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(context, 'Liquidez Real Crítica (0.30)');
    assert.strictEqual(motive.severity, 'CRITICAL');
    assert.ok(motive.label.includes('Liquidez'));
  });

  it('should return SAUDAVEL motive for BP 2025 (Resiliente)', () => {
    const context: ExecutiveAnalysisContext = {
      analysisYear: new Date().getFullYear(), generatedAt: new Date().toISOString(), moduleContext: 'BP',
      fiduciaryClassification: 'HEALTHY',
      mathematicalClassification: 'RESILIENT',
      globalScore: 94,
      primaryIndicators: { liquidityScore: 100, solvencyScore: 90 },
      technicalDrivers: { 
        liquidezReal: 7.78,
        liquidezSeca: 7.0,
        liquidezInstantaneaReal: 5.0,
        endividamentoGeral: 10,
        autonomiaFinanceira: 90,
        patrimonioLiquido: 500000,
        dependenciaCapitalTerceiros: 0.1
      },
      activeFiduciaryRestrictions: [],
      contextualAlerts: []
    };

    // Even if a local engine mistakenly sends a limited constraint
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(context, 'Funding Capacity Limitado');
    assert.strictEqual(motive.severity, 'HEALTHY');
    assert.ok(!motive.label.includes('Limitado'));
    assert.ok(motive.label.includes('Autonomia') || motive.label.includes('Liquidez'));
  });
});
