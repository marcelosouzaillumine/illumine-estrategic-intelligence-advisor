export enum DecisionEventType {
  DecisionViewed = 'DecisionViewed',
  ClarificationRequested = 'ClarificationRequested',
  AdjustmentRequested = 'AdjustmentRequested',
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

export interface DecisionEvent {
  id: string;
  decisionRequestId: string;
  type: DecisionEventType;
  actorId: string;
  timestamp: string;
  metadata?: any;
}
