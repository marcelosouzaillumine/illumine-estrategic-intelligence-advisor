import { 
  WhistleblowingReport, 
  WhistleblowingSeverity, 
  WhistleblowingCategory,
  AnonymousProtectionLayer,
  ComplianceAuditTrail,
  ComplianceCaseStatus
} from './types';

export class WhistleblowingEngine {
  private reports: Map<string, WhistleblowingReport> = new Map();

  /**
   * Recebe uma nova denúncia e aplica as camadas de proteção.
   */
  public fileReport(
    tenantId: string,
    category: WhistleblowingCategory,
    description: string,
    evidenceLinks: string[] = [],
    isAnonymous: boolean,
    reporterId?: string
  ): WhistleblowingReport {
    
    if (!tenantId) {
      throw new Error('TenantId obrigatório para isolamento fiduciário (Zero Cross-Tenant Leakage).');
    }

    const severity = this.calculateInitialSeverity(category);
    const reportId = `WB-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const protectionLayer: AnonymousProtectionLayer = {
      isAnonymous,
      communicationToken: `TOK-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      shieldedIdentityHash: isAnonymous ? undefined : `HASH-ID-${reporterId}`
    };

    const initialAudit: ComplianceAuditTrail = {
      auditId: `AUDIT-WB-${Date.now()}`,
      action: 'REPORT_FILED',
      actorHash: protectionLayer.isAnonymous ? 'ANONYMOUS' : 'SHIELDED_REPORTER',
      timestamp,
      details: `Denúncia recebida e protocolada. Categoria: ${category}.`
    };

    const report: WhistleblowingReport = {
      reportId,
      tenantId,
      category,
      severity,
      status: 'Registrado',
      description,
      evidenceLinks,
      protectionLayer,
      riskLevel: this.determineRiskLevel(severity),
      auditTrail: [initialAudit],
      lineageHash: `LIN-${tenantId}-${reportId}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      confidenceScore: 85 // Score base inicial
    };

    this.reports.set(reportId, report);

    // Se severidade alta, gera escalation
    if (severity === 'Crítica' || severity === 'Sistêmica') {
      this.triggerEscalation(report);
    }

    return report;
  }

  public getReportsForTenant(tenantId: string): WhistleblowingReport[] {
    return Array.from(this.reports.values()).filter(r => r.tenantId === tenantId);
  }

  public updateReportStatus(tenantId: string, reportId: string, newStatus: ComplianceCaseStatus, reviewerHash: string): void {
    const report = this.reports.get(reportId);
    if (!report || report.tenantId !== tenantId) {
      throw new Error('Acesso negado ou denúncia não encontrada.');
    }

    report.status = newStatus;
    report.updatedAt = new Date().toISOString();
    
    report.auditTrail.push({
      auditId: `AUDIT-WB-${Date.now()}`,
      action: 'STATUS_UPDATED',
      actorHash: reviewerHash,
      timestamp: report.updatedAt,
      details: `Status atualizado para: ${newStatus}`
    });
  }

  private calculateInitialSeverity(category: WhistleblowingCategory): WhistleblowingSeverity {
    switch (category) {
      case 'corrupção':
      case 'fraude':
      case 'vazamento de dados':
        return 'Crítica';
      case 'violação fiduciária':
      case 'violação financeira':
      case 'conflito de interesse ocultado':
        return 'Alta';
      case 'assédio':
      case 'discriminação':
        return 'Sistêmica'; // Impacto cultural e legal extremo
      default:
        return 'Média';
    }
  }

  private determineRiskLevel(severity: WhistleblowingSeverity) {
    if (severity === 'Sistêmica' || severity === 'Crítica') return 'Extremo';
    if (severity === 'Alta') return 'Alto';
    if (severity === 'Média') return 'Moderado';
    return 'Baixo';
  }

  private triggerEscalation(report: WhistleblowingReport) {
    // Integração futura com alertas executivos
    report.auditTrail.push({
      auditId: `AUDIT-ESC-${Date.now()}`,
      action: 'ESCALATION_TRIGGERED',
      actorHash: 'SYSTEM_ENGINE',
      timestamp: new Date().toISOString(),
      details: 'Escalation automático acionado devido à severidade do relato.'
    });
  }
}

export const whistleblowingEngine = new WhistleblowingEngine();
