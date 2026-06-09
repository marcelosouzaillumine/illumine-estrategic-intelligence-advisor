import { logger } from "../../../services/logging/InstitutionalLogger";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, logout as firebaseLogout } from '../../../lib/firebase';
import { InstitutionalSession } from './InstitutionalSession';
import { TenantResolutionEngine } from './TenantResolutionEngine';
import { SessionGovernanceLayer } from './SessionGovernanceLayer';

interface InstitutionalAuthContextData {
  session: InstitutionalSession | null;
  loading: boolean;
  activateTenant: (tenantId: string) => void;
  logout: () => Promise<void>;
  user: User | null;
}

const InstitutionalAuthContext = createContext<InstitutionalAuthContextData>({
  session: null,
  loading: true,
  activateTenant: () => {},
  logout: async () => {},
  user: null,
});

export const useInstitutionalAuth = () => {
  if ((globalThis as any).__mockUseInstitutionalAuth) {
    return (globalThis as any).__mockUseInstitutionalAuth();
  }
  return useContext(InstitutionalAuthContext);
};

export const InstitutionalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<InstitutionalSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      setLoading(true);
      
      if (!firebaseUser) {
        setUser(null);
        setSession(null);
        setLoading(false);
        return;
      }

      try {
        setUser(firebaseUser);
        const resolvedSession = await TenantResolutionEngine.resolve(firebaseUser);
        setSession(resolvedSession);
        
        if (resolvedSession.sessionState === 'READY' || resolvedSession.sessionState === 'TENANT_SELECTION_REQUIRED') {
           await SessionGovernanceLayer.emitTelemetry('SESSION_START', resolvedSession.sessionId, firebaseUser.uid, {
             email: firebaseUser.email,
             state: resolvedSession.sessionState,
             availableTenants: resolvedSession.availableTenants.length
           });
        }

      } catch (error) {
        logger.error('Session resolution failed', error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const activateTenant = async (tenantId: string) => {
    if (!session || session.sessionState === 'DENIED') return;
    
    const newSession = TenantResolutionEngine.activateTenant(session, tenantId);
    setSession(newSession);

    if (newSession.sessionState === 'READY') {
      await SessionGovernanceLayer.emitTelemetry('TENANT_SELECTION', newSession.sessionId, newSession.actorId, {
        selectedTenantId: tenantId,
        role: newSession.role
      });
    } else {
      await SessionGovernanceLayer.emitTelemetry('DENIED_RESOLUTION', newSession.sessionId, newSession.actorId, {
        attemptedTenantId: tenantId
      });
    }
  };

  const logout = async () => {
    if (session) {
      await SessionGovernanceLayer.emitTelemetry('SESSION_END', session.sessionId, session.actorId);
    }
    await firebaseLogout();
    setUser(null);
    setSession(null);
  };

  return (
    <InstitutionalAuthContext.Provider value={{ session, loading, activateTenant, logout, user }}>
      {children}
    </InstitutionalAuthContext.Provider>
  );
};
