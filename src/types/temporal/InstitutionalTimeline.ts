import { TimelineEvent } from './TimelineEvent';
import { TemporalSnapshot } from './TemporalSnapshot';
import { TemporalLineage } from './TemporalLineage';
import { InstitutionalMilestone } from './InstitutionalMilestone';
import { TemporalProvenanceRecord } from './TemporalProvenanceRecord';

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
