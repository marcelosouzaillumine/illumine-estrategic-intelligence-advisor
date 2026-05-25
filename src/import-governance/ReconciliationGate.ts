import { GovernedFinancialEntry, ImportStatus } from './types';
import { ParsedDataQuarantine, ImportViolationRegistry } from './ParsedDataQuarantine';
import { ImportAuditTrail } from './ImportAuditTrail';

export class ReconciliationGate {
  static evaluateBatch(batchId: string, entries: GovernedFinancialEntry[], fileName: string, method: string): GovernedFinancialEntry[] {
    let finalStatus = 'APPROVED' as ImportStatus;
    let overallConfidence = 100;
    
    entries.forEach(entry => {
       if (entry.status === 'QUARANTINED') finalStatus = 'QUARANTINED';
       else if (entry.status === 'NEEDS_REVIEW' && finalStatus !== 'QUARANTINED') finalStatus = 'NEEDS_REVIEW';
       
       overallConfidence = Math.min(overallConfidence, entry.ocrMetadata.confidence, entry.deParaMetadata?.confidence || 100);
       
       if (entry.violations.length > 0) {
          ImportViolationRegistry.register(batchId, entry);
       }
    });

    // Se houve erro crítico em qualquer lugar do lote, quarentena nele todo para evitar import parcial silencioso.
    if (finalStatus === 'QUARANTINED' || finalStatus === 'NEEDS_REVIEW') {
       ParsedDataQuarantine.quarantine(batchId, entries);
    }

    ImportAuditTrail.log({
      sourceFile: fileName,
      timestamp: new Date().toISOString(),
      extractionMethod: method,
      totalLines: entries.length,
      mappedAccounts: entries.filter(e => e.deParaMetadata).length,
      overallConfidence,
      violations: entries.flatMap(e => e.violations),
      finalStatus
    });

    return entries.map(e => ({ ...e, status: finalStatus }));
  }
}
