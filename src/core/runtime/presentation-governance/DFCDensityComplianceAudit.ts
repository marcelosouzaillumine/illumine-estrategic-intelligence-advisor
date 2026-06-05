import { PresentationLayer } from './ExecutiveAudienceProfile';

export interface DensityAuditResult {
  status: 'PASS' | 'DFC_DENSITY_VIOLATION';
  details?: string;
}

export class DFCDensityComplianceAudit {
  /**
   * Audits the currently visible section IDs against the audience density layer
   * to prevent any technical leaks in executive presentations.
   */
  public static audit(visibleSections: string[], layer: PresentationLayer): DensityAuditResult {
    if (layer === 'BOARD') {
      const prohibited = [
        'DFC_CONTEXT',
        'DFC_CQS_SUMMARY',
        'DFC_CAUSAL_INTELLIGENCE',
        'DFC_REVENUE_CASH_CONVERSION',
        'DFC_SHAREHOLDER_DEPENDENCY',
        'DFC_EFSI',
        'DFC_EQE_SUMMARY',
        'DFC_EARLY_WARNING',
        'DFC_SCENARIO_SIMULATION',
        'DFC_TECHNICAL_LAYER',
        'DFC_EQE_LINEAGE'
      ];
      
      for (const section of visibleSections) {
        if (prohibited.includes(section)) {
          return {
            status: 'DFC_DENSITY_VIOLATION',
            details: `Section ${section} is prohibited under BOARD mode.`
          };
        }
      }
    } else if (layer === 'EXECUTIVE') {
      const prohibited = [
        'DFC_EARLY_WARNING',
        'DFC_SCENARIO_SIMULATION',
        'DFC_TECHNICAL_LAYER',
        'DFC_EQE_LINEAGE'
      ];
      
      for (const section of visibleSections) {
        if (prohibited.includes(section)) {
          return {
            status: 'DFC_DENSITY_VIOLATION',
            details: `Section ${section} is prohibited under EXECUTIVE mode.`
          };
        }
      }
    }
    
    return { status: 'PASS' };
  }
}
