import { CashIntelligenceRuntimeOutput } from './CashIntelligenceTypes';
import { ExecutivePriorityResolver } from '../decision-intelligence/ExecutivePriorityResolver';

export class DFCExecutiveBindingAudit {
  /**
   * Executa a auditoria de consistência fiduciária e contratual sobre o output da DFC.
   */
  public static audit(output: any): {
    success: boolean;
    runwayBound: boolean;
    conversionBound: boolean;
    dependencyBound: boolean;
    advisoryBound: boolean;
    priorityBound: boolean;
  } {
    if (!output) {
      return {
        success: false,
        runwayBound: false,
        conversionBound: false,
        dependencyBound: false,
        advisoryBound: false,
        priorityBound: false
      };
    }

    // 1. runwayBound: unificação do runwayMonths
    const runwayMonths = output.runwayMonths;
    const universalRunway = output.universalIndicators?.cashRunwayInstitucional?.months;
    const continuityRunway = output.continuityRisk?.projectedRunwayMonths;
    const runwayBound = runwayMonths !== undefined &&
      runwayMonths === universalRunway &&
      runwayMonths === continuityRunway;

    // 2. conversionBound: uso do FCO Operacional Real na conversão
    const conversionAnalysis = output.cashConversionAnalysis;
    const expectedRatio = conversionAnalysis?.cashConversionPer100Revenue;
    const decisionConversion = output.cashBoardDecisionFramework?.revenueConversionAssessment;
    const conversionBound = conversionAnalysis !== undefined &&
      decisionConversion !== undefined &&
      decisionConversion.includes(Math.abs(expectedRatio).toString());

    // 3. dependencyBound: consistência da dependência crítica
    const dependencyAnalysis = output.shareholderDependencyAnalysis;
    const isDependencyCritical = dependencyAnalysis?.classification === 'DEPENDENCIA_CRITICA';
    const advisoryDependency = output.cashExecutiveAdvisory?.dependenciaCapital;
    const decisionDependency = output.cashBoardDecisionFramework?.shareholderDependency;
    const dependencyBound = isDependencyCritical &&
      advisoryDependency === 'Dependência crítica dos sócios.' &&
      decisionDependency === 'Dependência crítica dos sócios.';

    // 4. advisoryBound: estrutura obrigatória do Advisory
    const advisory = output.cashExecutiveAdvisory;
    const advisoryBound = advisory !== undefined &&
      advisory.situacaoAtual === 'A operação consome caixa.' &&
      advisory.restricaoPrincipal === 'Estrutura operacional deficitária.' &&
      advisory.dependenciaCapital === 'Dependência crítica dos sócios.' &&
      advisory.sustentabilidade === 'Runway reduzido.' &&
      advisory.outlook === 'Se nada for feito, a liquidez disponível será insuficiente para sustentar a continuidade operacional.' &&
      advisory.boardPriority === 'Reduzir consumo operacional e restaurar autonomia financeira.';

    // 5. priorityBound: consistência do Resolver de prioridades
    const priorities = ExecutivePriorityResolver.resolve({
      metrics: {
        fiduciary: {
          runway: runwayMonths,
          shareholderDependencyAnalysis: {
            classification: dependencyAnalysis?.classification,
            dependenciaCapitalExternoLabel: dependencyAnalysis?.dependenciaCapitalExternoLabel
          }
        }
      },
      cashSustainabilityReport: output
    });
    const topPriority = priorities[0];
    const priorityBound = topPriority !== undefined &&
      topPriority.title === 'Reduzir a queima operacional de caixa e restaurar a autonomia financeira.' &&
      topPriority.severity === 'CRITICAL' &&
      topPriority.sourceModule === 'DFC';

    const success = runwayBound && conversionBound && dependencyBound && advisoryBound && priorityBound;

    return {
      success,
      runwayBound,
      conversionBound,
      dependencyBound,
      advisoryBound,
      priorityBound
    };
  }
}
