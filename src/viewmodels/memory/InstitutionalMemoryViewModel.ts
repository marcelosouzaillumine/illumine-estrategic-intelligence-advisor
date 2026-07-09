import { InstitutionalMemoryRecord, MemoryOccurrence } from '../../types/memory/InstitutionalMemoryRecord';

export interface UIMemoryRecord {
  id: string;
  domain: string;
  title: string;
  summary: string;
  date: string;
  status: string;
}

/**
 * @deprecated Use `src/viewmodels/governance/useInstitutionalMemoryViewModel.ts` instead.
 * This class is scheduled for removal in HCA-003.
 */
export class InstitutionalMemoryViewModel {
  // Dummy Fiduciary Contract
  public static state = {};
  public static computed = {};
  public static actions = {};

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
