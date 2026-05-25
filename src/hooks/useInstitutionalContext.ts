import { useState, useEffect } from 'react';
import { OfficialRole, OfficialAction, EntityScopeEvaluationInput } from '../core/security/types';
// import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface InstitutionalContextData {
  actorId: string;
  tenantId: string;
  role: OfficialRole;
  permissions: OfficialAction[];
  entityScope: EntityScopeEvaluationInput;
  legacyTenantId?: string;
  isLegacyContext: boolean;
  isContextReady: boolean;
  contextSource: string;
}

export function useInstitutionalContext(): InstitutionalContextData {
  // const { user } = useAuth();
  const user: any = { uid: 'mock-user' };
  const [contextData, setContextData] = useState<InstitutionalContextData>({
    actorId: '',
    tenantId: '',
    role: 'OPERATIONAL_USER',
    permissions: [],
    entityScope: {
      tenantId: '',
      requestedEntityScope: 'ENTITY',
      entityId: '',
      allowedEntityIds: [],
      allowedGroupIds: [],
      consolidatedScope: false
    },
    isLegacyContext: false,
    isContextReady: false,
    contextSource: 'INITIALIZING'
  });

  useEffect(() => {
    async function resolveContext() {
      if (!user) {
        setContextData(prev => ({ ...prev, isContextReady: true, contextSource: 'UNAUTHENTICATED' }));
        return;
      }

      // Mock temporário simulando transição para auth institucional
      // Em produção, isso viria de um JWT ou Claims do Firebase
      
      let tenantId = 'tenant-1'; 
      let legacyTenantId = 'clientId-legado';
      let role: OfficialRole = 'CFO'; // Default simulado para a UI fluir, mas testaremos variações
      
      // Tentativa de obter claims reais se existirem (exemplo futuro)
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.tenantId) tenantId = data.tenantId;
          if (data.role) role = data.role as OfficialRole;
        }
      } catch (e) {
        // Ignora erro de firebase se mockado
      }

      setContextData({
        actorId: user.uid || 'user-cfo',
        tenantId: tenantId,
        role: role,
        permissions: ['VIEW_DASHBOARD', 'VIEW_FINANCIALS', 'VIEW_EXECUTIVE_ADVISORY', 'VIEW_OBSERVABILITY'],
        entityScope: {
          tenantId: tenantId,
          requestedEntityScope: 'ENTITY',
          entityId: tenantId,
          allowedEntityIds: [tenantId],
          allowedGroupIds: [],
          consolidatedScope: false
        },
        legacyTenantId: legacyTenantId,
        isLegacyContext: true, // Marcado como transitório conforme DIRETRIZ
        isContextReady: true,
        contextSource: 'TRANSITIONAL_MOCK'
      });
    }

    resolveContext();
  }, [user]);

  return contextData;
}
