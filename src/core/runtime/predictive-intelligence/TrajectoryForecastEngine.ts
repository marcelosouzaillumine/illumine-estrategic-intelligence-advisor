// src/core/runtime/predictive-intelligence/TrajectoryForecastEngine.ts
//
// Trajectory Forecast Engine
// Projects dynamic governance trajectories with expanding confidence bounds.

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { SurvivabilityScores } from '../decision-intelligence/decision-types';
import { MomentumMetrics } from './DeteriorationMomentumEngine';
import { TrajectoryPoint } from './predictive-types';

export class TrajectoryForecastEngine {
  /**
   * Forecasts the future trajectory for key dimensions over N steps, calculating expanding confidence bands.
   */
  public static forecastTrajectory(
    currentScores: SurvivabilityScores,
    momentum: MomentumMetrics,
    history: ExecutiveDecision[],
    steps: number
  ): TrajectoryPoint[] {
    const historyCount = history ? history.length : 0;
    
    // Base uncertainty factor: more history reduces uncertainty, higher velocity/acceleration increases it
    const baseUncertainty = Math.max(2, 10 - Math.min(6, historyCount / 2));

    const dimensions = [
      { name: 'Liquidity', val: currentScores.liquidity, vel: momentum.liquidityMomentum, acc: momentum.liquidityAcceleration },
      { name: 'Governance Consistency', val: currentScores.governance, vel: momentum.governanceStabilityMomentum, acc: momentum.governanceStabilityAcceleration },
      { name: 'Capital Preservation', val: currentScores.capitalPreservation, vel: momentum.liquidityMomentum, acc: momentum.liquidityAcceleration },
      { name: 'Survivability Composite', val: currentScores.composite, vel: momentum.survivabilityMomentum, acc: momentum.survivabilityAcceleration }
    ];

    const forecast: TrajectoryPoint[] = [];

    for (const dim of dimensions) {
      // Forecast value at the final step
      const projected = dim.val + dim.vel * steps + 0.5 * dim.acc * Math.pow(steps, 2);
      const projectedVal = Math.round(Math.max(0, Math.min(100, projected)));

      // Confidence interval expands with step size: width = baseUncertainty * steps
      const width = baseUncertainty * (steps * 0.7);
      const min = Math.round(Math.max(0, projectedVal - width));
      const max = Math.round(Math.min(100, projectedVal + width));

      forecast.push({
        dimension: dim.name,
        currentValue: dim.val,
        projectedValue: projectedVal,
        velocity: dim.vel,
        acceleration: dim.acc,
        confidenceInterval: { min, max }
      });
    }

    return forecast;
  }
}
