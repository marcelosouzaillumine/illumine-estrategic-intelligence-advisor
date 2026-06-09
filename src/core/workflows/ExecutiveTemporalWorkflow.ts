export type TemporalWorkflowState = 
  | 'BOARD_INTERVENTION'
  | 'CRITICAL_GOVERNANCE_REVIEW'
  | 'EXECUTIVE_SIGNOFF_REQUIRED'
  | 'TEMPORAL_ESCALATION_REVIEW'
  | 'RECURRENCE_ESCALATION_ACKNOWLEDGEMENT';

export interface DataAccessContext {
  tenantId: string;
  entityScope: string[];
  actorId: string;
  roles: string[];
}

export interface WorkflowTransitionPayload {
  context: DataAccessContext;
  tenantId: string;
  entityScope: string;
  lineageHash: string;
  auditReference: string;
  escalationEvidence: string[];
  visibilityPolicy: string;
  targetState: TemporalWorkflowState;
  correlationId?: string;
}

export interface WorkflowTransitionResult {
  success: boolean;
  newState?: TemporalWorkflowState;
  auditEventId?: string;
  error?: string;
}

export class ExecutiveTemporalWorkflow {
  /**
   * Processa uma transição de estado de workflow temporal, exigindo linhagem e evidências fiduciárias.
   */
  static processTransition(payload: WorkflowTransitionPayload): WorkflowTransitionResult {
    // 1. Validação de isolamento e contexto
    if (payload.tenantId !== payload.context.tenantId) {
      return { success: false, error: 'CROSS_TENANT_BLOCKED' };
    }
    
    if (!payload.context.entityScope.includes(payload.entityScope)) {
      return { success: false, error: 'OUT_OF_SCOPE' };
    }

    // 2. Validação de SSOT e Lineage
    if (!payload.lineageHash) {
      return { success: false, error: 'MISSING_LINEAGE_HASH' };
    }

    if (!payload.auditReference) {
      return { success: false, error: 'MISSING_AUDIT_REFERENCE' };
    }

    // 3. Regras Específicas de Estado (Mock de exemplo de regra de autorização rígida)
    if (payload.targetState === 'BOARD_INTERVENTION') {
      if (!payload.context.roles.includes('BOARD_MEMBER') && !payload.context.roles.includes('CFO')) {
         return { success: false, error: 'UNAUTHORIZED_ROLE' };
      }
    }

    // Acknowledge de recorrência preserva correlationId obrigatório (regra do teste)
    if (payload.targetState === 'RECURRENCE_ESCALATION_ACKNOWLEDGEMENT') {
      if (!payload.correlationId) {
         return { success: false, error: 'MISSING_CORRELATION_ID' };
      }
    }

    // 4. Efetivar transição (Geração de Audit Evento Fictício por enquanto, será salvo via runtime oficial)
    const auditEventId = `AUDIT-${Date.now()}-${payload.lineageHash.substring(0,6)}`;

    return {
      success: true,
      newState: payload.targetState,
      auditEventId
    };
  }
}
