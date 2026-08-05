import React, { createContext, useContext, useEffect, useState } from 'react';
import { ExecutiveContext } from '../core/security/auth/ExecutiveContext';
import { IdentityService } from '../services/IdentityService';
import { TenantService } from '../services/TenantService';
// Assuming you have some Auth adapter to get the current authUid. For now we will mock it or expect it as a prop/from useAuth
// import { useAuthAdapter } from '../adapters/ui/useAuthAdapter';

export interface ExecutiveContextState {
  context?: ExecutiveContext;
  loading: boolean;
  error?: string;
}

const ExecutiveContextReact = createContext<ExecutiveContextState>({
  loading: true,
});

export const ExecutiveContextProvider: React.FC<{
  children: React.ReactNode;
  authUid?: string | null; // Pass from Firebase Auth
  locale?: string;
}> = ({ children, authUid, locale = 'pt-BR' }) => {
  const [state, setState] = useState<ExecutiveContextState>({ loading: true });

  useEffect(() => {
    let isMounted = true;

    async function loadContext() {
      if (!authUid) {
        setState({ loading: false });
        return;
      }

      setState({ loading: true, error: undefined });
      try {
        const identity = await IdentityService.getUserProfile(authUid);
        if (!identity) {
          throw new Error('USER_NOT_FOUND');
        }

        const tenants = await TenantService.getActiveTenantsForUser(identity.user.id);
        if (tenants.length === 0) {
          throw new Error('NO_ACTIVE_TENANT');
        }

        // For now, auto-select the first active tenant.
        // In the future, you could store a last_used_tenant_id preference.
        const currentTenant = tenants[0];

        // This requires an endpoint or method to fetch capabilities based on roleCode + policies.
        // Currently we mock it or fetch it via AuthorizationService.
        // We will just provide empty capabilities here and let AuthorizationDecisionEngine evaluate role.
        // Wait, the context needs capabilities. We will resolve them from DB if possible, or just pass the role.
        // For now, we will leave capabilities empty or fetch them.
        const contextObj: ExecutiveContext = {
          user: identity.user,
          tenant: currentTenant.tenant,
          membership: currentTenant.membership,
          capabilities: [], // Should be hydrated by AuthorizationRepository
          locale,
        };

        if (isMounted) {
          setState({ context: contextObj, loading: false });
        }
      } catch (err: any) {
        if (isMounted) {
          setState({ loading: false, error: err.message || 'UNKNOWN_ERROR' });
        }
      }
    }

    loadContext();

    return () => {
      isMounted = false;
    };
  }, [authUid, locale]);

  return (
    <ExecutiveContextReact.Provider value={state}>
      {children}
    </ExecutiveContextReact.Provider>
  );
};

export function useExecutiveContext() {
  return useContext(ExecutiveContextReact);
}
