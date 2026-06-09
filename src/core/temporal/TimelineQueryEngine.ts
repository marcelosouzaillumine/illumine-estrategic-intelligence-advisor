import { TimelineRepository } from './TimelineRepository';
import { TimelineEvent } from '../../types/temporal/TimelineEvent';
import { TemporalProvenanceRecord } from '../../types/temporal/TemporalProvenanceRecord';

/**
 * Timeline Query Engine
 * 
 * Consultas determinísticas focadas em recuperar o estado cronológico.
 */
export class TimelineQueryEngine {
  constructor(private readonly repository: TimelineRepository) {}

  async findFirstAppearance(tenantId: string, timelineId: string, nodeId: string): Promise<TimelineEvent | null> {
    const events = await this.repository.getEvents(tenantId, timelineId);
    const nodeEvents = events.filter(e => e.sourceNodeId === nodeId || e.targetNodeId === nodeId);
    if (nodeEvents.length === 0) return null;
    
    return nodeEvents.reduce((first, current) => 
      new Date(current.timestamp) < new Date(first.timestamp) ? current : first
    );
  }

  async findLastOccurrence(tenantId: string, timelineId: string, nodeId: string): Promise<TimelineEvent | null> {
    const events = await this.repository.getEvents(tenantId, timelineId);
    const nodeEvents = events.filter(e => e.sourceNodeId === nodeId || e.targetNodeId === nodeId);
    if (nodeEvents.length === 0) return null;
    
    return nodeEvents.reduce((last, current) => 
      new Date(current.timestamp) > new Date(last.timestamp) ? current : last
    );
  }

  async findEvolutionPath(tenantId: string, timelineId: string, nodeId: string): Promise<TimelineEvent[]> {
    const events = await this.repository.getEvents(tenantId, timelineId);
    return events
      .filter(e => e.sourceNodeId === nodeId || e.targetNodeId === nodeId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async findHistoricalDependencies(tenantId: string, timelineId: string, nodeId: string): Promise<TimelineEvent[]> {
    const events = await this.repository.getEvents(tenantId, timelineId);
    return events
      .filter(e => e.sourceNodeId === nodeId && e.eventType === 'RELATIONSHIP_CREATED')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async findHistoricalEvidence(tenantId: string, provenanceId: string): Promise<TemporalProvenanceRecord | null> {
    return this.repository.getProvenanceRecord(tenantId, provenanceId);
  }
}
