export interface InvestigationSession {
  investigationId: string;
  tenantId: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  targetNodeId: string;
  targetNodeType: string;
  correlationId: string;
  lineageId: string;
}
