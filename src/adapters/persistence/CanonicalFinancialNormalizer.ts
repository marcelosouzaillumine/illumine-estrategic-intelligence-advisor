/**
 * Illumine OS™ Persistence Layer
 * Canonical Financial Normalizer (CFDI v2.1)
 * 
 * SINGLE AUTHORIZED NORMALIZATION POINT.
 * Converts raw Firestore documents to Readonly<CanonicalFinancialEntry>.
 * Post-normalization, zero legacy aliases (conta, category, valor, value, val, tipo, type) exist in memory.
 */

import { 
  CanonicalFinancialEntry, 
  FinancialStatementType, 
  FinancialLineageMetadata 
} from '../../../packages/executive-contracts/src/financial/index';

export class CanonicalFinancialNormalizer {
  public static mapRawTypeToStatementType(rawType: string): FinancialStatementType {
    if (!rawType) return FinancialStatementType.DRE_ACCOUNTING;
    const t = String(rawType).trim().toUpperCase();
    
    if (t === 'BP' || t === 'BALANÇO PATRIMONIAL' || t === 'BALANCO PATRIMONIAL' || t === 'BALANCE_SHEET') {
      return FinancialStatementType.BALANCE_SHEET;
    }
    if (t === 'DFC' || t === 'FLUXO DE CAIXA' || t === 'FLUXO_DE_CAIXA') {
      return FinancialStatementType.DFC;
    }
    if (t === 'DLPA' || t === 'LUCROS ACUMULADOS' || t === 'LUCROS_E_PREJUIZOS_ACUMULADOS') {
      return FinancialStatementType.DLPA;
    }
    if (t === 'DMPL') {
      return FinancialStatementType.DMPL;
    }
    if (t === 'DRE GERENCIAL' || t === 'DRE_MANAGERIAL') {
      return FinancialStatementType.DRE_MANAGERIAL;
    }
    return FinancialStatementType.DRE_ACCOUNTING;
  }

  public static normalizeToCanonicalEntry(rawDoc: any, contextClientId?: string, fallbackYear?: number): Readonly<CanonicalFinancialEntry> {
    if (!rawDoc) {
      throw new Error('[CFDI-001] Cannot normalize null or undefined document.');
    }

    // Resolving Client Identity
    const resolvedClientId = String(rawDoc.clientId || rawDoc.client_id || contextClientId || 'unknown-client').trim();

    // Resolving Account Name
    const rawAccountName = String(
      rawDoc.accountName || 
      rawDoc.conta || 
      rawDoc.category || 
      rawDoc.account || 
      rawDoc.nome || 
      'Conta Não Categorizada'
    ).trim();

    // Resolving Account Code
    const rawAccountCode = String(
      rawDoc.accountCode || 
      rawDoc.codigo || 
      rawDoc.code || 
      rawDoc.id || 
      `ACT-${Math.abs(this.hashCode(rawAccountName))}`
    ).trim();

    // Resolving Amount
    let rawAmount = 0;
    if (rawDoc.amount !== undefined && rawDoc.amount !== null) rawAmount = Number(rawDoc.amount);
    else if (rawDoc.valor !== undefined && rawDoc.valor !== null) rawAmount = Number(rawDoc.valor);
    else if (rawDoc.value !== undefined && rawDoc.value !== null) rawAmount = Number(rawDoc.value);
    else if (rawDoc.val !== undefined && rawDoc.val !== null) rawAmount = Number(rawDoc.val);

    if (isNaN(rawAmount)) rawAmount = 0;

    // Resolving Year & Month
    const rawYear = Number(rawDoc.year || rawDoc.exercicio || rawDoc.period || fallbackYear || new Date().getFullYear());
    const rawMonth = rawDoc.month ? Number(rawDoc.month) : undefined;

    // Resolving Statement Type
    const statementType = this.mapRawTypeToStatementType(rawDoc.statementType || rawDoc.tipo || rawDoc.type);

    // Resolving Status
    let status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED' = 'APPROVED';
    const s = String(rawDoc.status).toUpperCase();
    if (s === 'REJECTED' || s === 'REJEITADO') status = 'REJECTED';
    else if (s === 'ARCHIVED' || s === 'ARQUIVADO') status = 'ARCHIVED';
    else if (s === 'PENDING' || s === 'PENDENTE') status = 'PENDING';

    const lineage: FinancialLineageMetadata = {
      sourceCollection: String(rawDoc.sourceCollection || 'financial_entries'),
      sourceDocumentId: String(rawDoc.id || rawDoc.docId || 'entry-raw'),
      importBatchId: String(rawDoc.importBatchId || rawDoc.batchId || 'batch-legacy'),
      uploadedAt: String(rawDoc.uploadedAt || rawDoc.createdAt || new Date().toISOString()),
      uploadedBy: String(rawDoc.uploadedBy || rawDoc.createdBy || 'system-importer'),
      normalizedAt: new Date().toISOString(),
      normalizerVersion: '2.1.0',
      generatedBy: 'CanonicalFinancialNormalizer',
      importedBy: String(rawDoc.importedBy || 'FinancialImportWizard'),
      normalizedBy: 'CanonicalFinancialNormalizer-v2.1.0',
      validatedBy: 'FinancialIntegrityValidator-v2.1.0',
      certifiedBy: 'FinancialCertificationEngine-v2.1.0'
    };

    const entry: CanonicalFinancialEntry = {
      id: String(rawDoc.id || `${statementType}_${rawYear}_${rawAccountCode}`),
      schemaVersion: '2.1.0',
      accountCode: rawAccountCode,
      accountName: rawAccountName,
      statementType,
      amount: rawAmount,
      year: isNaN(rawYear) ? new Date().getFullYear() : rawYear,
      month: rawMonth,
      clientId: resolvedClientId,
      origin: String(rawDoc.origin || 'PERSISTENCE_STORE'),
      classification: String(rawDoc.classification || 'MANUAL_ENTRY'),
      status,
      lineage
    };

    return Object.freeze(entry);
  }

  public static normalizeBatch(rawDocs: any[], contextClientId?: string, fallbackYear?: number): ReadonlyArray<Readonly<CanonicalFinancialEntry>> {
    if (!Array.isArray(rawDocs)) return [];
    return rawDocs
      .filter(doc => !!doc)
      .map(doc => this.normalizeToCanonicalEntry(doc, contextClientId, fallbackYear));
  }

  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash;
  }
}
