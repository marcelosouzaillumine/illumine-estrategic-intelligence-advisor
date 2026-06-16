import { InstitutionalScenario } from '../BalanceSheetScenarioClassifier';
import { BalanceSheetExecutiveFacts } from '../BalanceSheetExecutiveFactsBuilder';
import { BalanceSheetExecutiveLanguageCompiler } from '../BalanceSheetExecutiveLanguageCompiler';
import { 
  ExecutiveSemanticRegistry, 
  BPLiquidityThresholds, 
  BPAutonomyThresholds 
} from '../ExecutiveSemanticRegistry';

export class BalanceSheetExecutiveOpinionBuilder {
  public static buildOpinion(scenario: InstitutionalScenario | undefined, facts?: BalanceSheetExecutiveFacts): string {
    if (!facts) return 'Avaliação estrutural contínua da capacidade de geração e proteção de valor.';
    
    const liqThreshold = ExecutiveSemanticRegistry.getThreshold(facts.liquidityCurrent || 0, BPLiquidityThresholds);
    const autThreshold = ExecutiveSemanticRegistry.getThreshold(facts.financialAutonomy || 0, BPAutonomyThresholds);

    return BalanceSheetExecutiveLanguageCompiler.compileExecutiveOpinion(facts, liqThreshold, autThreshold);
  }

  public static buildCriticalFactor(scenario: InstitutionalScenario | undefined, facts?: BalanceSheetExecutiveFacts): string {
    if (!facts) return 'Análise Patrimonial';
    
    const liqThreshold = ExecutiveSemanticRegistry.getThreshold(facts.liquidityCurrent || 0, BPLiquidityThresholds);
    const autThreshold = ExecutiveSemanticRegistry.getThreshold(facts.financialAutonomy || 0, BPAutonomyThresholds);

    return BalanceSheetExecutiveLanguageCompiler.compileCriticalFactor(liqThreshold, autThreshold);
  }

  public static buildManagementImplication(scenario: InstitutionalScenario | undefined, facts?: BalanceSheetExecutiveFacts): string {
    if (!facts) return 'Necessidade de acompanhamento estratégico contínuo.';

    const liqThreshold = ExecutiveSemanticRegistry.getThreshold(facts.liquidityCurrent || 0, BPLiquidityThresholds);
    const autThreshold = ExecutiveSemanticRegistry.getThreshold(facts.financialAutonomy || 0, BPAutonomyThresholds);

    return BalanceSheetExecutiveLanguageCompiler.compileManagementImplication(liqThreshold, autThreshold);
  }

  public static buildRecommendedAction(scenario: InstitutionalScenario | undefined, facts?: BalanceSheetExecutiveFacts): string {
    if (!facts) return 'Monitorar indicadores de balanço patrimonial.';

    const liqThreshold = ExecutiveSemanticRegistry.getThreshold(facts.liquidityCurrent || 0, BPLiquidityThresholds);
    const autThreshold = ExecutiveSemanticRegistry.getThreshold(facts.financialAutonomy || 0, BPAutonomyThresholds);

    return BalanceSheetExecutiveLanguageCompiler.compileRecommendedAction(liqThreshold, autThreshold);
  }
}
