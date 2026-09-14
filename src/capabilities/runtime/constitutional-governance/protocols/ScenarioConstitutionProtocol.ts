import { ConstitutionalProtocol, ValidationResult } from '../ConstitutionalProtocolDefinition';
import { ScenarioComparisonEngine } from '../../scenario-intelligence/ScenarioComparisonEngine';

export class ScenarioConstitutionProtocol implements ConstitutionalProtocol {
  public protocolId = 'SCP';
  public protocolName = 'Scenario Constitution Protocol';
  public protocolVersion = '1.0';
  public authorityLevel = 'SCENARIO';

  public validate(context: { baselineContext: any, scenarioContext: any }): ValidationResult {
    const violations: string[] = [];

    if (!context.baselineContext || !context.scenarioContext) {
      return { status: 'PASS', violations: [] };
    }

    const comparisons = ScenarioComparisonEngine.compare(context.baselineContext, context.scenarioContext);

    for (const comp of comparisons) {
      if (comp.metric === 'Runway' && comp.scenarioValue < 3) {
        violations.push(`SCENARIO_CONSTITUTION_VIOLATION: Runway cannot be simulated below 3 months.`);
      }
    }

    if (violations.length > 0) {
      return {
        status: 'FAIL',
        violations
      };
    }

    return {
      status: 'PASS',
      violations: []
    };
  }
}
