import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from '../src/core/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';
import { ExecutiveDecisionSynthesisEngine } from '../src/core/runtime/executive-consolidation/ExecutiveDecisionSynthesisEngine';

describe('StrategicDiagnosisNarrativeDifferentiation', () => {

  const getBaseContext = (year: number): ExecutiveAnalysisContext => ({
    analysisYear: year,
    generatedAt: '2024-01-01T00:00:00Z',
    moduleContext: 'BP',
    activeFiduciaryRestrictions: [],
    fiduciaryClassification: 'SAUDÁVEL',
    mathematicalClassification: 'STABLE',
    globalScore: 80,
    primaryIndicators: {},
    technicalDrivers: {},
    contextualAlerts: []
  });

  it('2023 - Recomposição / Estabilização', () => {
    const ctx = getBaseContext(2023);
    // Para optimization ou stabilization, liquidez >= 2, autonomia >= 70
    ctx.technicalDrivers = {
      liquidezReal: 3.0,
      liquidezSeca: 2.0,
      liquidezInstantaneaReal: 1.0,
      endividamentoGeral: 35,
      autonomiaFinanceira: 0.75, // 75%
      patrimonioLiquido: 100000,
      dependenciaCapitalTerceiros: 0.40
    };

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);
    const synthesis = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(ctx);
    
    assert.strictEqual(opinion.severityState, 'HEALTHY');
    assert.ok(opinion.situacaoAtual.includes('recomposição patrimonial') || opinion.situacaoAtual.includes('consolidação da base patrimonial'), opinion.situacaoAtual);
  });

  it('2024 - Expansão', () => {
    const ctx = getBaseContext(2024);
    // Para expansion, hasExpansionSignal (crescimentoAtivo ou 2024 via fallback), autonomia >= 70
    ctx.technicalDrivers = {
      liquidezReal: 4.0,
      liquidezSeca: 3.0,
      liquidezInstantaneaReal: 1.5,
      endividamentoGeral: 25,
      autonomiaFinanceira: 0.80, // 80%
      patrimonioLiquido: 500000,
      dependenciaCapitalTerceiros: 0.20,
      crescimentoAtivo: true // mock para hasExpansionSignal
    };

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);
    const synthesis = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(ctx);
    
    assert.strictEqual(opinion.severityState, 'HEALTHY');
    assert.ok(opinion.situacaoAtual.includes('expansão consistente') || opinion.situacaoAtual.includes('disciplina de capital durante o crescimento'), opinion.situacaoAtual);
    assert.ok(synthesis.priorityRecommendation.includes('Preservar disciplina de capital durante a expansão'));
  });

  it('2025 - Alocação de Excedentes', () => {
    const ctx = getBaseContext(2025);
    // Para capital_allocation, liquidezReal >= 5, autonomia >= 85, dependencia <= 0.30
    ctx.technicalDrivers = {
      liquidezReal: 6.0,
      liquidezSeca: 5.0,
      liquidezInstantaneaReal: 3.0,
      endividamentoGeral: 10,
      autonomiaFinanceira: 0.90, // 90%
      patrimonioLiquido: 1000000,
      dependenciaCapitalTerceiros: 0.10
    };

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);
    const synthesis = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(ctx);
    
    assert.strictEqual(opinion.severityState, 'HEALTHY');
    assert.ok(opinion.situacaoAtual.includes('alocação eficiente do capital excedente'), opinion.situacaoAtual);
    assert.ok(synthesis.priorityRecommendation.includes('Formalizar política de alocação de excedentes'));
  });

  it('Nenhum output deve conter expressões artificiais', () => {
    // Verificamos com um contexto que passa pelo catálogo
    const ctx = getBaseContext(2025);
    ctx.technicalDrivers = {
      liquidezReal: 1.5, // WARNING
      liquidezSeca: 1.0,
      liquidezInstantaneaReal: 0.5,
      endividamentoGeral: 50,
      autonomiaFinanceira: 0.50, // WARNING
      patrimonioLiquido: 50000,
      dependenciaCapitalTerceiros: 0.60
    };
    ctx.globalScore = 45; // FORCE WARNING
    
    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);
    const synthesis = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(ctx);
    
    const fullText = opinion.situacaoAtual + " " + opinion.prioridadeEstrategica + " " + opinion.outlook + " " + synthesis.priorityRecommendation;
    
    assert.ok(!fullText.includes('fundo de manobra resiliente'), 'Contém expressão artificial');
    assert.ok(!fullText.includes('fortaleza patrimonial'), 'Contém expressão artificial');
    assert.ok(!fullText.includes('proteção inflacionária'), 'Contém expressão artificial');
  });

  it('As narrativas de 2023, 2024 e 2025 devem ser diferentes', () => {
    const ctx2023 = getBaseContext(2023);
    ctx2023.technicalDrivers = { liquidezReal: 3.0, liquidezSeca: 2.5, liquidezInstantaneaReal: 1.5, autonomiaFinanceira: 0.75, endividamentoGeral: 35, patrimonioLiquido: 100000 };
    
    const ctx2024 = getBaseContext(2024);
    ctx2024.technicalDrivers = { liquidezReal: 4.0, liquidezSeca: 3.5, liquidezInstantaneaReal: 2.0, autonomiaFinanceira: 0.80, crescimentoAtivo: true, patrimonioLiquido: 500000, endividamentoGeral: 25 };
    
    const ctx2025 = getBaseContext(2025);
    ctx2025.technicalDrivers = { liquidezReal: 6.0, liquidezSeca: 5.5, liquidezInstantaneaReal: 4.0, autonomiaFinanceira: 0.90, dependenciaCapitalTerceiros: 0.10, patrimonioLiquido: 1000000, endividamentoGeral: 10 };

    const sit2023 = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx2023).situacaoAtual;
    const sit2024 = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx2024).situacaoAtual;
    const sit2025 = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx2025).situacaoAtual;

    assert.notStrictEqual(sit2023, sit2024);
    assert.notStrictEqual(sit2024, sit2025);
    assert.notStrictEqual(sit2023, sit2025);
  });
});
