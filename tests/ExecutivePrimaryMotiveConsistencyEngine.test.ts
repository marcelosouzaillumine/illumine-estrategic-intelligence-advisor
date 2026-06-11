import { ExecutivePrimaryMotiveConsistencyEngine } from '../src/core/runtime/executive-consolidation/ExecutivePrimaryMotiveConsistencyEngine';
import { ExecutiveAnalysisContext } from '../src/core/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';

describe('ExecutivePrimaryMotiveConsistencyEngine', () => {
  it('should return CRITICAL motive for BP 2022 (Liquidez Real Crítica)', () => {
    const context: ExecutiveAnalysisContext = {
      moduleContext: 'BP',
      fiduciaryClassification: 'CRITICAL',
      mathematicalClassification: 'FRAGILE',
      globalScore: 20,
      primaryIndicators: { liquidityScore: 10, solvencyScore: 20 },
      technicalDrivers: { liquidityReal: 0.3 },
      activeFiduciaryRestrictions: ['Insolvência Iminente'],
      contextualAlerts: []
    };

    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(context, 'Liquidez Real Crítica (0.30)');
    expect(motive.severity).toBe('CRITICAL');
    expect(motive.label).toContain('Liquidez');
  });

  it('should return SAUDAVEL motive for BP 2025 (Resiliente)', () => {
    const context: ExecutiveAnalysisContext = {
      moduleContext: 'BP',
      fiduciaryClassification: 'HEALTHY',
      mathematicalClassification: 'RESILIENT',
      globalScore: 94,
      primaryIndicators: { liquidityScore: 100, solvencyScore: 90 },
      technicalDrivers: { liquidityReal: 7.78, debtConcentration: 0.07 },
      activeFiduciaryRestrictions: [],
      contextualAlerts: []
    };

    // Even if a local engine mistakenly sends a limited constraint
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(context, 'Funding Capacity Limitado');
    expect(motive.severity).toBe('HEALTHY');
    expect(motive.label).not.toContain('Limitado');
    expect(motive.label).toContain('Excedente de Liquidez');
  });
});
