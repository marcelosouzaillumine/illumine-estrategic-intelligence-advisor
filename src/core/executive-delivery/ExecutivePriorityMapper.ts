import { ExecutiveIntelligenceReport } from '../runtime/executive-intelligence-runtime';

export interface MappedPriority {
  id: string;
  title: string;
  description: string;
  priorityLevel?: string;
  priorityRank?: number;
  severityOrder?: number;
  recommendedFocusArea?: string;
}

export interface PriorityMapperResult {
  status: 'SUCCESS' | 'INSUFFICIENT_PRIORITY_DATA';
  priorities: MappedPriority[];
}

export class ExecutivePriorityMapper {
  /**
   * Passive mapper for priorities already declared in the ExecutiveIntelligenceReport.
   * NEVER calculates priority, ranks severity, compares scores to decide order, or creates new focus areas.
   */
  public static map(report: ExecutiveIntelligenceReport): PriorityMapperResult {
    if (!report) {
      throw new Error('[Executive Priority Mapper] Relatório inválido.');
    }

    const reportAny = report as any;
    
    // Check if the runtime officially provided any explicit priority/severity order metadata
    const priorityRank = reportAny.priorityRank || reportAny.advisory?.priorityRank;
    const priorityLevel = reportAny.priorityLevel || reportAny.advisory?.priorityLevel;
    const severityOrder = reportAny.severityOrder || reportAny.advisory?.severityOrder;
    const recommendedFocusAreas = reportAny.recommendedFocusAreas || reportAny.advisory?.recommendedFocusAreas;

    // If none of the sequencing metadata is present, preserve the original order of the report and return INSUFFICIENT_PRIORITY_DATA
    if (!priorityRank && !priorityLevel && !severityOrder && !recommendedFocusAreas) {
      const originalActions = report.advisory?.actionMatrix || [];
      const priorities: MappedPriority[] = originalActions.map((action, index) => ({
        id: `PRIO-ORIG-${index}`,
        title: `Ação Recomendada ${index + 1}`,
        description: action,
      }));

      return {
        status: 'INSUFFICIENT_PRIORITY_DATA',
        priorities,
      };
    }

    // If they exist, we map them passivamente using the structures provided by the runtime.
    // We do NOT compute priorities or decide ranks; we just read and format the runtime outputs.
    let rawPriorities: any[] = [];
    if (Array.isArray(recommendedFocusAreas)) {
      rawPriorities = recommendedFocusAreas;
    } else if (Array.isArray(priorityRank)) {
      rawPriorities = priorityRank;
    } else {
      // Fallback if some single field is provided
      rawPriorities = (report.advisory?.actionMatrix || []).map((action, idx) => ({
        id: `PRIO-MAP-${idx}`,
        title: `Foco Estratégico ${idx + 1}`,
        description: action,
        priorityLevel: typeof priorityLevel === 'string' ? priorityLevel : undefined,
        priorityRank: typeof priorityRank === 'number' ? priorityRank : undefined,
        severityOrder: typeof severityOrder === 'number' ? severityOrder : undefined,
      }));
    }

    const mapped: MappedPriority[] = rawPriorities.map((p: any, index: number) => {
      if (typeof p === 'string') {
        return {
          id: `PRIO-STR-${index}`,
          title: `Foco Estratégico ${index + 1}`,
          description: p,
          priorityLevel: typeof priorityLevel === 'string' ? priorityLevel : undefined,
          priorityRank: typeof priorityRank === 'number' ? priorityRank : undefined,
          severityOrder: typeof severityOrder === 'number' ? severityOrder : undefined,
        };
      }
      return {
        id: p.id || `PRIO-VAL-${index}`,
        title: p.title || `Foco Estratégico ${index + 1}`,
        description: p.description || p.msg || p.text || '',
        priorityLevel: p.priorityLevel || p.level,
        priorityRank: p.priorityRank || p.rank,
        severityOrder: p.severityOrder || p.order,
        recommendedFocusArea: p.recommendedFocusArea || p.focusArea,
      };
    });

    // If the runtime provided explicit ranks or order, we sort by them passivamente.
    // We do NOT recalculate; we just sort by the metadata numbers declared by the core.
    mapped.sort(sortMetadataPassively);

    return {
      status: 'SUCCESS',
      priorities: mapped,
    };
  }
}

function sortMetadataPassively(a: MappedPriority, b: MappedPriority): number {
  if (a.priorityRank !== undefined && b.priorityRank !== undefined) {
    return a.priorityRank - b.priorityRank;
  }
  if (a.severityOrder !== undefined && b.severityOrder !== undefined) {
    return a.severityOrder - b.severityOrder;
  }
  return 0;
}

