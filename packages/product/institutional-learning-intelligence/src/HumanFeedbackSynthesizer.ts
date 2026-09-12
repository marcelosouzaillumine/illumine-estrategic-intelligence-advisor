export class HumanFeedbackSynthesizer {
  public static synthesizeHumanFeedback(feedbackText: string, ratingScore: number): {
    readonly synthesizedNotes: string;
    readonly qualitativeScore: number;
  } {
    return {
      synthesizedNotes: `Chancela Executiva: ${feedbackText}`,
      qualitativeScore: Math.min(5, Math.max(1, ratingScore))
    };
  }
}
