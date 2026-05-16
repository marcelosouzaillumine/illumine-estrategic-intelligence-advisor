
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { GovernanceConfig, AuditLog, UserRole } from '../types/governance';

const CONFIG_COLLECTION = 'configuracoes_governanca';
const LOGS_COLLECTION = 'audit_logs';

export const governanceService = {
  async getConfig(): Promise<GovernanceConfig | null> {
    try {
      const q = query(collection(db, CONFIG_COLLECTION), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as GovernanceConfig;
      }
      return null;
    } catch (error) {
      console.error('Error fetching governance config:', error);
      return null;
    }
  },

  async updateConfig(id: string, config: Partial<GovernanceConfig>): Promise<void> {
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
  },

  async logAction(log: Omit<AuditLog, 'timestamp' | 'id' | 'ip' | 'user_agent' | 'protocolo'>): Promise<string> {
    try {
      const protocol = `PRT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const payload: AuditLog = {
        ...log,
        protocolo: protocol,
        ip: 'N/A', // Browser doesn't give IP easily, usually handled on backend
        user_agent: navigator.userAgent,
        timestamp: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, LOGS_COLLECTION), payload);
      return protocol;
    } catch (error) {
      console.error('Error logging action:', error);
      return 'ERROR';
    }
  },

  async getLogs(filters: { userId?: string, clienteId?: string } = {}): Promise<AuditLog[]> {
    try {
      let q = query(collection(db, LOGS_COLLECTION), orderBy('timestamp', 'desc'), limit(100));
      
      if (filters.userId) {
        q = query(q, where('user_id', '==', filters.userId));
      }
      if (filters.clienteId) {
        q = query(q, where('cliente_ativo_id', '==', filters.clienteId));
      }

      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  }
};
