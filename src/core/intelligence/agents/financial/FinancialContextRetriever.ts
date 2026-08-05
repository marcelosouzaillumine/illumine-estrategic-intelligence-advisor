import { UnifiedFinancialIntelligenceContext } from '../../financial/orchestration/FinancialIntelligenceCoordinator';
import { FinancialExecutiveIntent } from './FinancialExecutiveIntent';
import { FinancialInsight } from '../../financial/orchestration/FinancialInsightRegistry';

export class FinancialContextRetriever {
  public retrieve(intent: FinancialExecutiveIntent, unifiedContext: UnifiedFinancialIntelligenceContext): any {
    // Selectively filter the Unified Context based on intent
    
    if (intent === FinancialExecutiveIntent.HEALTH_ASSESSMENT) {
      return {
        profile: unifiedContext.financialHealthProfile,
        criticalFindings: unifiedContext.criticalFindings,
      };
    }
    
    if (intent === FinancialExecutiveIntent.CAUSE_INVESTIGATION) {
      return {
        criticalFindings: unifiedContext.criticalFindings, // to investigate causes
      };
    }

    if (intent === FinancialExecutiveIntent.BOARD_PREPARATION) {
      return {
        profile: unifiedContext.financialHealthProfile,
        criticalFindings: unifiedContext.criticalFindings,
        executiveQuestions: unifiedContext.executiveQuestions,
        strategicThemes: unifiedContext.strategicThemes
      };
    }

    if (intent === FinancialExecutiveIntent.TREND_ANALYSIS) {
      return {
        history: unifiedContext.history
      };
    }

    // Default: return a broader slice
    return {
      profile: unifiedContext.financialHealthProfile,
      criticalFindings: unifiedContext.criticalFindings,
      executiveQuestions: unifiedContext.executiveQuestions
    };
  }
}
