import { InstitutionalArtifact } from '../../../../../types/data-fabric/InstitutionalArtifact';

export interface InstitutionalMemoryRecord extends InstitutionalArtifact {
  memoryDomain: string; // Ex: 'RISK', 'FINANCE', 'COMPLIANCE'
  summary: string;
  factIds: string[]; // Fatos atrelados à memória
}

export interface MemoryRelationship {
  relationshipId: string;
  sourceMemoryId: string;
  targetMemoryId: string;
  relationshipType: 'CAUSES' | 'MITIGATES' | 'PRECEDES' | 'RELATES_TO';
}

export interface MemoryOccurrence {
  occurrenceId: string;
  memoryId: string;
  date: string;
  context: string;
  evidenceIds: string[];
}

export interface MemoryTimeline {
  timelineId: string;
  memoryId: string;
  occurrences: MemoryOccurrence[];
}
