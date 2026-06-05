import { PresentationLayer } from './ExecutiveAudienceProfile';

export interface VisibilityPolicy {
  section: string;
  visibleIn: PresentationLayer[];
}

export const PRESENTATION_POLICIES: VisibilityPolicy[] = [
  // DFC & EQE sections
  { section: 'DFC_SNAPSHOT', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_EXECUTIVE_DIAGNOSIS', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_BOARD_PRIORITIES', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_RUNWAY', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_BOARD_ADVISORY', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_RECONCILIATION_SUMMARY', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  
  { section: 'DFC_CONTEXT', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_CQS_SUMMARY', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_CAUSAL_INTELLIGENCE', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_REVENUE_CASH_CONVERSION', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_SHAREHOLDER_DEPENDENCY', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_EFSI', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_EQE_SUMMARY', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },

  { section: 'DFC_EARLY_WARNING', visibleIn: ['TECHNICAL'] },
  { section: 'DFC_SCENARIO_SIMULATION', visibleIn: ['TECHNICAL'] },
  { section: 'DFC_TECHNICAL_LAYER', visibleIn: ['TECHNICAL'] },
  { section: 'DFC_EQE_LINEAGE', visibleIn: ['TECHNICAL'] },
  
  // Board Pack
  { section: 'BOARD_PACK_EXECUTIVE_SUMMARY', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'BOARD_PACK_TECHNICAL_APPENDIX', visibleIn: ['TECHNICAL'] },

  // DRE sections
  { section: 'DRE_DIAGNOSTICO', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DRE_DECISION_SUPPORT', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DRE_HEALTH_SCORE', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DRE_ADVISORY', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  
  { section: 'DRE_ESTRUTURA_ECONOMICA', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  { section: 'DRE_CONSUMO_ECONOMICO', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  { section: 'DRE_BREAK_EVEN', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  
  { section: 'DRE_TECHNICAL_LAYER', visibleIn: ['TECHNICAL'] }
];
