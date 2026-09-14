export interface ExecutivePositionSummary {
  status: {
    classification: string;
    narrative: string;
  };
  strengths: Array<{
    title: string;
    explanation: string;
  }>;
  attentionPoints: Array<{
    title: string;
    explanation: string;
    relatedSignalId?: string;
  }>;
  centralQuestion: {
    question: string;
    origin?: string;
  };
}
