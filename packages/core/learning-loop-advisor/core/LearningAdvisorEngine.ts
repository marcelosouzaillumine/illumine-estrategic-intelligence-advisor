import { MemoryRepository } from '../../institutional-memory/repositories/MemoryRepository';
import { DecisionMemoryRecord } from '../../institutional-memory/models/DecisionMemoryRecord';

export class LearningAdvisorEngine {
  constructor(private memoryRepo: MemoryRepository) {}

  /**
   * Enriquece avaliações executivas com memória institucional contextual.
   * Não prescreve decisões, apenas amplifica a capacidade de decisão com base na história.
   */
  async enrichExecutiveEvaluation(
    organizationId: string, 
    currentContextKeywords: string[]
  ): Promise<string | null> {
    const similarDecisions = await this.memoryRepo.findSimilarDecisions(organizationId, currentContextKeywords, 3);
    
    if (similarDecisions.length === 0) {
      return null;
    }

    // Instiga o executivo sem tomar a decisão por ele
    // "Esta decisão já aconteceu antes? Qual era o contexto? Qual hipótese sustentava? Qual foi o resultado? O que aprendemos?"
    
    let advisoryMessage = `Histórico Institucional Encontrado: Identificamos ${similarDecisions.length} decisão(ões) anterior(es) com contexto similar.\n\n`;
    
    similarDecisions.forEach((decision, index) => {
      advisoryMessage += `[Decisão ${index + 1} - ${decision.decisionDate.toISOString().split('T')[0]}]\n`;
      advisoryMessage += `- Intenção: ${decision.intent?.strategicObjective || 'Não registrada'}\n`;
      if (decision.lessonsLearned) {
        advisoryMessage += `- Aprendizado Institucional: ${decision.lessonsLearned.text}\n`;
      }
      advisoryMessage += '\n';
    });
    
    advisoryMessage += `Pergunta Executiva: Deseja revisar alguma premissa desta nova decisão com base nestes aprendizados institucionais históricos?`;

    return advisoryMessage;
  }
}
