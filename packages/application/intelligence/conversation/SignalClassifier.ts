import { ExecutiveConversation } from '@/core/intelligence/conversation/ExecutiveConversation';
import { IntelligenceArtifact } from '@/core/intelligence/artifacts/IntelligenceArtifact';

export class SignalClassifier {
  async classify(conversation: ExecutiveConversation): Promise<IntelligenceArtifact[]> {
    // Logic to extract factual signals from conversation messages
    // Return artifactType="signal"
    return [];
  }
}
