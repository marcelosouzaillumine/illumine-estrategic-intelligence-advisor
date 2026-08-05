import { AIProviderPort } from '@/core/intelligence/providers/AIProviderPort';
import { IntelligenceInput } from '@/core/intelligence/providers/IntelligenceInput';
import { AIContext } from '@/core/intelligence/providers/AIContext';
import { InferenceResult } from '@/core/intelligence/providers/InferenceResult';

export class MockAIProvider implements AIProviderPort {
  providerId = "mock-engine";
  capabilities = ["signal.extraction", "insight.generation", "recommendation.creation"];

  async analyze(input: IntelligenceInput, context: AIContext): Promise<InferenceResult> {
    const text = input.content.toLowerCase();

    // Scenario A: High Confidence
    if (text.includes("receita caiu") || text.includes("perdeu margem")) {
      return this.createResult(85, "Margin deterioration detected", ["Revenue Risk", "Margin Decline"]);
    }

    // Scenario B: Low Evidence / Low Confidence
    if (text.includes("talvez") || text.includes("algum problema")) {
      return this.createResult(32, "Potential unidentified issue", []); // Should be blocked by validation
    }

    // Scenario C: Critical Domain (Requires Human Approval)
    if (text.includes("reduzir equipe")) {
      // In a real app, the Governance Policy would detect this domain (People) and set RequiresHumanApproval: TRUE.
      // Here we simulate the AI extracting it confidently, but it will be flagged later in the pipeline/inbox.
      return this.createResult(90, "Headcount reduction suggested", ["People Capability", "Restructuring"]);
    }

    // Default Fallback
    return this.createResult(70, "General strategic analysis", ["Observation"]);
  }

  private createResult(score: number, explanation: string, signals: any[]): InferenceResult {
    return {
      provider: this.providerId,
      model: "rule-based-mock",
      version: "1.0",
      explanation,
      extractedSignals: signals.map(s => ({ type: "mock-signal", description: s })),
      confidence: {
        score,
        dimensions: { evidence: score, dataQuality: score, reasoning: score, historicalAccuracy: score },
        explanation: `Mock score generated as ${score}`,
        uncertaintyFactors: score < 50 ? ["Insufficient data"] : []
      },
      generatedAt: new Date(),
      metadata: { latency: 15, tokenUsage: 0 }
    };
  }
}
