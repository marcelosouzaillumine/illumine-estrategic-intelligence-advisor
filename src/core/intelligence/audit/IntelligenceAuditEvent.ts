export interface IntelligenceAuditEvent {
  eventId: string;
  artifactId: string;
  action: string; // e.g., 'STATUS_CHANGE', 'CONFIDENCE_UPDATE', 'DECISION_MADE'
  actor: {
    type: "ai" | "human" | "system";
    id: string; // userId, AI model ID, or system component ID
  };
  previousState: string;
  newState: string;
  reason: string;
  timestamp: Date;
  correlationId: string; // crucial for building the Intelligence Graph
}
