import { InstitutionalTimeline } from '../../types/temporal/InstitutionalTimeline';
import { TemporalSnapshot } from '../../types/temporal/TemporalSnapshot';
import { TimelineEvent } from '../../types/temporal/TimelineEvent';
import { TemporalLineage } from '../../types/temporal/TemporalLineage';
import { InstitutionalMilestone } from '../../types/temporal/InstitutionalMilestone';
import { TemporalProvenanceRecord } from '../../types/temporal/TemporalProvenanceRecord';

export interface TimelineRepository {
  getTimeline(tenantId: string, timelineId: string): Promise<InstitutionalTimeline | null>;
  getSnapshots(tenantId: string, timelineId: string): Promise<TemporalSnapshot[]>;
  getEvents(tenantId: string, timelineId: string): Promise<TimelineEvent[]>;
  getSnapshotById(tenantId: string, snapshotId: string): Promise<TemporalSnapshot | null>;
  getEventById(tenantId: string, eventId: string): Promise<TimelineEvent | null>;
  
  // Enhancements
  getLineage(tenantId: string, sourceSnapshotId: string, targetSnapshotId: string): Promise<TemporalLineage | null>;
  getMilestones(tenantId: string, timelineId: string): Promise<InstitutionalMilestone[]>;
  getProvenanceRecord(tenantId: string, provenanceId: string): Promise<TemporalProvenanceRecord | null>;
}
