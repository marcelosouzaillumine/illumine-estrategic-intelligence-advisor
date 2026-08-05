export interface RevenueAuditRecord {
  id: string;
  customerId: string;
  timestamp: string;
  sourceEventId: string;
  sourceEventType: string;
  executiveNarrative: string; // The translated business language record
  metadata: Record<string, any>;
}
