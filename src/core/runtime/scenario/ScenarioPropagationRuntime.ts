import { ConsolidatedFinancialInput } from '../consolidated/types';
import { GovernanceViolationRecord } from '../observability/observability-types';
import { InstitutionalStressResult, ScenarioPropagationResult, ProjectedConfidence } from './ScenarioTypes';
import { PredictiveStressEngine } from './PredictiveStressEngine';

export class ScenarioPropagationRuntime {
  /**
   * Propaga o estresse detectado (entidades colapsadas ou com caixa no limite)
   * através das teias do Grupo Econômico (Intercompany) e re-avaliza o risco do ecossistema.
   */
  static run(stressedInput: ConsolidatedFinancialInput, horizonMonths: number): ScenarioPropagationResult {
    const rawStress = PredictiveStressEngine.evaluateStress(stressedInput);
    const propagatedViolations: GovernanceViolationRecord[] = [];
    
    // 1. Contaminação Intercompany
    // Se uma entidade origem de mútuo (quem deve pagar) colapsou, a entidade destino toma um hit e gera violação preditiva
    for (const relation of (stressedInput as any).intercompanyRelations || []) {
      if (rawStress.collapsedEntities.includes(relation.fromEntityId)) {
        propagatedViolations.push({
          violationId: crypto.randomUUID(),
          executionId: 'PROJECTED', // Preenchido no final
          groupId: stressedInput.groupId,
          severity: relation.materiality === 'MATERIAL' ? 'CRITICAL' : 'WARNING',
          source: 'ScenarioPropagationRuntime',
          timestamp: new Date().toISOString(),
          message: `Risco Preditivo: Calote intragrupo. A Entidade devedora (${relation.fromEntityId}) encontra-se insolvente no cenário estressado, ameaçando ${relation.amount} para o credor (${relation.toEntityId}).`,
          affectedEntities: [relation.fromEntityId, relation.toEntityId],
          runtimeStage: 'SCENARIO_PROPAGATION',
          resolved: false
        });
      }
    }

    // 2. Cálculo do Burn Rate e Time to Crisis
    // Simulação grosseira linear: (Dívidas - Caixa) / Meses
    let burnRate = 0;
    if (rawStress.totalGroupLiabilities > rawStress.totalGroupCash) {
       // Assumindo que dívidas circulares expiram em 12 meses
       burnRate = (rawStress.totalGroupLiabilities - rawStress.totalGroupCash) / 12;
    }
    
    let monthsToCrisis = 999;
    if (burnRate > 0) {
      monthsToCrisis = Math.floor(rawStress.totalGroupCash / burnRate);
    }
    if (rawStress.totalGroupCash <= 0 && rawStress.totalGroupLiabilities > 0) {
      monthsToCrisis = 0;
    }

    const stressResult: InstitutionalStressResult = {
      survivingEntities: rawStress.survivingEntities,
      collapsedEntities: rawStress.collapsedEntities,
      groupSolvencyStatus: rawStress.groupSolvencyStatus as 'SOLVENT' | 'AT_RISK' | 'INSOLVENT',
      estimatedCashBurnRate: Number(burnRate.toFixed(2)),
      monthsToLiquidityCrisis: monthsToCrisis
    };

    // 3. Projeta Confidence Baseado em Violations Críticas e Sobrevivência
    let projectedConfidence: ProjectedConfidence = 'HIGH';
    
    const criticalViolations = propagatedViolations.filter(v => v.severity === 'CRITICAL');
    
    if (stressResult.collapsedEntities.length > 0) {
      projectedConfidence = 'CRITICAL_STRESS';
    } else if (stressResult.groupSolvencyStatus === 'INSOLVENT' || stressResult.groupSolvencyStatus === 'AT_RISK') {
      projectedConfidence = 'LOW';
    } else if (criticalViolations.length > 0) {
      projectedConfidence = 'MEDIUM';
    }

    return {
      stressResult,
      projectedConfidence,
      propagatedViolations
    };
  }
}
