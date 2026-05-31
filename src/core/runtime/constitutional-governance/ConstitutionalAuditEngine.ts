// src/core/runtime/constitutional-governance/ConstitutionalAuditEngine.ts
//
// Constitutional Audit Engine
// Tracks doctrine evolution logs, audit records, and triggers alerts on governance erosion.

import { ConstitutionalAuditRecord, ConstitutionalOverrideAttempt } from './constitutional-types';

export class ConstitutionalAuditEngine {
  private auditLogs: ConstitutionalAuditRecord[] = [];

  /**
   * Adds a new audit record to the log.
   */
  public logRecord(record: ConstitutionalAuditRecord): void {
    this.auditLogs.push(record);
  }

  /**
   * Returns all stored audit records.
   */
  public getLogs(): ConstitutionalAuditRecord[] {
    return [...this.auditLogs];
  }

  /**
   * Evaluates the audit history to detect signs of governance erosion or policy bypass attempts.
   */
  public detectGovernanceErosion(): { erosionDetected: boolean; warnings: string[] } {
    const warnings: string[] = [];
    const overrideRecords = this.auditLogs.filter(r => r.type === 'OVERRIDE_ATTEMPT' && r.overrideAttempt);

    // 1. Alert on unauthorized or forbidden attempts
    const unsafeAttempts = overrideRecords.filter(
      r =>
        r.overrideAttempt?.authorizationStatus === 'ATTEMPTED_FORBIDDEN' ||
        r.overrideAttempt?.authorizationStatus === 'UNAUTHORIZED'
    );

    if (unsafeAttempts.length > 0) {
      warnings.push(
        `EROSÃO DE GOVERNANÇA: Detectadas ${unsafeAttempts.length} tentativas de override não autorizadas ou proibidas em termos constitucionais.`
      );
    }

    // 2. Alert on frequency of overrides (e.g., 3 or more approved/rejected overrides in the audit trail)
    if (overrideRecords.length >= 3) {
      warnings.push(
        `EROSÃO DE GOVERNANÇA: Frequência elevada de solicitações de override fiduciário (${overrideRecords.length} tentativas registradas).`
      );
    }

    // 3. Alert on potential policy drift
    const policyUpdates = this.auditLogs.filter(r => r.type === 'POLICY_UPDATE');
    if (policyUpdates.length >= 5) {
      warnings.push(
        `EROSÃO DE GOVERNANÇA: Instabilidade de políticas runtime detectada (${policyUpdates.length} atualizações registradas).`
      );
    }

    return {
      erosionDetected: warnings.length > 0,
      warnings
    };
  }
}
