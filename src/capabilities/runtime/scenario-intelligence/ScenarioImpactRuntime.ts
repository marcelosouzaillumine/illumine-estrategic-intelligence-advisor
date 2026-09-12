import { ExecutiveDecisionObject } from '../decision-intelligence/ExecutiveDecisionObject';
import { InstitutionalScenarioReport } from './InstitutionalScenarioReport';
import { InstitutionalScenario } from './ScenarioDefinition';
import { ScenarioMutationEngine } from './ScenarioMutationEngine';
import { ScenarioComparisonEngine } from './ScenarioComparisonEngine';
import { ScenarioHashFramework } from './ScenarioHashFramework';
import { ScenarioConstitutionProtocol } from '../constitutional-governance/protocols/ScenarioConstitutionProtocol';
import { ScenarioSimulationConstitutionProtocol } from '../constitutional-governance/protocols/ScenarioSimulationConstitutionProtocol';
import { ScenarioSurvivabilityFilter } from './ScenarioSurvivabilityFilter';
import { ScenarioMutation } from './ScenarioMutation';

export class ScenarioImpactRuntime {
  public static evaluate(
    baselineContext: any,
    decisions: ExecutiveDecisionObject[]
  ): InstitutionalScenarioReport[] {
    const reports: InstitutionalScenarioReport[] = [];

    for (let i = 0; i < decisions.length; i++) {
      const decision = decisions[i];
      
      const mutations: ScenarioMutation[] = [{
        mutationId: this.mapDecisionToMutation(decision.actionId),
        decisionId: decision.decisionId,
        actionId: decision.actionId,
        actionSource: 'CAR',
        value: 100 // Example deterministic payload
      }];

      const scenarioHash = ScenarioHashFramework.generateHash(
        baselineContext.lineageHash || 'NO_BASELINE',
        mutations,
        '1.0'
      );

      const scenarioContext = ScenarioMutationEngine.applyMutations(baselineContext, mutations);

      const scenario: InstitutionalScenario = {
        scenarioId: `SCENARIO-${scenarioHash}`,
        scenarioName: `Simulação de: ${decision.recommendedAction}`,
        scenarioType: 'DETERMINISTIC_IMPACT',
        baselineHash: baselineContext.lineageHash || 'NO_BASELINE',
        mutations,
        constitutionalStatus: 'PENDING'
      };

      const comparisons = ScenarioComparisonEngine.compare(baselineContext, scenarioContext);

      const scp = new ScenarioConstitutionProtocol();
      const scpResult = scp.validate({ baselineContext, scenarioContext });

      const sscp = new ScenarioSimulationConstitutionProtocol();
      const sscpResult = sscp.validate({ 
        baselineContext, 
        scenario, 
        determinismHash1: scenarioHash, 
        determinismHash2: scenarioHash 
      });

      const survResult = ScenarioSurvivabilityFilter.validate(baselineContext, mutations);

      const isConstitutional = scpResult.status === 'PASS' && sscpResult.status === 'PASS';

      reports.push({
        scenarioId: scenario.scenarioId,
        scenarioName: scenario.scenarioName,
        constitutionalStatus: isConstitutional ? 'VALID' : 'BLOCKED',
        survivabilityStatus: survResult.status,
        overallImpact: isConstitutional ? 'POSITIVE' : 'NEGATIVE',
        baselineHash: scenario.baselineHash,
        scenarioHash,
        impactMatrix: comparisons,
        lineageHash: scenarioHash
      });
    }

    return reports;
  }

  private static mapDecisionToMutation(actionId: string): any {
    if (actionId.includes('CAPEX')) return 'CAPEX_EXPANSION';
    if (actionId.includes('CASH')) return 'CAPEX_REDUCTION';
    if (actionId.includes('INVENTORY')) return 'INVENTORY_REDUCTION';
    return 'MARGIN_INCREASE'; // Default safe mutation
  }
}
