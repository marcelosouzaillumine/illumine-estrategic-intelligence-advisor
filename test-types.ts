import { NarrativeContext } from './src/lib/narrative-context-types';
import { UnifiedFinancialNarrative } from './src/lib/unified-financial-narrative-types';
interface ReportLike {
  narrativeContext?: NarrativeContext;
  unifiedFinancialNarrative?: UnifiedFinancialNarrative;
}
const finalReport = { someOtherField: 1, narrativeContext: undefined, unifiedFinancialNarrative: undefined };
function map(r: ReportLike) { return r; }
map(finalReport);
