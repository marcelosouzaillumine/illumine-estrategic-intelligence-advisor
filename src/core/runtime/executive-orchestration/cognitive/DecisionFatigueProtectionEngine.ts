import { PrioritizedAttentionItem, ExecutiveCognitiveLoadLevel, ExecutiveSignalDensity } from './types';

export class DecisionFatigueProtectionEngine {
  /**
   * Applies throttling policies to prevent visual overload and alert fatigue.
   * Limits concurrent focus demands, preserving readability.
   * NEVER defers or hides BOARD_INTERVENTION, EXECUTIVE_INTERVENTION, or critical/fiduciary states.
   */
  public static protect(
    items: PrioritizedAttentionItem[]
  ): {
    items: PrioritizedAttentionItem[];
    loadLevel: ExecutiveCognitiveLoadLevel;
    signalDensity: ExecutiveSignalDensity;
  } {
    const totalSignals = items.length;
    let loadLevel: ExecutiveCognitiveLoadLevel = 'MINIMAL';
    let signalDensity: ExecutiveSignalDensity = 'LIGHT';

    if (totalSignals > 15) {
      loadLevel = 'SATURATED';
      signalDensity = 'OVERLOADED';
    } else if (totalSignals > 8) {
      loadLevel = 'ELEVATED';
      signalDensity = 'DENSE';
    } else if (totalSignals > 4) {
      loadLevel = 'CONTROLLED';
      signalDensity = 'BALANCED';
    }

    const protectedItems = items.map(item => {
      // Un-deferrable items: BOARD_INTERVENTION, EXECUTIVE_INTERVENTION, IMMEDIATE, CRITICAL priorities
      const isCritical = 
        item.urgency === 'BOARD_INTERVENTION' || 
        item.urgency === 'EXECUTIVE_INTERVENTION' || 
        item.priority === 'IMMEDIATE' || 
        item.priority === 'CRITICAL' || 
        item.signal.fiduciaryEscalation ||
        item.signal.rawSeverity === 'CRITICAL';

      if (isCritical) {
        return { ...item, deferred: false };
      }

      // Throttle low priority items if density is high/dense
      let deferred = false;
      if (signalDensity === 'OVERLOADED') {
        // Defer low and moderate items
        deferred = item.priority === 'LOW' || item.priority === 'MODERATE';
      } else if (signalDensity === 'DENSE') {
        // Defer low priority items
        deferred = item.priority === 'LOW';
      }

      return {
        ...item,
        deferred
      };
    });

    return {
      items: protectedItems,
      loadLevel,
      signalDensity
    };
  }
}
