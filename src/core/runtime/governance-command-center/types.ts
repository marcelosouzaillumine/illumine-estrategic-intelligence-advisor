export type GovernanceIncidentType =
  | 'FIDUCIARY_ESCALATION'
  | 'LIQUIDITY_PRESSURE'
  | 'OPERATIONAL_DETERIORATION'
  | 'CROSS_ENTITY_CONTAGION'
  | 'GOVERNANCE_BREACH'
  | 'EXECUTION_FAILURE'
  | 'SYSTEMIC_RISK'
  | 'RUNTIME_DEGRADATION'
  | 'AUDIT_INTEGRITY_FAILURE'
  | 'TENANT_ISOLATION_VIOLATION';

export type GovernanceIncidentSeverity =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL'
  | 'SYSTEMIC';

export type GovernanceIncidentStatus =
  | 'OPEN'
  | 'ACKNOWLEDGED'
  | 'UNDER_SUPERVISION'
  | 'ESCALATED'
  | 'CONTAINED'
  | 'RESOLVED'
  | 'FAIL_CLOSED';

export type GovernanceSupervisionMode =
  | 'EXECUTIVE'
  | 'CFO'
  | 'ADVISORY'
  | 'OPERATIONS'
  | 'BOARD';

export type RuntimeHealthStatus =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'PARTIAL'
  | 'FAIL_CLOSED';

export type EscalationTopologyState =
  | 'CONTAINED'
  | 'PROPAGATING'
  | 'CRITICAL_CHAIN'
  | 'SYSTEMIC_CONTAGION';

export type SupervisionActionType =
  | 'ACKNOWLEDGE'
  | 'SUPERVISION'
  | 'ESCALATION'
  | 'CONTAINMENT'
  | 'RESOLUTION';

/**
 * Evento de supervisão append-only que altera ou enriquece o ciclo de vida
 * do incidente sem modificar o registro original.
 */
export interface GovernanceSupervisionEvent {
  eventId: string;
  incidentId: string;
  tenantId: string;
  correlationId: string;
  lineageHash: string;
  actorId: string;
  timestamp: string;
  supervisionAction: SupervisionActionType;
  details?: string;
}

/**
 * Registro de incidente de governança imutável
 */
export interface GovernanceIncident {
  incidentId: string;
  tenantId: string;
  type: GovernanceIncidentType;
  severity: GovernanceIncidentSeverity;
  title: string;
  description: string;
  detectedAt: string;
  lineageHash: string;
  correlationId: string;
  sourceRuntimeReferences: string[];
  entityId: string;
}

export interface RuntimeHealthState {
  status: RuntimeHealthStatus;
  integrityPercentage: number; // 0-100
  failedLineageCount: number;
  lastTraceTime: string;
  hasBrokenPropagation: boolean;
  telemetryContinuous: boolean;
}

export interface EscalationTopology {
  state: EscalationTopologyState;
  criticalPropagationChain: string[];
  contagionRiskLevel: number; // 0-100
}

export interface MultiTenantSupervision {
  activeTenantsCount: number;
  tenantStressMap: Record<string, number>;
  crossTenantRiskTrends: string[];
}
