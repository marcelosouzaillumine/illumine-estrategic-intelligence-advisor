import { db, MASTER_ADMINS } from '../../../lib/firebase';
import { collection, query, where, getDocs, or, doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { OfficialRole, OfficialAction } from '../types';
import { InstitutionalSession, AvailableTenant } from './InstitutionalSession';

// Matriz de Permissões Oficial (RBAC)
const RBAC_PERMISSION_MATRIX: Record<OfficialRole, OfficialAction[]> = {
  SUPER_ADMIN: [
    'VIEW_DASHBOARD', 'VIEW_FINANCIALS', 'VIEW_EXECUTIVE_ADVISORY', 'VIEW_CAUSALITY', 
    'VIEW_OBSERVABILITY', 'CREATE_SIMULATION', 'SHARE_SIMULATION', 'APPROVE_SIMULATION',
    'VIEW_SIMULATION', 'EXPORT_SIMULATION', 'CREATE_SNAPSHOT', 'VIEW_SNAPSHOT', 'EXPORT_SNAPSHOT',
    'CREATE_BOARD_PACK', 'APPROVE_BOARD_PACK', 'VIEW_BOARD_PACK', 'EXPORT_BOARD_PACK',
    'MANAGE_USERS', 'MANAGE_TENANT', 'MANAGE_ENTITY', 'VIEW_AUDIT_LOGS', 'EXECUTE_REPLAY',
    'IMPORT_DATA', 'APPROVE_DATA', 'CONFIGURE_POLICIES', 'CREATE_REPORT'
  ],
  TENANT_ADMIN: [
    'VIEW_DASHBOARD', 'VIEW_FINANCIALS', 'VIEW_EXECUTIVE_ADVISORY', 'VIEW_CAUSALITY',
    'MANAGE_USERS', 'MANAGE_TENANT', 'MANAGE_ENTITY', 'VIEW_AUDIT_LOGS', 'IMPORT_DATA', 
    'CONFIGURE_POLICIES'
  ],
  CFO: [
    'VIEW_DASHBOARD', 'VIEW_FINANCIALS', 'VIEW_EXECUTIVE_ADVISORY', 'VIEW_CAUSALITY',
    'VIEW_OBSERVABILITY', 'CREATE_SIMULATION', 'SHARE_SIMULATION', 'APPROVE_SIMULATION',
    'VIEW_SIMULATION', 'EXPORT_SIMULATION', 'CREATE_SNAPSHOT', 'VIEW_SNAPSHOT', 'EXPORT_SNAPSHOT',
    'CREATE_BOARD_PACK', 'APPROVE_BOARD_PACK', 'VIEW_BOARD_PACK', 'EXPORT_BOARD_PACK',
    'IMPORT_DATA', 'APPROVE_DATA', 'CREATE_REPORT'
  ],
  CONTROLLER: [
    'VIEW_DASHBOARD', 'VIEW_FINANCIALS', 'VIEW_CAUSALITY', 'CREATE_SIMULATION', 
    'VIEW_SIMULATION', 'CREATE_SNAPSHOT', 'VIEW_SNAPSHOT', 'IMPORT_DATA', 'APPROVE_DATA'
  ],
  ADVISOR: [
    'VIEW_DASHBOARD', 'VIEW_FINANCIALS', 'VIEW_EXECUTIVE_ADVISORY', 'VIEW_CAUSALITY',
    'VIEW_SIMULATION', 'CREATE_SIMULATION', 'CREATE_REPORT', 'VIEW_SNAPSHOT'
  ],
  BOARD_MEMBER: [
    'VIEW_DASHBOARD', 'VIEW_FINANCIALS', 'VIEW_EXECUTIVE_ADVISORY', 'VIEW_SIMULATION',
    'VIEW_BOARD_PACK', 'APPROVE_BOARD_PACK'
  ],
  INVESTOR: [
    'VIEW_DASHBOARD', 'VIEW_FINANCIALS', 'VIEW_SIMULATION', 'VIEW_BOARD_PACK'
  ],
  AUDITOR: [
    'VIEW_FINANCIALS', 'VIEW_CAUSALITY', 'VIEW_OBSERVABILITY', 'VIEW_SIMULATION',
    'VIEW_SNAPSHOT', 'VIEW_BOARD_PACK', 'VIEW_AUDIT_LOGS', 'EXECUTE_REPLAY'
  ],
  OPERATIONAL_USER: [
    'VIEW_DASHBOARD', 'VIEW_FINANCIALS', 'IMPORT_DATA'
  ]
};

export class TenantResolutionEngine {
  
  static async getFirestoreDocs(q: any): Promise<any> {
    return getDocs(q);
  }

  static async resolve(user: User): Promise<InstitutionalSession> {
    const userEmail = (user.email || '').toLowerCase().trim();
    const actorId = user.uid;
    const requestSource = 'AuthResolution';
    
    // 1. Super Admin Check
    const isMaster = MASTER_ADMINS.some(email => email.toLowerCase().trim() === userEmail);
    if (isMaster) {
      // Para Super Admins, permitimos selecionar qualquer tenant, mas por padrão exigimos seleção
      // Neste mock da engine, eles operam no tenant 'master'
      const allClientsSnap = await this.getFirestoreDocs(query(collection(db, 'clients')));
      const masterAvailableTenants: AvailableTenant[] = allClientsSnap.docs.map((doc: any) => ({
        tenantId: doc.id,
        name: doc.data().fantasia || doc.data().razao || doc.id,
        role: 'SUPER_ADMIN'
      }));
      return this.buildSession(actorId, 'MASTER', 'SUPER_ADMIN', ['*'], ['*'], true, 'READY', undefined, masterAvailableTenants);
    }

    const availableTenants: AvailableTenant[] = [];

    // 2. Fetch from clients (Owner)
    const ownerQuery = query(collection(db, 'clients'), where('ownerId', '==', actorId));
    const ownerSnap = await this.getFirestoreDocs(ownerQuery);
    ownerSnap.docs.forEach((doc: any) => {
      availableTenants.push({
        tenantId: doc.id,
        name: doc.data().fantasia || doc.data().razao || doc.id,
        role: 'CFO' // Default owner role
      });
    });

    // 3. Fetch from client_users
    const userAssocQuery = query(
      collection(db, 'client_users'),
      or(
        where('email', '==', userEmail),
        where('email', '==', user.email || '')
      )
    );
    const assocSnap = await this.getFirestoreDocs(userAssocQuery);
    assocSnap.docs.forEach((docSnap: any) => {
      const data = docSnap.data();
      if (data.status !== 'Inativo' && data.clientId) {
        if (!availableTenants.some(t => t.tenantId === data.clientId)) {
          availableTenants.push({
            tenantId: data.clientId,
            name: data.clientName || 'Tenant Associado',
            role: (data.role as OfficialRole) || 'OPERATIONAL_USER'
          });
        }
      }
    });

    // 4. Fetch from partners
    const partnerQuery = query(collection(db, 'partners'), where('ownerId', '==', actorId));
    const partnerSnap = await this.getFirestoreDocs(partnerQuery);
    partnerSnap.docs.forEach((docSnap: any) => {
      const data = docSnap.data();
      if (!availableTenants.some(t => t.tenantId === docSnap.id)) {
        availableTenants.push({
          tenantId: docSnap.id,
          name: data.fantasia || data.razao || 'Partner Tenant',
          role: 'TENANT_ADMIN' // Partner acts as Tenant Admin
        });
      }
    });

    // 5. Evaluate available tenants
    if (availableTenants.length === 0) {
      return this.buildSession(actorId, '', 'OPERATIONAL_USER', [], [], false, 'DENIED');
    }

    if (availableTenants.length === 1) {
      const tenant = availableTenants[0];
      return this.buildSession(
        actorId, 
        tenant.tenantId, 
        tenant.role, 
        [tenant.tenantId], 
        [], 
        false, 
        'READY',
        tenant.tenantId,
        availableTenants
      );
    }

    // Múltiplos tenants exigem seleção explícita
    return this.buildSession(
      actorId, 
      '', 
      'OPERATIONAL_USER', 
      [], 
      [], 
      false, 
      'TENANT_SELECTION_REQUIRED',
      undefined,
      availableTenants
    );
  }

  static activateTenant(session: InstitutionalSession, targetTenantId: string): InstitutionalSession {
    const target = session.availableTenants.find(t => t.tenantId === targetTenantId);
    if (!target) {
      return { ...session, sessionState: 'DENIED' };
    }

    const permissions = RBAC_PERMISSION_MATRIX[target.role] || [];
    
    return {
      ...session,
      tenantId: target.tenantId,
      selectedTenantId: target.tenantId,
      role: target.role,
      permissions,
      entityScope: [target.tenantId],
      sessionState: 'READY'
    };
  }

  private static buildSession(
    actorId: string, 
    tenantId: string, 
    role: OfficialRole, 
    entityScope: string[], 
    groupScope: string[], 
    consolidatedScope: boolean,
    sessionState: InstitutionalSession['sessionState'],
    selectedTenantId?: string,
    availableTenants: AvailableTenant[] = []
  ): InstitutionalSession {
    const permissions = sessionState === 'DENIED' ? [] : (RBAC_PERMISSION_MATRIX[role] || []);

    return {
      actorId,
      tenantId,
      role,
      permissions,
      entityScope,
      groupScope,
      consolidatedScope,
      visibilityPolicies: ['INTERNAL', 'PUBLIC_WITHIN_TENANT'], // Default baselines
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authenticatedAt: new Date().toISOString(),
      requestSource: 'InstitutionalSession',
      sessionState,
      selectedTenantId,
      availableTenants
    };
  }
}
