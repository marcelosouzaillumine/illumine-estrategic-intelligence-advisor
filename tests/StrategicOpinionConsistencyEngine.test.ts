import { describe, it } from 'node:test';
import assert from 'node:assert';


import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from '../src/workspace/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';
import { ExecutiveDecisionSynthesisEngine } from '../src/workspace/runtime/executive-consolidation/ExecutiveDecisionSynthesisEngine';

describe('StrategicOpinionConsistencyEngine Parametric Test v1.3', () => {
  it('should generate parametric narratives that reflect unique material drivers across healthy exercises', () => {
    
    // 2023: Recuperacao/Consolidacao
    const context2023: ExecutiveAnalysisContext = {
      analysisYear: 2023, generatedAt: new Date().toISOString(), moduleContext: 'BP',
      activeFiduciaryRestrictions: [],
      fiduciaryClassification: 'HEALTHY', mathematicalClassification: 'STABLE', globalScore: 75,
      primaryIndicators: {}, contextualAlerts: [],
      technicalDrivers: { liquidezReal: 3.19, liquidezSeca: 3.0, liquidezInstantaneaReal: 1.5, autonomiaFinanceira: 74.2, endividamentoGeral: 26.1, dependenciaCapitalTerceiros: 25.8, patrimonioLiquido: 50000 }
    };

    // 2024: Fortalecimento
    const context2024: ExecutiveAnalysisContext = {
      analysisYear: 2024, generatedAt: new Date().toISOString(), moduleContext: 'BP',
      activeFiduciaryRestrictions: [],
      fiduciaryClassification: 'HEALTHY', mathematicalClassification: 'STABLE', globalScore: 85,
      primaryIndicators: {}, contextualAlerts: [],
      technicalDrivers: { liquidezReal: 7.78, liquidezSeca: 7.0, liquidezInstantaneaReal: 4.5, autonomiaFinanceira: 82.4, endividamentoGeral: 17.6, dependenciaCapitalTerceiros: 17.6, patrimonioLiquido: 60000 }
    };

    // 2025: Robustez
    const context2025: ExecutiveAnalysisContext = {
      analysisYear: 2025, generatedAt: new Date().toISOString(), moduleContext: 'BP',
      activeFiduciaryRestrictions: [],
      fiduciaryClassification: 'HEALTHY', mathematicalClassification: 'STABLE', globalScore: 92,
      primaryIndicators: {}, contextualAlerts: [],
      technicalDrivers: { liquidezReal: 9.05, liquidezSeca: 8.5, liquidezInstantaneaReal: 6.0, autonomiaFinanceira: 92.9, endividamentoGeral: 7.1, dependenciaCapitalTerceiros: 7.1, patrimonioLiquido: 70000 }
    };

    const payload2023 = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(context2023);
    const payload2024 = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(context2024);
    const payload2025 = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(context2025);

    // Validate that narratives are not identical
    const uniqueSituations = new Set([
      payload2023.currentSituation,
      payload2024.currentSituation,
      payload2025.currentSituation
    ]);
    console.log([...uniqueSituations]); assert.ok(uniqueSituations.size >= 2);

    // Validate semantics
    assert.ok(payload2023.currentSituation.toLowerCase()?.includes('liquidez'));
    assert.ok(payload2024.currentSituation.toLowerCase()?.includes('autonomia'));
    assert.ok(payload2025.primaryDriver?.toLowerCase()?.includes('autonomia'));
  });
});
