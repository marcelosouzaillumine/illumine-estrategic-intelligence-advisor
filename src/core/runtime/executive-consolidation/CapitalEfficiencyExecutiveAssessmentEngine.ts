import { ExecutiveAssessmentResult } from './LiquidityExecutiveAssessmentEngine';
import { CapitalEfficiencyRuleSet, EfficiencyContextProfile } from './CapitalEfficiencyRuleSet';
import { CapitalEfficiencyMetricsProvider } from './CapitalEfficiencyMetricsProvider';

export class CapitalEfficiencyExecutiveAssessmentEngine {
  public static assess(indicators: any[], bpSummary: any, clientProfile?: any): ExecutiveAssessmentResult {
    // Obter as heurísticas a partir do Provider desacoplado
    const metrics = CapitalEfficiencyMetricsProvider.getMetrics(indicators, bpSummary);
    
    // Pilar 1 - Montar o contexto institucional
    const context: EfficiencyContextProfile = {
      sector: clientProfile?.sector || clientProfile?.segment,
      isHolding: clientProfile?.sector === 'Holding' || clientProfile?.tags?.includes('holding'),
      isFinancialInstitution: clientProfile?.sector === 'Financial' || clientProfile?.tags?.includes('banco'),
      isTreasury: clientProfile?.tags?.includes('tesouraria'),
      isInvestmentVehicle: clientProfile?.tags?.includes('investimento') || clientProfile?.sector === 'Investment',
      isPreparingForMA: clientProfile?.tags?.includes('m&a'),
      isHighGrowthPhase: clientProfile?.companyStage === 'Growth' || clientProfile?.companyStage === 'Scale-up'
    };
    
    // Aplicar a RuleSet nas métricas
    const result = CapitalEfficiencyRuleSet.evaluate(metrics, context);
    
    return result;
  }
}

