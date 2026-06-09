import { ExecutivePriority } from './PrescriptiveTypes';

export interface DecisionMatrixOutput {
  dayZeroCritical: ExecutivePriority[]; // High Urgency + High Impact
  strategicPlanning: ExecutivePriority[]; // Low Urgency + High Impact
  quickWins: ExecutivePriority[]; // High Urgency + Low Impact
  monitoring: ExecutivePriority[]; // Low Urgency + Low Impact
}

export class DecisionMatrixEngine {
  static mapToMatrix(priorities: ExecutivePriority[]): DecisionMatrixOutput {
    const output: DecisionMatrixOutput = {
      dayZeroCritical: [],
      strategicPlanning: [],
      quickWins: [],
      monitoring: []
    };

    priorities.forEach(priority => {
      const isHighUrgency = priority.urgency === 'CRITICAL' || priority.urgency === 'HIGH';
      const isHighImpact = priority.impact === 'SYSTEMIC' || priority.impact === 'SIGNIFICANT';

      if (isHighUrgency && isHighImpact) {
        output.dayZeroCritical.push(priority);
      } else if (!isHighUrgency && isHighImpact) {
        output.strategicPlanning.push(priority);
      } else if (isHighUrgency && !isHighImpact) {
        output.quickWins.push(priority);
      } else {
        output.monitoring.push(priority);
      }
    });

    return output;
  }
}
