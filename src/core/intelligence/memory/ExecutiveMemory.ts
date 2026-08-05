export interface MemoryEntry {
  id: string;
  type: 'DECISION' | 'OUTCOME' | 'LESSON' | 'INSIGHT';
  timestamp: string;
  content: string;
  context: Record<string, any>;
  tags: string[];
}

export interface ExecutiveMemory {
  retrieveRelevantMemories(context: any): Promise<MemoryEntry[]>;
  storeMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<void>;
  getMemoryTrace(): MemoryEntry[];
}
