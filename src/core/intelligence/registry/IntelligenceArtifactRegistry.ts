import { ExecutiveArtifact } from '../contracts/schema/v1/ExecutiveArtifact.schema';
import { SchemaValidator } from '../validation/SchemaValidator';

export interface IntelligenceArtifactRegistry {
  save(artifact: ExecutiveArtifact): Promise<void>;
  findByExecutionId(id: string): Promise<ExecutiveArtifact | null>;
  findByCapability(capabilityId: string): Promise<ExecutiveArtifact[]>;
}

/**
 * InMemory implementation of the IntelligenceArtifactRegistry for the stabilization phase.
 * In production, this would be a Postgres/Firebase adapter.
 */
export class InMemoryIntelligenceArtifactRegistry implements IntelligenceArtifactRegistry {
  private artifacts: ExecutiveArtifact[] = [];

  async save(artifact: ExecutiveArtifact): Promise<void> {
    // Ensuring the artifact is perfectly valid before saving it to Institutional Memory
    SchemaValidator.validate(artifact);
    this.artifacts.push(artifact);
  }

  async findByExecutionId(id: string): Promise<ExecutiveArtifact | null> {
    const found = this.artifacts.find(a => a.meta.executionId === id);
    return found || null;
  }

  async findByCapability(capabilityId: string): Promise<ExecutiveArtifact[]> {
    // Note: assuming pipelineId/capabilityId is tracked in meta or knowledgeContext
    // Right now meta has pipelineId. Let's use that as proxy.
    return this.artifacts.filter(a => a.meta.pipelineId === capabilityId);
  }
}
