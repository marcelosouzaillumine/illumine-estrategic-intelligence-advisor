import { ExecutiveMaturityBenchmark } from './ExecutiveMaturityBenchmark';
import { DecisionMemoryRecord } from '../learning/DecisionMemoryRecord';
import { LearningEvent } from '../learning/LearningEvent';

export class MaturityBenchmarkEngine {
  /**
   * Avalia a maturidade de inteligência institucional da empresa baseada no seu 
   * histórico fiduciário e velocidade de aprendizado.
   */
  public static evaluate(
    decisions: DecisionMemoryRecord[], 
    learnings: LearningEvent[]
  ): ExecutiveMaturityBenchmark {
    
    // Métrica 1: Governança (Taxa de decisões com responsáveis e premissas explícitas)
    const governedDecisions = decisions.filter(d => d.responsibleExecutives.length > 0 && d.assumptions.length > 0);
    const governanceScore = decisions.length === 0 ? 0 : Math.round((governedDecisions.length / decisions.length) * 100);

    // Métrica 2: Aprendizado (Taxa de decisões que fecharam o loop e geraram um LearningEvent)
    const learningScore = decisions.length === 0 ? 0 : Math.round((learnings.length / decisions.length) * 100);

    // Métrica 3 e 4: (Mockadas temporariamente para compor a fundação arquitetural)
    const anticipationScore = 65; // placeholder
    const executionScore = 70; // placeholder

    const overallMaturityIndex = Math.round((governanceScore + anticipationScore + learningScore + executionScore) / 4);

    return {
      governanceScore,
      anticipationScore,
      learningScore,
      executionScore,
      overallMaturityIndex
    };
  }
}
