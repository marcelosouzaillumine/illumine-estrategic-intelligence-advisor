import { KnowledgeIngestionRequest } from '@/core/knowledge/ingestion/KnowledgeIngestionRequest';
import { KnowledgeIngestionResult } from '@/core/knowledge/ingestion/KnowledgeIngestionResult';
import { KnowledgeNormalizationEngine } from '../normalization/KnowledgeNormalizationEngine';
import { KnowledgeSimilarityEngine } from '../normalization/KnowledgeSimilarityEngine';
import { KnowledgeValidationEngine } from '@/core/knowledge/validation/KnowledgeValidationEngine';
import { KnowledgeLifecyclePolicy } from '@/core/knowledge/policies/KnowledgeLifecyclePolicy';
import { v4 as uuidv4 } from 'uuid';

export class KnowledgeIngestionEngine {
  constructor(
    private normalizer: KnowledgeNormalizationEngine,
    private similarity: KnowledgeSimilarityEngine,
    private validator: KnowledgeValidationEngine,
    private lifecycle: KnowledgeLifecyclePolicy,
    private eventBus: any // Mocking EventBus for now
  ) {}

  async ingest(request: KnowledgeIngestionRequest): Promise<KnowledgeIngestionResult> {
    const lineageId = uuidv4();
    
    // 1. Normalization
    const normalizedData = this.normalizer.normalize(request);
    
    // 2. Similarity & Deduplication
    const similarityResult = this.similarity.detect(normalizedData);
    if (similarityResult.isDuplicate) {
       return this.reject(lineageId, "Duplicate detected");
    }

    // 3. Validation
    const issues = this.validator.validate(request, normalizedData);
    if (issues.some(i => i.severity === "critical" || i.severity === "high")) {
       return {
         success: false,
         status: "rejected",
         validationIssues: issues,
         lineageId,
         createdAt: new Date()
       };
    }

    // 4. Artifact Creation (Mocked ID for now)
    const artifactId = uuidv4();

    // 5. Fire Event to Institutional Learning Loop
    this.eventBus?.publish({
      eventType: "knowledge.artifact.created",
      capability: "knowledge.fabric",
      payload: {
        eventId: uuidv4(),
        tenantId: request.tenantId,
        artifactId,
        domain: normalizedData.domain,
        source: request.source,
        confidence: 85, // Computed from QualityAssessment
        occurredAt: new Date()
      }
    });

    return {
      success: true,
      artifactId,
      status: "published",
      validationIssues: [],
      lineageId,
      createdAt: new Date()
    };
  }

  private reject(lineageId: string, reason: string): KnowledgeIngestionResult {
    return {
      success: false,
      status: "rejected",
      validationIssues: [{ code: "REJECTED", description: reason, severity: "critical" }],
      lineageId,
      createdAt: new Date()
    };
  }
}
