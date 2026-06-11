import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from './StrategicOpinionConsistencyEngine';

describe('StrategicOpinionConsistencyEngine', () => {
  it('should return CRITICAL when there are active fiduciary restrictions', () => {
    const context: ExecutiveAnalysisContext = {
      moduleContext: 'BP',
      activeFiduciaryRestrictions: ['PAT_LIQUIDITY_WARNING'],
      fiduciaryClassification: 'SAUDÁVEL',
      mathematicalClassification: 'STABLE',
      globalScore: 85,
      primaryIndicators: {},
      contextualAlerts: []
    };

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(context);
    expect(opinion.severityState).toBe('CRITICAL');
    expect(opinion.fullNarrative).toContain('recomposição urgente');
  });

  it('should return HEALTHY for robust BP scenarios without restrictions', () => {
    const context: ExecutiveAnalysisContext = {
      moduleContext: 'BP',
      activeFiduciaryRestrictions: [],
      fiduciaryClassification: 'SAUDÁVEL',
      mathematicalClassification: 'STABLE',
      globalScore: 92,
      primaryIndicators: { liquidityScore: 100, solvencyScore: 100 },
      contextualAlerts: []
    };

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(context);
    expect(opinion.severityState).toBe('HEALTHY');
    expect(opinion.fullNarrative).toContain('robusta autonomia financeira');
    expect(opinion.fullNarrative).not.toContain('crise');
    expect(opinion.fullNarrative).not.toContain('stress');
  });

  it('should evaluate warning state properly for DFC', () => {
    const context: ExecutiveAnalysisContext = {
      moduleContext: 'DFC',
      activeFiduciaryRestrictions: [],
      fiduciaryClassification: 'ATENÇÃO',
      mathematicalClassification: 'ATTENTION',
      globalScore: 55,
      primaryIndicators: {},
      contextualAlerts: []
    };

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(context);
    expect(opinion.severityState).toBe('WARNING');
    expect(opinion.fullNarrative).toContain('margens sob pressão');
  });
});
