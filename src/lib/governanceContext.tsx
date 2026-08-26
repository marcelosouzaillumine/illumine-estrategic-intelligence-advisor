import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { UserRole, GovernanceConfig } from '../types/governance';
import { governanceService } from '../services/governanceService';
import { DataAccessContext } from '../core/security/data-access-context';
import { useExecutiveContext } from '../contexts/ExecutiveContext';

const POLICY_VERSION = "1.0.2";

interface GovernanceContextType {
  role: UserRole;
  isAccepted: boolean;
  config: GovernanceConfig | null;
  loading: boolean;
  setAccepted: (accepted: boolean) => Promise<void>;
  refreshConfig: () => Promise<void>;
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

export function GovernanceProvider({ children, user }: { children: React.ReactNode, user: User | null }) {
  const { context, loading: execLoading } = useExecutiveContext();
  const [role, setRole] = useState<UserRole>('cliente');
  const [isAccepted, setIsAccepted] = useState(false);
  const [config, setConfig] = useState<GovernanceConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initGovernance() {
      if (execLoading) return; // Wait for the executive context

      if (!user || !context) {
        setLoading(false);
        return;
      }

      try {
        // 1. Determine Role from ExecutiveContext
        let currentRole: UserRole = 'cliente';
        if (context.capabilities.includes('SYSTEM.OBSERVABILITY.VIEW')) {
          currentRole = 'master'; // Mapping new capabilities to legacy UserRole string for UI compatibility
        } else {
          // You could map context.membership.roleCode to UserRole here
          currentRole = 'cliente';
        }
        setRole(currentRole);

        // 2. Check Acceptance (Terms of service/Privacy policy)
        // This is a legitimate governance concern, keep it hitting firestore or a future LegalService.
        const acceptanceDoc = await getDoc(doc(db, 'user_acceptances', user.uid));
        if (acceptanceDoc.exists()) {
          const data = acceptanceDoc.data();
          setIsAccepted(data.accepted);
        }

        // 3. Get Global Config
        const systemContext: DataAccessContext = {
          actorId: context.user.id,
          tenantId: context.tenant.id,
          role: 'SUPER_ADMIN',
          permissions: ['VIEW_OBSERVABILITY'],
          entityScope: { tenantId: 'SYSTEM', requestedEntityScope: 'ENTITY', entityId: 'SYSTEM', allowedEntityIds: ['SYSTEM'], allowedGroupIds: [], consolidatedScope: true },
          requestedAction: 'VIEW_OBSERVABILITY',
          resourceType: 'Config',
          resourceTenantId: 'SYSTEM',
          visibilityPolicy: 'INTERNAL',
          auditRequirement: false
        };
        const govConfig = await governanceService.getConfig(systemContext);
        setConfig(govConfig);

      } catch (error) {
        console.error('Error initializing governance:', error);
      } finally {
        setLoading(false);
      }
    }

    initGovernance();
  }, [user, context, execLoading]);

  const setAccepted = async (accepted: boolean) => {
    if (!user) return;
    try {
      (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // setDoc(doc(db, 'user_acceptances', user.uid), {
        accepted,
        acceptedAt: serverTimestamp(),
        userId: user.uid,
        email: user.email,
        version: POLICY_VERSION
      });
      setIsAccepted(accepted);
    } catch (error) {
      console.error('Error saving acceptance:', error);
    }
  };

  const refreshConfig = async () => {
    if (!context) return;
    const systemContext: DataAccessContext = {
      actorId: context.user.id,
      tenantId: context.tenant.id,
      role: 'SUPER_ADMIN',
      permissions: ['VIEW_OBSERVABILITY'],
      entityScope: { tenantId: 'SYSTEM', requestedEntityScope: 'ENTITY', entityId: 'SYSTEM', allowedEntityIds: ['SYSTEM'], allowedGroupIds: [], consolidatedScope: true },
      requestedAction: 'VIEW_OBSERVABILITY',
      resourceType: 'Config',
      resourceTenantId: 'SYSTEM',
      visibilityPolicy: 'INTERNAL',
      auditRequirement: false
    };
    const govConfig = await governanceService.getConfig(systemContext);
    setConfig(govConfig);
  };

  return (
    <GovernanceContext.Provider value={{ role, isAccepted, config, loading, setAccepted, refreshConfig }}>
      {children}
    </GovernanceContext.Provider>
  );
}

export const useGovernance = () => {
  const context = useContext(GovernanceContext);
  if (context === undefined) {
    throw new Error('useGovernance must be used within a GovernanceProvider');
  }
  return context;
}
