import { CFO_HEALTH_SCORE_DIMENSION_WEIGHTS } from './cfo-calibration.engine';

export interface ExecutiveFinancialHealthScore {
  score: number; // 0-100
  classification: 'excellent' | 'healthy' | 'attention' | 'critical';
  dimensions: {
    liquidity: number; // 0-100
    profitability: number; // 0-100
    leverage: number; // 0-100
    efficiency: number; // 0-100
    evolution: number; // 0-100
  };
  trend: 'improving' | 'stable' | 'declining';
}

export class CfoHealthScoreEngine {
  
  static calculateScore(snapshotPayload: any): ExecutiveFinancialHealthScore {
    // In a real implementation, these would be derived from snapshotPayload metrics.
    // We are simulating the calculation logic for the framework here.
    
    // Heuristic simulation based on runway and margin
    let liquidityScore = 50;
    if (snapshotPayload.cashIntelligence?.liquidity?.runwayDays > 90) liquidityScore = 90;
    else if (snapshotPayload.cashIntelligence?.liquidity?.runwayDays < 30) liquidityScore = 20;

    let profitabilityScore = 50;
    if (snapshotPayload.performance?.ebitda?.margin > 15) profitabilityScore = 85;
    else if (snapshotPayload.performance?.ebitda?.margin < 0) profitabilityScore = 15;

    const leverageScore = 70; // Simulated
    const efficiencyScore = 75; // Simulated
    const evolutionScore = snapshotPayload.performance?.revenue?.percentageChange > 0 ? 80 : 40; // Simulated
    
    const w = CFO_HEALTH_SCORE_DIMENSION_WEIGHTS;
    
    const finalScore = Math.round(
      (liquidityScore * w.liquidity) +
      (profitabilityScore * w.profitability) +
      (leverageScore * w.leverage) +
      (efficiencyScore * w.efficiency) +
      (evolutionScore * w.evolution)
    );

    let classification: ExecutiveFinancialHealthScore['classification'] = 'healthy';
    if (finalScore >= 90) classification = 'excellent';
    else if (finalScore >= 75) classification = 'healthy';
    else if (finalScore >= 50) classification = 'attention';
    else classification = 'critical';

    return {
      score: finalScore,
      classification,
      dimensions: {
        liquidity: liquidityScore,
        profitability: profitabilityScore,
        leverage: leverageScore,
        efficiency: efficiencyScore,
        evolution: evolutionScore
      },
      trend: 'stable'
    };
  }
}
