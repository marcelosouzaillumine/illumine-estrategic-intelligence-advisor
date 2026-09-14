export interface FinancialProvenance {
    diagnosisId?: string;
    ruleId?: string;
    indicatorIds?: string[];
    factIds?: string[]; // IDs from FinancialIndicatorsFact or Statements
    companyId: string;
    periodId: string;
    sourceVersion: string; // e.g., 'FPS-v1.0'
    journalEntryRefs?: string[];
}

export interface IntelligenceTraceability {
    insightId: string;
    generatedAt: Date;
    engineVersion: string;
    provenance: FinancialProvenance;
}
