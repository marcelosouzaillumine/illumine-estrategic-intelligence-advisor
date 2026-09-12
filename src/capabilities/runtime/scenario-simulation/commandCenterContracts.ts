export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IncidentSupervisionState {
  incidentId: string;
  tenantId: string;
  title: string;
  severity: IncidentSeverity;
  status: 'OPEN' | 'UNDER_ANALYSIS' | 'RESOLVED' | 'SUPPRESSED';
  escalatedTo: 'MANAGEMENT' | 'CFO' | 'BOARD' | 'NONE';
  detectedAt: string;
  resolvedAt?: string;
  lineageHash: string;
  correlationId: string;
}

export interface EscalationTopologyHook {
  hookId: string;
  triggerSeverity: IncidentSeverity;
  targetRole: 'MANAGEMENT' | 'CFO' | 'BOARD';
  isActive: boolean;
  routingRule: string;
}
