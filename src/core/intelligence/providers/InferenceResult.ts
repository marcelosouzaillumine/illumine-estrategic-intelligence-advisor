import { ConfidenceAssessment } from '../confidence/ConfidenceAssessment';

export interface InferenceResult {
  provider: string; // AI provider name
  model: string;    // specific model version used
  version: string;  // prompt/pipeline version
  explanation: string; // Human-readable justification of the result
  extractedSignals: any[]; // The raw extracted objects
  confidence: ConfidenceAssessment;
  generatedAt: Date;
  metadata: {
    latency: number;
    tokenUsage?: number;
  };
}
