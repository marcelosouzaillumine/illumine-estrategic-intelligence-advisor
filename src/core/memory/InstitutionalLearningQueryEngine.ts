import { InstitutionalMemoryRuntime } from './InstitutionalMemoryRuntime';
import { MemoryOccurrence } from '../../types/memory/InstitutionalMemoryRecord';

/**
 * Motor de Consulta Observacional.
 * Sem IA, sem sugestão de caminhos. Apenas responder com base nos dados brutos.
 */
export class InstitutionalLearningQueryEngine {
  constructor(private readonly memoryRuntime: InstitutionalMemoryRuntime) {}

  async countRecurrences(tenantId: string, memoryId: string): Promise<number> {
    const timeline = await this.memoryRuntime.findHistoricalRecurrence(tenantId, memoryId);
    return timeline ? timeline.occurrences.length : 0;
  }

  async getFirstOccurrence(tenantId: string, memoryId: string): Promise<MemoryOccurrence | null> {
    return this.memoryRuntime.findFirstOccurrence(tenantId, memoryId);
  }

  async getHistoricalContexts(tenantId: string, memoryId: string): Promise<string[]> {
    const timeline = await this.memoryRuntime.findHistoricalRecurrence(tenantId, memoryId);
    return timeline ? timeline.occurrences.map(o => o.context) : [];
  }
}
