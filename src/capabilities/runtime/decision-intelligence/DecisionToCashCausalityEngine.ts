import { 
  DecisionToCashCausalityInput, 
  DecisionToCashCausalityOutput, 
  CausalChain, 
  CausalityConfidenceLevel, 
  RecognizedCausalChainType 
} from './DecisionToCashCausalityTypes';

export class DecisionToCashCausalityEngine {
  public static evaluate(input: DecisionToCashCausalityInput): DecisionToCashCausalityOutput {
    const { decisions, cashCycles, longitudinalCash, fiduciaryTimeline } = input;
    
    // Bloqueios base de integridade contábil
    if (!cashCycles || cashCycles.length === 0 || longitudinalCash.trajectoryClassification === 'INSUFFICIENT_HISTORICAL_DATA' || fiduciaryTimeline?.timelineIntegrityStatus === 'BROKEN') {
      return this.createBlockedOutput();
    }

    if (!decisions || decisions.length === 0) {
      return this.createNoEventOutput();
    }

    const causalChains: CausalChain[] = [];
    const decisionImpactMap: Record<string, CausalChain> = {};
    const affectedFinancialMetrics = new Set<string>();
    const evidenceTrail: string[] = [];
    const fiduciaryWarnings: string[] = [];

    // Mapeamento causal determinístico
    decisions.forEach(decision => {
      let chainType: RecognizedCausalChainType = 'NO_ESTABLISHED_CHAIN';
      let confidence: CausalityConfidenceLevel = 'LOW_CONFIDENCE_ASSOCIATION';
      const localEvidence: string[] = [];
      let description = 'Causalidade não estabelecida de forma determinística.';

      const impact = decision.observedImpact;

      // Rule 1: INVENTORY_EXPANSION_TO_CASH_PRESSURE
      if (decision.decisionType === 'INVENTORY_EXPANSION' && impact.fcoImpact < 0 && impact.runwayImpactMonths < 0) {
        chainType = 'INVENTORY_EXPANSION_TO_CASH_PRESSURE';
        confidence = decision.recurrenceFlag ? 'HIGH_CONFIDENCE_CAUSAL_CHAIN' : 'MODERATE_CONFIDENCE_CAUSAL_CHAIN';
        description = 'A decisão de expansão de estoque está associada à deterioração posterior do FCO e redução de runway.';
        localEvidence.push('Queda de FCO observada no ciclo vinculado.');
        affectedFinancialMetrics.add('FCO');
        affectedFinancialMetrics.add('Estoque');
      }
      
      // Rule 2: CUSTOMER_CREDIT_TO_WORKING_CAPITAL_STRESS
      else if (decision.decisionType === 'CUSTOMER_CREDIT_EXPANSION' && impact.fcoImpact < 0 && impact.runwayImpactMonths < 0) {
        chainType = 'CUSTOMER_CREDIT_TO_WORKING_CAPITAL_STRESS';
        confidence = decision.recurrenceFlag ? 'HIGH_CONFIDENCE_CAUSAL_CHAIN' : 'MODERATE_CONFIDENCE_CAUSAL_CHAIN';
        description = 'A decisão gerou pressão de capital de giro conforme evidências disponíveis (Aumento de recebíveis e deterioração de caixa).';
        localEvidence.push('Deterioração de FCO e pressão em recebíveis.');
        affectedFinancialMetrics.add('FCO');
        affectedFinancialMetrics.add('Contas a Receber');
      }

      // Rule 3: CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY
      else if (decision.decisionType === 'EMERGENCY_CAPITALIZATION' && impact.fcoImpact < 0 && impact.runwayImpactMonths > 0) {
        chainType = 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY';
        confidence = decision.recurrenceFlag ? 'HIGH_CONFIDENCE_CAUSAL_CHAIN' : 'MODERATE_CONFIDENCE_CAUSAL_CHAIN';
        description = 'A capitalização emergencial injetou liquidez, mas o fluxo de caixa livre operacional permaneceu deficitário (liquidez artificial).';
        localEvidence.push('Runway expandido por evento não operacional.');
        affectedFinancialMetrics.add('Runway');
      }

      // Rule 4: CAPEX_WITHOUT_OPERATIONAL_RETURN
      else if (decision.decisionType === 'CAPEX_EXPANSION' && impact.fcoImpact <= 0) {
        chainType = 'CAPEX_WITHOUT_OPERATIONAL_RETURN';
        confidence = 'MODERATE_CONFIDENCE_CAUSAL_CHAIN';
        description = 'Expansão de CAPEX realizada sem recuperação ou contrapartida positiva no fluxo de caixa operacional posterior.';
        localEvidence.push('Ausência de retorno de FCO após Capex.');
        affectedFinancialMetrics.add('CAPEX');
        affectedFinancialMetrics.add('FCO');
      }

      // Rule 5: DISTRIBUTION_TO_CONTINUITY_RISK
      else if (decision.decisionType === 'DIVIDEND_DISTRIBUTION' && decision.fiduciaryRiskFlag) {
        chainType = 'DISTRIBUTION_TO_CONTINUITY_RISK';
        confidence = 'HIGH_CONFIDENCE_CAUSAL_CHAIN';
        description = 'Distribuição fiduciariamente restrita sob runway crítico, gerando risco direto de continuidade.';
        localEvidence.push('Distribuição em momento de risco estrutural documentado.');
        fiduciaryWarnings.push('Alerta Fiduciário: Distribuição de capital associada a risco direto de continuidade institucional.');
        affectedFinancialMetrics.add('Caixa Livre');
      }

      // Rule 6: CORRECTIVE_ACTION_TO_RECOVERY
      else if ((decision.decisionType === 'COST_CUTTING' || decision.decisionType === 'OPERATIONAL_RESTRUCTURING') && impact.fcoImpact > 0 && impact.runwayImpactMonths > 0) {
        chainType = 'CORRECTIVE_ACTION_TO_RECOVERY';
        confidence = 'HIGH_CONFIDENCE_CAUSAL_CHAIN';
        description = 'A decisão corretiva está estruturalmente associada à melhora do FCO e expansão de runway no ciclo.';
        localEvidence.push('Melhora de FCO e Runway imediatamente vinculados à decisão corretiva.');
        affectedFinancialMetrics.add('FCO');
        affectedFinancialMetrics.add('Runway');
      }

      const chain: CausalChain = {
        chainId: `causality-${decision.decisionId}`,
        chainType,
        triggerEvent: decision,
        impactedCycle: decision.linkedFinancialCycle,
        affectedFinancialMetrics: Array.from(affectedFinancialMetrics),
        description,
        confidence,
        evidenceTrail: localEvidence
      };

      causalChains.push(chain);
      decisionImpactMap[decision.decisionId] = chain;
      evidenceTrail.push(...localEvidence);
    });

    const isHighConfidence = causalChains.some(c => c.confidence === 'HIGH_CONFIDENCE_CAUSAL_CHAIN');
    const isModerateConfidence = causalChains.some(c => c.confidence === 'MODERATE_CONFIDENCE_CAUSAL_CHAIN');
    
    let globalConfidence: CausalityConfidenceLevel = 'LOW_CONFIDENCE_ASSOCIATION';
    if (isHighConfidence) globalConfidence = 'HIGH_CONFIDENCE_CAUSAL_CHAIN';
    else if (isModerateConfidence) globalConfidence = 'MODERATE_CONFIDENCE_CAUSAL_CHAIN';

    const causalityLimitations = ['Causalidade restrita à temporalidade dos ciclos financeiros.', 'A engine fiduciária não profere intenção, culpa ou avaliação de caráter executivo.'];

    return {
      causalChains,
      decisionImpactMap,
      affectedFinancialMetrics: Array.from(affectedFinancialMetrics),
      runwayImpactAssessment: causalChains.some(c => c.triggerEvent.observedImpact.runwayImpactMonths < 0) ? 'IMPACTO_NEGATIVO_OBSERVADO' : 'ESTABILIZADO',
      fcoImpactAssessment: causalChains.some(c => c.triggerEvent.observedImpact.fcoImpact < 0) ? 'IMPACTO_NEGATIVO_OBSERVADO' : 'ESTABILIZADO',
      liquidityQualityImpact: causalChains.some(c => c.chainType === 'CAPITALIZATION_TO_ARTIFICIAL_LIQUIDITY') ? 'LIQUIDEZ_ARTIFICIAL_VINCULADA' : 'SEM_DISTORCAO_CAUSAL',
      continuityRiskImpact: causalChains.some(c => c.chainType === 'DISTRIBUTION_TO_CONTINUITY_RISK') ? 'RISCO_DIRETO_VINCULADO' : 'SEM_RISCO_VINCULADO',
      confidence: globalConfidence,
      evidenceTrail,
      causalityLimitations,
      fiduciaryWarnings
    };
  }

