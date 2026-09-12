import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';
import { NarrativeHierarchyBlock } from './types';

export class ExecutiveNarrativeHierarchyEngine {
  /**
   * Maps a resolved ExecutiveIntelligenceReport into a structured 5-level narrative block.
   */
  public static buildBlock(report: ExecutiveIntelligenceReport): NarrativeHierarchyBlock {
    return {
      level1: `${report.severity.level}: ${report.advisory.priorityFocus || report.severity.justification}`,
      level2: report.causality.rootCause || 'Sem causa raiz estrutural mapeada pelo Runtime.',
      level3: report.causality.financialPropagation || 'Nenhuma propagação operacional reportada pelo Runtime.',
      level4: report.causality.strategicImpact || 'Nenhum impacto estratégico reportado pelo Runtime.',
      level5: report.advisory.actionMatrix && report.advisory.actionMatrix.length > 0
        ? report.advisory.actionMatrix.join(' | ')
        : 'Monitorar os indicadores regulares fiduciários.'
    };
  }
}
