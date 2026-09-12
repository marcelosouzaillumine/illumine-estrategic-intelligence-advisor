import { DimensionScore } from '../dimensions/EIMIDimensions';

export enum MaturityLevel {
  LEVEL_1_OPERATIONAL_VISIBILITY = 1,
  LEVEL_2_INTEGRATED_INTELLIGENCE = 2,
  LEVEL_3_EXECUTIVE_INTELLIGENCE = 3,
  LEVEL_4_INSTITUTIONAL_INTELLIGENCE = 4,
  LEVEL_5_ADAPTIVE_ENTERPRISE = 5
}

export class MaturityCalculator {
  static calculateOverallMaturity(scores: DimensionScore[]): MaturityLevel {
    const averageScore = scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length;
    
    if (averageScore >= 8.5) return MaturityLevel.LEVEL_5_ADAPTIVE_ENTERPRISE;
    if (averageScore >= 7.0) return MaturityLevel.LEVEL_4_INSTITUTIONAL_INTELLIGENCE;
    if (averageScore >= 5.0) return MaturityLevel.LEVEL_3_EXECUTIVE_INTELLIGENCE;
    if (averageScore >= 3.0) return MaturityLevel.LEVEL_2_INTEGRATED_INTELLIGENCE;
    
    return MaturityLevel.LEVEL_1_OPERATIONAL_VISIBILITY;
  }
}
