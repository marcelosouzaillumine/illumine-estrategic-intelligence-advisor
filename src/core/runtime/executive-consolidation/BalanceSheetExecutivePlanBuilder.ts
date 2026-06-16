import { ExecutivePlanActionViewModel } from '../../../types/executive/BalanceSheetExecutiveViewModel';
import { BalanceSheetExecutiveFacts } from './BalanceSheetExecutiveFactsBuilder';
import { BalanceSheetExecutiveLanguageCompiler } from './BalanceSheetExecutiveLanguageCompiler';
import { 
  ExecutiveSemanticRegistry, 
  BPLiquidityThresholds, 
  BPAutonomyThresholds, 
  BPWorkingCapitalThresholds 
} from './ExecutiveSemanticRegistry';

export class BalanceSheetExecutivePlanBuilder {
  public static buildPlan(policyProfile?: string, executiveInterpretation?: any, institutionalStage?: string, facts?: BalanceSheetExecutiveFacts): any {
    
    // Evaluate Thresholds
    const liqThreshold = ExecutiveSemanticRegistry.getThreshold(facts?.liquidityCurrent || 0, BPLiquidityThresholds);
    const autThreshold = ExecutiveSemanticRegistry.getThreshold(facts?.financialAutonomy || 0, BPAutonomyThresholds);
    const wcThreshold = ExecutiveSemanticRegistry.getThreshold(facts?.workingCapital || 0, BPWorkingCapitalThresholds);

    const planActions = BalanceSheetExecutiveLanguageCompiler.compilePlanActions(facts || {} as any, liqThreshold, autThreshold, wcThreshold);

    let curtoAcao = planActions.shortTerm;
    let medioAcao = planActions.mediumTerm;
    let longoAcao = planActions.longTerm;

    if (executiveInterpretation?.executivePlanOverride) {
      curtoAcao = executiveInterpretation.executivePlanOverride.shortTerm?.action || curtoAcao;
      medioAcao = executiveInterpretation.executivePlanOverride.mediumTerm?.action || medioAcao;
      longoAcao = executiveInterpretation.executivePlanOverride.longTerm?.action || longoAcao;
    }

    const origin = { sourceEngine: 'BalanceSheetExecutivePlanBuilder', sourceRule: 'Quantitative Triggers', confidence: 'Alta', lastValidatedAt: new Date().toISOString() };

    let planTitle = 'Diretrizes Estratégicas de Capital';
    if (liqThreshold.severity === 'CRITICAL' || autThreshold.severity === 'CRITICAL') planTitle = 'Proteção de Caixa e Continuidade';
    else if (liqThreshold.severity === 'WARNING' || autThreshold.severity === 'WARNING') planTitle = 'Recomposição Patrimonial e Disciplina';
    else if (liqThreshold.severity === 'ROBUST' && autThreshold.severity === 'ROBUST') planTitle = 'Otimização de Capital Excedente';
    else planTitle = 'Sustentação e Eficiência Patrimonial';

    return {
      planTitle,
      planFinanceiro: {
        prazo: 'Curto Prazo',
        acao: curtoAcao,
        origin
      },
      planOperacional: {
        prazo: 'Médio Prazo',
        acao: medioAcao,
        origin
      },
      planGovernanca: {
        prazo: 'Longo Prazo',
        acao: longoAcao,
        origin
      }
    };
  }
}
