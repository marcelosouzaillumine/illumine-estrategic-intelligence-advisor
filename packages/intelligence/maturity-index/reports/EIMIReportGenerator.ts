import { MaturityLevel } from '../scoring/MaturityCalculator';
import { DimensionScore } from '../dimensions/EIMIDimensions';

export interface EIMIReport {
  organizationId: string;
  generatedAt: Date;
  overallMaturityLevel: MaturityLevel;
  dimensionScores: DimensionScore[];
  executiveSummary: string;
}

export class EIMIReportGenerator {
  static generate(organizationId: string, scores: DimensionScore[], overallLevel: MaturityLevel): EIMIReport {
    return {
      organizationId,
      generatedAt: new Date(),
      overallMaturityLevel: overallLevel,
      dimensionScores: scores,
      executiveSummary: `A organização encontra-se no nível ${overallLevel} de maturidade executiva.`
    };
  }
}