  private static createBlockedOutput(): DecisionToCashCausalityOutput {
    return {
      causalChains: [],
      decisionImpactMap: {},
      affectedFinancialMetrics: [],
      runwayImpactAssessment: 'NAO_AVALIADO',
      fcoImpactAssessment: 'NAO_AVALIADO',
      liquidityQualityImpact: 'NAO_AVALIADO',
      continuityRiskImpact: 'NAO_AVALIADO',
      confidence: 'BLOCKED_BY_ACCOUNTING_INTEGRITY',
      evidenceTrail: [],
      causalityLimitations: ['Bloqueio por falta de integridade contábil ou linha do tempo quebrada.'],
      fiduciaryWarnings: ['Avaliação causal bloqueada devido a inconsistências no fechamento ou dados insuficientes.']
    };
  }

  private static createNoEventOutput(): DecisionToCashCausalityOutput {
    return {
      causalChains: [],
      decisionImpactMap: {},
      affectedFinancialMetrics: [],
      runwayImpactAssessment: 'NAO_AVALIADO',
      fcoImpactAssessment: 'NAO_AVALIADO',
      liquidityQualityImpact: 'NAO_AVALIADO',
      continuityRiskImpact: 'NAO_AVALIADO',
      confidence: 'CAUSALITY_NOT_ESTABLISHED',
      evidenceTrail: [],
      causalityLimitations: ['Causalidade requer ao menos um evento de decisão estruturado.'],
      fiduciaryWarnings: []
    };
  }
}
