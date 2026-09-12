/**
 * Illumine OS™ Financial Governance Boundary
 * Financial Integrity Validator (CFDI v2.1)
 * 
 * Validates canonical financial entries against taxonomy FIN-001 to FIN-010.
 * Emits rich evidence payloads for every violation.
 */

import { 
  CanonicalFinancialEntry, 
  FinancialViolation, 
  FinancialStatementType 
} from '../../../../../../packages/executive-contracts/src/financial/index';

export class FinancialIntegrityValidator {
  public static validate(
    entries: ReadonlyArray<CanonicalFinancialEntry>,
    targetClientId: string,
    targetStatementType: FinancialStatementType,
    targetYear: number
  ): ReadonlyArray<FinancialViolation> {
    const violations: FinancialViolation[] = [];

    if (!targetClientId || targetClientId === 'unknown-client') {
      violations.push({
        code: 'FIN-002',
        message: 'Unknown or missing client identity.',
        severity: 'CRITICAL',
        recoverable: false,
        evidence: { targetClientId }
      });
    }

    if (!entries || entries.length === 0) {
      violations.push({
        code: 'FIN-010',
        message: 'No financial entries found for the requested period.',
        severity: 'WARNING',
        recoverable: true,
        evidence: { targetClientId, targetStatementType, targetYear, entryCount: 0 }
      });
      return Object.freeze(violations);
    }

    const seenAccountCodes = new Set<string>();

    entries.forEach((entry, idx) => {
      // FIN-001: Schema version check
      if (entry.schemaVersion !== '2.1.0') {
        violations.push({
          code: 'FIN-001',
          message: `Invalid schema version '${entry.schemaVersion}' at index ${idx}. Expected '2.1.0'.`,
          severity: 'ERROR',
          recoverable: true,
          evidence: { entryId: entry.id, schemaVersion: entry.schemaVersion }
        });
      }

      // FIN-002: Client Mismatch
      if (entry.clientId !== targetClientId) {
        violations.push({
          code: 'FIN-002',
          message: `Client identity mismatch for entry '${entry.id}'. Expected '${targetClientId}', got '${entry.clientId}'.`,
          severity: 'CRITICAL',
          recoverable: false,
          evidence: { entryId: entry.id, expectedClient: targetClientId, actualClient: entry.clientId }
        });
      }

      // FIN-003: Statement Type Isolation Violation
      if (entry.statementType !== targetStatementType) {
        violations.push({
          code: 'FIN-003',
          message: `Statement isolation violation for entry '${entry.id}'. Target '${targetStatementType}', got '${entry.statementType}'.`,
          severity: 'CRITICAL',
          recoverable: false,
          evidence: { entryId: entry.id, expectedType: targetStatementType, actualType: entry.statementType }
        });
      }

      // Check for duplicate account codes
      if (seenAccountCodes.has(entry.accountCode)) {
        violations.push({
          code: 'FIN-001',
          message: `Duplicate account code '${entry.accountCode}' detected for statement '${targetStatementType}'.`,
          severity: 'WARNING',
          recoverable: true,
          evidence: { accountCode: entry.accountCode, accountName: entry.accountName }
        });
      } else {
        seenAccountCodes.add(entry.accountCode);
      }

      // FIN-008: Missing Lineage
      if (!entry.lineage || !entry.lineage.sourceCollection) {
        violations.push({
          code: 'FIN-008',
          message: `Missing lineage metadata for entry '${entry.id}'.`,
          severity: 'ERROR',
          recoverable: true,
          evidence: { entryId: entry.id }
        });
      }

      // FIN-009: Rejected Entry
      if (entry.status === 'REJECTED') {
        violations.push({
          code: 'FIN-009',
          message: `Rejected entry '${entry.id}' detected in active dataset.`,
          severity: 'ERROR',
          recoverable: true,
          evidence: { entryId: entry.id, accountName: entry.accountName }
        });
      }
    });

    return Object.freeze(violations);
  }
}
