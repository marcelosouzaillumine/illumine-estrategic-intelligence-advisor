import { 
  ConductCodeDocument, 
  ConductCodeAcceptance, 
  ComplianceAuditTrail 
} from './types';

export class ConductCodeRegistry {
  private documents: Map<string, ConductCodeDocument> = new Map();
  private acceptances: Map<string, ConductCodeAcceptance> = new Map();

  /**
   * Publica uma nova versão de uma política institucional.
   */
  public publishDocument(
    tenantId: string,
    title: string,
    type: ConductCodeDocument['type'],
    version: string,
    contentHash: string,
    isRequired: boolean,
    validUntil: string
  ): ConductCodeDocument {
    if (!tenantId) throw new Error('TenantId obrigatório para publicar políticas institucionais.');

    const timestamp = new Date().toISOString();
    const documentId = `DOC-${Date.now()}`;

    const doc: ConductCodeDocument = {
      documentId,
      tenantId,
      title,
      type,
      version,
      contentHash,
      isRequired,
      validUntil,
      auditTrail: [{
        auditId: `AUDIT-DOC-${Date.now()}`,
        action: 'DOCUMENT_PUBLISHED',
        actorHash: 'COMPLIANCE_OFFICER',
        timestamp,
        details: `Política ${title} (${version}) publicada.`
      }],
      lineageHash: `LIN-DOC-${tenantId}-${documentId}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      confidenceScore: 100
    };

    this.documents.set(documentId, doc);
    return doc;
  }

  /**
   * Registra o aceite digital de um colaborador para uma política específica.
   */
  public registerAcceptance(
    tenantId: string,
    documentId: string,
    userId: string
  ): ConductCodeAcceptance {
    
    const doc = this.documents.get(documentId);
    if (!doc || doc.tenantId !== tenantId) {
      throw new Error('Documento não encontrado ou pertencente a outro tenant.');
    }

    const timestamp = new Date().toISOString();
    const acceptanceId = `ACC-${Date.now()}`;

    const acceptance: ConductCodeAcceptance = {
      acceptanceId,
      tenantId,
      documentId,
      userId,
      acceptedVersion: doc.version,
      expiresAt: doc.validUntil,
      isCompliant: true,
      auditTrail: [{
        auditId: `AUDIT-ACC-${Date.now()}`,
        action: 'DIGITAL_ACCEPTANCE_REGISTERED',
        actorHash: `HASH-USER-${userId}`, // Mascarado
        timestamp,
        details: `Aceite digital registrado para a versão ${doc.version}.`
      }],
      lineageHash: `LIN-ACC-${tenantId}-${acceptanceId}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      confidenceScore: 100
    };

    this.acceptances.set(acceptanceId, acceptance);
    return acceptance;
  }

  /**
   * Identifica usuários que não assinaram políticas obrigatórias vigentes.
   * Retorna os IDs dos usuários inadimplentes (Gaps de Compliance).
   */
  public checkComplianceGaps(tenantId: string, activeUserIds: string[]): { documentTitle: string, nonCompliantUserIds: string[] }[] {
    const activeRequiredDocs = Array.from(this.documents.values())
      .filter(d => d.tenantId === tenantId && d.isRequired && new Date(d.validUntil) > new Date());
    
    const tenantAcceptances = Array.from(this.acceptances.values())
      .filter(a => a.tenantId === tenantId && new Date(a.expiresAt) > new Date() && a.isCompliant);

    const gaps: { documentTitle: string, nonCompliantUserIds: string[] }[] = [];

    for (const doc of activeRequiredDocs) {
      const docAcceptances = tenantAcceptances.filter(a => a.documentId === doc.documentId);
      const acceptedUserIds = new Set(docAcceptances.map(a => a.userId));
      
      const missingUserIds = activeUserIds.filter(userId => !acceptedUserIds.has(userId));
      
      if (missingUserIds.length > 0) {
        gaps.push({
          documentTitle: doc.title,
          nonCompliantUserIds: missingUserIds
        });
      }
    }

    return gaps;
  }
}

export const conductCodeRegistry = new ConductCodeRegistry();
