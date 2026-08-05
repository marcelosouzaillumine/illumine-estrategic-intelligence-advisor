// @ts-nocheck
import { InferenceResult } from '@/core/intelligence/providers/InferenceResult';
import { IntelligenceArtifact } from '@/core/intelligence/artifacts/IntelligenceArtifact';
import { v4 as uuidv4 } from 'uuid';

export class IntelligenceArtifactFactory {
  create(inference: InferenceResult, validationStatus: "detected" | "validated" | "blocked"): IntelligenceArtifact {
    return {
      id: uuidv4(),
      tenantId: "system-tenant", // In a real app, this comes from AIContext
      source: "conversation",
      artifactType: "signal",
      domain: "strategic", // Mapped from InferenceResult or input context
      confidence: {
        score: inference.confidence.score,
        factors: inference.confidence.uncertaintyFactors || []
      },
      evidence: [], // mapped from extracted signals/evidence
      relatedEntities: [],
      lifecycle: validationStatus === "blocked" ? "detected" : validationStatus,
      createdAt: new Date()
    };
  }
}
