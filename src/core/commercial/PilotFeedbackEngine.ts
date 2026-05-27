export interface ExecutiveFeedback {
  feedbackId: string;
  tenantId: string;
  sessionId: string;
  actorId: string;
  confidencePerception: number; // 1 to 5
  narrativeClarity: number;      // 1 to 5
  valuePerception: number;      // 1 to 5
  excessiveNoise: number;       // 1 to 5
  irrelevantWarnings: number;    // 1 to 5
  confusionPoints: string;
  timestamp: string;
}

export class PilotFeedbackEngine {
  private static feedbacks: ExecutiveFeedback[] = [];

  /**
   * Clears feedbacks for testing.
   */
  public static clearForTest(): void {
    this.feedbacks = [];
  }

  /**
   * Registers a new feedback log.
   */
  public static registerFeedback(input: Omit<ExecutiveFeedback, 'feedbackId' | 'timestamp'>): ExecutiveFeedback {
    if (!input.tenantId || input.tenantId.trim() === '') {
      throw new Error('[Feedback Engine] tenantId obrigatório.');
    }
    if (!input.sessionId || input.sessionId.trim() === '') {
      throw new Error('[Feedback Engine] sessionId obrigatório.');
    }
    if (!input.actorId || input.actorId.trim() === '') {
      throw new Error('[Feedback Engine] actorId obrigatório.');
    }

    // Validate 1 to 5 scales
    const validateScale = (val: number, field: string) => {
      if (typeof val !== 'number' || val < 1 || val > 5) {
        throw new Error(`[Feedback Engine] O campo ${field} deve ser uma nota de 1 a 5.`);
      }
    };

    validateScale(input.confidencePerception, 'confidencePerception');
    validateScale(input.narrativeClarity, 'narrativeClarity');
    validateScale(input.valuePerception, 'valuePerception');
    validateScale(input.excessiveNoise, 'excessiveNoise');
    validateScale(input.irrelevantWarnings, 'irrelevantWarnings');

    const feedback: ExecutiveFeedback = {
      feedbackId: `FEED-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      ...input,
      timestamp: new Date().toISOString()
    };

    this.feedbacks.push(feedback);
    return feedback;
  }

  /**
   * Returns feedbacks for a specific tenant.
   */
  public static getFeedbackByTenant(tenantId: string): ExecutiveFeedback[] {
    if (!tenantId) return [];
    return this.feedbacks.filter(f => f.tenantId === tenantId);
  }
}
