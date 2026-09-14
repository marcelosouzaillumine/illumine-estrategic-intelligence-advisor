
export type ImportedSpreadsheetRow = unknown[];
export type ImportedBalanceSheetRow = unknown[];
export type ImportedDREEntry = unknown[];

export interface ImportedPdfTextItem {
  str: string;
  transform: number[];
  width?: number;
  height?: number;
  dir?: string;
  fontName?: string;
  hasEOL?: boolean;
  [key: string]: unknown;
}
