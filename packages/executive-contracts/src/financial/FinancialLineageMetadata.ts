/**
 * Illumine OS™ Executive Contracts
 * Financial Lineage & Provenance Metadata (CFDI v2.1)
 */

export interface FinancialLineageMetadata {
  readonly sourceCollection: string;
  readonly sourceDocumentId: string;
  readonly importBatchId: string;
  readonly uploadedAt: string;
  readonly uploadedBy: string;
  readonly normalizedAt: string;
  readonly normalizerVersion: string;
  readonly generatedBy: string;
  readonly importedBy: string;
  readonly normalizedBy: string;
  readonly validatedBy: string;
  readonly certifiedBy: string;
}
