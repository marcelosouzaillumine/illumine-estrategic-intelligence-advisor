import { GovernedFinancialEntry } from '../../../../import-governance/types';
import { SilentZeroDetector } from '../../../../import-governance/SilentZeroDetector';
import { AccountMappingValidator } from '../../../../import-governance/AccountMappingValidator';
import { ImportConfidenceEngine } from '../../../../import-governance/ImportConfidenceEngine';
import { HierarchyIntegrityValidator } from '../../../../import-governance/HierarchyIntegrityValidator';
import { SyntheticAnalyticGuard } from '../../../../import-governance/SyntheticAnalyticGuard';
import { ReconciliationGate } from '../../../../import-governance/ReconciliationGate';

export class ImportGovernanceEngine {
  /**
   * Processa o lote de dados lidos pelos parsers base.
   */
  static processBatch(batchId: string, fileName: string, method: string, rawEntries: any[]): GovernedFinancialEntry[] {
    
    // 1. Convert to Governed Format
    let entries: GovernedFinancialEntry[] = rawEntries.map(e => {
      return {
        originalCategory: e.category,
        category: e.category,
        value: e.value,
        status: 'APPROVED',
        violations: [],
        ocrMetadata: {
          rawText: String(e.value),
          parsedValue: e.value,
          confidence: 100, // OCR legados assumem 100 até falhar
          sourceLocation: 'unknown',
          extractionMethod: method as any
        }
      };
    });

    // 2. Run Enforcers per Entry
    entries = entries.map(entry => {
       let e = SilentZeroDetector.validate(entry);
       e = AccountMappingValidator.validate(e);
       e = ImportConfidenceEngine.evaluate(e);
       return e;
    });

    // 3. Run Structural Enforcers (Batch level)
    entries = SyntheticAnalyticGuard.validate(entries);
    entries = HierarchyIntegrityValidator.validate(entries);

    // 4. Reconciliation Gate
    entries = ReconciliationGate.evaluateBatch(batchId, entries, fileName, method);

    return entries;
  }

  /**
   * Ponto de interface retro-compatível para os serviços antigos (Legacy Adapter).
   * Ele apenas devolve os dados se estiverem limpos, do contrário lança erro silencioso para não explodir a UI,
   * mas trava a esteira (QUARANTINED). A UI verá uma lista vazia ou não processada, forçando o operador a conferir.
   */
  static getLegacyAdapterData(entries: GovernedFinancialEntry[]): any[] {
     // Apenas QUARANTINED bloqueia a importação hard no sistema atual.
     // NEEDS_REVIEW é classificado como soft-warning e será importado.
     const hasBlockers = entries.some(e => e.status === 'QUARANTINED');
     if (hasBlockers) {
        console.error('[ImportGovernanceEngine] Lote bloqueado pela Governança. Os dados não alimentarão os motores institucionais.');
        const reasons = entries.filter(e => e.status === 'QUARANTINED').flatMap(e => e.violations.map(v => `${e.originalCategory}: ${v.message}`));
        const uniqueReasons = Array.from(new Set(reasons));
        const summary = uniqueReasons.slice(0, 3).join(' | ');
        throw new Error(`Importação bloqueada (Governança): ${summary}${uniqueReasons.length > 3 ? '...' : ''}`);
     }
     
     // Removemos os metadados para não quebrar a interface antiga que só espera category e value
     return entries.map(e => ({
       category: e.category,
       value: e.value
     }));
  }
}
