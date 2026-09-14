import { TimelineEvent } from '../../../../../types/temporal/TimelineEvent';
import { TemporalSnapshot } from '../../../../../types/temporal/TemporalSnapshot';
import { TemporalLineage } from '../../../../../types/temporal/TemporalLineage';
import { InstitutionalMilestone } from '../../../../../types/temporal/InstitutionalMilestone';
import { TemporalProvenanceRecord } from '../../../../../types/temporal/TemporalProvenanceRecord';

export interface InstitutionalTimeline {
  timelineId: string;
  tenantId: string;
  startDate: string;
  endDate?: string;
  
  // Historical context
  events: TimelineEvent[];
  snapshots: TemporalSnapshot[];
  
  // Advanced features (Enhancements)
  lineages?: TemporalLineage[];
  milestones?: InstitutionalMilestone[];
  provenanceRecords?: TemporalProvenanceRecord[];
}
