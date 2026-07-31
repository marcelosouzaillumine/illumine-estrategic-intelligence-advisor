import { DecisionMemoryRecord } from '../models/DecisionMemoryRecord';
import { ClassificationRules } from '../classification/ClassificationRules';

export interface AuditLog {
  id: string;
  memoryRecordId: string;
  action: 'CREATED' | 'UPDATED' | 'CLASSIFIED' | 'REVIEWED';
  actorId: string;
  timestamp: Date;
  diffSnapshot?: any;
}

/**
 * Trilha de auditoria para garantir a rastreabilidade fiduciária.
 */
export class MemoryAuditTrail {
  private logs: AuditLog[] = [];

  logAction(
    record: DecisionMemoryRecord, 
    action: 'CREATED' | 'UPDATED' | 'CLASSIFIED' | 'REVIEWED', 
    actorId: string
  ): void {
    
    // Enforcement: If classified as fiduciary, ensure rules pass
    if (action === 'CLASSIFIED' && record.classification === 'FIDUCIARY_RECORD') {
      const isValid = ClassificationRules.validateFiduciaryClassification(record);
      if (!isValid) {
        throw new Error("Cannot classify as FIDUCIARY_RECORD without meeting governance constraints.");
      }
    }

    this.logs.push({
      id: crypto.randomUUID(),
      memoryRecordId: record.id,
      action,
      actorId,
      timestamp: new Date()
    });
  }

  getTrailForRecord(memoryRecordId: string): AuditLog[] {
    return this.logs.filter(log => log.memoryRecordId === memoryRecordId);
  }
}
