// src/core/runtime/pilot-operations/PilotOperationsEngine.ts

import {
  PilotTenantStatus,
  PilotOperationalHealth,
  PilotExecutiveEngagement,
  PilotSupervisionTelemetry,
  CognitiveLoadSignals,
  PilotTelemetryEvent,
  PilotFeedbackEntry
} from './types';

export class PilotOperationsEngine {
  /**
   * Supervise and evaluate pilot status and health from aggregated telemetry and feedback.
   * This is strictly operational metadata analysis (no financial recalculation).
   */
  public static evaluatePilot(
    tenantId: string,
    explicitStatus: PilotTenantStatus,
    telemetryEvents: PilotTelemetryEvent[],
    feedbackList: PilotFeedbackEntry[],
    onboardingStepCount: number,
    totalOnboardingSteps: number
  ): PilotSupervisionTelemetry {
    // 1. Calculate operational stability
    const errorEvents = telemetryEvents.filter(e => e.hasError);
    const totalEventsCount = telemetryEvents.length;
    let runtimeStability = 100;
    if (totalEventsCount > 0) {
      const errorRatio = errorEvents.length / totalEventsCount;
      runtimeStability = Math.max(0, Math.round(100 * (1 - errorRatio)));
    }

    // 2. Assess cognitive load from interaction velocity
    // interactionVelocity = events in last cycle or count of events
    const interactionVelocity = telemetryEvents.length;
    let cognitiveStatus: 'NORMAL' | 'HIGH' | 'CRITICAL' = 'NORMAL';
    let overloadsCount = 0;

    if (interactionVelocity > 50) {
      cognitiveStatus = 'CRITICAL';
      overloadsCount = Math.floor((interactionVelocity - 50) / 10) + 1;
    } else if (interactionVelocity > 25) {
      cognitiveStatus = 'HIGH';
      overloadsCount = 1;
    }

    const cognitiveLoad: CognitiveLoadSignals = {
      overloadsCount,
      interactionVelocity,
      status: cognitiveStatus
    };

    // 3. Determine operational health based on rules
    let health: PilotOperationalHealth = 'HEALTHY';
    
    // Rule: FAIL_CLOSED status forces FAIL_CLOSED health
    if (explicitStatus === 'FAIL_CLOSED') {
      health = 'FAIL_CLOSED';
    } else {
      const hasCriticalFeedback = feedbackList.some(f => f.severity === 'CRITICAL');
      const hasBlockingFeedback = feedbackList.some(f => f.severity === 'BLOCKING');
      
      if (hasCriticalFeedback || runtimeStability < 70) {
        health = 'DEGRADED';
      } else if (hasBlockingFeedback || runtimeStability < 90 || cognitiveStatus === 'CRITICAL') {
        health = 'PARTIAL';
      }
    }

    // 4. Track engagement
    let engagement: PilotExecutiveEngagement = 'LOW';
    if (interactionVelocity > 35) {
      engagement = 'CRITICAL_DEPENDENCY';
    } else if (interactionVelocity > 15) {
      engagement = 'HIGH';
    } else if (interactionVelocity > 5) {
      engagement = 'MODERATE';
    }

    // 5. Readability & clarity scores (based on qualitative feedback)
    let readabilityViolations = feedbackList.filter(f => f.category === 'GOVERNANCE_READABILITY').length;
    let governanceReadability = Math.max(0, 100 - readabilityViolations * 10);

    let clarityViolations = feedbackList.filter(f => f.category === 'EXECUTIVE_CLARITY').length;
    let supervisionClarity = Math.max(0, 100 - clarityViolations * 10);

    // 6. Onboarding progress percentage
    const onboardingProgress = totalOnboardingSteps > 0
      ? Math.round((onboardingStepCount / totalOnboardingSteps) * 100)
      : 0;

    return {
      tenantId,
      status: explicitStatus,
      health,
      engagement,
      onboardingProgress,
      runtimeStability,
      governanceReadability,
      supervisionClarity,
      cognitiveLoad,
      activeFeedbackCount: feedbackList.length
    };
  }
}
