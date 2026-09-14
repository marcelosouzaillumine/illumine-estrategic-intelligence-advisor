import { LearningEvent } from '../models/LearningEvent';

export class LessonSynthesizer {
  /**
   * Transforma o Learning Event em um aprendizado consolidado legível.
   */
  static synthesize(event: LearningEvent): string {
    // Exemplo de síntese baseada em evidência (Regra 1)
    if (event.evidence.length === 0) {
      throw new Error("Cannot synthesize lesson without evidence.");
    }

    return `Lesson derived from decision ${event.sourceDecisionId}: ${event.interpretation}`;
  }
}
