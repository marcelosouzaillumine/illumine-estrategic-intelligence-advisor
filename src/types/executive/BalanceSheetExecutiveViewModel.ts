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

export interface ExecutiveObservationViewModel {
  contexto: DisplayLabel;
  observacao: DisplayNarrative;
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

export interface AnalysisPanelViewModel {
  dimension: DisplayLabel;
  statusBadgeVariant: 'success' | 'warning' | 'critical' | 'neutral' | 'info';
  statusLabel: DisplayStatus;
  opinion: DisplayNarrative;
  driver: DisplayNarrative;
  implication: DisplayNarrative;
  technicalObservation: DisplayNarrative;
  executiveQuestion?: DisplayNarrative;
  confidence: DisplayLabel;
  score?: number;
  evidences: ExecutiveEvidenceViewModel[];
  origin: ExecutiveFieldOrigin;
}

export type DecisionPanelViewModel = AnalysisPanelViewModel;

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
  observacaoFinanceira?: ExecutiveObservationViewModel;
  observacaoOperacional?: ExecutiveObservationViewModel;
  observacaoGovernanca?: ExecutiveObservationViewModel;
  observacaoOrigin?: ExecutiveFieldOrigin;

  // Panels
  analysisPanels: {
    protection?: AnalysisPanelViewModel;
    liquidity?: AnalysisPanelViewModel;
    capitalStructure?: AnalysisPanelViewModel;
    workingCapital?: AnalysisPanelViewModel;
    capitalEfficiency?: AnalysisPanelViewModel;
    assetQuality?: AnalysisPanelViewModel;
  };
  
  // Legacy / deprecated fields
  decisionPanels?: Record<string, AnalysisPanelViewModel>;
  decisionTrace?: any[];

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
  technicalObservation?: DisplayNarrative;

  // Missing components
  institutionalContext?: BalanceSheetInstitutionalContextViewModel;
  auditLayer?: BalanceSheetAuditLayerViewModel;
  evidenceTrace?: any[]; // Array of trace nodes
  technicalLayer?: { families: { familyName: string; indicators: TechnicalIndicatorViewModel[] }[] };
}
