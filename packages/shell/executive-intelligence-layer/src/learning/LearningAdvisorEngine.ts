import { LearningEvent } from './LearningEvent';
import { DecisionMemoryRecord } from './DecisionMemoryRecord';

/**
 * Assessor de Aprendizado Contínuo.
 * NÃO TOMA DECISÕES. Apenas intercepta a intenção executiva atual e a cruza
 * com a memória institucional da organização para resgatar falhas ou acertos passados.
 */
export class LearningAdvisorEngine {
  /**
   * Resgata a memória institucional aplicável ao contexto atual.
   * @param proposedDecision A intenção de decisão que o conselho está debatendo.
   * @param currentBusinessState O contexto macroeconômico atual da empresa.
   * @param learningHistory Audit trail de aprendizados anteriores (LearningEvents).
   * @param decisionHistory Audit trail de decisões originais.
   */
  public static consultInstitutionalMemory(
    proposedDecision: string,
    currentBusinessState: string,
    learningHistory: LearningEvent[],
    decisionHistory: DecisionMemoryRecord[]
  ): string | null {
    
    // Filtra decisões passadas do mesmo tipo que ocorreram em estado semelhante
    const relevantDecisions = decisionHistory.filter(d => 
      d.decisionType === proposedDecision && 
      d.contextSnapshot.financialState === currentBusinessState // Matching do objeto estruturado
    );

    if (relevantDecisions.length === 0) return null;

    // Busca aprendizados gerados por essas decisões
    const relevantLearnings = learningHistory.filter(l => 
      relevantDecisions.some(d => d.id === l.sourceDecisionId)
    );

    if (relevantLearnings.length === 0) return null;

    // Constrói o aviso baseado na memória (exibindo a lição de maior confiança/severidade)
    // Para simplificar a arquitetura inicial, pegamos a lição mais recente:
    const mostRecentLearning = relevantLearnings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    return `Memória Institucional Detectada: Em contextos similares (${currentBusinessState}), decisões de ${proposedDecision} falharam no passado devido à premissa refutada. Lição aprendida (Confiança: ${mostRecentLearning.confidence}%): "${mostRecentLearning.lesson}". É recomendada extrema cautela na aprovação atual.`;
  }
}
