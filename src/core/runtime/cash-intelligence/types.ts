export type CashQualityClassification = 'HEALTHY' | 'ATTENTION' | 'DETERIORATING' | 'CRITICAL';
export type CashConfidenceLevel = 'HIGH' | 'MODERATE' | 'RESTRICTED' | 'BLOCKED';

export interface InstitutionalCashSignal {
  id: string;
  label: string;
  classification: CashQualityClassification;
  confidence: CashConfidenceLevel;
  value?: number;
  displayValue?: string;
  narrative: string;
  lineage: string[];
  disclosures: string[];
}

export interface CashFlowReconciliationReport {
  isReconcilable: boolean;
  variancePercentage: number;
  confidence: CashConfidenceLevel;
  reconciliationStatus: 'RECONCILED' | 'ALLOWED_WITH_DISCLOSURE' | 'RESTRICTED' | 'BLOCKED';
  disclosures: string[];
}

export interface InstitutionalCashSustainabilityReport {
  isAvailable: boolean;
  confidence: CashConfidenceLevel;
  reconciliation: CashFlowReconciliationReport;
  signals: {
    operatingCashIntegrity?: InstitutionalCashSignal;
    earningsCashConversion?: InstitutionalCashSignal;
    liquidityConsumptionVelocity?: InstitutionalCashSignal;
    workingCapitalPressure?: InstitutionalCashSignal;
    debtDependencyPressure?: InstitutionalCashSignal;
    syntheticProfitRisk?: InstitutionalCashSignal;
  };
  overallNarrative: string;
  fiduciaryDisclosures: string[];
}
