import { ResponsivenessMetrics } from './types';

export interface ActionMarker {
  advisoryId: string;
  issuedAt: string;
  acknowledgedAt?: string;
  executedAt?: string;
}

export class ExecutiveResponsivenessEngine {
  public static evaluate(actionMarkers: ActionMarker[]): ResponsivenessMetrics {
    if (!actionMarkers || actionMarkers.length === 0) {
      return {
        responsivenessScore: 0,
        governanceReactionTime: -1,
        advisoryExecutionRate: 0,
        executionDisciplineIndex: 0,
        workflowCompletionSpeed: 0
      };
    }

    let executedCount = 0;
    let acknowledgedCount = 0;
    let totalReactionDays = 0;

    actionMarkers.forEach(marker => {
      if (marker.executedAt) {
        executedCount++;
        const reactionTimeMs = new Date(marker.executedAt).getTime() - new Date(marker.issuedAt).getTime();
        totalReactionDays += Math.max(0, reactionTimeMs / (1000 * 60 * 60 * 24));
      } else if (marker.acknowledgedAt) {
        acknowledgedCount++;
      }
    });

    const advisoryExecutionRate = (executedCount / actionMarkers.length) * 100;
    
    // If not executed, we can't definitively measure the reaction time of executions
    const governanceReactionTime = executedCount > 0 ? (totalReactionDays / executedCount) : -1;

    // Acknowledgements improve discipline but not as much as executions
    const executionDisciplineIndex = ((executedCount * 1.0) + (acknowledgedCount * 0.3)) / actionMarkers.length * 100;

    let responsivenessScore = executionDisciplineIndex;
    
    // Penalize if reaction time is too slow (e.g. > 90 days)
    if (governanceReactionTime > 90) {
      responsivenessScore = Math.max(0, responsivenessScore - 20);
    } else if (governanceReactionTime > 0 && governanceReactionTime <= 30) {
      responsivenessScore = Math.min(100, responsivenessScore + 10);
    }

    return {
      responsivenessScore: Number(responsivenessScore.toFixed(2)),
      governanceReactionTime: Number(governanceReactionTime.toFixed(2)),
      advisoryExecutionRate: Number(advisoryExecutionRate.toFixed(2)),
      executionDisciplineIndex: Number(executionDisciplineIndex.toFixed(2)),
      workflowCompletionSpeed: executedCount > 0 ? Number((100 / Math.max(1, governanceReactionTime)).toFixed(2)) : 0
    };
  }
}
