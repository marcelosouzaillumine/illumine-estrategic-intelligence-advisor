export class ScenarioBaselineValidator {
  public static validate(baselineContext: any): {
    status: 'VALID' | 'SCENARIO_WITHOUT_VALID_BASELINE';
  } {
    if (!baselineContext || (!baselineContext.baselineHash && !baselineContext.lineageHash) || !baselineContext.hasValidatedCashFlowEvidence) {
      return { status: 'SCENARIO_WITHOUT_VALID_BASELINE' };
    }
    return { status: 'VALID' };
  }
}
