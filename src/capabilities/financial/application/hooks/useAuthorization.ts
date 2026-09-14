import { useExecutiveContext } from '../../../../contexts/ExecutiveContext';
import { AuthorizationDecisionEngine } from '../../../../core/security/auth/AuthorizationDecisionEngine';
import { SystemCapability } from '../../../../domain/authorization/Capabilities';
import { useState, useEffect } from 'react';

export function useAuthorization() {
  const { context, loading, error } = useExecutiveContext();

  const can = (capability: SystemCapability, options?: { explain?: boolean }): boolean | { allowed: boolean; reason: string; required: SystemCapability } => {
    if (loading || error || !context) {
      if (options?.explain) return { allowed: false, reason: 'CONTEXT_UNAVAILABLE', required: capability };
      return false;
    }
    
    const hasCapability = context.capabilities.includes(capability);
    
    if (options?.explain) {
      return { 
        allowed: hasCapability, 
        reason: hasCapability ? 'ROLE_PERMISSION_MATCH' : 'MISSING_PERMISSION',
        required: capability 
      };
    }

    return hasCapability;
  };

  const authorizeAsync = async (capability: SystemCapability) => {
    if (loading || error || !context) return { allowed: false, reason: 'CONTEXT_UNAVAILABLE' };
    return AuthorizationDecisionEngine.authorize({ context, capability });
  };

  return { can, authorizeAsync, loading, error };
}
