import { 
  EthicsInvestigation, 
  EthicsCommitteeDecision, 
  ComplianceAuditTrail 
} from './types';
import { whistleblowingEngine } from './WhistleblowingEngine';

export class EthicsCommitteeRuntime {
  private investigations: Map<string, EthicsInvestigation> = new Map();
  private decisions: Map<string, EthicsCommitteeDecision> = new Map();

  /**
   * Inicia uma investigação formal baseada em um relatório de whistleblowing.
   */
  public launchInvestigation(
    tenantId: string, 
    reportId: string, 
    investigatorIds: string[]
  ): EthicsInvestigation {
    const timestamp = new Date().toISOString();
    const investigationId = 'INV-' + Date.now();

    // Atualiza status do reporte original (assegura isolamento de tenant internamente)
    whistleblowingEngine.updateReportStatus(tenantId, reportId, 'Investigação Ativa', 'SYSTEM_ETHICS_COMMITTEE');

    const investigation: EthicsInvestigation = {
      investigationId,
      reportId,
      tenantId,
      investigatorIds,
      findings: '',
      recommendedAction: '',
      status: 'Iniciada',
      auditTrail: [{
        auditId: 'AUDIT-INV-' + Date.now(),
        action: 'INVESTIGATION_LAUNCHED',
        actorHash: 'COMMITTEE_RUNTIME',
        timestamp,
        details: 'Investigação formal iniciada. Designados ' + investigatorIds.length + ' investigadores.'
      }],
      lineageHash: 'LIN-INV-' + tenantId + '-' + investigationId,
      createdAt: timestamp,
      updatedAt: timestamp,
      confidenceScore: 100
    };

    this.investigations.set(investigationId, investigation);
    return investigation;
  }

  /**
   * Registra a deliberação final do comitê de ética, gerando sanções e recomendações.
   */
  public issueCommitteeDecision(
    tenantId: string,
    investigationId: string,
    responsibleReviewers: string[],
    findings: string,
    sanctionApplied: string,
    recommendations: string,
    evidenceRegistry: string[]
  ): EthicsCommitteeDecision {
    
    const investigation = this.investigations.get(investigationId);
    if (!investigation || investigation.tenantId !== tenantId) {
      throw new Error('Investigação não encontrada no contexto deste Tenant.');
    }

    const timestamp = new Date().toISOString();
    const decisionId = 'DEC-ETH-' + Date.now();

    const decision: EthicsCommitteeDecision = {
      decisionId,
      investigationId,
      tenantId,
      committeeDecisionHash: 'HASH-DEC-' + Date.now(),
      evidenceRegistry,
      responsibleReviewers,
      fiduciaryContext: 'Deliberação Oficial do Comitê de Ética Institucional',
      sanctionApplied,
      recommendations,
      auditTrail: [{
        auditId: 'AUDIT-DEC-' + Date.now(),
        action: 'COMMITTEE_DECISION_ISSUED',
        actorHash: 'COMMITTEE_QUORUM',
        timestamp,
        details: 'Decisão final emitida. Sanção: ' + (sanctionApplied ? 'Aplicada' : 'Nenhuma') + '.'
      }],
      decisionAuditTrail: [],
      lineageHash: `LIN-DEC-${tenantId}-${decisionId}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      confidenceScore: 0.99
    };

    investigation.status = 'Concluída';
    investigation.findings = findings;
    investigation.updatedAt = timestamp;
    
    this.decisions.set(decisionId, decision);

    // Atualiza denúncia original para status final
    whistleblowingEngine.updateReportStatus(
      tenantId, 
      investigation.reportId, 
      sanctionApplied ? 'Concluído com Sanção' : 'Arquivado como Improcedente', 
      'COMMITTEE_QUORUM'
    );

    return decision;
  }

  public getDecisionsForTenant(tenantId: string): EthicsCommitteeDecision[] {
    return Array.from(this.decisions.values()).filter(d => d.tenantId === tenantId);
  }
}

export const ethicsCommitteeRuntime = new EthicsCommitteeRuntime();
