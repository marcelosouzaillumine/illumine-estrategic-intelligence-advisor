import { InstitutionalMemoryRepository } from './InstitutionalMemoryRepository';
import { MemoryOccurrence, MemoryTimeline, InstitutionalMemoryRecord, MemoryRelationship } from '../../types/memory/InstitutionalMemoryRecord';

export class InstitutionalMemoryRuntime {
  constructor(private readonly repository: InstitutionalMemoryRepository) {}

  async findFirstOccurrence(tenantId: string, memoryId: string): Promise<MemoryOccurrence | null> {
    const occurrences = await this.repository.loadOccurrences(tenantId, memoryId);
    if (!occurrences.length) return null;
    return occurrences.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }

  async findHistoricalRecurrence(tenantId: string, memoryId: string): Promise<MemoryTimeline | null> {
    return this.repository.loadHistoricalContexts(tenantId, memoryId);
  }

  async findRelatedDecisions(tenantId: string, memoryId: string): Promise<MemoryRelationship[]> {
    return this.repository.loadRelatedEvents(tenantId, memoryId);
  }

  async findHistoricalImpacts(tenantId: string, memoryId: string): Promise<MemoryRelationship[]> {
    const relationships = await this.repository.loadRelatedEvents(tenantId, memoryId);
    return relationships.filter(r => r.relationshipType === 'CAUSES');
  }
}
