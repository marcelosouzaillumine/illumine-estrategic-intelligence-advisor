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
  ): { decisionPanels: Record<string, any>, interpretations: any, institutionalScenario?: InstitutionalScenario } {
    
    const decisionPanels: Record<string, any> = {};
    const interpretations: any = {};
    
    // Evaluate Thresholds
    const liqThreshold = ExecutiveSemanticRegistry.getThreshold(facts.liquidityCurrent || 0, BPLiquidityThresholds);
    const autThreshold = ExecutiveSemanticRegistry.getThreshold(facts.financialAutonomy || 0, BPAutonomyThresholds);
    const wcThreshold = ExecutiveSemanticRegistry.getThreshold(facts.workingCapital || 0, BPWorkingCapitalThresholds);

    // Derive Scenario instead of making it the input
    const derivedScenarioStr = BalanceSheetExecutiveLanguageCompiler.compileDerivedScenario(liqThreshold, autThreshold);

    // Compile Panels via Language Compiler
    decisionPanels.protection = BalanceSheetExecutiveLanguageCompiler.compilePanel('Protection', facts, liqThreshold, autThreshold, wcThreshold);
    decisionPanels.liquidity = BalanceSheetExecutiveLanguageCompiler.compilePanel('Liquidity', facts, liqThreshold, autThreshold, wcThreshold);
    decisionPanels.capitalStructure = BalanceSheetExecutiveLanguageCompiler.compilePanel('CapitalStructure', facts, liqThreshold, autThreshold, wcThreshold);
    decisionPanels.workingCapital = BalanceSheetExecutiveLanguageCompiler.compilePanel('WorkingCapital', facts, liqThreshold, autThreshold, wcThreshold);
    decisionPanels.assetQuality = BalanceSheetExecutiveLanguageCompiler.compilePanel('AssetQuality', facts, liqThreshold, autThreshold, wcThreshold);
    decisionPanels.capitalEfficiency = BalanceSheetExecutiveLanguageCompiler.compilePanel('CapitalEfficiency', facts, liqThreshold, autThreshold, wcThreshold);

    // Provide derived interpretations for backward compatibility in builders
    interpretations.patrimonialThesis = derivedScenarioStr === 'CRITICAL_LIQUIDITY_STRESS' ? 'Risco de Continuidade no Curto Prazo' : 'Gestão patrimonial orientada por dados quantitativos';
    interpretations.executivePlanOverride = {
      shortTerm: { action: decisionPanels.liquidity.action },
      mediumTerm: { action: decisionPanels.workingCapital.action },
      longTerm: { action: decisionPanels.capitalStructure.action }
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

    return { decisionPanels, interpretations, institutionalScenario };
  }
}
