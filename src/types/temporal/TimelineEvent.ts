export type TimelineEventType = 
  | 'NODE_CREATED'
  | 'NODE_UPDATED'
  | 'NODE_DELETED'
  | 'RELATIONSHIP_CREATED'
  | 'RELATIONSHIP_DELETED'
  | 'DECISION_APPROVED'
  | 'RISK_EMERGED';

export interface TimelineEvent {
  eventId: string;
  timestamp: string;
  eventType: TimelineEventType;
  sourceNodeId?: string;
  targetNodeId?: string;
  description: string;
  correlationId: string;
  lineageId: string;
}
