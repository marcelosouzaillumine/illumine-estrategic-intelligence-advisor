// Unified Financial Narrative Mapper
import type { UnifiedFinancialNarrativeInput } from './unified-financial-narrative-types';
import type { DRENarrativeReportLike } from './dre-narrative-types';
import type { DFCNarrativeReportLike } from './dfc-narrative-types';
import type { BPNarrativeReportLike } from './bp-narrative-types';
import type { DLPANarrativeReportLike } from './dlpa-narrative-types';

/**
 * Maps minimal report contracts to the UFNE engine input.
 * Avoids importing the full ExecutiveIntelligenceReport.
 */
export function mapReportToUnifiedFinancialNarrativeInput(params: {
  dre?: DRENarrativeReportLike;
  dfc?: DFCNarrativeReportLike;
  bp?: BPNarrativeReportLike;
  dlpa?: DLPANarrativeReportLike;
}): UnifiedFinancialNarrativeInput {
  return {
    narrativeContext: params.dre?.narrativeContext || params.dfc?.narrativeContext || params.bp?.narrativeContext || params.dlpa?.narrativeContext,
    dreNarrative: params.dre ? { ...params.dre } as any : undefined,
    dfcNarrative: params.dfc ? { ...params.dfc } as any : undefined,
    bpNarrative: params.bp ? { ...params.bp } as any : undefined,
    dlpaNarrative: params.dlpa ? { ...params.dlpa } as any : undefined,
  };
}
