import { ImportPublicationRecord, ImportedDataset } from './IntegrationGovernanceTypes';
import { ConnectorAuditLogger } from './ConnectorAuditLogger';

export class ImportPublicationEngine {
  private static publications: ImportPublicationRecord[] = [];

  /**
   * Stub de publicação fiduciária.
   * Não altera os dados rodando no React neste MVP, apenas simula o "carimbo".
   */
  static publish(dataset: ImportedDataset, actorId: string): ImportPublicationRecord | null {
    if (dataset.status !== 'APPROVED') {
      ConnectorAuditLogger.logEvent(dataset.tenantId, 'IMPORT_FAILED', actorId, dataset.importId, dataset.connectorId, 'Tentativa de publicar dataset não aprovado.');
      return null;
    }

    if (dataset.stagingValidationPassed !== true) {
      ConnectorAuditLogger.logEvent(dataset.tenantId, 'IMPORT_FAILED', actorId, dataset.importId, dataset.connectorId, 'Dataset não passou na Staging Validation.');
      return null;
    }

    if (dataset.promotedToRuntime !== true) {
      ConnectorAuditLogger.logEvent(dataset.tenantId, 'IMPORT_FAILED', actorId, dataset.importId, dataset.connectorId, 'Dataset não foi promovido ao Runtime Oficial.');
      return null;
    }

    if (dataset.blockingWarnings && dataset.blockingWarnings.length > 0) {
      ConnectorAuditLogger.logEvent(dataset.tenantId, 'IMPORT_FAILED', actorId, dataset.importId, dataset.connectorId, 'Dataset possui blocking warnings.');
      return null;
    }

    if (!dataset.policyVersion) {
      ConnectorAuditLogger.logEvent(dataset.tenantId, 'IMPORT_FAILED', actorId, dataset.importId, dataset.connectorId, 'Dataset sem política de validação versionada.');
      return null;
    }

    const publication: ImportPublicationRecord = {
      publicationId: `PUB-${Date.now()}`,
      importId: dataset.importId,
      targetRuntimeVersion: 'v2.0.0-next', // A publicação engatilharia uma nova sub-versão fiduciária do runtime
      publishedBy: actorId,
      publishedAt: new Date().toISOString(),
      lineageReference: dataset.lineage
    };

    this.publications.push(publication);
    ConnectorAuditLogger.logEvent(dataset.tenantId, 'IMPORT_PUBLISHED', actorId, dataset.importId, dataset.connectorId, 'Dataset oficialmente publicado no ecossistema.');

    return publication;
  }

  static getPublicationsForTenant(tenantId: string): ImportPublicationRecord[] {
    return this.publications.filter(p => p.lineageReference.tenantId === tenantId && !p.reverted);
  }

  static revertPublication(importId: string, actorId: string, justification: string): void {
    const pub = this.publications.find(p => p.importId === importId && !p.reverted);
    if (pub) {
      pub.reverted = true;
      pub.revertedAt = new Date().toISOString();
      pub.revertedBy = actorId;
      pub.reversionJustification = justification;
    }
  }

  static getAllPublications(): ImportPublicationRecord[] {
    return this.publications;
  }

  static clearMockDataForTenant(tenantId: string) {
    this.publications = this.publications.filter(p => p.lineageReference.tenantId !== tenantId);
  }
}
