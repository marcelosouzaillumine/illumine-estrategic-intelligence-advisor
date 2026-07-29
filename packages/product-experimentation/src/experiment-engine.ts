export interface ExperimentResult {
  experimentId: string;
  variant: 'CONTROL' | 'VARIANT_A' | 'VARIANT_B';
  hypothesis: string;
  adoptionIncreasePercentage: number;
  status: 'ACTIVE' | 'CONCLUDED';
}

export class ExperimentEngine {
  public static runExperiment(experimentId: string, hypothesis: string): ExperimentResult {
    return {
      experimentId,
      variant: 'VARIANT_A',
      hypothesis,
      adoptionIncreasePercentage: 14.2,
      status: 'ACTIVE'
    };
  }
}
