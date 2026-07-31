import { DecisionMemoryRecord } from './DecisionMemoryRecord';
import { LearningEvent } from './LearningEvent';

/**
 * Coração da evolução contínua da empresa.
 * Analisa o delta entre Expectativa e Realidade de decisões antigas.
 */
export class LearningLoopEngine {
  /**
   * Executa o ciclo de fechamento de aprendizado de uma decisão do passado.
   * @param pastDecision O registro histórico da decisão tomada.
   * @param actualOutcome O resultado financeiro documentado pós-implementação da decisão.
   * @param approvedBy Executivo humano que chancelou a interpretação do aprendizado.
   */
  public static closeLoop(pastDecision: DecisionMemoryRecord, actualOutcome: string, approvedBy: string): LearningEvent {
    // Na arquitetura real, o LLM interpretaria a diferença entre pastDecision.expectedOutcome e actualOutcome
    // Aqui implementamos a base fiduciária e estrutural para sustentar essa inteligência
    
    // MOCK SIMPLIFICADO para a fundação arquitetural
    const success = actualOutcome.toLowerCase().includes('sucesso') || actualOutcome.toLowerCase().includes('crescimento');
    
    const confirmedCause = success 
      ? `A premissa ("${pastDecision.assumptions[0] || 'N/A'}") provou-se verdadeira.` 
      : `O risco previsto de "${pastDecision.risksIdentified[0] || 'N/A'}" materializou-se.`;

    const presumedCause = success 
      ? 'Não há divergências a investigar.'
      : 'Possível mudança de cenário macroeconômico (A validar).';
      
    const decisionResponsibility = success
      ? 'Acerto Estratégico'
      : 'Erro de Premissa Interna (Risco assumido pelo Conselho)';

    const lesson = success
      ? `Decisões de ${pastDecision.decisionType} no contexto atual possuem alta resiliência.`
      : `Expansões no contexto atual sem mitigação de riscos tendem a falhar.`;

    return {
      sourceDecisionId: pastDecision.id,
      evidence: `Resultado reportado: ${actualOutcome}`,
      confirmedCause,
      presumedCause,
      decisionResponsibility,
      lesson,
      confidence: success ? 90 : 95,
      approvedBy,
      timestamp: new Date().toISOString()
    };
  }
}
