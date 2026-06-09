import { CognitiveSignal, PrioritizedAttentionItem, ExecutiveAttentionPriority, ExecutiveDecisionUrgency } from './types';

export class ExecutiveSignalPriorityEngine {
  /**
   * Prioritizes and orders Runtime signals deterministically.
   * Applying strict passive prioritization policies over Runtime-resolved fields.
   */
  public static prioritize(signals: CognitiveSignal[]): PrioritizedAttentionItem[] {
    const items: PrioritizedAttentionItem[] = signals.map(signal => {
      let priority: ExecutiveAttentionPriority = 'LOW';
      let urgency: ExecutiveDecisionUrgency = 'MONITOR';
      let focusWeight = 0.2;

      // Deterministic priority and urgency mapping
      if (signal.fiduciaryEscalation || signal.rawSeverity === 'CRITICAL') {
        priority = 'IMMEDIATE';
        urgency = signal.fiduciaryEscalation ? 'BOARD_INTERVENTION' : 'EXECUTIVE_INTERVENTION';
        focusWeight = 1.0;
      } else if (signal.rawSeverity === 'WARNING') {
        priority = 'CRITICAL';
        urgency = 'ACTION_REQUIRED';
        focusWeight = 0.8;
      } else if (signal.confidence === 'LOW') {
        priority = 'HIGH';
        urgency = 'REVIEW';
        focusWeight = 0.65;
      } else if (signal.rawSeverity === 'INFO') {
        priority = 'MODERATE';
        urgency = 'REVIEW';
        focusWeight = 0.4;
      } else {
        priority = 'LOW';
        urgency = 'MONITOR';
        focusWeight = 0.15;
      }

      // Respect urgency override from runtime if provided
      if (signal.urgencyOverride) {
        urgency = signal.urgencyOverride;
        if (urgency === 'BOARD_INTERVENTION') focusWeight = Math.max(focusWeight, 1.0);
        else if (urgency === 'EXECUTIVE_INTERVENTION') focusWeight = Math.max(focusWeight, 0.85);
        else if (urgency === 'ACTION_REQUIRED') focusWeight = Math.max(focusWeight, 0.7);
        else if (urgency === 'REVIEW') focusWeight = Math.max(focusWeight, 0.45);
      }

      return {
        signal,
        priority,
        urgency,
        focusWeight,
        deferred: false
      };
    });

    // Sort descending by focusWeight, placing fiduciary and critical items first
    return items.sort((a, b) => b.focusWeight - a.focusWeight);
  }
}
