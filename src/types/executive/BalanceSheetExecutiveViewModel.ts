import { BalanceSheetInstitutionalContextViewModel, BalanceSheetAuditLayerViewModel } from '../../components/pages/balance-sheet/view-models';

export type DisplayLabel = string;
export type DisplayStatus = string;
export type DisplayNarrative = string;
export type DisplayValue = string | number;

export interface ExecutiveFieldOrigin {
  sourceEngine: string;
  sourceRule: string;
  confidence: number | string;
  lastValidatedAt: string;
}

export interface ExecutivePlanActionViewModel {
  prazo: DisplayLabel;
  acao: DisplayNarrative;
  origin: ExecutiveFieldOrigin;
}

export interface ExecutiveEvidenceViewModel {
  name: DisplayLabel;
  value: DisplayValue;
  healthyRange?: DisplayValue;
  interpretation?: DisplayNarrative;
  origin: ExecutiveFieldOrigin;
}

export interface TechnicalIndicatorViewModel {
  familyName: DisplayLabel;
  label: DisplayLabel;
  formula: DisplayNarrative;
  value: DisplayValue;
  classificationLabel: DisplayStatus | null;
  purpose: DisplayNarrative;
  limitations: DisplayNarrative;
  referenceRange: DisplayValue;
  methodologicalNotes: DisplayNarrative;
  origin: ExecutiveFieldOrigin;
}

export interface DecisionPanelViewModel {
  dimension: DisplayLabel;
  statusBadgeVariant: 'success' | 'warning' | 'critical' | 'neutral' | 'info';
  statusLabel: DisplayStatus;
  opinion: DisplayNarrative;
  driver: DisplayNarrative;
  implication: DisplayNarrative;
  action: DisplayNarrative;
  confidence: DisplayLabel;
  score?: number;
  evidences: ExecutiveEvidenceViewModel[];
  origin: ExecutiveFieldOrigin;
}

export interface BalanceSheetExecutiveViewModel {
  // Dummy Fiduciary Contract
  state?: any;
  computed?: any;
  actions?: any;

  // Strategic Diagnosis
  strategicSeverity: DisplayStatus;
  strategicSeverityReason: DisplayNarrative;
  dominantRiskFamily: DisplayLabel;
  patrimonialThesis: DisplayNarrative;
  diagnosisOrigin: ExecutiveFieldOrigin;

  // Executive Plan
  planFinanceiro: ExecutivePlanActionViewModel;
  planOperacional: ExecutivePlanActionViewModel;
  planGovernanca: ExecutivePlanActionViewModel;
  planOrigin: ExecutiveFieldOrigin;

  // Panels
  decisionPanels: {
    protection?: DecisionPanelViewModel;
    liquidity?: DecisionPanelViewModel;
    capitalStructure?: DecisionPanelViewModel;
    workingCapital?: DecisionPanelViewModel;
    capitalEfficiency?: DecisionPanelViewModel;
    assetQuality?: DecisionPanelViewModel;
  };
  
  // Technical Layer
  technicalIndicators: TechnicalIndicatorViewModel[];
  
  // Consistency State
  isConsistent: boolean;
  consistencyViolations?: string[];

  // SIS Consistency
  institutionalScenario?: {
    scenario: string;
    confidence: string;
    primaryDriver: string;
    secondaryDriver: string;
    severity: string;
    policyProfile: string;
    liquidityIntent?: string;
  };
  policyProfile?: string;
  executiveOpinion?: DisplayNarrative;
  criticalFactor?: DisplayNarrative;
  managementImplication?: DisplayNarrative;
  recommendedAction?: DisplayNarrative;

  // Missing components
  institutionalContext?: BalanceSheetInstitutionalContextViewModel;
  auditLayer?: BalanceSheetAuditLayerViewModel;
  decisionTrace?: any[]; // Array of trace nodes
  technicalLayer?: { families: { familyName: string; indicators: TechnicalIndicatorViewModel[] }[] };
}
