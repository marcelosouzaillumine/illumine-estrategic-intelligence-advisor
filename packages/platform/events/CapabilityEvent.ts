export interface CapabilityEvent<TPayload> {
  eventId: string;
  eventType: string; // Uses IntelligenceEvents or similar registry enum
  capabilityId: string; // e.g. "executive.conversation.intelligence"
  aggregateId: string; // e.g. the Conversation ID
  tenantId: string;
  workspaceId: string;
  occurredAt: Date;
  version: number;
  correlationId: string; // Links this event back to the user request or conversation flow
  payload: TPayload;
}
