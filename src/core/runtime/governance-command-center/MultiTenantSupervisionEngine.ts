import { TenantRole } from '../tenancy/TenancyTypes';
import { TenantAuditLogger } from '../tenancy/TenantAuditLogger';

export class MultiTenantSupervisionEngine {
  /**
   * Valida se o usuário logado possui a autorização necessária (MASTER_ADMIN ou ADVISOR)
   * para auditar e supervisionar dados multi-inquilino.
   * Registra log de auditoria apropriado no banco de dados.
   */
  public static async validateAndAuditAccess(params: {
    actorId: string;
    actorRole: TenantRole;
    targetTenantId: string;
    actionDescription: string;
    workspaceId: string | null;
  }): Promise<{ isAuthorized: boolean; auditLogged: boolean }> {
    // Apenas MASTER_ADMIN e ADVISOR possuem escopo legítimo de multi-tenant supervision
    const isAuthorized = params.actorRole === 'MASTER_ADMIN' || params.actorRole === 'ADVISOR';

    if (!isAuthorized) {
      // Registrar tentativa de acesso não autorizada
      await TenantAuditLogger.logAction(
        params.targetTenantId,
        params.workspaceId,
        params.actorId,
        'UNAUTHORIZED_ACCESS_ATTEMPT',
        {
          attemptedRole: params.actorRole,
          actionDescription: params.actionDescription
        }
      );
      return { isAuthorized: false, auditLogged: true };
    }

    // Registrar visualização de relatório autorizada
    await TenantAuditLogger.logAction(
      params.targetTenantId,
      params.workspaceId,
      params.actorId,
      'VIEW_REPORT',
      {
        authorizedRole: params.actorRole,
        actionDescription: params.actionDescription
      }
    );

    return { isAuthorized: true, auditLogged: true };
  }
}
