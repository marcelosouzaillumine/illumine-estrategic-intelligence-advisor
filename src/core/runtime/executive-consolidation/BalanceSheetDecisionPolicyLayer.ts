import { BalanceSheetExecutiveFacts } from './BalanceSheetExecutiveFactsBuilder';
import { BalanceSheetScenarioClassifier, InstitutionalScenario } from './BalanceSheetScenarioClassifier';
import { BalanceSheetExecutiveLanguageCompiler } from './BalanceSheetExecutiveLanguageCompiler';
import { 
  ExecutiveSemanticRegistry, 
  BPLiquidityThresholds, 
  BPAutonomyThresholds, 
  BPWorkingCapitalThresholds 
} from './ExecutiveSemanticRegistry';

export class BalanceSheetDecisionPolicyLayer {
  public static applyPolicies(
    facts: BalanceSheetExecutiveFacts,
    rawAssessments: any = {},
    institutionalStage: string = ''
  ): { analysisPanels: Record<string, any>, interpretations: any, institutionalScenario?: InstitutionalScenario } {
    
    const analysisPanels: Record<string, any> = {};
    const interpretations: any = {};
    
    // Evaluate Thresholds
    const liqThreshold = ExecutiveSemanticRegistry.getThreshold(facts.liquidityCurrent || 0, BPLiquidityThresholds);
    const autThreshold = ExecutiveSemanticRegistry.getThreshold(facts.financialAutonomy || 0, BPAutonomyThresholds);
    const wcThreshold = ExecutiveSemanticRegistry.getThreshold(facts.workingCapital || 0, BPWorkingCapitalThresholds);

    // Derive Scenario instead of making it the input
    const derivedScenarioStr = BalanceSheetExecutiveLanguageCompiler.compileDerivedScenario(liqThreshold, autThreshold);

    // Compile Panels via Language Compiler
    analysisPanels.protection = BalanceSheetExecutiveLanguageCompiler.compilePanel('Protection', facts, liqThreshold, autThreshold, wcThreshold);
    analysisPanels.liquidity = BalanceSheetExecutiveLanguageCompiler.compilePanel('Liquidity', facts, liqThreshold, autThreshold, wcThreshold);
    analysisPanels.capitalStructure = BalanceSheetExecutiveLanguageCompiler.compilePanel('CapitalStructure', facts, liqThreshold, autThreshold, wcThreshold);
    analysisPanels.workingCapital = BalanceSheetExecutiveLanguageCompiler.compilePanel('WorkingCapital', facts, liqThreshold, autThreshold, wcThreshold);
    analysisPanels.assetQuality = BalanceSheetExecutiveLanguageCompiler.compilePanel('AssetQuality', facts, liqThreshold, autThreshold, wcThreshold);
    analysisPanels.capitalEfficiency = BalanceSheetExecutiveLanguageCompiler.compilePanel('CapitalEfficiency', facts, liqThreshold, autThreshold, wcThreshold);

    interpretations.patrimonialThesis = derivedScenarioStr === 'CRITICAL_LIQUIDITY_STRESS' ? 'Risco de Continuidade no Curto Prazo' : 'Gestão patrimonial orientada por dados quantitativos';
    interpretations.executivePlanOverride = {
      shortTerm: { executiveQuestion: analysisPanels.liquidity.executiveQuestion },
      mediumTerm: { executiveQuestion: analysisPanels.workingCapital.executiveQuestion },
      longTerm: { executiveQuestion: analysisPanels.capitalStructure.executiveQuestion }
    };
    
    // Reconstruct the institutionalScenario object from the derived scenario
    const institutionalScenario: InstitutionalScenario = {
      scenario: derivedScenarioStr as any,
      confidence: 'HIGH',
      primaryDriver: 'Liquidez Corrente',
      secondaryDriver: 'Autonomia Financeira',
      severity: liqThreshold.severity === 'CRITICAL' || autThreshold.severity === 'CRITICAL' ? 'CRITICAL' : (liqThreshold.severity === 'WARNING' || autThreshold.severity === 'WARNING' ? 'HIGH' : 'MEDIUM'),
      liquidityIntent: 'NEUTRAL',
      policyProfile: (derivedScenarioStr === 'CRITICAL_LIQUIDITY_STRESS' ? 'SURVIVAL' : 'SUSTAINABLE_MANAGEMENT') as any
    };

    return { analysisPanels, interpretations, institutionalScenario };
  }
}
