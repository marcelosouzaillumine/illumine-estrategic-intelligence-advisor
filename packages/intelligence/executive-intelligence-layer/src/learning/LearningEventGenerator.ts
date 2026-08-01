import { DecisionOutcome, DecisionRecord } from '../governance/DecisionRecord';

export class LearningEventGenerator {
  /**
   * Transforma um resultado empírico (DecisionOutcome) e o contexto de uma decisão (DecisionRecord)
   * em conhecimento institucional e premissas causais para futuras decisões.
   */
  public static generateLearningEvent(record: DecisionRecord, outcome: DecisionOutcome): DecisionOutcome {
    const updatedOutcome = { ...outcome, lessonsLearned: [...outcome.lessonsLearned] };
    
    // Análise de premissas validadas vs desafiadas
    const wasOverridden = record.approval.signature?.humanOverride;
    
    if (outcome.successStatus === 'FAILURE' || outcome.successStatus === 'PARTIAL') {
      const failedMetrics = outcome.variance?.filter(v => v.status === 'UNDERPERFORMED').map(v => v.metric).join(', ');
      
      let lesson = `Em decisões de tipo '${record.decisionContext.decisionType}' no contexto de '${record.decisionContext.financialState}', a métrica(s) [${failedMetrics}] sub-performou. `;
      
      if (wasOverridden) {
        lesson += `A decisão sofreu override humano aceitando risco '${record.approval.signature?.riskAcceptance}'. Recomenda-se revisar as premissas: ${record.deliberation.premisesChallenged.join(', ')}.`;
      } else {
        lesson += `O modelo sugeriu a decisão com ${record.approval.signature?.confidenceScore}% de confiança. Pode haver variáveis externas não mapeadas impactando a liquidez ou crescimento.`;
      }
      
      updatedOutcome.lessonsLearned.push(lesson);
    } else if (outcome.successStatus === 'SUCCESS') {
      updatedOutcome.lessonsLearned.push(
        `Estratégia '${record.intention.proposedDecision}' validada para o cenário '${record.decisionContext.financialState}'. O modelo manteve assertividade nos ganhos de ${outcome.variance?.map(v => v.metric).join(', ')}.`
      );
    }
    
    return updatedOutcome;
  }
}
