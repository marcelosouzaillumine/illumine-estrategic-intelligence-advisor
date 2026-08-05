import { RevenueMetrics } from '../models/RevenueMetrics';
import { RevenueHealth } from '../models/RevenueHealth';

/**
 * Agrega dados de Observabilidade para exibição em Dashboards do COO / Revenue Office.
 */
export interface RevenueExecutiveSnapshot {
  snapshotTimestamp: string;
  globalHealth: RevenueHealth;
  coreMetrics: RevenueMetrics;
  
  // Real-time operations
  pendingDeadLetterQueueItems: number;
  recentAuditAnomalies: number; // e.g. Contract Activated but Payment Failed
}
