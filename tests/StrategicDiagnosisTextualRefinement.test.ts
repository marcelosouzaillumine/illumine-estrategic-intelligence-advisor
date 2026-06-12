import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from '../src/core/runtime/executive-consolidation/StrategicOpinionConsistencyEngine';
import { ExecutiveDecisionSynthesisEngine } from '../src/core/runtime/executive-consolidation/ExecutiveDecisionSynthesisEngine';

describe('StrategicDiagnosisTextualRefinement', () => {

  const getBaseContext = (module: 'BP' | 'DRE' | 'DFC' | 'DLPA' = 'BP'): ExecutiveAnalysisContext => ({
    analysisYear: 2024,
    generatedAt: '2024-01-01T00:00:00Z',
    moduleContext: module,
    activeFiduciaryRestrictions: [],
    fiduciaryClassification: '',
    mathematicalClassification: '',
    globalScore: 50,
    primaryIndicators: {},
    technicalDrivers: {},
    contextualAlerts: []
  });

  it('1. Cliente crítico com liquidez ruim e autonomia moderada (Liquidity wins)', () => {
    const ctx = getBaseContext('BP');
    ctx.technicalDrivers = {
      liquidezReal: 0.8, // CRITICAL
      liquidezSeca: 0.8,
      liquidezInstantaneaReal: 0.4,
      endividamentoGeral: 70,
      autonomiaFinanceira: 0.85, // 85% = HEALTHY mitigating factor
      patrimonioLiquido: -1000 // CRITICAL, so autonomy is the only mitigating factor
    };
    ctx.globalScore = 20;

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);
    const synthesis = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(ctx);
    
    // Severity should be CRITICAL due to liquidity
    assert.strictEqual(opinion.severityState, 'CRITICAL');
    
    // Primary driver should be Liquidez Real
    assert.ok(synthesis.primaryDriver.includes('Liquidez Real Crítica'));
    
    // Check two sentence structure
    assert.ok(opinion.situacaoAtual.includes('stress severo'), 'Must contain "stress severo"');
    assert.ok(opinion.situacaoAtual.includes('não é suficiente para compensar'), 'Must contain mitigating narrative clause');
    assert.ok(opinion.situacaoAtual.includes('autonomia'), 'Must mention autonomia as mitigating');
    
    // Recommendation should not just be strategicPriority
    assert.notStrictEqual(synthesis.priorityRecommendation, opinion.prioridadeEstrategica);
    assert.ok(synthesis.priorityRecommendation.includes('Consolidar a recomposição patrimonial'));
  });

  it('2. Cliente saudável com alta liquidez e alta autonomia', () => {
    const ctx = getBaseContext('BP');
    ctx.technicalDrivers = {
      liquidezReal: 4.0, // HEALTHY
      liquidezSeca: 3.5,
      liquidezInstantaneaReal: 2.0,
      endividamentoGeral: 20,
      autonomiaFinanceira: 0.90, // 90% HEALTHY
      patrimonioLiquido: 500000
    };
    ctx.globalScore = 85;

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);
    const synthesis = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(ctx);
    
    assert.strictEqual(opinion.severityState, 'HEALTHY');
    
    // Should highlight optimization language (expansion stage because year is 2024)
    assert.ok(opinion.situacaoAtual.includes('expansão consistente'));
    assert.ok(!opinion.situacaoAtual.includes('sobrevivência'));
    assert.ok(!opinion.situacaoAtual.includes('stress'));

    // Should not contain "comprometida" or defensive terminology
    assert.ok(!opinion.situacaoAtual.includes('comprometida'));
  });

  it('3. Cliente saudável com liquidez confortável, mas dependência moderada', () => {
    const ctx = getBaseContext('BP');
    ctx.technicalDrivers = {
      liquidezReal: 3.0, // HEALTHY
      liquidezSeca: 2.5,
      liquidezInstantaneaReal: 1.5,
      endividamentoGeral: 45, // WARNING
      autonomiaFinanceira: 0.45, // WARNING
      dependenciaCapitalTerceiros: 0.60, // WARNING
      patrimonioLiquido: 200000
    };
    ctx.globalScore = 75; // Forces HEALTHY despite some warning drivers

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);
    const synthesis = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(ctx);
    
    assert.strictEqual(opinion.severityState, 'HEALTHY');
    // Primary driver must be chosen from HEALTHY drivers (Liquidez Real)
    assert.ok(synthesis.primaryDriver.includes('Liquidez Real'), 'Dominant driver must be healthy: ' + synthesis.primaryDriver);
    // Should NOT complain about dependency in the main healthy statement
    assert.ok(!opinion.situacaoAtual.includes('dependência'));
  });

  it('4. Cliente em atenção com endividamento elevado, mas caixa positivo', () => {
    const ctx = getBaseContext('BP');
    ctx.technicalDrivers = {
      liquidezReal: 2.5, // WARNING
      liquidezSeca: 2.0,
      liquidezInstantaneaReal: 1.0, // HEALTHY
      endividamentoGeral: 55, // WARNING
      autonomiaFinanceira: 0.40, // WARNING
      patrimonioLiquido: 100000
    };
    ctx.globalScore = 50; // WARNING

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);
    
    assert.strictEqual(opinion.severityState, 'WARNING');
    assert.ok(opinion.situacaoAtual.includes('permanece funcional, porém exige monitoramento ativo'));
  });

  it('5. Cliente com FCO negativo e lucro positivo (DFC module)', () => {
    const ctx = getBaseContext('DFC');
    ctx.technicalDrivers = {
      fco: -50000, // CRITICAL
      saldoTesouraria: 10000,
      runway: 5,
      dependenciaSocios: 1,
      conversaoReceitaCaixa: 0.5,
      margemLiquida: 0.15 // HEALTHY (but this is DRE, let's say it's available)
    };
    
    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);
    
    assert.strictEqual(opinion.severityState, 'CRITICAL');
    assert.ok(opinion.situacaoAtual.includes('stress severo'), opinion.situacaoAtual);
    assert.ok(opinion.situacaoAtual.includes('O fluxo operacional encontra-se'), opinion.situacaoAtual);
  });

  it('6. Cliente com PL positivo, mas liquidez crítica', () => {
    const ctx = getBaseContext('BP');
    ctx.technicalDrivers = {
      liquidezReal: 0.5, // CRITICAL
      liquidezSeca: 0.4,
      liquidezInstantaneaReal: 0.1, // CRITICAL
      endividamentoGeral: 30, // HEALTHY
      autonomiaFinanceira: 0.85, // HEALTHY
      patrimonioLiquido: 1000000 // HEALTHY
    };
    
    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);
    const synthesis = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(ctx);
    
    assert.strictEqual(opinion.severityState, 'CRITICAL');
    assert.ok(synthesis.primaryDriver.includes('Liquidez'), 'Liquidity wins over Solvency: ' + synthesis.primaryDriver);
    assert.ok(opinion.situacaoAtual.includes('não é suficiente para compensar'), 'Mitigating factor mentioned');
  });

  it('7. Cliente neutro sem drivers suficientes', () => {
    const ctx = getBaseContext('BP');
    ctx.technicalDrivers = {}; // missing drivers
    
    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(ctx);
    const synthesis = ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload(ctx);
    
    assert.strictEqual(opinion.severityState, 'NEUTRAL');
    assert.ok(!synthesis.primaryDriver.includes('Dados Insuficientes') ? false : true); // should be handled
    assert.ok(opinion.situacaoAtual.includes('Dados insuficientes para diagnóstico'));
  });

});
