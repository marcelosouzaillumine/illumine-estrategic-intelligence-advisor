import { MemoryClassification } from './MemoryClassification';

/**
 * Registro Institucional de uma Decisão Estratégica.
 * Documenta não apenas o que foi feito, mas o "porquê", o contexto, 
 * os riscos mapeados e, posteriormente, a realidade do resultado (Learning Loop).
 */
export interface DecisionMemoryRecord {
  id: string;
  decisionDate: string; // ISO String
  decisionType: string; // Ex: 'EXPAND_OPERATIONS', 'DISTRIBUTE_DIVIDENDS'
  
  /**
   * Snapshot do contexto e indicadores no momento exato da decisão.
   */
  contextSnapshot: {
    financialState: string;
    liquidity: number;
    autonomy: number;
    decision: string;
    approvedBy: string;
    date: string;
  };
  
  /**
   * Premissas que sustentaram a aprovação da decisão.
   * Ex: "Mercado absorverá volume adicional sem perda de margem"
   */
  assumptions: string[];
  
  /**
   * Riscos alertados pelo CausalDiagnosticEngine no momento.
   */
  risksIdentified: string[];
  
  /**
   * Qual era a consequência esperada ao tomar essa decisão?
   */
  expectedOutcome: string;
  
  /**
   * Lista de IDs (ou nomes) dos executivos que validaram a decisão.
   */
  responsibleExecutives: string[];
  
  /**
   * Nível de sigilo/gravidade desta memória.
   */
  approvalLevel: MemoryClassification;
  
  /**
   * Resultado REALIZADO (Preenchido posteriormente na validação do ciclo)
   */
  actualOutcome?: string;
  
  /**
   * Aprendizado institucional extraído da diferença entre Expectativa x Realidade
   */
  lessonsLearned?: string;
  
  /**
   * Grau de confiança que o motor tinha ao embasar esta decisão no passado
   */
  confidenceScore: number;
}
