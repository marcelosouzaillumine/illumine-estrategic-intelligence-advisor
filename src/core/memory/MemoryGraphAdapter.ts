import { InstitutionalMemoryRecord } from '../../types/memory/InstitutionalMemoryRecord';

export class MemoryGraphAdapter {
  static adaptMemoryToGraphNode(memory: InstitutionalMemoryRecord) {
    return {
      id: memory.artifactId,
      type: 'MEMORY',
      label: memory.title,
      properties: {
        memoryDomain: memory.memoryDomain,
        summary: memory.summary,
        status: memory.status
      },
      tenantId: memory.tenantId
    };
  }
}
