import { db } from '../../../lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export interface RuntimePressureIncident {
  pressureId: string;
  runtimeType: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tenantId: string;
  detectedAt: string;
  recommendedAction: string;
}

export class RuntimePressureMonitor {
  private static localIncidents: RuntimePressureIncident[] = [];
  private static isMockEnabled = false;

  static setMockMode(enabled: boolean) {
    this.isMockEnabled = enabled;
    if (enabled) this.localIncidents = [];
  }

  static getLocalIncidents(): RuntimePressureIncident[] {
    return this.localIncidents;
  }

  static async savePressureIncident(incident: RuntimePressureIncident): Promise<void> {
    if (this.isMockEnabled) {
      this.localIncidents.push(incident);
      return;
    }
    const cleanIncident = JSON.parse(JSON.stringify(incident));
    (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // addDoc(collection(db, 'runtime_pressure'), {
      ...cleanIncident,
      serverTimestamp: new Date()
    });
  }

  static async registerPressureIncident(
    input: Omit<RuntimePressureIncident, 'pressureId' | 'detectedAt'>
  ): Promise<void> {
    const incident: RuntimePressureIncident = {
      ...input,
      pressureId: `press_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      detectedAt: new Date().toISOString()
    };

    console.warn(`[RuntimePressureMonitor] Pressure detected: ${input.runtimeType} (Severity: ${input.severity}) for tenant ${input.tenantId}`);
    await this.savePressureIncident(incident);
  }

  static async getPressureIncidents(tenantId: string): Promise<RuntimePressureIncident[]> {
    if (this.isMockEnabled) {
      return this.localIncidents.filter(i => tenantId === 'GLOBAL' || i.tenantId === tenantId);
    }
    let q = query(collection(db, 'runtime_pressure'));
    if (tenantId !== 'GLOBAL') {
      q = query(q, where('tenantId', '==', tenantId));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as RuntimePressureIncident);
  }
}
