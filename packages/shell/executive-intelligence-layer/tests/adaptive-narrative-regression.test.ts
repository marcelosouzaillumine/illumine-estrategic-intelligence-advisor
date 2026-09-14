import { ExecutiveIntelligenceOrchestrator } from '../src/orchestration/ExecutiveIntelligenceOrchestrator';

describe('Adaptive Narrative Regression Test', () => {
  it('should generate structurally divergent execution plans for STABLE vs CRITICAL states', () => {
    // 1. Contexto: Empório 2024 (Saudável/Estável)
    const emporio24Data = {
      assets: 1000000,
      liabilities: 500000,
      equity: 500000,
      ebitda: 200000,
      revenue: 1000000,
      liquidity: 1.5,
      // Forçaremos o classifier a ler como Estável ou Pressão Controlada simulando a métrica que ele já espera
      _mockState: 'PRESSÃO FINANCEIRA CONTROLADA'
    };

    const pkg24 = ExecutiveIntelligenceOrchestrator.runPipeline(emporio24Data);
    // Como passamos dados bons/médios, o Orchestrator classifica e o AdaptiveNarrative gera
    // Nós apenas forçamos os testes via o resultado final
    expect(pkg24.executionPlan).toBeDefined();

    // 2. Contexto: Granatum (Crítico)
    const granatumData = {
      assets: 1000000,
      liabilities: 1500000,
      equity: -500000, // Passivo a descoberto
      ebitda: -50000,
      revenue: 800000,
      liquidity: 0.5,
      _mockState: 'RISCO DE CONTINUIDADE'
    };

    // Para tornar esse teste puro, a gente vai importar o Classifier mockado ou 
    // garantir que o Orchestrator chame com esses states. 
    // Aqui testaremos os properties gerados:
    
    // Vamos injetar o BusinessState usando o AdaptiveNarrativeEngine diretamente para focar na divergência narrativa
    const { AdaptiveNarrativeEngine } = require('../src/narrative/AdaptiveNarrativeEngine');
    
    const narrative24 = AdaptiveNarrativeEngine.generateNarrativeBlocks('PRESSÃO FINANCEIRA CONTROLADA', [], undefined);
    const narrativeGranatum = AdaptiveNarrativeEngine.generateNarrativeBlocks('RISCO DE CONTINUIDADE', [], undefined);

    // Validações Estruturais
    expect(narrative24.executionPlan[0].priority).not.toEqual(narrativeGranatum.executionPlan[0].priority);
    expect(narrativeGranatum.executionPlan[0].owner).toEqual('CFO');
    expect(narrativeGranatum.executionPlan[0].deadline).toEqual('Imediato');
    
    const isCriticalIn24 = narrative24.narrativeBlocks.some((b: any) => b.priority === 'CRITICAL');
    const isCriticalInGranatum = narrativeGranatum.narrativeBlocks.some((b: any) => b.priority === 'CRITICAL');
    
    expect(isCriticalIn24).toBeFalsy();
    expect(isCriticalInGranatum).toBeTruthy();
  });
});
