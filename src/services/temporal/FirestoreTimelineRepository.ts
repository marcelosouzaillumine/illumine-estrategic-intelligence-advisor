import { TimelineRepository } from '../../core/temporal/TimelineRepository';
import { InstitutionalTimeline } from '../../types/temporal/InstitutionalTimeline';
import { TemporalSnapshot } from '../../types/temporal/TemporalSnapshot';
import { TimelineEvent } from '../../types/temporal/TimelineEvent';
import { TemporalLineage } from '../../types/temporal/TemporalLineage';
import { InstitutionalMilestone } from '../../types/temporal/InstitutionalMilestone';
import { TemporalProvenanceRecord } from '../../types/temporal/TemporalProvenanceRecord';

/**
 * Adapter para Firestore.
 * Em produção real, este arquivo integraria com a API do Firebase/Firestore,
 * injetando o Firebase App ou chamadas HTTP para o backend Sovereign.
 * Para garantir execução offline e tipagem determinística, esta é
 * a estrutura de Mock que suporta testes sem rede.
 */
export class FirestoreTimelineRepository implements TimelineRepository {
  
  async getTimeline(tenantId: string, timelineId: string): Promise<InstitutionalTimeline | null> {
    // Fail-closed isolation check
    if (!tenantId) throw new Error("TENANT_ID_REQUIRED");
    return null; // A ser mockado/integrado
  }

  async getSnapshots(tenantId: string, timelineId: string): Promise<TemporalSnapshot[]> {
    if (!tenantId) throw new Error("TENANT_ID_REQUIRED");
    return [];
  }

  async getEvents(tenantId: string, timelineId: string): Promise<TimelineEvent[]> {
    if (!tenantId) throw new Error("TENANT_ID_REQUIRED");
    return [];
  }

  async getSnapshotById(tenantId: string, snapshotId: string): Promise<TemporalSnapshot | null> {
    if (!tenantId) throw new Error("TENANT_ID_REQUIRED");
    return null;
  }

  async getEventById(tenantId: string, eventId: string): Promise<TimelineEvent | null> {
    if (!tenantId) throw new Error("TENANT_ID_REQUIRED");
    return null;
  }

  async getLineage(tenantId: string, sourceSnapshotId: string, targetSnapshotId: string): Promise<TemporalLineage | null> {
    if (!tenantId) throw new Error("TENANT_ID_REQUIRED");
    return null;
  }

  async getMilestones(tenantId: string, timelineId: string): Promise<InstitutionalMilestone[]> {
    if (!tenantId) throw new Error("TENANT_ID_REQUIRED");
    return [];
  }

  async getProvenanceRecord(tenantId: string, provenanceId: string): Promise<TemporalProvenanceRecord | null> {
    if (!tenantId) throw new Error("TENANT_ID_REQUIRED");
    return null;
  }
}
