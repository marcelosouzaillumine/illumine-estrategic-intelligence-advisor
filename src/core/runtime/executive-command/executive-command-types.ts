// src/core/runtime/executive-command/executive-command-types.ts

/**
 * REPRESENTATION DOMAIN
 * 
 * ExecutiveDirective = Orientação fiduciária e operacional sugerida pelo sistema.
 * BoardResolution    = Decisão humana formalmente aprovada.
 */

export type DirectiveCategory = 
  | 'CAPITAL_PRESERVATION'
  | 'LIQUIDITY_STABILIZATION'
  | 'OPERATIONAL_COMPRESSION_MITIGATION'
  | 'GOVERNANCE_RESTRICTION'
  | 'EXPANSION_SUSPENSION'
  | 'TREASURY_PRESERVATION'
  | 'STRUCTURAL_GROWTH';

export type DirectiveSeverity = 'STANDARD' | 'ELEVATED' | 'CRITICAL' | 'RESTRICTIVE';

export interface ExecutiveDirective {
  id: string;
  category: DirectiveCategory;
  title: string;
  statement: string; // The guidance text
  severity: DirectiveSeverity;
  causalDrivers: string[]; // Hashes/Names of drivers that caused this
  lineageHash: string;
  createdAt: string;
  status: 'PENDING_REVIEW' | 'ACKNOWLEDGED' | 'RESOLVED_BY_BOARD' | 'OVERRIDDEN';
}

export interface BoardResolution {
  id: string;
  directiveIdReference?: string;
  decisionHash: string; // Append-only integrity hash
  approvedBy: string; // User ID / Role
  timestamp: string;
  rationale: string;
  resolutionType: 'ADOPTED' | 'MODIFIED' | 'REJECTED';
}

export type DriftSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ExecutiveDriftEvent {
  id: string;
  description: string; // "Observada divergência entre restrição fiduciária e postura operacional..."
  severity: DriftSeverity;
  conflictingDirective?: string; // The directive that is being opposed by action
  observedMetric: string;
  timestamp: string;
  lineageHash: string;
}

export interface InstitutionalAlignmentState {
  overallAlignmentScore: number; // 0 to 100
  treasuryAlignment: 'ALIGNED' | 'DIVERGENT' | 'CRITICAL_TENSION';
  growthAlignment: 'ALIGNED' | 'DIVERGENT' | 'CRITICAL_TENSION';
  continuityAlignment: 'ALIGNED' | 'DIVERGENT' | 'CRITICAL_TENSION';
  alignmentNarrative: string;
}

export interface GovernanceExecutionTracking {
  pendingDirectivesCount: number;
  resolvedDirectivesCount: number;
  recurringDriftCount: number;
  executionRate: number; // % of directives properly addressed via BoardResolution
}

export interface ExecutiveCommandExplainability {
  rationale: string;
  dominantEngine: string;
  supportingLineageHashes: string[];
  governanceConstraintsApplied: string[];
}

export interface StrategicOrchestration {
  primaryFocus: string;
  immediateActionsRetained: string[];
  orchestrationNarrative: string;
}

export interface ExecutiveCommandThesis {
  thesisStatement: string;
  structuralPosture: 'EXPANSIONARY' | 'CAUTIOUS' | 'DEFENSIVE' | 'SURVIVAL';
  confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH';
  lineageHash: string;
}

export interface InstitutionalExecutiveCommandOutput {
  activeDirectives: ExecutiveDirective[];
  driftEvents: ExecutiveDriftEvent[];
  institutionalAlignment: InstitutionalAlignmentState;
  governanceTracking: GovernanceExecutionTracking;
  strategicOrchestration: StrategicOrchestration;
  commandThesis: ExecutiveCommandThesis;
  explainability: ExecutiveCommandExplainability;
}
