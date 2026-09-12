import { ExecutivePriority } from './ExecutivePriorityResolver';
import { ExecutivePresentationLabelRegistry } from '../../../workspace/runtime/presentation-governance/ExecutivePresentationLabelRegistry';

export interface NormalizedPriority {
  theme: string;
  impact: string;
  recommendation: string;
}

export class DFCBoardPriorityPresentationAdapter {
  /**
   * Normalizes raw ExecutivePriority records into executive-safe formats,
   * avoiding any technical domain IDs or severity codes.
   */
  public static adapt(priorities: ExecutivePriority[]): NormalizedPriority[] {
    return priorities.map(p => {
      // 1. Resolve Theme Registry Key
      let themeKey = 'DFC_PRIORITY_LIQUIDITY_PRESERVATION';
      if (p.sourceModule === 'DFC') {
        const text = (p.title + ' ' + p.rationale).toLowerCase();
        if (text.includes('queima') || text.includes('consumo') || text.includes('runway')) {
          themeKey = 'DFC_PRIORITY_LIQUIDITY_PRESERVATION';
        } else if (text.includes('conversão') || text.includes('receita') || text.includes('faturamento')) {
          themeKey = 'DFC_PRIORITY_CASH_CONVERSION';
        } else {
          themeKey = 'DFC_PRIORITY_CAPITAL_INDEPENDENCE';
        }
      } else if (p.sourceModule === 'BP') {
        themeKey = 'DFC_PRIORITY_LIQUIDITY_PRESERVATION';
      } else if (p.sourceModule === 'DLPA') {
        themeKey = 'DFC_PRIORITY_CAPITAL_INDEPENDENCE';
      } else if (p.sourceModule === 'DRE') {
        themeKey = 'DFC_PRIORITY_CASH_CONVERSION';
      }

      // 2. Resolve Impact Registry Key
      let impactKey = 'IMPACT_MODERATE';
      if (p.severity === 'CRITICAL') {
        impactKey = 'IMPACT_VERY_HIGH';
      } else if (p.severity === 'HIGH') {
        impactKey = 'IMPACT_HIGH';
      } else if (p.severity === 'MODERATE') {
        impactKey = 'IMPACT_MODERATE';
      } else {
        impactKey = 'IMPACT_MODERATE';
      }

      return {
        theme: ExecutivePresentationLabelRegistry.getLabel(themeKey),
        impact: ExecutivePresentationLabelRegistry.getLabel(impactKey),
        recommendation: p.title
      };
    });
  }
}
