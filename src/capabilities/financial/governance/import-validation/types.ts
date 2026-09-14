export type ImportStatus = 'APPROVED' | 'NEEDS_REVIEW' | 'BLOCKED' | 'QUARANTINED';

export interface OcrMetadata {
  rawText: string;
  parsedValue: number | null;
  confidence: number;
  sourceLocation: string; // Ex: 'PDF Page 2, Line 14'
  extractionMethod: 'regex' | 'ai' | 'excel_cell' | 'csv_split';
}

export interface DeParaMetadata {
  mappedAccount: string;
  confidence: number;
  reason: string;
  alternatives: string[];
  requiresHumanValidation: boolean;
}

export interface ImportViolation {
  code: string; // Ex: 'SILENT_ZERO', 'AMBIGUOUS_MAPPING', 'SYNTHETIC_CONFLICT'
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
}

export interface GovernedFinancialEntry {
  originalCategory: string;
  category: string; // mapped category
  value: number | null;
  type?: string; // Ativo, Passivo...
  ocrMetadata: OcrMetadata;
  deParaMetadata?: DeParaMetadata;
  status: ImportStatus;
  violations: ImportViolation[];
}

export interface ImportAuditTrailLog {
  sourceFile: string;
  timestamp: string;
  extractionMethod: string;
  totalLines: number;
  mappedAccounts: number;
  overallConfidence: number;
  violations: ImportViolation[];
  validatorUser?: string;
  finalStatus: ImportStatus;
}
