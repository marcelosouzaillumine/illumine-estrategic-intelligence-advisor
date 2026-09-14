import { MemoryRecord } from './MemoryRecord';
import { KnowledgeEvent } from './KnowledgeEvent';

export interface InstitutionalMemory {
  readonly records: readonly MemoryRecord[];
  readonly knowledgeEvents: readonly KnowledgeEvent[];
  readonly lastUpdated: string;
}
