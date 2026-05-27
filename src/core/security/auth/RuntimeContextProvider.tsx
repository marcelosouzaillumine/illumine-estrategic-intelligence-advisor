import React, { createContext, useContext, useMemo } from 'react';
import { InstitutionalSession } from './InstitutionalSession';
import { useInstitutionalAuth } from './InstitutionalAuthProvider';
import { DataAccessContext } from '../data-access-context';
import { OfficialAction, VisibilityPolicy, EntityScopeEvaluationInput } from '../types';

interface RuntimeContextData {
  buildDataAccessContext: (
    requestedAction: OfficialAction,
    resourceType: string,
    resourceTenantId?: string, // Opcional, assume o tenant atual se não fornecido
    resourceOwnerId?: string,
    visibilityPolicy?: VisibilityPolicy,
    approvalState?: string,
    auditRequirement?: boolean,
    fiduciaryRequirements?: {
      lineageHash?: string;
      inputHash?: string;
      scenarioHash?: string;
    }
  ) => DataAccessContext;
  session: InstitutionalSession | null;
  isReady: boolean;
}

const RuntimeContext = createContext<RuntimeContextData>({
  buildDataAccessContext: () => { throw new Error('RuntimeContext not initialized'); },
  session: null,
  isReady: false
});

export const useRuntimeContext = () => useContext(RuntimeContext);

export const RuntimeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useInstitutionalAuth();

  const isReady = !loading && session !== null && session.sessionState === 'READY';

  const buildDataAccessContext = (
    requestedAction: OfficialAction,
    resourceType: string,
    resourceTenantId?: string,
    resourceOwnerId?: string,
    visibilityPolicy?: VisibilityPolicy,
    approvalState?: string,
    auditRequirement?: boolean,
    fiduciaryRequirements?: {
      lineageHash?: string;
      inputHash?: string;
      scenarioHash?: string;
    }
  ): DataAccessContext => {
    if (!isReady || !session) {
      throw new Error('[RuntimeContextProvider] Cannot build DataAccessContext: Institutional Session is not READY');
    }

    const entityScopeInput: EntityScopeEvaluationInput = {
      tenantId: session.tenantId,
      allowedEntityIds: session.entityScope,
      allowedGroupIds: session.groupScope || [],
      consolidatedScope: session.consolidatedScope || false,
      requestedEntityScope: 'ENTITY'
    };

    return {
      actorId: session.actorId,
      tenantId: session.tenantId,
      role: session.role,
      permissions: session.permissions,
      entityScope: entityScopeInput,
      
      requestedAction,
      resourceType,
      resourceTenantId: resourceTenantId || session.tenantId,
      resourceOwnerId,
      visibilityPolicy,
      approvalState,
      auditRequirement,
      
      lineageHash: fiduciaryRequirements?.lineageHash,
      inputHash: fiduciaryRequirements?.inputHash,
      scenarioHash: fiduciaryRequirements?.scenarioHash,

      requestSource: 'RuntimeContextProvider',
      sessionId: session.sessionId
    };
  };

  const value = useMemo(() => ({
    buildDataAccessContext,
    session: isReady ? session : null,
    isReady
  }), [session, isReady]);

  return (
    <RuntimeContext.Provider value={value}>
      {children}
    </RuntimeContext.Provider>
  );
};
