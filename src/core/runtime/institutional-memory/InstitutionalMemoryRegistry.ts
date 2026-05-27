import { InstitutionalMemoryRecord } from './types';

// In-memory static store (append-only)
const MEMORY_STORE: InstitutionalMemoryRecord[] = [];

// Seed immutable DEMO records (tagged explicitly, only returned for demo scopes)
const DEMO_SEEDS: InstitutionalMemoryRecord[] = [
  {
    memoryId: 'demo-mem-1',
    tenantId: 'demo-tenant-turnaround',
    entityId: 'ENT-A',
    timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
    runtimeReferenceId: 'ref-turnaround-01',
    lineageHash: 'lin-hash-turnaround-999',
    governanceCategory: 'Liquidez',
    severityLevel: 'WARNING',
    executiveUrgency: 'REVIEW',
    narrativeSnapshot: 'Sinais iniciais de deterioração no ciclo de caixa curto prazo.',
    causalSummary: 'Aumento do prazo médio de estoques e redução de liquidez imediata.',
    recommendationSnapshot: ['Preservar caixa e reduzir novos investimentos.'],
    confidenceSnapshot: 'HIGH',
    memorySource: 'DEMO',
    integrityStatus: 'VERIFIED'
  },
  {
    memoryId: 'demo-mem-2',
    tenantId: 'demo-tenant-turnaround',
    entityId: 'ENT-A',
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months ago
    runtimeReferenceId: 'ref-turnaround-02',
    lineageHash: 'lin-hash-turnaround-998',
    governanceCategory: 'Liquidez',
    severityLevel: 'CRITICAL',
    executiveUrgency: 'ACTION_REQUIRED',
    narrativeSnapshot: 'Redução acentuada na cobertura de caixa operacional YoY.',
    causalSummary: 'Consumo acelerado de caixa e necessidade de funding de curto prazo.',
    recommendationSnapshot: ['Preservar caixa e reduzir novos investimentos.', 'Aprovar aporte fiduciário regulado.'],
    confidenceSnapshot: 'HIGH',
    memorySource: 'DEMO',
    integrityStatus: 'VERIFIED'
  },
  {
    memoryId: 'demo-mem-3',
    tenantId: 'demo-tenant-turnaround',
    entityId: 'ENT-A',
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
    runtimeReferenceId: 'ref-turnaround-03',
    lineageHash: 'lin-hash-turnaround-997',
    governanceCategory: 'Fiduciária',
    severityLevel: 'CRITICAL',
    executiveUrgency: 'BOARD_INTERVENTION',
    narrativeSnapshot: 'Conflito de interesse na aprovação de fornecedor societário.',
    causalSummary: 'Aprovador de contrato é acionista majoritário da fornecedora.',
    recommendationSnapshot: ['Suspender contrato TechCorp até parecer independente.'],
    confidenceSnapshot: 'HIGH',
    memorySource: 'DEMO',
    integrityStatus: 'VERIFIED'
  }
];

export class InstitutionalMemoryRegistry {
  /**
   * Appends a new, immutable memory record to the store.
   * Prevents mutation of prior history.
   */
  public static append(record: Omit<InstitutionalMemoryRecord, 'memoryId'>): InstitutionalMemoryRecord {
    // Basic lineage integrity checks
    if (!record.lineageHash || !record.tenantId || !record.runtimeReferenceId) {
      throw new Error('VIOLAÇÃO DE MEMÓRIA: Impossível armazenar registro sem lineageHash, tenantId ou runtimeReferenceId.');
    }

    const newRecord: InstitutionalMemoryRecord = {
      ...record,
      memoryId: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Freeze to enforce immutability
    Object.freeze(newRecord);
    MEMORY_STORE.push(newRecord);
    return newRecord;
  }

  /**
   * Retrieves memory records strictly isolated by tenantId.
   * Mixes in DEMO records only if the target tenant is a demo tenant.
   */
  public static getRecords(tenantId: string): InstitutionalMemoryRecord[] {
    const isDemoTenant = tenantId.startsWith('demo-') || tenantId === 'TENANT-1';
    
    const productionRecords = MEMORY_STORE.filter(r => r.tenantId === tenantId);
    
    if (isDemoTenant) {
      const demoRecords = DEMO_SEEDS.filter(r => r.tenantId === tenantId || r.tenantId === 'demo-tenant-turnaround');
      return [...demoRecords, ...productionRecords].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }

    return productionRecords.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Clears in-memory store for testing purposes only.
   */
  public static clearForTest() {
    MEMORY_STORE.length = 0;
  }
}
