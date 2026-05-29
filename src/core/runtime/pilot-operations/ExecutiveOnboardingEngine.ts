// src/core/runtime/pilot-operations/ExecutiveOnboardingEngine.ts

import { PilotOnboardingState } from './types';

export const ONBOARDING_STEPS = [
  { id: 'SYSTEM_ACTIVATION', label: 'System Activation', description: 'Ativação do ambiente e chaves criptográficas do tenant.' },
  { id: 'WORKSPACE_CONFIGURATION', label: 'Workspace Configuration', description: 'Mapeamento inicial de entidades e escopo fiduciário.' },
  { id: 'CAUSALITY_UNDERSTANDING', label: 'Causality Understanding', description: 'Leitura obrigatória e validação de nexo de causalidade.' },
  { id: 'COMMAND_CENTER_VERIFICATION', label: 'Command Center Verification', description: 'Visita guiada ao painel de controle e auditorias de runtime.' },
  { id: 'SIMULATION_BOUNDARIES', label: 'Simulation Boundaries', description: 'Compreensão de limites: sem IA generativa, sem previsões especulativas.' },
  { id: 'FEEDBACK_SUBMISSION', label: 'Feedback Submission', description: 'Registro de primeiro ponto de fricção ou validação de leitura.' },
  { id: 'BOARD_APPROVAL', label: 'Board Approval', description: 'Assinatura fiduciária eletrônica e liberação de produção.' }
];

export class ExecutiveOnboardingEngine {
  /**
   * Evaluates the onboarding state and returns the next pending step and details.
   */
  public static getProgress(state: PilotOnboardingState) {
    const totalSteps = ONBOARDING_STEPS.length;
    const completedCount = state.completedSteps.length;
    const isComplete = completedCount === totalSteps;
    
    // Find current active step index (first step that is not completed)
    let currentActiveStepIndex = 0;
    for (let i = 0; i < totalSteps; i++) {
      if (!state.completedSteps.includes(ONBOARDING_STEPS[i].id)) {
        currentActiveStepIndex = i;
        break;
      }
    }

    if (isComplete) {
      currentActiveStepIndex = totalSteps - 1;
    }

    const currentStep = ONBOARDING_STEPS[currentActiveStepIndex];

    return {
      completedCount,
      totalSteps,
      progressPercentage: Math.round((completedCount / totalSteps) * 100),
      isComplete,
      currentStep,
      currentActiveStepIndex,
      steps: ONBOARDING_STEPS.map((step, idx) => ({
        ...step,
        isCompleted: state.completedSteps.includes(step.id),
        isLocked: idx > completedCount
      }))
    };
  }

  /**
   * Transition to complete a step. Steps must be completed strictly in order.
   */
  public static completeStep(
    state: PilotOnboardingState,
    stepId: string
  ): { success: boolean; state: PilotOnboardingState; error?: string } {
    const stepIndex = ONBOARDING_STEPS.findIndex(s => s.id === stepId);
    if (stepIndex === -1) {
      return { success: false, state, error: 'INVALID_STEP' };
    }

    // Step must not be already completed
    if (state.completedSteps.includes(stepId)) {
      return { success: true, state };
    }

    // Verify ordering to prevent bypasses/shortcuts
    // Ensure all steps prior to stepIndex are already completed
    for (let i = 0; i < stepIndex; i++) {
      if (!state.completedSteps.includes(ONBOARDING_STEPS[i].id)) {
        return { 
          success: false, 
          state, 
          error: `VIOLATION_ONBOARDING_ORDER: Step '${ONBOARDING_STEPS[i].label}' must be completed before '${ONBOARDING_STEPS[stepIndex].label}'.` 
        };
      }
    }

    const newCompletedSteps = [...state.completedSteps, stepId];
    const newState: PilotOnboardingState = {
      currentStepIndex: stepIndex + 1 >= ONBOARDING_STEPS.length ? ONBOARDING_STEPS.length - 1 : stepIndex + 1,
      completedSteps: newCompletedSteps,
      lastCompletedAt: new Date().toISOString()
    };

    return { success: true, state: newState };
  }
}
