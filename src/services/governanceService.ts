import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GovernanceConfig, AuditLog } from '../types/governance';
import { DataAccessContext } from '../core/security/data-access-context';
import { GovernedRepositoryWrapper } from '../core/security/governed-repository';

const CONFIG_COLLECTION = 'configuracoes_governanca';
const LOGS_COLLECTION = 'audit_logs';

export const governanceService = {
  async getFirestoreDocs(q: any): Promise<any> {
    return getDocs(q);
  },

  async getConfig(context: DataAccessContext): Promise<GovernanceConfig | null> {
    return GovernedRepositoryWrapper.execute(context, async () => {
      try {
        const q = query(collection(db, CONFIG_COLLECTION), limit(1));
        const snap = await this.getFirestoreDocs(q);
        if (!snap.empty) {
          return { id: snap.docs[0].id, ...snap.docs[0].data() } as GovernanceConfig;
        }
        return null;
      } catch (error) {
        console.error('Error fetching governance config:', error);
        return null;
      }
    });
  },

  async updateConfig(context: DataAccessContext, id: string, config: Partial<GovernanceConfig>): Promise<void> {
    return GovernedRepositoryWrapper.execute(context, async () => {
      try {
        const docRef = doc(db, CONFIG_COLLECTION, id);
        await updateDoc(docRef, {
          ...config,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error updating governance config:', error);
        throw error;
      }
    });
  },

  async logAction(context: DataAccessContext, log: Omit<AuditLog, 'timestamp' | 'id' | 'ip' | 'user_agent' | 'protocolo'>): Promise<string> {
    // Log writing might be an exception to strict rules, but we wrap it to ensure caller provides context.
    return GovernedRepositoryWrapper.execute(context, async () => {
      try {
        const protocol = `PRT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const payload: AuditLog = {
          ...log,
          protocolo: protocol,
          ip: 'N/A', // Browser doesn't give IP easily, usually handled on backend
          user_agent: navigator.userAgent,
          timestamp: serverTimestamp() as any
        };

        await addDoc(collection(db, LOGS_COLLECTION), payload);
        return protocol;
      } catch (error) {
        console.error('Error logging action:', error);
        return 'ERROR';
      }
    });
  },

  async getLogs(context: DataAccessContext, filters: { userId?: string, clienteId?: string } = {}): Promise<AuditLog[]> {
    return GovernedRepositoryWrapper.execute(context, async () => {
      try {
        let q = query(collection(db, LOGS_COLLECTION), orderBy('timestamp', 'desc'), limit(100));
        
        if (filters.userId) {
          q = query(q, where('user_id', '==', filters.userId));
        }
        if (filters.clienteId) {
          q = query(q, where('cliente_ativo_id', '==', filters.clienteId));
        }

        const snap = await this.getFirestoreDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog));
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        return [];
      }
    });
  },

  async getDashboardIndicators(context: DataAccessContext, clientId: string): Promise<any[]> {
    if (!clientId) throw new Error('Client ID is required');
    const cleanId = clientId.trim();

    return GovernedRepositoryWrapper.execute(context, async () => {
      try {
        const q = query(
          collection(db, 'indicators'),
          where('clientId', '==', cleanId)
        );
        const snap = await this.getFirestoreDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (error) {
        console.error('Error fetching indicators:', error);
        return [];
      }
    });
  },

  async getAuditEvents(context: DataAccessContext, filters: { tenantId?: string } = {}): Promise<any[]> {
    return GovernedRepositoryWrapper.execute(context, async () => {
      try {
        const activeTenant = context.tenantId;
        const isSuperAdmin = context.role === 'SUPER_ADMIN';
        const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;

        let q;
        if (isSuperAdmin && !filters.tenantId) {
          // Super admin gets global view if no tenant filter is set
          q = query(
            collection(db, 'audit_events'),
            orderBy('timestamp', 'desc'),
            limit(100)
          );
        } else {
          q = query(
            collection(db, 'audit_events'),
            where('tenantId', '==', targetTenant),
            orderBy('timestamp', 'desc'),
            limit(100)
          );
        }

        const snap = await this.getFirestoreDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      } catch (error) {
        console.error('Error fetching audit events:', error);
        return [];
      }
    });
  },

  async getAnomalies(context: DataAccessContext, filters: { tenantId?: string } = {}): Promise<any[]> {
    return GovernedRepositoryWrapper.execute(context, async () => {
      try {
        const activeTenant = context.tenantId;
        const isSuperAdmin = context.role === 'SUPER_ADMIN';
        const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;

        let q;
        if (isSuperAdmin && !filters.tenantId) {
          // Super admin gets global view if no tenant filter is set
          q = query(
            collection(db, 'anomalies'),
            orderBy('detectedAt', 'desc'),
            limit(100)
          );
        } else {
          q = query(
            collection(db, 'anomalies'),
            where('tenantId', '==', targetTenant),
            orderBy('detectedAt', 'desc'),
            limit(100)
          );
        }

        const snap = await this.getFirestoreDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      } catch (error) {
        console.error('Error fetching anomalies:', error);
        return [];
      }
    });
  },

  async getJobs(context: DataAccessContext, filters: { tenantId?: string, state?: string } = {}): Promise<any[]> {
    return GovernedRepositoryWrapper.execute(context, async () => {
      try {
        const activeTenant = context.tenantId;
        const isSuperAdmin = context.role === 'SUPER_ADMIN';
        const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;

        let q;
        if (isSuperAdmin && !filters.tenantId) {
          q = query(
            collection(db, 'institutional_jobs'),
            orderBy('createdAt', 'desc'),
            limit(100)
          );
        } else {
          q = query(
            collection(db, 'institutional_jobs'),
            where('tenantId', '==', targetTenant),
            orderBy('createdAt', 'desc'),
            limit(100)
          );
        }

        const snap = await this.getFirestoreDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
      }
    });
  },

  async getPressureIncidents(context: DataAccessContext, filters: { tenantId?: string } = {}): Promise<any[]> {
    return GovernedRepositoryWrapper.execute(context, async () => {
      try {
        const activeTenant = context.tenantId;
        const isSuperAdmin = context.role === 'SUPER_ADMIN';
        const targetTenant = isSuperAdmin ? (filters.tenantId || activeTenant) : activeTenant;

        let q;
        if (isSuperAdmin && !filters.tenantId) {
          q = query(
            collection(db, 'runtime_pressure'),
            orderBy('detectedAt', 'desc'),
            limit(100)
          );
        } else {
          q = query(
            collection(db, 'runtime_pressure'),
            where('tenantId', '==', targetTenant),
            orderBy('detectedAt', 'desc'),
            limit(100)
          );
        }

        const snap = await this.getFirestoreDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (error) {
        console.error('Error fetching pressure incidents:', error);
        return [];
      }
    });
  }
};
