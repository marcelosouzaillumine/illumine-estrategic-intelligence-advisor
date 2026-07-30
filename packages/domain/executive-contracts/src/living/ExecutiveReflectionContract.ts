export interface ExecutiveReflectionContract {
  readonly reflectionId: string;
  readonly dateIso: string;
  readonly primaryDecisionQuestionText: string;
  readonly userPrimaryDecisionAnswerText?: string;
  readonly isOutcomePositive?: boolean;
  readonly keyLearningToRegisterText?: string;
  readonly followUpForTomorrowText?: string;
  readonly isPersistedInWisdom: boolean;
}
