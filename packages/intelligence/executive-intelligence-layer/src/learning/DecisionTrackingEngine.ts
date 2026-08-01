import { DecisionOutcome } from '../governance/DecisionRecord';

export class DecisionTrackingEngine {
  /**
   * Tracks and compares the actual outcome against the expected outcome.
   * Calculates the variance and determines the success status of the decision.
   */
  public static trackOutcome(
    decisionId: string,
    expectedOutcome: Array<{ metric: string; value: string }>,
    actualOutcome: Array<{ metric: string; value: string }>
  ): DecisionOutcome {
    
    const variance: Array<{ metric: string; delta: string; status: 'ACHIEVED' | 'UNDERPERFORMED' | 'OVERPERFORMED' }> = [];
    let successCount = 0;
    
    // We assume simplistic parsing for the sake of the domain logic example.
    // e.g. "R$ 2M", "10%", "+3%"
    for (const expected of expectedOutcome) {
      const actual = actualOutcome.find(a => a.metric === expected.metric);
      
      if (!actual) {
        variance.push({
          metric: expected.metric,
          delta: 'N/A',
          status: 'UNDERPERFORMED'
        });
        continue;
      }
      
      // Compute status based on simplistic comparison logic
      const expValueStr = expected.value.replace(/[^0-9.-]/g, '');
      const actValueStr = actual.value.replace(/[^0-9.-]/g, '');
      
      const expValue = parseFloat(expValueStr);
      const actValue = parseFloat(actValueStr);
      
      let status: 'ACHIEVED' | 'UNDERPERFORMED' | 'OVERPERFORMED' = 'ACHIEVED';
      
      if (!isNaN(expValue) && !isNaN(actValue)) {
        if (actValue > expValue) {
          status = 'OVERPERFORMED';
          successCount++;
        } else if (actValue < expValue) {
          status = 'UNDERPERFORMED';
        } else {
          status = 'ACHIEVED';
          successCount++;
        }
      }
      
      variance.push({
        metric: expected.metric,
        delta: `${actual.value} vs ${expected.value}`,
        status
      });
    }
    
    let successStatus: 'PENDING' | 'SUCCESS' | 'PARTIAL' | 'FAILURE' = 'FAILURE';
    if (successCount === expectedOutcome.length) {
      successStatus = 'SUCCESS';
    } else if (successCount > 0) {
      successStatus = 'PARTIAL';
    }

    return {
      decisionId,
      expectedOutcome,
      actualOutcome,
      variance,
      successStatus,
      lessonsLearned: [], // This will be populated by LearningEventGenerator
      validatedBy: 'System Engine'
    };
  }
}
