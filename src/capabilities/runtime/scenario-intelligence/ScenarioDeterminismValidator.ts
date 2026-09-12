export class ScenarioDeterminismValidator {
  public static validate(hash1: string, hash2: string): {
    status: 'VALID' | 'NON_DETERMINISTIC_SCENARIO';
  } {
    if (hash1 !== hash2) {
      return { status: 'NON_DETERMINISTIC_SCENARIO' };
    }
    return { status: 'VALID' };
  }
}
