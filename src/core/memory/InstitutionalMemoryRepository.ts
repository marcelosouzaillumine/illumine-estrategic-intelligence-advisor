import { InstitutionalMemoryRecord, MemoryOccurrence, MemoryRelationship, MemoryTimeline } from '../../types/memory/InstitutionalMemoryRecord';
import { InstitutionalFact } from '../../types/data-fabric/InstitutionalFact';

export interface InstitutionalMemoryRepository {
  loadMemory(tenantId: string, organizationId: string): Promise<InstitutionalMemoryRecord[]>;
  loadOccurrences(tenantId: string, memoryId: string): Promise<MemoryOccurrence[]>;
  loadRelatedEvents(tenantId: string, memoryId: string): Promise<MemoryRelationship[]>;
  loadHistoricalContexts(tenantId: string, memoryId: string): Promise<MemoryTimeline | null>;
  loadFacts(tenantId: string, factIds: string[]): Promise<InstitutionalFact[]>;
}

export class MockInstitutionalMemoryRepository implements InstitutionalMemoryRepository {
  async loadMemory(tenantId: string, organizationId: string): Promise<InstitutionalMemoryRecord[]> { return []; }
  async loadOccurrences(tenantId: string, memoryId: string): Promise<MemoryOccurrence[]> { return []; }
  async loadRelatedEvents(tenantId: string, memoryId: string): Promise<MemoryRelationship[]> { return []; }
  async loadHistoricalContexts(tenantId: string, memoryId: string): Promise<MemoryTimeline | null> { return null; }
  async loadFacts(tenantId: string, factIds: string[]): Promise<InstitutionalFact[]> { return []; }
}
