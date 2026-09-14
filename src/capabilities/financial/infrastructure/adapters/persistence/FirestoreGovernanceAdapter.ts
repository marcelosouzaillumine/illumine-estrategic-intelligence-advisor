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
import { blockedFirestoreWrite } from '../../../../../lib/blockedFirestoreWrite';
import { db } from '../../../../../lib/firebase';
import { GovernanceConfig, AuditLog } from '../../../../../types/governance';

export class FirestoreGovernanceAdapter {
  static async getConfig(): Promise<GovernanceConfig | null> {
    const q = query(collection(db, 'configuracoes_governanca'), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as GovernanceConfig;
    }
    return null;
  }

  static async updateConfig(id: string, config: Partial<GovernanceConfig>): Promise<void> {
    const docRef = doc(db, 'configuracoes_governanca', id);
    blockedFirestoreWrite(); // updateDoc(docRef, {
      // ...config,
      // updatedAt: serverTimestamp()
    // });
  }

  static async logAction(payload: AuditLog): Promise<void> {
    blockedFirestoreWrite(); // addDoc(collection(db, 'audit_logs'), payload);
  }

  static async getLogs(filters: { userId?: string, clienteId?: string }): Promise<AuditLog[]> {
    let q: any = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(100));
    if (filters.userId) q = query(q, where('user_id', '==', filters.userId));
    if (filters.clienteId) q = query(q, where('cliente_ativo_id', '==', filters.clienteId));
    
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as AuditLog));
  }

  static async getDashboardIndicators(clientId: string): Promise<any[]> {
    const q = query(collection(db, 'indicators'), where('clientId', '==', clientId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  static async getAuditEvents(targetTenant: string, isGlobal: boolean): Promise<any[]> {
    let q;
    if (isGlobal) {
      q = query(collection(db, 'audit_events'), orderBy('timestamp', 'desc'), limit(100));
    } else {
      q = query(collection(db, 'audit_events'), where('tenantId', '==', targetTenant), orderBy('timestamp', 'desc'), limit(100));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  static async getAnomalies(targetTenant: string, isGlobal: boolean): Promise<any[]> {
    let q;
    if (isGlobal) {
      q = query(collection(db, 'anomalies'), orderBy('detectedAt', 'desc'), limit(100));
    } else {
      q = query(collection(db, 'anomalies'), where('tenantId', '==', targetTenant), orderBy('detectedAt', 'desc'), limit(100));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  static async getJobs(targetTenant: string, isGlobal: boolean): Promise<any[]> {
    let q;
    if (isGlobal) {
      q = query(collection(db, 'institutional_jobs'), orderBy('createdAt', 'desc'), limit(100));
    } else {
      q = query(collection(db, 'institutional_jobs'), where('tenantId', '==', targetTenant), orderBy('createdAt', 'desc'), limit(100));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  static async getPressureIncidents(targetTenant: string, isGlobal: boolean): Promise<any[]> {
    let q;
    if (isGlobal) {
      q = query(collection(db, 'runtime_pressure'), orderBy('detectedAt', 'desc'), limit(100));
    } else {
      q = query(collection(db, 'runtime_pressure'), where('tenantId', '==', targetTenant), orderBy('detectedAt', 'desc'), limit(100));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }
}
