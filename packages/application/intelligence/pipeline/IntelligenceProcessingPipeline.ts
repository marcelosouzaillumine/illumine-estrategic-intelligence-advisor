import { AIProviderPort } from '@/core/intelligence/providers/AIProviderPort';
import { IntelligenceInput } from '@/core/intelligence/providers/IntelligenceInput';
import { AIContext } from '@/core/intelligence/providers/AIContext';
import { IntelligenceValidationEngine } from '../validation/IntelligenceValidationEngine';
import { IntelligenceArtifactFactory } from '../artifacts/IntelligenceArtifactFactory';
import { IntelligenceArtifact } from '@/core/intelligence/artifacts/IntelligenceArtifact';

export class IntelligenceProcessingPipeline {
  constructor(
    private aiProvider: AIProviderPort,
    private validationEngine: IntelligenceValidationEngine,
    private artifactFactory: IntelligenceArtifactFactory
  ) {}

  async process(input: IntelligenceInput, context: AIContext, providerMode: "mock" | "shadow" | "active" = "mock"): Promise<IntelligenceArtifact | null> {
    // 1. Inference Generation (Mock logic runs as baseline if in mock or shadow)
    let primaryInference = await this.aiProvider.analyze(input, context);

    if (providerMode === "shadow") {
      // In a real implementation, we inject the real AIProviderPort here 
      // alongside the Mock AI Provider.
      // const challengerInference = await this.realAiProvider.analyze(input, context);
      // const comparison = this.shadowEvaluator.evaluate(primaryInference, challengerInference);
      // console.log("Shadow Mode Execution - Comparison Logged:", comparison);
      // We purposefully DO NOT use the challenger inference for the rest of the flow.
    } else if (providerMode === "active") {
      // Use real provider directly
      // primaryInference = await this.realAiProvider.analyze(input, context);
    }

    // 2. Policy & Confidence Validation
    const validation = this.validationEngine.validate(primaryInference);

    // 3. Artifact Factory Transformation
    const artifact = this.artifactFactory.create(primaryInference, validation.artifactStatus);

    return artifact;
  }
}
