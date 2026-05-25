import { GovernedFinancialEntry } from './types';
import { SilentZeroDetector } from './SilentZeroDetector';
import { AccountMappingValidator } from './AccountMappingValidator';
import { ImportConfidenceEngine } from './ImportConfidenceEngine';
import { HierarchyIntegrityValidator } from './HierarchyIntegrityValidator';
import { SyntheticAnalyticGuard } from './SyntheticAnalyticGuard';
import { ReconciliationGate } from './ReconciliationGate';

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
     const hasBlockers = entries.some(e => e.status === 'QUARANTINED' || e.status === 'NEEDS_REVIEW');
     if (hasBlockers) {
        console.error('[ImportGovernanceEngine] Lote bloqueado pela Governança. Os dados não alimentarão os motores institucionais.');
        // Retorna array vazio para travar fluxo, ao invés de zeros silenciosos (que corrompem tudo).
        // Isso obriga a reimportar ou acionar a interface de conciliação no futuro.
        return [];
     }
     
     // Removemos os metadados para não quebrar a interface antiga que só espera category e value
     return entries.map(e => ({
       category: e.category,
       value: e.value
     }));
  }
}
