/**
 * Illumine OS™ Executive Contracts
 * Financial Statement Type Enum (CFDI v2.1)
 * 
 * Defines strict canonical types for financial statements.
 * String text searches (includes(), startsWith(), LIKE) are strictly forbidden.
 */

export enum FinancialStatementType {
  DRE_ACCOUNTING = 'DRE_ACCOUNTING',
  DRE_MANAGERIAL = 'DRE_MANAGERIAL',
  BALANCE_SHEET = 'BALANCE_SHEET',
  DFC = 'DFC',
  DLPA = 'DLPA',
  DMPL = 'DMPL'
}
