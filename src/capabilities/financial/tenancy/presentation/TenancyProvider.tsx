import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdvisorWorkspaceContext, TenantPermission } from '../../../../platform/tenant/TenancyTypes';
import { WorkspaceResolver } from '../../../../platform/tenant/WorkspaceResolver';
import { PermissionMatrixResolver } from '../../../../platform/tenant/PermissionMatrixResolver';
import { TenantAuditLogger } from '../../../../platform/tenant/TenantAuditLogger';

interface TenancyContextType {
  context: AdvisorWorkspaceContext | null;
  permissions: TenantPermission | null;
  isTenantResolved: boolean;
  loading: boolean;
  switchWorkspace: (workspaceId: string, groupId: string) => Promise<void>;
}

const TenancyContext = createContext<TenancyContextType>({
  context: null,
  permissions: null,
  isTenantResolved: false,
  loading: true,
  switchWorkspace: async () => {}
});

export const useTenancy = () => useContext(TenancyContext);

export function TenancyProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<AdvisorWorkspaceContext | null>(null);
  const [permissions, setPermissions] = useState<TenantPermission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao iniciar, tenta resolver o tenant do usuário logado (usando um mock userId)
    WorkspaceResolver.resolveDefaultContext('mock-user-123').then(ctx => {
      if (ctx) {
        setContext(ctx);
        setPermissions(PermissionMatrixResolver.resolvePermissions(ctx.role));
      }
      setLoading(false);
    });
  }, []);

  const switchWorkspace = async (newWorkspaceId: string, newGroupId: string) => {
    if (!context) return;
    setLoading(true);
    
    // Registra a troca no Audit Log
    await TenantAuditLogger.logAction(context.activeTenantId, newWorkspaceId, 'mock-user-123', 'SWITCH_WORKSPACE', { from: context.activeWorkspaceId, to: newWorkspaceId });

    // Atualiza o contexto
    setContext({
      ...context,
      activeWorkspaceId: newWorkspaceId,
      activeGroupId: newGroupId
    });

    // TODO: Invalidation de Caches globais e de Observabilidade ocorreriam aqui

    setLoading(false);
  };

  return (
    <TenancyContext.Provider value={{
      context,
      permissions,
      isTenantResolved: !!context,
      loading,
      switchWorkspace
    }}>
      {children}
    </TenancyContext.Provider>
  );
}
