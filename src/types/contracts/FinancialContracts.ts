
import { FirestoreDocument } from "./FirestoreContracts";

export interface FinancialEntryLike {
  id?: string;
  category?: string;
  conta?: string;
  value?: number | string;
  valor?: number | string;
  val?: number | string;
  type?: string;
  tipo?: string;
  docType?: string;
  year?: number;
  ano?: number;
  month?: number;
  mes?: number;
  [key: string]: unknown;
}

export interface FinancialStatementLike extends FirestoreDocument {
  year?: number;
  month?: number;
  type?: string;
  category?: string;
  conta?: string;
  value?: number | string;
  valor?: number | string;
  val?: number | string;
  data?: FinancialEntryLike[];
  isBatch?: boolean;
}

export interface PayableEntry extends FirestoreDocument {
  vencimento?: string;
  valor?: string | number;
  valorAberto?: string | number;
  status?: string;
  [key: string]: unknown;
}

export interface ReceivableEntry extends FirestoreDocument {
  vencimento?: string;
  valor?: string | number;
  valorAberto?: string | number;
  status?: string;
  [key: string]: unknown;
}

export interface PositionEntry extends FirestoreDocument {
  saldoAtual?: string | number;
  moeda?: string;
  [key: string]: unknown;
}

export interface PreComputedData {
  premissas?: {
    economicas?: any[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
