export interface IOSLineageReference {
  executionId: string;
  sourceDomains: string[];
  alertIds?: string[];
  simulationIds?: string[];
  playbookIds?: string[];
  timestamp: string;
  lineageHash: string;
}

export interface InstitutionalPulse {
  pulseId: string;
  tenantId: string;
  systemicPressureScore: number; // 0 to 1
  operationalSaturationScore: number; // 0 to 1
  governanceStabilityScore: number; // 0 to 1
  resilienceTrend: 'WORSENING' | 'STABLE' | 'IMPROVING';
  lineage: IOSLineageReference;
}

export interface InstitutionalTimelineEvent {
  eventId: string;
  tenantId: string;
  domain: string;
  eventType: 'ALERT' | 'SIMULATION' | 'PLAYBOOK_ACTIVATION' | 'WORKFLOW_STRESS';
  title: string;
  description: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface OperationalDependency {
  dependencyId: string;
  bottleneckNode: string;
  impactedWorkflows: string[];
  criticality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface InstitutionalContext {
  contextId: string;
  tenantId: string;
  primaryStressVector: string;
  recoveryMomentum: 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE';
  description: string;
}

export interface OperationalProjection {
  projectionId: string;
  domain: string;
  projectedState: string;
  timeframeMonths: number;
}

export interface InstitutionalState {
  stateId: string;
  tenantId: string;
  pulse: InstitutionalPulse;
  context: InstitutionalContext;
  dependencies: OperationalDependency[];
  timeline: InstitutionalTimelineEvent[];
  projections: OperationalProjection[];
  timestamp: string;
  synchronizationTrace: string;
}
