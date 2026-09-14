export type ConstitutionalStatus = 'COMPLIANT' | 'ATTENTION' | 'RESTRICTED' | 'VIOLATED' | 'FAIL_CLOSED';

export interface ConstitutionalAxiomStatus {
  axiom: string;
  status: ConstitutionalStatus;
  description: string;
}

export interface ConstitutionalRestriction {
  type: string;
  level: 'MODERATE' | 'HIGH' | 'CRITICAL' | 'BLOCKED';
  description: string;
  origin: string;
}

export interface ConstitutionalEnforcementAction {
  actionId: string;
  trigger: string;
  description: string;
  timestamp: string;
  severity: 'WARNING' | 'INTERVENTION' | 'VETO' | 'QUARANTINE';
}

export interface ConstitutionalOverride {
  overrideId: string;
  target: string;
  reason: string;
  approvedBy: string;
  timestamp: string;
}

export interface ConstitutionalQuarantineState {
  isQuarantined: boolean;
  reason: string;
  activatedAt: string;
  suppressedSystems: string[];
}

export interface ConfidenceBreakdown {
  overallConfidence: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' | 'FAIL_CLOSED';
  completenessScore: number;
  historicalDepthMonths: number;
  runtimeConsistency: 'CONSISTENT' | 'DEGRADED' | 'BROKEN';
  lineageContinuity: 'UNBROKEN' | 'PARTIAL' | 'ORPHANED';
}

export interface ConstitutionalLineageInformation {
  constitutionalHash: string;
  runtimeHash: string;
  propagationLineage: string[];
  evidenceCount: number;
  traceabilityStatus: 'FULLY_TRACEABLE' | 'PARTIALLY_TRACEABLE' | 'UNTRACEABLE';
}

export interface ConstitutionalGovernanceDashboardOutput {
  constitutionalStatus: ConstitutionalStatus;
  axiomStatus: ConstitutionalAxiomStatus[];
  restrictions: ConstitutionalRestriction[];
  enforcementActions: ConstitutionalEnforcementAction[];
  overrides: ConstitutionalOverride[];
  quarantineState?: ConstitutionalQuarantineState;
  confidenceBreakdown?: ConfidenceBreakdown;
  lineageInformation?: ConstitutionalLineageInformation;
  constitutionalNarrative?: string;
}
