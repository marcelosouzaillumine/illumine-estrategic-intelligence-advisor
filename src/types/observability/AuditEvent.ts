export type EventSeverity = "INFO" | "WARNING" | "CRITICAL" | "ERROR";

export interface InstitutionalAuditEvent {
  eventId: string;
  eventType: string;
  severity: EventSeverity;
  timestamp: string;
  
  // Tenant Context
  tenantId: string;
  clientId?: string;
  userId: string;
  role: string;
  
  // Traceability
  correlationId: string;
  lineageId: string;
  decisionChainId?: string;
  
  // Runtime Context
  engineId: string;
  runtimeAuthority: string;
  
  // Flow Context
  sourceModule: string;
  targetOutput: string;
  
  // Custom Data
  metadata?: Record<string, unknown>;
}
