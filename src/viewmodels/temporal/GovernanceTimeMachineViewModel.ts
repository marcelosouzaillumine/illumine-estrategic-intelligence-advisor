import { GovernanceTimeMachineRuntime } from '../../core/temporal/GovernanceTimeMachineRuntime';
import { TimelineQueryEngine } from '../../core/temporal/TimelineQueryEngine';
import { InstitutionalTimeline } from '../../types/temporal/InstitutionalTimeline';
import { TemporalSnapshot } from '../../types/temporal/TemporalSnapshot';
import { TimelineEvent } from '../../types/temporal/TimelineEvent';
import { TemporalLineage } from '../../types/temporal/TemporalLineage';
import { InstitutionalMilestone } from '../../types/temporal/InstitutionalMilestone';
import { TemporalProvenanceRecord } from '../../types/temporal/TemporalProvenanceRecord';

export class GovernanceTimeMachineViewModel {
  constructor(
    private readonly runtime: GovernanceTimeMachineRuntime,
    private readonly queryEngine: TimelineQueryEngine
  ) {}

  async fetchHistoricalContext(tenantId: string, timelineId: string): Promise<{
    timeline: InstitutionalTimeline | null;
    snapshots: TemporalSnapshot[];
    events: TimelineEvent[];
  }> {
    const timeline = await this.runtime.loadTimeline(tenantId, timelineId);
    if (!timeline) return { timeline: null, snapshots: [], events: [] };
    
    const history = await this.runtime.loadInstitutionalHistory(tenantId, timelineId);
    return {
      timeline,
      snapshots: history.snapshots,
      events: history.events
    };
  }

  async fetchSnapshotComparison(tenantId: string, sourceSnapshotId: string, targetSnapshotId: string): Promise<TemporalLineage | null> {
    return this.runtime.compareSnapshots(tenantId, sourceSnapshotId, targetSnapshotId);
  }

  async fetchNodeEvolution(tenantId: string, timelineId: string, nodeId: string): Promise<TimelineEvent[]> {
    return this.queryEngine.findEvolutionPath(tenantId, timelineId, nodeId);
  }

  async fetchMilestones(tenantId: string, timelineId: string): Promise<InstitutionalMilestone[]> {
    const timeline = await this.runtime.loadTimeline(tenantId, timelineId);
    return timeline?.milestones || [];
  }

  async fetchProvenance(tenantId: string, provenanceId: string): Promise<TemporalProvenanceRecord | null> {
    return this.queryEngine.findHistoricalEvidence(tenantId, provenanceId);
  }
}
