import { LongitudinalTrajectory } from '../../cash-intelligence/CashIntelligenceTypes';

export class LongitudinalScoreEngine {
  /**
   * Avalia a qualidade da trajetória e retorna o score longitudinal.
   * Regras:
   * - STABLE_SUSTAINABILITY: 85–100
   * - STRUCTURAL_IMPROVEMENT: 80–95
   * - REAL_RECOVERY: 70–85
   * - VOLATILE_RECOVERY: 50–70
   * - UNSTABLE_CASH_PROFILE: 35–55
   * - CHRONIC_DEPENDENCY: teto máximo 40
   * - ARTIFICIAL_TURNAROUND: teto máximo 35
   * - PROGRESSIVE_DETERIORATION: 10–30
   * - INSUFFICIENT_HISTORICAL_DATA: NOT_AVAILABLE
   * 
   * @param trajectory A classificação longitudinal da trajetória.
   * @param baseScore Score pontual base opcional para balizar dentro do range.
   */
  public static calculate(
    trajectory: LongitudinalTrajectory,
    baseScore: number = 50
  ): number | 'NOT_AVAILABLE' {
    if (trajectory === 'INSUFFICIENT_HISTORICAL_DATA') {
      return 'NOT_AVAILABLE';
    }

    let score = baseScore;

    switch (trajectory) {
      case 'STABLE_SUSTAINABILITY':
        score = Math.max(85, Math.min(100, score + 20));
        break;
      case 'STRUCTURAL_IMPROVEMENT':
        score = Math.max(80, Math.min(95, score + 15));
        break;
      case 'REAL_RECOVERY':
        score = Math.max(70, Math.min(85, score + 10));
        break;
      case 'VOLATILE_RECOVERY':
        score = Math.max(50, Math.min(70, score));
        break;
      case 'UNSTABLE_CASH_PROFILE':
        score = Math.max(35, Math.min(55, score - 10));
        break;
      case 'CHRONIC_DEPENDENCY':
        score = Math.min(score - 20, 40);
        break;
      case 'ARTIFICIAL_TURNAROUND':
        score = Math.min(score - 30, 35);
        break;
      case 'PROGRESSIVE_DETERIORATION':
        score = Math.max(10, Math.min(30, score - 40));
        break;
      case 'DETERIORATION':
        score = Math.max(20, Math.min(45, score - 30));
        break;
      default:
        break;
    }

    return Math.round(score);
  }
}
