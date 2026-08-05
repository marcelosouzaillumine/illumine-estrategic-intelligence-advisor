import { IntelligenceInput } from './IntelligenceInput';
import { AIContext } from './AIContext';
import { InferenceResult } from './InferenceResult';

export interface AIProviderPort {
  providerId: string; // e.g. "openai-enterprise", "anthropic-claude"
  capabilities: string[]; // e.g. ["financial_analysis", "executive_synthesis", "compliance_check"]
  
  analyze(
    input: IntelligenceInput,
    context: AIContext
  ): Promise<InferenceResult>;
}
