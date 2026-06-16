import { InstitutionalScenario } from '../BalanceSheetScenarioClassifier';
import { BalanceSheetExecutiveOpinionBuilder } from './BalanceSheetExecutiveOpinionBuilder';

export interface DecisionTraceNode {
  type: 'question' | 'opinion' | 'driver' | 'implication' | 'action' | 'kpis' | 'engine' | 'source';
  label: string;
  content: string;
}

export class DecisionTraceBuilder {
  public static build(
    scenario: InstitutionalScenario | undefined,
    patrimonialIntelligenceReport: any,
    filterYear: number,
    facts?: any
  ): DecisionTraceNode[] {
    const opinion = BalanceSheetExecutiveOpinionBuilder.buildOpinion(scenario, facts);
    const criticalFactor = BalanceSheetExecutiveOpinionBuilder.buildCriticalFactor(scenario, facts);
    const implication = BalanceSheetExecutiveOpinionBuilder.buildManagementImplication(scenario, facts);
    const action = BalanceSheetExecutiveOpinionBuilder.buildRecommendedAction(scenario, facts);

    return [
      { type: 'question', label: 'Pergunta de Negócio', content: 'Qual é o contexto institucional e a classificação patrimonial da organização?' },
      { type: 'opinion', label: 'Parecer Executivo', content: opinion },
      { type: 'driver', label: 'Fator Crítico Institucional', content: criticalFactor },
      { type: 'implication', label: 'Implicação de Gestão', content: implication },
      { type: 'action', label: 'Ação Recomendada', content: action },
      { type: 'kpis', label: 'Evidências (KPIs)', content: `${patrimonialIntelligenceReport?.indicators?.length || 0} indicadores calculados em 3 macrotemas.` },
      { type: 'engine', label: 'Motor Analítico', content: 'FiduciaryRuntimeAdapter (Executive Consolidation Engine)' },
      { type: 'source', label: 'Fonte de Dados Origem', content: `Balanço Patrimonial (${filterYear})` },
    ];
  }
}
