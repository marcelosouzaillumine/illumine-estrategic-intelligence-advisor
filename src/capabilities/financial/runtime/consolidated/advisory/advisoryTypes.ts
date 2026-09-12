import { RuntimeConfidence, RuntimeViolation } from '../../../../../runtime/types';
import { ConsolidatedFinancialOutput, EliminationRecord } from '../types';

export type InstitutionalRole = 
  | 'HOLDING_PATRIMONIAL'
  | 'HOLDING_OPERACIONAL'
  | 'SUBSIDIARIA_OPERACIONAL'
  | 'SPE'
  | 'CENTRO_ADMINISTRATIVO'
  | 'VEICULO_FINANCEIRO'
  | 'UNIDADE_DEFICITARIA'
  | 'UNIDADE_ESTRATEGICA';

export type SystemicRiskType = 
  | 'LIQUIDITY_CHAIN_COLLAPSE'
  | 'DEBT_CONCENTRATION'
  | 'SYSTEMIC_DEPENDENCY'
  | 'DOMINO_EFFECT'
  | 'TREASURY_CONTAMINATION'
  | 'FRAGILITY_CONSOLIDATION';

export type CausalityType = 
  | 'ARTIFICIAL_GROWTH'
  | 'OPERATIONAL_PARASITISM'
  | 'CROSS_REVENUE_DEPENDENCY'
  | 'INTERCOMPANY_FUNDING'
  | 'ARTIFICIAL_SUBSIDIZATION'
  | 'REVENUE_CONCENTRATION'
  | 'DEBT_CONCENTRATION';

export interface HoldingRoleAnalysis {
  entityId: string;
  inferredRole: InstitutionalRole;
  isTreasuryAbsorber: boolean;
  isOperational: boolean;
  justification: string;
}

export interface DependencyAnalysis {
  sourceEntityId: string;
  targetEntityId: string;
  dependencyType: 'FUNDING' | 'REVENUE' | 'DEBT' | 'GUARANTEE';
  materialityPercentage: number; // Ex: 45% of revenue comes from intercompany
  description: string;
}

export interface CrossEntityCausality {
  causalityType: CausalityType;
  primaryEntityId: string;
  secondaryEntityId?: string;
  impactScale: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  financialEvidence: {
    metric: string;
    value: number;
    context: string;
  };
}

export interface SystemicRisk {
  riskType: SystemicRiskType;
  triggerEntityId: string;
  impactedEntities: string[];
  severity: 'WARNING' | 'ELEVATED' | 'SEVERE' | 'CRITICAL';
  description: string;
  potentialDominoEffect: boolean;
}

export interface ConsolidatedExecutiveAdvisoryReport {
  groupId: string;
  baseConfidence: RuntimeConfidence;
  finalConfidence: RuntimeConfidence;
  structuralRoles: HoldingRoleAnalysis[];
  dependencies: DependencyAnalysis[];
  causalities: CrossEntityCausality[];
  systemicRisks: SystemicRisk[];
  narrative: string;
  strategicAlerts: string[];
  violations: RuntimeViolation[];
}
