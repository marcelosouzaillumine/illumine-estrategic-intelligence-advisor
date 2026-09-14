export interface AdvisorClientContext {
  organizationId: string;
  organizationName: string;
  organizationType: 'CORPORATION' | 'HOLDING' | 'NON_PROFIT' | 'FAMILY_OFFICE';
  
  // Observational Governance Stage (Derived from ESGIM / Digital Twin)
  governanceStage: 'EARLY' | 'GROWTH' | 'MATURE' | 'TRANSITION' | 'UNKNOWN';
  
  activeRisks: number;
  activeOpportunities: number;
  activeInvestigations: number;
  
  // Last observation date by the advisor
  lastAccessedAt: string;
}
