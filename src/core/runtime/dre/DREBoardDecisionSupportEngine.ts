import { EconomicDiagnosisOutput } from './EconomicDiagnosisEngine';
import { CrossStatementIsolationValidator } from './CrossStatementIsolationValidator';
import { ExecutivePrimaryMotiveConsistencyEngine } from '../executive-consolidation/ExecutivePrimaryMotiveConsistencyEngine';
import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from '../executive-consolidation/StrategicOpinionConsistencyEngine';

export interface BoardDecisionFramework {
  classificacaoGeral: string;
  perfilDeRisco: string;
  capacidadeDeAbsorcao: string;
  problemaPrincipal: string;
  focoImediato: string;
  outlookDoConselho: string;
  gapDeEquilibrio?: number;
  runwayOperacional?: number;
}

export class DREBoardDecisionSupportEngine {
  public static generateFramework(
    diagnosis: EconomicDiagnosisOutput,
    financialMetrics: { breakEvenGap?: number; netRevenue?: number; breakEvenRevenue?: number },
    context?: ExecutiveAnalysisContext
  ): BoardDecisionFramework {
    const { valueCreationAssessment, primaryConstraint, recoverabilityAssessment, strategicPriority, boardOutlook } = diagnosis;

    const safeContext = context || {
      moduleContext: 'DRE',
      activeFiduciaryRestrictions: [],
      fiduciaryClassification: recoverabilityAssessment,
      mathematicalClassification: valueCreationAssessment === 'Sim' ? 'RESILIENT' : 'ATTENTION',
      globalScore: 50,
      primaryIndicators: {},
      contextualAlerts: []
    };

    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(safeContext, primaryConstraint);

    const classificacaoGeral = recoverabilityAssessment;
    const perfilDeRisco = valueCreationAssessment === 'Sim' ? 'Baixo' : (valueCreationAssessment === 'Parcialmente' ? 'Moderado' : 'Alto');
    const capacidadeDeAbsorcao = valueCreationAssessment === 'Sim' ? 'Alta' : 'Baixa';

    const problemaPrincipal = CrossStatementIsolationValidator.isWithinDREDomain(motive.label)
      ? motive.label
      : 'Estrutura de custos incompatível com o volume de receita atual';

    const focoImediato = strategicPriority;
    const outlookDoConselho = boardOutlook;

    return {
      classificacaoGeral,
      perfilDeRisco,
      capacidadeDeAbsorcao,
      problemaPrincipal,
      focoImediato,
      outlookDoConselho,
      gapDeEquilibrio: financialMetrics.breakEvenGap
    };
  }
}
