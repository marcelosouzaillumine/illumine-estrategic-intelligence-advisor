import { DataAccessContext } from './data-access-context';
import { PermissionEngine } from './permission-engine';

export class GovernedRepositoryError extends Error {
  constructor(message: string, public readonly decisionCode: string) {
    super(message);
    this.name = 'GovernedRepositoryError';
  }
}

export class GovernedRepositoryWrapper {
  /**
   * Envolve qualquer operação de acesso a dados (leitura ou escrita) sob a governança do tenant.
   * Lança erro caso o acesso seja negado.
   * Registra log se auditRequired = true.
   */
  static async execute<T>(
    context: DataAccessContext,
    operation: () => Promise<T>
  ): Promise<T> {
    if (!context) {
      throw new GovernedRepositoryError('Acesso negado: Contexto de governança ausente (DENY_MISSING_CONTEXT)', 'DENY_MISSING_CONTEXT');
    }

    // SYSTEM rules enforcement
    if (context.tenantId === 'SYSTEM' || context.actorId === 'SYSTEM') {
      if (!context.requestSource || !context.operation) {
        throw new GovernedRepositoryError('SYSTEM context requires requestSource and operation explicitly', 'DENY_SYSTEM_CONTEXT_INVALID');
      }
    }

    // Fiduciary checks
    if (context.requestedAction === 'CREATE_SNAPSHOT') {
      if (!context.lineageHash || !context.inputHash) {
        throw new GovernedRepositoryError('Fiduciary snapshots must provide lineageHash and inputHash', 'DENY_FIDUCIARY_REQUIREMENT_MISSING');
      }
    }
    
    if (context.requestedAction === 'CREATE_BOARD_PACK') {
      if (!context.lineageHash) {
        throw new GovernedRepositoryError('Board packs must provide lineageHash', 'DENY_FIDUCIARY_REQUIREMENT_MISSING');
      }
    }

    if (context.requestedAction === 'CREATE_SIMULATION') {
      if (!context.scenarioHash) {
         throw new GovernedRepositoryError('Simulations must provide scenarioHash', 'DENY_FIDUCIARY_REQUIREMENT_MISSING');
      }
    }

    const decision = PermissionEngine.evaluatePermission({
      tenantId: context.tenantId,
      actorId: context.actorId,
      userRole: context.role,
      permissions: context.permissions,
      requestedAction: context.requestedAction,
      resourceType: context.resourceType,
      resourceTenantId: context.resourceTenantId,
      entityScope: context.entityScope,
      visibilityPolicy: context.visibilityPolicy,
      approvalState: context.approvalState,
      resourceOwnerId: context.resourceOwnerId,
      auditRequirement: context.auditRequirement
    });

    if (!decision.allowed) {
      throw new GovernedRepositoryError(`Acesso negado: ${decision.reason} (${decision.decisionCode})`, decision.decisionCode);
    }

    // O ideal aqui é injetar o serviço de auditoria em produção,
    // Mas mantemos a lógica isolada conforme o guideline de não alterar dependências externas complexas.
    if (decision.auditRequired) {
      console.log(`[AUDIT] Action: ${context.requestedAction} | Actor: ${context.actorId} | Resource: ${context.resourceType} | Target Tenant: ${context.resourceTenantId} | Correlation: ${context.correlationId || 'N/A'}`);
      // Futuro: await AuditService.log(...)
    }

    // A permissão foi validada com sucesso, executa a operação
    return await operation();
  }
}
