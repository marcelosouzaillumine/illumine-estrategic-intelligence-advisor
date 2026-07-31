import { FinancialEvidenceContract } from './FinancialEvidenceContract';
import { DecisionAssessmentContract } from './DecisionAssessmentContract';

/**
 * Contrato Global da Plataforma de Inteligência Executiva.
 * Reúne o Contexto (Layer 1), Integridade (Layer 0), Diagnóstico (Layer 2), Governança (Layer 3) e Narrativa (Layer 4).
 */
export interface ExecutiveIntelligenceContract {
  /**
   * Estado financeiro detectado (Ex: Pressão Financeira, Crescimento Sustentável)
   */
  businessState: string;
  
  /**
   * Identificação única do processamento cognitivo para auditoria fiduciária
   */
  cognitiveSessionId: string;
  
  /**
   * Grau de confiança médio da análise (0 a 100)
   */
  overallConfidence: number;

  /**
   * Evidências processadas que formaram a base para o diagnóstico
   */
  evidences: FinancialEvidenceContract[];

  /**
   * Se o usuário pediu a validação de uma decisão, o parecer fiduciário estará aqui.
   */
  decisionAssessment?: DecisionAssessmentContract;

  /**
   * Síntese narrativa dinâmica estruturada por blocos
   */
  narrativeBlocks: Array<{
    type: 'SITUATION' | 'SIGNALS' | 'RISK' | 'DECISION' | 'ACTION' | 'MONITORING';
    content: string;
    confidence: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>;
}
