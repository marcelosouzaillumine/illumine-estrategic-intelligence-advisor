export interface CognitiveEmbeddingMetadata {
  tenantId: string;
  organizationId: string;
  sourceType: string;
  sourceId: string;
  createdAt: Date;
  confidentialityLevel: string;
}

export interface MemoryQuery {
  queryText: string;
  filters?: Record<string, any>;
}

export interface ScopedMemoryResult {
  memoryId: string;
  content: string;
  metadata: CognitiveEmbeddingMetadata;
  similarity: number;
}

export interface InstitutionalMemory {
  id: string;
  tenantId: string;
  organizationId: string;
  content: string;
  sourceType: string;
}
