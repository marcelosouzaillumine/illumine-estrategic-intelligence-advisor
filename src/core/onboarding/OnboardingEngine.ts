import { AuditEventBus } from '../security/audit/AuditEventBus';

export type OnboardingStage =
  | 'FIRST_TENANT_SETUP'
  | 'EXECUTIVE_ACTIVATION'
  | 'GOVERNANCE_READINESS'
  | 'SIMULATION_ENABLEMENT'
  | 'ADVISORY_ACTIVATION'
  | 'HEALTH_INITIALIZED'
  | 'COMPLETED';

export interface OnboardingState {
  tenantId: string;
  stage: OnboardingStage;
  isolationValidated: boolean;
  topologyValidated: boolean;
  entityScopeConfigured: boolean;
  minRolesAssigned: boolean;
  telemetryActive: boolean;
  observabilityActive: boolean;
  initialBalanceSheetBalanced: boolean;
  advisoryRuntimeOperational: boolean;
  governanceReadiness: boolean;
  onboardingCompleted: boolean;
}

export class OnboardingEngine {
  private static states: Record<string, OnboardingState> = {};

  public static getOnboardingState(tenantId: string): OnboardingState {
    if (!this.states[tenantId]) {
      this.states[tenantId] = {
        tenantId,
        stage: 'FIRST_TENANT_SETUP',
        isolationValidated: false,
        topologyValidated: false,
        entityScopeConfigured: false,
        minRolesAssigned: false,
        telemetryActive: false,
        observabilityActive: false,
        initialBalanceSheetBalanced: false,
        advisoryRuntimeOperational: false,
        governanceReadiness: false,
        onboardingCompleted: false
      };
    }
    return { ...this.states[tenantId] };
  }

  public static updateState(tenantId: string, updates: Partial<OnboardingState>): OnboardingState {
    const current = this.getOnboardingState(tenantId);
    const updated = { ...current, ...updates };

    // Recalculate governanceReadiness
    updated.governanceReadiness = 
      updated.isolationValidated &&
      updated.topologyValidated &&
      updated.entityScopeConfigured &&
      updated.minRolesAssigned &&
      updated.telemetryActive &&
      updated.observabilityActive &&
      updated.initialBalanceSheetBalanced &&
      updated.advisoryRuntimeOperational;

    this.states[tenantId] = updated;
    return updated;
  }

  /**
   * Transitions onboarding stage with strict validation checks and audit logging.
   */
  public static transitionTo(tenantId: string, nextStage: OnboardingStage, actorId: string): OnboardingState {
    const current = this.getOnboardingState(tenantId);

    // Validate transition path
    const stagesOrder: OnboardingStage[] = [
      'FIRST_TENANT_SETUP',
      'EXECUTIVE_ACTIVATION',
      'GOVERNANCE_READINESS',
      'SIMULATION_ENABLEMENT',
      'ADVISORY_ACTIVATION',
      'HEALTH_INITIALIZED',
      'COMPLETED'
    ];

    const currentIdx = stagesOrder.indexOf(current.stage);
    const nextIdx = stagesOrder.indexOf(nextStage);

    if (nextIdx !== currentIdx + 1 && nextStage !== current.stage) {
      throw new Error(`[Onboarding Engine] Transição inválida de ${current.stage} para ${nextStage}`);
    }

    // Validation rules per transition
    if (nextStage === 'COMPLETED') {
      if (!current.governanceReadiness) {
        throw new Error('[Onboarding Engine] Rejeitado: Onboarding não pode ser concluído sem governanceReadiness completo (readiness institucional mínimo pendente).');
      }
      if (!current.topologyValidated) {
        throw new Error('[Onboarding Engine] Rejeitado: Onboarding concluído exige topologia válida.');
      }
    }

    const updated = this.updateState(tenantId, { stage: nextStage });
    if (nextStage === 'COMPLETED') {
      this.updateState(tenantId, { onboardingCompleted: true });
      updated.onboardingCompleted = true;
    }

    // Log the transition audit trail
    AuditEventBus.emit({
      tenantId,
      actorId,
      role: 'SYSTEM',
      sessionId: 'SYSTEM_ONBOARDING',
      eventType: 'ONBOARDING_STAGE_TRANSITION',
      resourceType: 'Onboarding',
      auditSeverity: 'INFO',
      requestSource: 'OnboardingEngine',
      metadata: { fromStage: current.stage, toStage: nextStage }
    });

    return updated;
  }

  /**
   * Initializes health indicators for the active tenant.
   */
  public static initializeHealth(tenantId: string, actorId: string): void {
    const state = this.getOnboardingState(tenantId);
    if (state.stage !== 'HEALTH_INITIALIZED' && state.stage !== 'COMPLETED') {
      this.transitionTo(tenantId, 'HEALTH_INITIALIZED', actorId);
    }
    
    AuditEventBus.emit({
      tenantId,
      actorId,
      role: 'SYSTEM',
      sessionId: 'SYSTEM_ONBOARDING',
      eventType: 'ONBOARDING_HEALTH_INITIALIZED',
      resourceType: 'Onboarding',
      auditSeverity: 'INFO',
      requestSource: 'OnboardingEngine',
      metadata: { status: 'HEALTH_OK' }
    });
  }
}
