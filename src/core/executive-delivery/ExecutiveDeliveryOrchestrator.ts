import { ExecutiveIntelligenceReport } from '../runtime/executive-intelligence-runtime';

export type DeliveryStep =
  | 'SUMMARY'
  | 'PRIORITIES'
  | 'FINANCIAL_HEALTH'
  | 'CAUSALITY'
  | 'STRESS_PROPAGATION'
  | 'SCENARIOS'
  | 'RISKS'
  | 'ACTION_FOCUS'
  | 'BOARD_CONCLUSION';

export interface StepContent {
  step: DeliveryStep;
  title: string;
  description: string;
  data: Record<string, any>;
}

export class ExecutiveDeliveryOrchestrator {
  private static readonly STEP_SEQUENCE: DeliveryStep[] = [
    'SUMMARY',
    'PRIORITIES',
    'FINANCIAL_HEALTH',
    'CAUSALITY',
    'STRESS_PROPAGATION',
    'SCENARIOS',
    'RISKS',
    'ACTION_FOCUS',
    'BOARD_CONCLUSION',
  ];

  /**
   * Returns the steps in the correct presentation sequence.
   * This operates passivamente and does NOT modify the underlying data or calculate any metrics.
   */
  public static orchestrate(report: ExecutiveIntelligenceReport): StepContent[] {
    if (!report) {
      throw new Error('[Executive Delivery] Relatório inválido.');
    }

    return this.STEP_SEQUENCE.map((step) => {
      let title = '';
      let description = '';
      let data: Record<string, any> = {};

      switch (step) {
        case 'SUMMARY':
          title = 'Sumário Executivo';
          description = 'Visão consolidada da saúde corporativa e severidade institucional.';
          data = {
            context: report.context,
            severity: report.severity,
            scores: {
              composite: report.scores.composite,
              governance: report.scores.governance,
            },
            executiveSummary: report.advisory.executiveSummary,
          };
          break;
        case 'PRIORITIES':
          title = 'Prioridades Estratégicas';
          description = 'Sequenciamento de prioridades declaradas pelo core runtime.';
          data = {
            priorityFocus: report.advisory.priorityFocus,
            actionMatrix: report.advisory.actionMatrix,
            advisoryPriorities: report.structuralCapital?.advisoryPriorities || [],
          };
          break;
        case 'FINANCIAL_HEALTH':
          title = 'Saúde Financeira e Estrutural';
          description = 'Decomposição dos scores de liquidez, governança e saúde operacional.';
          data = {
            scores: report.scores,
            capitalStructure: report.capitalStructure,
            decomposition: report.decomposition,
            metrics: report.metrics,
          };
          break;
        case 'CAUSALITY':
          title = 'Análise de Causalidade';
          description = 'Investigação de causas-raiz contábeis e vetores de propagação.';
          data = {
            causality: report.causality,
            temporalCausality: report.temporalCausality,
          };
          break;
        case 'STRESS_PROPAGATION':
          title = 'Propagação de Stress';
          description = 'Vulnerabilidades e buffers de capital identificados.';
          data = {
            scores: {
              financialStress: report.scores.financialStress,
            },
            structuralCapital: report.structuralCapital
              ? {
                  signals: report.structuralCapital.signals,
                  severity: report.structuralCapital.severity,
                  compression: report.structuralCapital.compression,
                }
              : null,
          };
          break;
        case 'SCENARIOS':
          title = 'Inteligência de Cenários';
          description = 'Simulação de projeções e estresse sob diferentes premissas.';
          data = {
            scenarioProjections: report.scenarioProjections || [],
          };
          break;
        case 'RISKS':
          title = 'Hierarquia de Riscos';
          description = 'Mapeamento passivo de riscos críticos e secundários.';
          data = {
            executiveAttentionMap: report.structuralCapital?.executiveAttentionMap || { critical: [], secondary: [] },
          };
          break;
        case 'ACTION_FOCUS':
          title = 'Matriz de Ação Recomendada';
          description = 'Ações fiduciárias prioritárias e mitigadores de risco.';
          data = {
            actionMatrix: report.advisory.actionMatrix,
            priorityFocus: report.advisory.priorityFocus,
          };
          break;
        case 'BOARD_CONCLUSION':
          title = 'Rastreabilidade e Conclusão';
          description = 'Evidências fiduciárias, lineage de dados e integridade do runtime.';
          data = {
            compliance: report.compliance,
            runtimeMetadata: report.runtimeMetadata,
            institutionalMemory: report.institutionalMemory,
          };
          break;
      }

      return {
        step,
        title,
        description,
        data,
      };
    });
  }

  public static getSequence(): DeliveryStep[] {
    return [...this.STEP_SEQUENCE];
  }
}
