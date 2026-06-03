import { PresentationLayer } from './ExecutiveAudienceProfile';

export interface VisibilityPolicy {
  section: string;
  visibleIn: PresentationLayer[];
}

export const PRESENTATION_POLICIES: VisibilityPolicy[] = [
  // DFC & EQE sections
  { section: 'DFC_CONTEXTO', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_HEALTH_SCORE', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_DIAGNOSTICO_EXECUTIVO', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_RUNWAY', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_ADVISORY', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_TOP_3_PRIORITIES', visibleIn: ['BOARD', 'EXECUTIVE', 'TECHNICAL'] },
  
  { section: 'DFC_SHAREHOLDER_DEPENDENCY', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_REVENUE_CONVERSION', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_INTERMEDIATE_INDICATORS', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  { section: 'DFC_LIQUIDITY_STRESS', visibleIn: ['EXECUTIVE', 'TECHNICAL'] },
  
  { section: 'DFC_RECONCILIATION_DETAIL', visibleIn: ['TECHNICAL'] },
  { section: 'DFC_LINEAGE', visibleIn: ['TECHNICAL'] },
  { section: 'DFC_FORMULAS', visibleIn: ['TECHNICAL'] },
  { section: 'DFC_RECLASSIFIED_FCO', visibleIn: ['TECHNICAL'] },
  { section: 'DFC_ADJUSTED_FLOWS', visibleIn: ['TECHNICAL'] },
  { section: 'DFC_CQS_COMPONENTS', visibleIn: ['TECHNICAL'] },
  { section: 'DFC_AUDIT', visibleIn: ['TECHNICAL'] },

  // EQE
  { section: 'EQE_LINEAGE', visibleIn: ['TECHNICAL'] },
  { section: 'EQE_COMPLETE', visibleIn: ['TECHNICAL'] },
  
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
