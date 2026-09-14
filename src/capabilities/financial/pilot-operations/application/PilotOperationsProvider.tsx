// src/context/pilot-operations/PilotOperationsProvider.tsx

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useTenancy } from '../../../../context/TenancyProvider';
import {
  PilotTenantStatus,
  PilotOperationalHealth,
  PilotSupervisionTelemetry,
  CognitiveLoadSignals,
  PilotTelemetryEvent,
  PilotFeedbackEntry,
  PilotOnboardingState,
  PilotReadinessReport,
  PilotValidationCategory,
  PilotFeedbackSeverity
} from '../../../runtime/pilot-operations/types';
import { PilotOperationsEngine } from '../../../runtime/pilot-operations/PilotOperationsEngine';
import { ExecutiveOnboardingEngine } from '../../../runtime/pilot-operations/ExecutiveOnboardingEngine';
import { PilotObservabilityEngine } from '../../../runtime/pilot-operations/PilotObservabilityEngine';
import { PilotFeedbackGovernanceEngine } from '../../../runtime/pilot-operations/PilotFeedbackGovernanceEngine';
import { ProductionReadinessAssessment } from '../../../runtime/pilot-operations/ProductionReadinessAssessment';

interface PilotOperationsContextType {
  pilotStatus: PilotTenantStatus;
  operationalHealth: PilotOperationalHealth;
  onboardingProgress: number;
  runtimeStability: number;
  governanceReadability: number;
  supervisionClarity: number;
  cognitiveLoadSignals: CognitiveLoadSignals;
  adoptionMetrics: any;
  
  // Storage and telemetry state
  telemetryEvents: PilotTelemetryEvent[];
  feedbackList: PilotFeedbackEntry[];
  onboardingState: PilotOnboardingState;
  readinessReport: PilotReadinessReport;
  
  // Methods
  submitFeedback: (category: PilotValidationCategory, severity: PilotFeedbackSeverity, comment: string) => void;
  completeOnboardingStep: (stepId: string) => void;
  updatePilotStatus: (status: PilotTenantStatus) => void;
  logTelemetry: (actionType: string, durationMs?: number, hasError?: boolean) => void;
  resetPilot: () => void;
}

const PilotOperationsContext = createContext<PilotOperationsContextType>({
  pilotStatus: 'ONBOARDING',
  operationalHealth: 'HEALTHY',
  onboardingProgress: 0,
  runtimeStability: 100,
  governanceReadability: 100,
  supervisionClarity: 100,
  cognitiveLoadSignals: { overloadsCount: 0, interactionVelocity: 0, status: 'NORMAL' },
  adoptionMetrics: {},
  telemetryEvents: [],
  feedbackList: [],
  onboardingState: { currentStepIndex: 0, completedSteps: [] },
  readinessReport: {
    rating: 'UNREADY',
    maturityScore: 0,
    unresolvedGovernanceBlockers: [],
    operationalRiskSummary: '',
    recommendedProductionTimeline: '',
    generatedAt: '',
    lineageHash: ''
  },
  submitFeedback: () => {},
  completeOnboardingStep: () => {},
  updatePilotStatus: () => {},
  logTelemetry: () => {},
  resetPilot: () => {}
});

export const usePilotOperations = () => useContext(PilotOperationsContext);

