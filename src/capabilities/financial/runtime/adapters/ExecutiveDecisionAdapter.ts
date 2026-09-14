import { EngineDefinition, InstitutionalContext, EngineExecutionResult, RuntimeConfidence, RuntimeViolation } from '../../../../runtime/types';

export const ExecutiveDecisionAdapter: EngineDefinition = {
  name: 'ExecutiveDecisionEngine',
  priority: 50, // Runs after StressTestAdapter (40)
  dependencies: ['LegacyFinancialAdapter', 'LegacyDREAdapter', 'LegacyDFCAdapter', 'StressTestAdapter'],
  requiredData: ['rawFinancialData'],
  inferenceScope: 'institutional_decision',
  minimumEvidenceLevel: 'INFERRED_LOW_CONFIDENCE',

  execute: async (context: InstitutionalContext): Promise<EngineExecutionResult> => {
    try {
      const violations: RuntimeViolation[] = [];
      const dfcInference = context.inferences['LegacyDFCAdapter'];
      const stressInference = context.inferences['StressTestAdapter'];
      const dreInference = context.inferences['LegacyDREAdapter'];

      const isDfcInferred = dfcInference?.evidenceLevel === 'INFERRED_LOW_CONFIDENCE';
      const confidence: RuntimeConfidence = isDfcInferred ? 'LOW' : 'HIGH';

      const metrics = dreInference?.metrics || {};
      const fco = dfcInference?.metrics?.fco || 0;
      const resilienciaGlobal = metrics.resilienciaGlobal || 0;
      const ebitda = metrics.ebitda || 0;
      const runwayDays = stressInference?.metrics?.runwayDays || 0;
      const isBurnRate = stressInference?.metrics?.isBurnRate || false;
      const ruptureRisk = stressInference?.metrics?.ruptureRisk || false;

      let evidenceClassification = 'EVIDENCE_BASED';
      if (isDfcInferred) {
        evidenceClassification = 'INFERRED_LOW_CONFIDENCE';
      }

      const blockedInferences: string[] = [];
      const strategicActionMatrix: Array<{ acao: string; impacto: string; velocidade: string; complexidade: string; prioridade: string }> = [];

      // Decision Generation based on CAUSAL states
      if (isDfcInferred) {
        blockedInferences.push('Recomendação Bloqueada por Validação Institucional: Falta de DFC Primária');
        strategicActionMatrix.push({
          acao: 'Implementar estruturação contábil de fluxo de caixa (DFC)',
          impacto: 'Alto',
          velocidade: 'Imediata',
          complexidade: 'Média',
          prioridade: 'Imediata'
        });
        
        violations.push({
          rule: 'decision_blocked_by_dfc',
          severity: 'HIGH',
          message: 'Recomendações estratégicas absolutas bloqueadas devido à falta de DFC atestada.',
          blocked: true
        });
      } else {
        // DFC is verified. Decisions can be causal.
        if (ruptureRisk) {
          strategicActionMatrix.push({
            acao: 'Desmobilização tática de ativos não operacionais para blindagem de caixa',
            impacto: 'Alto',
            velocidade: 'Imediata',
            complexidade: 'Alta',
            prioridade: 'Imediata'
          });
        } else if (isBurnRate && runwayDays < 90) {
          strategicActionMatrix.push({
            acao: 'Plano de capitalização ou turnaround financeiro de urgência',
            impacto: 'Alto',
            velocidade: 'Curto Prazo',
            complexidade: 'Alta',
            prioridade: 'Alta'
          });
        } else if (fco > 0 && ebitda > 0 && resilienciaGlobal > 70) {
          strategicActionMatrix.push({
            acao: 'Aceleração de crescimento e alocação de capital expansivo',
            impacto: 'Alto',
            velocidade: 'Médio Prazo',
            complexidade: 'Média',
            prioridade: 'Estratégica'
          });
        } else {
          strategicActionMatrix.push({
            acao: 'Manter governança e monitoramento longitudinal',
            impacto: 'Baixo',
            velocidade: 'Longo Prazo',
            complexidade: 'Baixa',
            prioridade: 'Moderada'
          });
        }
      }

      return {
        engineName: 'ExecutiveDecisionEngine',
        success: true,
        confidence,
        inference: {
          domain: 'institutional_decision',
          metrics: {
            evidenceClassification,
            blockedInferences,
            strategicActionMatrix,
            institutionalRisk: ruptureRisk ? 'CRITICAL' : (isBurnRate ? 'HIGH' : 'CONTROLLED')
          },
          causality: [],
          narrative: {
            diagnostic: blockedInferences.length > 0 ? 'Decisões limitadas por falta de evidência estrutural.' : 'Decisões ancoradas na matriz causal validada.',
            cause: isDfcInferred ? 'Inferência de fluxo de caixa' : 'Fluxo de caixa atestado',
            consequence: blockedInferences.length > 0 ? 'Expansão bloqueada' : 'Estratégia liberada',
            sensitivity: isDfcInferred ? 'Alta (Dados imprecisos)' : 'Baixa',
            risk: ruptureRisk ? 'Ruptura Eminente' : 'Risco Mitigado',
            priority: isDfcInferred ? 'Correção Contábil' : 'Execução Tática',
            strategicMovement: strategicActionMatrix[0]?.acao || ''
          },
          confidence,
          evidenceLevel: evidenceClassification,
          score: null
        },
        violations: violations.length > 0 ? violations : undefined
      };
    } catch (e: any) {
      return {
        engineName: 'ExecutiveDecisionEngine',
        success: false,
        confidence: 'LOW',
        violations: [{
          rule: 'decision_engine_error',
          severity: 'CRITICAL',
          message: `Erro ao processar Decision Engine: ${e.message}`,
          blocked: true
        }]
      };
    }
  }
};
