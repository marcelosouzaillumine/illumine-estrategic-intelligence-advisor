import { FinancialIntegrityEngine } from '../integrity/FinancialIntegrityEngine';
import { BusinessFinancialStateClassifier } from '../context/BusinessFinancialStateClassifier';
import { DecisionGovernanceEngine } from '../governance/DecisionGovernanceEngine';
import { CausalDiagnosticEngine } from '../causal/CausalDiagnosticEngine';
import { AdaptiveNarrativeEngine } from '../narrative/AdaptiveNarrativeEngine';
import { LearningAdvisorEngine } from '../learning/LearningAdvisorEngine';
import { ExecutiveIntelligenceContract } from '../contracts/ExecutiveIntelligenceContract';
import { DecisionMemoryRecord } from '../learning/DecisionMemoryRecord';
import { LearningEvent } from '../learning/LearningEvent';

/**
 * Cérebro central que coordena a execução das camadas cognitivas.
 */
export class ExecutiveIntelligenceOrchestrator {
  /**
   * Processa o pipeline completo de inteligência executiva.
   * @param financialData Payload de dados do domínio analisado
   * @param historicalData Histórico financeiro para avaliação temporal
   * @param proposedDecision (Opcional) Decisão submetida para avaliação fiduciária
   * @param decisionHistory (Opcional) Memória Institucional bruta (Fase 4)
   * @param learningHistory (Opcional) Memória de aprendizados da empresa (Fase 4)
   */
  public static runPipeline(
    financialData: any, 
    historicalData?: any[], 
    proposedDecision?: string,
    decisionHistory: DecisionMemoryRecord[] = [],
    learningHistory: LearningEvent[] = []
  ): ExecutiveIntelligenceContract {
    const sessionId = `EIL-SESSION-${Date.now()}`;

    // LAYER 0: Financial Integrity Validation
    const integrity = FinancialIntegrityEngine.validate(financialData, historicalData, proposedDecision);

    if (integrity.status === 'BLOCKED') {
      return {
        cognitiveSessionId: sessionId,
        businessState: 'UNKNOWN - DATA REJECTED',
        overallConfidence: 0,
        evidences: [],
        narrativeBlocks: [
          {
            type: 'CRITICAL',
            content: `Inteligência suspensa por violação fiduciária. Motivo principal: ${integrity.blockers[0].message}`,
            confidence: 100,
            severity: 'CRITICAL'
          }
        ]
      } as any;
    }

    // LAYER 1: Context (Business Financial State)
    const businessState = BusinessFinancialStateClassifier.classify(financialData);

    // LAYER 5 (NEW - FASE 4): Learning Advisor - Consulta a memória da empresa
    let memoryWarning: string | null = null;
    if (proposedDecision && decisionHistory.length > 0 && learningHistory.length > 0) {
      memoryWarning = LearningAdvisorEngine.consultInstitutionalMemory(
        proposedDecision, 
        businessState, 
        learningHistory, 
        decisionHistory
      );
    }

    // LAYER 3: Governance (Decision Assessment)
    let decisionAssessment;
    if (proposedDecision) {
      decisionAssessment = DecisionGovernanceEngine.assess(proposedDecision, businessState, financialData);
      
      // Intervenção da Memória Institucional sobre a Governança atual
      if (memoryWarning) {
        if (decisionAssessment.status !== 'BLOCKED') {
           decisionAssessment.status = 'APPROVED_WITH_CONDITIONS'; // Rebaixa o status devido a alertas do passado
        }
        decisionAssessment.reasons.push(memoryWarning);
      }
    }

    // LAYER 2: Causal Diagnostics
    const evidences = CausalDiagnosticEngine.diagnose(financialData, businessState);
    
    // Calcula Confiança Geral Média Ponderada
    let overallConfidence = 100;
    if (evidences.length > 0) {
      const sum = evidences.reduce((acc, curr) => acc + curr.confidence, 0);
      overallConfidence = Math.round(sum / evidences.length);
    }

    // LAYER 4: Adaptive Narrative
    const narrativeBlocks = AdaptiveNarrativeEngine.generateBrief(businessState, evidences, decisionAssessment);

    return {
      cognitiveSessionId: sessionId,
      businessState,
      overallConfidence,
      evidences,
      decisionAssessment,
      narrativeBlocks
    };
  }
}