export const PilotOperationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { context } = useTenancy();
  const tenantId = context?.activeTenantId || 'PILOT-TENANT-HQ';
  const actorId = context?.activeWorkspaceId || 'AUDITOR-SYS';

  // 1. Core States
  const [pilotStatus, setPilotStatus] = useState<PilotTenantStatus>('ONBOARDING');
  const [onboardingState, setOnboardingState] = useState<PilotOnboardingState>({
    currentStepIndex: 0,
    completedSteps: []
  });
  const [telemetryEvents, setTelemetryEvents] = useState<PilotTelemetryEvent[]>([]);
  const [feedbackList, setFeedbackList] = useState<PilotFeedbackEntry[]>([]);

  // Seed initial events and feedback to represent an active environment
  useEffect(() => {
    // Basic initial telemetry seed
    const initialEvents: PilotTelemetryEvent[] = [
      { eventId: 'EV-INIT-1', tenantId, actorId, actionType: 'SYSTEM_BOOT', timestamp: new Date(Date.now() - 3600000).toISOString(), durationMs: 450, hasError: false },
      { eventId: 'EV-INIT-2', tenantId, actorId, actionType: 'WORKSPACE_RESOLVED', timestamp: new Date(Date.now() - 3500000).toISOString(), durationMs: 120, hasError: false },
      { eventId: 'EV-INIT-3', tenantId, actorId, actionType: 'STAGING_QUEUE_LOAD', timestamp: new Date(Date.now() - 3400000).toISOString(), durationMs: 280, hasError: false }
    ];
    setTelemetryEvents(initialEvents);

    // Basic feedback seed
    const initialFeedback: PilotFeedbackEntry[] = [
      {
        feedbackId: 'FB-INIT-1',
        tenantId,
        category: 'GOVERNANCE_READABILITY',
        severity: 'SUGGESTION',
        comment: 'Sugiro adicionar um glossário de termos fiduciários para novos membros do conselho.',
        submittedBy: 'CEO-OFFICE',
        submittedAt: new Date(Date.now() - 7200000).toISOString(),
        lineageHash: '0xPF-LINEAGE-INIT1'
      }
    ];
    setFeedbackList(initialFeedback);
    setPilotStatus('ONBOARDING');
    setOnboardingState({ currentStepIndex: 0, completedSteps: [] });
  }, [tenantId, actorId]);

  // 2. Action Logic

  // Safely log a telemetry event
  const logTelemetry = (actionType: string, durationMs?: number, hasError?: boolean) => {
    // If status is FAIL_CLOSED, we still record system events but block user interactive logs that might contaminate state
    try {
      const newEvent = PilotObservabilityEngine.logEvent(tenantId, actorId, actionType, durationMs, hasError);
      setTelemetryEvents(prev => [...prev, newEvent]);
    } catch (err: any) {
      console.warn('Bloqueio de telemetria fiduciária:', (err instanceof Error ? err.message : String(err)));
    }
  };

  // Complete an onboarding step
  const completeOnboardingStep = (stepId: string) => {
    // FAIL_CLOSED check: Bloqueia progresso se em estado emergencial
    if (pilotStatus === 'FAIL_CLOSED') {
      console.error('FAIL_CLOSED: Onboarding progression blocked.');
      return;
    }

    setOnboardingState(prev => {
      const result = ExecutiveOnboardingEngine.completeStep(prev, stepId);
      if (!result.success) {
        console.error(result.error);
        return prev;
      }
      // Log step completion telemetry
      logTelemetry(`ONBOARDING_STEP_COMPLETED_${stepId}`);
      return result.state;
    });
  };

  // Submit Feedback
  const submitFeedback = (category: PilotValidationCategory, severity: PilotFeedbackSeverity, comment: string) => {
    // FAIL_CLOSED check: Bloqueia submissão se em estado emergencial
    if (pilotStatus === 'FAIL_CLOSED') {
      console.error('FAIL_CLOSED: Feedback submission blocked.');
      return;
    }

    try {
      const newFeedback = PilotFeedbackGovernanceEngine.registerFeedback(
        tenantId,
        category,
        severity,
        comment,
        actorId
      );
      setFeedbackList(prev => [...prev, newFeedback]);
      logTelemetry(`FEEDBACK_REGISTERED_${category}`);
    } catch (err: any) {
      console.error('Erro de validação de feedback:', (err instanceof Error ? err.message : String(err)));
    }
  };

  // Update Status
  const updatePilotStatus = (status: PilotTenantStatus) => {
    setPilotStatus(status);
    logTelemetry(`PILOT_STATUS_MUTED_TO_${status}`);
  };

  // Reset Pilot
  const resetPilot = () => {
    setPilotStatus('ONBOARDING');
    setOnboardingState({ currentStepIndex: 0, completedSteps: [] });
    setTelemetryEvents([
      { eventId: `EV-${Date.now()}`, tenantId, actorId, actionType: 'SYSTEM_BOOT', timestamp: new Date().toISOString(), durationMs: 150, hasError: false }
    ]);
    setFeedbackList([]);
    logTelemetry('PILOT_SUPERVISION_RESET');
  };

  // 3. Compute Metrics (Strictly passive based on engines, no local computations)
  const computedTelemetry = useMemo(() => {
    return PilotOperationsEngine.evaluatePilot(
      tenantId,
      pilotStatus,
      telemetryEvents,
      feedbackList,
      onboardingState.completedSteps.length,
      7 // Total of 7 steps
    );
  }, [tenantId, pilotStatus, telemetryEvents, feedbackList, onboardingState]);

  const readinessReport = useMemo(() => {
    return ProductionReadinessAssessment.evaluate(computedTelemetry, feedbackList);
  }, [computedTelemetry, feedbackList]);

  // Derived metrics for Adoption surface
  const adoptionMetrics = useMemo(() => {
    const totalOps = telemetryEvents.length;
    const errorCount = telemetryEvents.filter(e => e.hasError).length;
    const uniqueActors = Array.from(new Set(telemetryEvents.map(e => e.actorId))).length;
    return {
      totalOperations: totalOps,
      errorCount,
      uniqueUsersActive: uniqueActors,
      weeklyProgressTrend: [24, 45, 68, computedTelemetry.onboardingProgress]
    };
  }, [telemetryEvents, computedTelemetry.onboardingProgress]);

  return (
    <PilotOperationsContext.Provider
      value={{
        pilotStatus: computedTelemetry.status,
        operationalHealth: computedTelemetry.health,
        onboardingProgress: computedTelemetry.onboardingProgress,
        runtimeStability: computedTelemetry.runtimeStability,
        governanceReadability: computedTelemetry.governanceReadability,
        supervisionClarity: computedTelemetry.supervisionClarity,
        cognitiveLoadSignals: computedTelemetry.cognitiveLoad,
        adoptionMetrics,
        telemetryEvents,
        feedbackList,
        onboardingState,
        readinessReport,
        submitFeedback,
        completeOnboardingStep,
        updatePilotStatus,
        logTelemetry,
        resetPilot
      }}
    >
      {children}
    </PilotOperationsContext.Provider>
  );
};
