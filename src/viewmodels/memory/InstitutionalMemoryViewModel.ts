import { InstitutionalMemoryRecord, MemoryOccurrence } from '../../types/memory/InstitutionalMemoryRecord';

export interface UIMemoryRecord {
  id: string;
  domain: string;
  title: string;
  summary: string;
  date: string;
  status: string;
}

export class InstitutionalMemoryViewModel {
  static adaptMemory(memory: InstitutionalMemoryRecord[]): UIMemoryRecord[] {
    return memory.map(m => ({
      id: m.artifactId,
      domain: m.memoryDomain || 'GENERAL',
      title: m.title,
      summary: m.summary,
      date: new Date(m.createdAt).toLocaleDateString('pt-BR'),
      status: m.status
    }));
  }
}
