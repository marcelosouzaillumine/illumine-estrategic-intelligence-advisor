import { ConstitutionalProtocol, ValidationResult } from '../ConstitutionalProtocolDefinition';
import { ScenarioBaselineValidator } from '../../scenario-intelligence/ScenarioBaselineValidator';
import { ScenarioDeterminismValidator } from '../../scenario-intelligence/ScenarioDeterminismValidator';
import { ScenarioLineageFramework } from '../../scenario-intelligence/ScenarioLineageFramework';
import { InstitutionalScenario } from '../../scenario-intelligence/ScenarioDefinition';

export class ScenarioSimulationConstitutionProtocol implements ConstitutionalProtocol {
  public protocolId = 'SSCP';
  public protocolName = 'Scenario Simulation Constitution Protocol';
  public protocolVersion = '1.0';
  public authorityLevel = 'SCENARIO';

  public validate(context: { baselineContext: any, scenario: InstitutionalScenario, determinismHash1: string, determinismHash2: string }): ValidationResult {
    const violations: string[] = [];

    if (!context.baselineContext || !context.scenario) {
      return { status: 'PASS', violations: [] };
    }

    // 1. Reality Rule
    const baselineResult = ScenarioBaselineValidator.validate(context.baselineContext);
    if (baselineResult.status !== 'VALID') {
      violations.push(baselineResult.status);
    }

    // 2. Lineage Validation
    const lineageResult = ScenarioLineageFramework.validate(context.scenario);
    if (lineageResult.status !== 'VALID') {
      violations.push(lineageResult.status);
    }

    // 3. Reproducibility Rule
    const determinismResult = ScenarioDeterminismValidator.validate(context.determinismHash1, context.determinismHash2);
    if (determinismResult.status !== 'VALID') {
      violations.push(determinismResult.status);
    }

    // 4. Isolation Rule
    if (context.baselineContext && context.baselineContext._isMutated) {
      violations.push('BASELINE_MUTATION_DETECTED');
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
