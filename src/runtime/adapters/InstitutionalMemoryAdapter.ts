import { EngineDefinition, InstitutionalContext, EngineExecutionResult, RuntimeConfidence, RuntimeViolation, MemoryClassification } from '../types';

export const InstitutionalMemoryAdapter: EngineDefinition = {
  name: 'InstitutionalMemoryEngine',
  priority: 60, // Runs after ExecutiveDecisionEngine
  dependencies: ['LegacyFinancialAdapter', 'LegacyDREAdapter', 'LegacyDFCAdapter', 'StressTestAdapter', 'ExecutiveDecisionEngine'],
  requiredData: ['historicalCyclesCount'],
  inferenceScope: 'institutional_memory',
  minimumEvidenceLevel: 'EVIDENCE_BASED',

  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const violations: RuntimeViolation[] = [];
      const periodsAvailable = context.input.historicalCyclesCount || 0;
      
      let memoryType: MemoryClassification;
      let confidence: RuntimeConfidence;
      let blockedInferences: string[] = [];
      let allowedInferences: string[] = [];
      let historicalSignals: string[] = [];
      let causalContinuity: string;
      let narrativeBoundary: string;

      if (periodsAvailable < 2) {
        memoryType = 'STRUCTURAL_SNAPSHOT';
        confidence = 'LOW';
        blockedInferences = [
          'Tendência longitudinal de crescimento',
          'Recorrência operacional confiável',
          'Evolução estrutural consolidada',
          'Comparativos YoY com validade estratégica'
        ];
        allowedInferences = [
          'Diagnóstico do período vigente',
          'Status atual de capital de giro'
        ];
        causalContinuity = 'Inexistente';
        narrativeBoundary = 'Narrativa deve ser estritamente limitada ao momento presente. Proibida qualquer inferência sobre evolução ou resiliência temporal.';
        
        violations.push({
          rule: 'memory_blocked_by_insufficient_history',
          severity: 'HIGH',
          message: `Histórico insuficiente para inferência longitudinal (${periodsAvailable} períodos). Tendências bloqueadas.`,
          blocked: true
        });

      } else if (periodsAvailable === 2) {
        memoryType = 'LIMITED_COMPARISON';
        confidence = 'LOW';
        blockedInferences = [
          'Evolução estrutural consolidada',
          'Tendência longitudinal de crescimento',
          'Previsibilidade operacional'
        ];
        allowedInferences = [
          'Comparação de ciclo isolado (YoY restrito)',
          'Variação primária'
        ];
        causalContinuity = 'Ruptura latente / Dados insuficientes';
        narrativeBoundary = 'Permitida comparação estrita entre dois anos. Proibida a definição de "tendência" ou "evolução consistente".';

        violations.push({
          rule: 'memory_limited_comparison',
          severity: 'MEDIUM',
          message: `Comparação restrita a dois ciclos (${periodsAvailable} períodos). Não configura tendência estatisticamente válida.`,
          blocked: true
        });

      } else if (periodsAvailable >= 3 && periodsAvailable < 5) {
        memoryType = 'MODERATE_TREND';
        confidence = 'MEDIUM';
        blockedInferences = [
          'Crescimento estrutural garantido',
          'Maturidade plena assegurada apenas por tempo'
        ];
        allowedInferences = [
          'Série temporal inicial',
          'Variação de resiliência nos últimos ciclos',
          'Primeiros traços de recorrência de caixa'
        ];
        causalContinuity = 'Série temporal em formação';
        narrativeBoundary = 'Permitida a discussão de tendência e resiliência de médio prazo, sujeito a estresse causal do fluxo de caixa.';
        
      } else {
        // >= 5
        memoryType = 'ROBUST_LONGITUDINAL_MEMORY';
        confidence = 'HIGH';
        blockedInferences = [];
        allowedInferences = [
          'Memória executiva consolidada',
          'Crescimento estrutural histórico',
          'Recorrência comprovada de geração de caixa',
          'Análise profunda de sazonalidade e resiliência temporal'
        ];
        causalContinuity = 'Consolidada e Rastreável';
        narrativeBoundary = 'Abertura total para análises de tendências estruturais e capacidade longitudinal de geração e defesa de caixa.';
      }

      // Check for blocked status via causality engine or missing DFC
      const dfcInference = context.inferences['LegacyDFCAdapter'];
      if (!dfcInference || dfcInference.evidenceLevel === 'INFERRED_LOW_CONFIDENCE') {
        memoryType = 'BLOCKED_INSUFFICIENT_HISTORY';
        confidence = 'LOW';
        blockedInferences.push('Evolução de geração livre de caixa', 'Tendência de saúde de liquidez real');
        causalContinuity = 'Rompida pela falta de fluxo de caixa primário.';
        narrativeBoundary = 'A ausência de DFC primária invalida a análise de evolução de liquidez, não importa o número de anos disponíveis.';
        
        violations.push({
          rule: 'memory_blocked_by_dfc_absence',
          severity: 'CRITICAL',
          message: `Evolução e memória bloqueadas devido a ausência de atestado causal (DFC) histórico.`,
          blocked: true
        });
      }

      return {
        engineName: 'InstitutionalMemoryEngine',
        success: true,
        confidence,
        inference: {
          domain: 'institutional_memory',
          metrics: {
            memoryType,
            periodsAvailable,
            allowedInferences,
            blockedInferences,
            historicalSignals,
            causalContinuity,
            narrativeBoundary
          },
          causality: [],
          narrative: {
            diagnostic: memoryType === 'STRUCTURAL_SNAPSHOT' || memoryType === 'BLOCKED_INSUFFICIENT_HISTORY' 
              ? 'Memória longitudinal interrompida ou inexistente. Foco estrito no presente.'
              : `Série temporal avaliada com ${periodsAvailable} períodos (${memoryType}).`,
            cause: `Base de dados composta por ${periodsAvailable} ciclos importados.`,
            consequence: blockedInferences.length > 0 
              ? `Leitura evolutiva restrita. Foram bloqueadas inferências sobre: ${blockedInferences[0]}.`
              : 'Liberação total para análises e projeções longitudinais.',
            sensitivity: confidence === 'LOW' ? 'Altíssima (Inconsistência Temporal)' : 'Controlada',
            risk: confidence === 'LOW' ? 'Risco Epistemológico Elevado' : 'Base Estável',
            priority: confidence === 'LOW' ? 'Consolidação de Séries Históricas' : 'Aprofundamento de Tendências',
            strategicMovement: memoryType === 'STRUCTURAL_SNAPSHOT' 
              ? 'Suspender projeções evolutivas e basear decisões unicamente na causalidade do exercício atual.'
              : 'Utilizar memória consolidada para atestar robustez operacional.'
          },
          confidence,
          evidenceLevel: memoryType === 'ROBUST_LONGITUDINAL_MEMORY' ? 'EVIDENCE_BASED' : 'INFERRED_LOW_CONFIDENCE',
          score: periodsAvailable
        },
        violations: violations.length > 0 ? violations : undefined
      };
    } catch (e: any) {
      return {
        engineName: 'InstitutionalMemoryEngine',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'memory_engine_error',
          severity: 'CRITICAL',
          message: `Erro ao processar Institutional Memory Engine: ${e.message}`,
          blocked: true
        }]
      };
    }
  }
};
