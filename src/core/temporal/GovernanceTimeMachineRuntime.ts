import { TimelineRepository } from './TimelineRepository';
import { InstitutionalTimeline } from '../../types/temporal/InstitutionalTimeline';
import { TemporalSnapshot } from '../../types/temporal/TemporalSnapshot';
import { TimelineEvent } from '../../types/temporal/TimelineEvent';
import { TemporalLineage } from '../../types/temporal/TemporalLineage';

/**
 * Governance Time Machine Runtime
 * 
 * Camada de orquestração puramente determinística.
 * NENHUM cálculo, inferência, re-execução de motores fiduciários
 * ou geração de probabilidade ocorre aqui. 
 * Recupera apenas fatos cronológicos persistidos.
 */
export class GovernanceTimeMachineRuntime {
  constructor(private readonly repository: TimelineRepository) {}

  async loadTimeline(tenantId: string, timelineId: string): Promise<InstitutionalTimeline | null> {
    return this.repository.getTimeline(tenantId, timelineId);
  }

  async compareSnapshots(tenantId: string, sourceSnapshotId: string, targetSnapshotId: string): Promise<TemporalLineage | null> {
    // Retorna a lineage pré-calculada pelo repositório. O runtime não realiza diff.
    return this.repository.getLineage(tenantId, sourceSnapshotId, targetSnapshotId);
  }

  async reconstructPath(tenantId: string, timelineId: string, endSnapshotId: string): Promise<TemporalSnapshot[]> {
    const snapshots = await this.repository.getSnapshots(tenantId, timelineId);
    // Ordenar logicamente pelo tempo até o endSnapshot
    const endSnap = snapshots.find(s => s.snapshotId === endSnapshotId);
    if (!endSnap) return [];

    return snapshots
      .filter(s => new Date(s.createdAt) <= new Date(endSnap.createdAt))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async loadInstitutionalHistory(tenantId: string, timelineId: string): Promise<{ snapshots: TemporalSnapshot[], events: TimelineEvent[] }> {
    const [snapshots, events] = await Promise.all([
      this.repository.getSnapshots(tenantId, timelineId),
      this.repository.getEvents(tenantId, timelineId)
    ]);
    return { snapshots, events };
  }

  async loadEventSequence(tenantId: string, timelineId: string): Promise<TimelineEvent[]> {
    const events = await this.repository.getEvents(tenantId, timelineId);
    return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
}
