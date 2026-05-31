// src/core/runtime/audit-assurance/InstitutionalAuditEngine.ts
//
// Institutional Audit Engine
// Aggregates audit logs and inspections, preparing formal reports for regulatory officers.

import { AssuranceMetadata } from './audit-types';

export interface AuditInspectionReport {
  timestamp: string;
  totalAudits: number;
  gradeDistribution: Record<string, number>;
  failClosedCount: number;
  auditReadyCount: number;
  systemIntegrityScore: number;
  findings: string[];
}

export class InstitutionalAuditEngine {
  private auditHistory: AssuranceMetadata[] = [];

  /**
   * Registers a certified execution transaction into the audit repository.
   */
  public registerAudit(metadata: AssuranceMetadata): void {
    this.auditHistory.push(metadata);
  }

  /**
   * Clears historical registered audits.
   */
  public clearHistory(): void {
    this.auditHistory = [];
  }

  /**
   * Returns registered audit history entries.
   */
  public getHistory(): AssuranceMetadata[] {
    return [...this.auditHistory];
  }

  /**
   * Evaluates the registered history to compile an institutional compliance inspection report.
   */
  public inspectAuditHistory(): AuditInspectionReport {
    const totalAudits = this.auditHistory.length;
    const gradeDistribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    let failClosedCount = 0;
    let auditReadyCount = 0;
    let sumScores = 0;
    const findings: string[] = [];

    for (const meta of this.auditHistory) {
      const g = meta.grade || 'F';
      gradeDistribution[g] = (gradeDistribution[g] || 0) + 1;
      sumScores += meta.scores?.overallScore || 0;

      if (meta.classification === 'FAIL_CLOSED') {
        failClosedCount++;
        findings.push(
          `[FIDUCIARY_ALERT] Transação ID ${meta.auditId} entrou em estado FAIL_CLOSED.`
        );
      }

      if (meta.classification === 'AUDIT_READY') {
        auditReadyCount++;
      }

      if (!meta.reconstructionVerified) {
        findings.push(
          `[RECONSTRUCTION_FAILURE] Divergência identificada durante a reconstituição da transação ID ${meta.auditId}.`
        );
      }
    }

    const systemIntegrityScore =
      totalAudits > 0 ? Math.round(sumScores / totalAudits) : 100;

    return {
      timestamp: new Date().toISOString(),
      totalAudits,
      gradeDistribution,
      failClosedCount,
      auditReadyCount,
      systemIntegrityScore,
      findings
    };
  }

  /**
   * Exports a structured, certified ASCII log for regulatory compliance inspection.
   */
  public generateCertifiedLog(): string {
    let output = `==================================================\n`;
    output += `SOVEREIGN AUDIT & REGULATORY ASSURANCE TRAIL LOG\n`;
    output += `Exportado em: ${new Date().toISOString()}\n`;
    output += `==================================================\n\n`;

    if (this.auditHistory.length === 0) {
      output += `Nenhum registro de auditoria localizado no repositório local.\n`;
      return output;
    }

    for (const meta of this.auditHistory) {
      output += `Registro: ${meta.auditId}\n`;
      output += `  Correlação: ${meta.correlationId}\n`;
      output += `  Status: ${meta.classification} (Nota ${meta.grade})\n`;
      output += `  Score Geral: ${meta.scores?.overallScore || 0}%\n`;
      output += `  Cadeia de Causa: ${meta.causalChainTrace?.length || 0} elos mapeados\n`;
      output += `  Integridade de Assinatura: ${
        meta.evidencePackage?.signature ? 'ASSINADO' : 'SEM ASSINATURA'
      }\n`;
      output += `  Verificação Secundária: ${
        meta.reconstructionVerified ? 'SUCESSO (Dual standard OK)' : 'FALHA DE CORRELAÇÃO'
      }\n`;
      output += `--------------------------------------------------\n`;
    }

    return output;
  }
}
