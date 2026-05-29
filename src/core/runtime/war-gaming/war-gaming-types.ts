// src/core/runtime/war-gaming/war-gaming-types.ts

export type CrisisType = 
  | 'TREASURY_COLLAPSE'
  | 'SUPPLIER_SHOCK'
  | 'REVENUE_COMPRESSION'
  | 'MARGIN_COLLAPSE'
  | 'COVENANT_PRESSURE'
  | 'INVENTORY_FREEZE'
  | 'CAPITAL_DRAIN'
  | 'FUNDING_RETRACTION'
  | 'LIQUIDITY_RUPTURE'
  | 'OPERATIONAL_PARALYSIS'
  | 'HYBRID_SHOCK';

export interface CrisisInput {
  id: string;
  type: CrisisType;
  description: string;
  magnitude: number; // e.g., 0.45 for a 45% drop
  targetVariable: string; // e.g., 'Receita Líquida' or 'Supplier Days'
  durationMonths: number;
}

export interface InstitutionalWarGameScenario {
  scenarioId: string;
  baselineHash: string;
  crisisInputs: CrisisInput[];
  simulationHash?: string;
  status: 'PENDING' | 'EXECUTING' | 'BLOCKED_BY_CONSTRAINT' | 'COMPLETED';
}

export interface CrisisPropagationNode {
  nodeId: string;
  variable: string;
  baselineValue: number;
  simulatedValue: number;
  variancePercentage: number;
  severity: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA' | 'RUPTURA';
  causalLinkTo?: string; // Next node in domino effect
  rationale: string;
}

export interface TreasurySurvivalProfile {
  availableRunwayMonths: number;
  exhaustionPointReached: boolean;
  criticalCovenantBreached: boolean;
  liquidityDrainVelocity: number;
  survivalNarrative: string;
}

export interface StrategicResponseOption {
  responseId: string;
  title: string;
  description: string;
  interventions: { variable: string; delta: number }[]; // e.g., reduce fixed cost by 10%
}

export interface ResponseComparisonResult {
  baselineScenarioId: string;
  responses: {
    responseId: string;
    resultingRunway: number;
    resultingLiquidity: number;
    resultingSeverity: string;
    tradeOffNarrative: string;
  }[];
}

export interface CrisisExplainabilityProfile {
  lineageHash: string;
  scenarioHash: string;
  activatedChains: string[];
  brokenConstraints: string[];
  escalatedPressures: string[];
  institutionalStressExplanation: string;
  fiduciaryWarnings: string[];
}

export interface InstitutionalSurvivalThesis {
  resilienceScore: number; // 0-100
  sustainabilityStatus: 'PRESERVADA' | 'PRESSIONADA' | 'DETERIORADA' | 'INSUSTENTÁVEL';
  fiduciaryPressureLevel: 'BAIXA' | 'MODERADA' | 'ALTA' | 'EXTREMA';
  structuralDeteriorationEvidence: string[];
  thesisStatement: string;
}

export interface WarGameResult {
  scenario: InstitutionalWarGameScenario;
  propagation: CrisisPropagationNode[];
  treasurySurvival: TreasurySurvivalProfile;
  thesis: InstitutionalSurvivalThesis;
  explainability: CrisisExplainabilityProfile;
}
