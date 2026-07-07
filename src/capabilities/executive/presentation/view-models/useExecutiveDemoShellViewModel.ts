import { useState, useEffect, useMemo } from 'react';
import { DemoSessionState, DemoScenario, GuidedJourneyStep } from '../../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveDemoApplicationService } from '../../application/ExecutiveDemoApplicationService';

export function useExecutiveDemoShellViewModel() {
  const [sessionId] = useState<string>(() => `demo-session-${Math.floor(1000 + Math.random() * 9000)}`);
  const [session, setSession] = useState<DemoSessionState | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<GuidedJourneyStep>('SUMMARY');
  const [presentationActive, setPresentationActive] = useState<boolean>(false);
  const [guardError, setGuardError] = useState<string | null>(null);

  useEffect(() => {
    const sess = ExecutiveDemoApplicationService.createSession(sessionId);
    setSession({ ...sess });
  }, [sessionId]);

  const handleSelectScenario = (scenarioId: string) => {
    if (!session) return;
    try {
      const sc = ExecutiveDemoApplicationService.getScenario(scenarioId);
      if (!sc) throw new Error(`Scenario ${scenarioId} not found.`);
      
      ExecutiveDemoApplicationService.loadScenario(sessionId, scenarioId, sc.runtimeSnapshotId);
      setSelectedScenarioId(scenarioId);
      setSession({ ...ExecutiveDemoApplicationService.getSession(sessionId) });
      setGuardError(null);
    } catch (err: any) {
      setGuardError(err.message);
    }
  };

  const handleAcknowledgeDisclosure = () => {
    if (!session) return;
    try {
      ExecutiveDemoApplicationService.acknowledgeDisclosure(sessionId);
      setSession({ ...ExecutiveDemoApplicationService.getSession(sessionId) });
      setGuardError(null);
    } catch (err: any) {
      setGuardError(err.message);
    }
  };

  const activeScenario = selectedScenarioId ? ExecutiveDemoApplicationService.getScenario(selectedScenarioId) : null;
  
  let isBlocked = false;
  let validationError = guardError;

  if (activeScenario && session) {
    try {
      ExecutiveDemoApplicationService.assertSafeDemonstration(activeScenario, session);
    } catch (err: any) {
      isBlocked = true;
      validationError = err.message;
    }
  }

  const allowedSteps = activeScenario && session 
    ? ExecutiveDemoApplicationService.resolveSteps(session, activeScenario)
    : [];

  return {
    state: {
      sessionId,
      session,
      selectedScenarioId,
      currentStep,
      presentationActive,
      guardError: validationError,
      isBlocked
    },
    computed: {
      activeScenario,
      allowedSteps
    },
    actions: {
      setCurrentStep,
      setPresentationActive,
      handleSelectScenario,
      handleAcknowledgeDisclosure
    }
  };
}
