export type MonitoringSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
export type MonitoringScope = 'TENANT' | 'WORKSPACE' | 'GROUP' | 'ENTITY';

export interface AlertLineageReference {
  executionId?: string;
  scenarioId?: string;
  reportVersion?: string;
  snapshotHash?: string;
  sourceContext: string;
}

export interface MonitoringAlert {
  alertId: string;
  tenantId: string;
  workspaceId: string;
  groupId?: string;
  ruleId: string;
  severity: MonitoringSeverity;
  message: string;
  lineage: AlertLineageReference;
  timestamp: string;
  status: 'ACTIVE' | 'RESOLVED' | 'ESCALATED' | 'SUPPRESSED';
}

export interface MonitoringExecutionRecord {
  monitoringExecutionId: string;
  tenantId: string;
  scheduleMode: 'MANUAL' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  alertsGenerated: number;
  durationMs: number;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'THROTTLED';
}

export interface ConfidenceTrend {
  trendId: string;
  groupId: string;
  previousConfidence: string;
  currentConfidence: string;
  driftDetected: boolean;
  timestamp: string;
}

export interface SystemicRiskTrend {
  trendId: string;
  groupId: string;
  accelerationRate: number; // 0 to 1
  isAccelerating: boolean;
  timestamp: string;
}

export interface LiquidityHealthSignal {
  groupId: string;
  healthScore: number; // 0 to 100
  runwayMonths: number;
  isDeteriorating: boolean;
  timestamp: string;
}

export interface GovernanceEscalation {
  escalationId: string;
  alertId: string;
  previousSeverity: MonitoringSeverity;
  newSeverity: MonitoringSeverity;
  reason: string;
  timestamp: string;
}

export interface MonitoringRule {
  ruleId: string;
  name: string;
  description: string;
  defaultSeverity: MonitoringSeverity;
  evaluate: (context: any) => MonitoringAlert | null;
}
