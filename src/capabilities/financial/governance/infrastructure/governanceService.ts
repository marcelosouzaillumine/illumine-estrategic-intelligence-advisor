import { serverTimestamp } from 'firebase/firestore';
import { FirestoreGovernanceAdapter } from '../../../../adapters/persistence/FirestoreGovernanceAdapter';

import { GovernanceConfig, AuditLog } from '../../../../types/governance';
import { DataAccessContext } from '../../../../core/security/data-access-context';
import { GovernedRepositoryWrapper } from '../../../../core/security/governed-repository';

const CONFIG_COLLECTION = 'configuracoes_governanca';
const LOGS_COLLECTION = 'audit_logs';

export const governanceService = {
  async getFirestoreDocs(q: any): Promise<any> {
    // Mock wrapper for tests, although we now use adapters.
    // In the future tests should mock adapters.
    return { docs: [] };
  },

  async getConfig(context: DataAccessContext): Promise<GovernanceConfig | null> {
    return GovernedRepositoryWrapper.execute(context, async () => {
      try {
        return await FirestoreGovernanceAdapter.getConfig();
      } catch (error) {
        console.error('Error fetching governance config:', error);
        return null;
      }
    });
  },

  async updateConfig(context: DataAccessContext, id: string, config: Partial<GovernanceConfig>): Promise<void> {
    return GovernedRepositoryWrapper.execute(context, async () => {
      try {
        await FirestoreGovernanceAdapter.updateConfig(id, config);
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

        await FirestoreGovernanceAdapter.logAction(payload);
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
        return await FirestoreGovernanceAdapter.getLogs(filters);
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
        return await FirestoreGovernanceAdapter.getDashboardIndicators(cleanId);
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
        const isGlobal = isSuperAdmin && !filters.tenantId;

        return await FirestoreGovernanceAdapter.getAuditEvents(targetTenant || '', !!isGlobal);
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
        const isGlobal = isSuperAdmin && !filters.tenantId;

        return await FirestoreGovernanceAdapter.getAnomalies(targetTenant || '', !!isGlobal);
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
        const isGlobal = isSuperAdmin && !filters.tenantId;

        return await FirestoreGovernanceAdapter.getJobs(targetTenant || '', !!isGlobal);
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
        const isGlobal = isSuperAdmin && !filters.tenantId;

        return await FirestoreGovernanceAdapter.getPressureIncidents(targetTenant || '', !!isGlobal);
      } catch (error) {
        console.error('Error fetching pressure incidents:', error);
        return [];
      }
    });
  }
};
