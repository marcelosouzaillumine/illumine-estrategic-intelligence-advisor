import { ConnectorRegistry } from './ConnectorRegistry';
import { DataIngestionGateway } from './DataIngestionGateway';
import { DataQualityGatekeeper } from './DataQualityGatekeeper';
import { SchemaMappingEngine } from './SchemaMappingEngine';
import { SourceTrustEngine } from './SourceTrustEngine';
import { IngestionLineageBinder } from './IngestionLineageBinder';
import { ImportReviewQueue } from './ImportReviewQueue';
import { ConnectorAuditLogger } from './ConnectorAuditLogger';
import { ImportedDataset } from './IntegrationGovernanceTypes';

export class ConnectorExecutionEngine {
  /**
   * Orquestra a ingestão de dados ponta-a-ponta, desde o gateway até a Fila de Revisão.
   */
  static executeIngestion(
    tenantId: string,
    workspaceId: string,
    connectorId: string,
    rawPayload: any,
    actorId: string
  ): ImportedDataset | null {
    const connector = ConnectorRegistry.getConnector(connectorId);
    if (!connector || !connector.isActive) {
      ConnectorAuditLogger.logEvent(tenantId, 'IMPORT_FAILED', actorId, undefined, connectorId, 'Conector inativo ou inexistente.');
      return null;
    }

    ConnectorAuditLogger.logEvent(tenantId, 'IMPORT_RECEIVED', actorId, undefined, connectorId, 'Payload recebido no Gateway.');

    const receivedPayload = DataIngestionGateway.receivePayload(rawPayload);
    const violations = DataQualityGatekeeper.inspect(receivedPayload, tenantId, workspaceId);

    const hasBlocker = violations.some(v => v.severity === 'BLOCKER');
    if (hasBlocker) {
      ConnectorAuditLogger.logEvent(tenantId, 'IMPORT_REJECTED', actorId, undefined, connectorId, `Payload rejeitado por violação crítica estrutural: ${violations[0].rule}`);
      return null;
    }

    const mappedData = SchemaMappingEngine.normalizePayload(receivedPayload);
    const trust = SourceTrustEngine.evaluateTrust(connector.type);
    
    const importId = `IMPORT-${Date.now()}`;
    const lineage = IngestionLineageBinder.bind(
      tenantId,
      workspaceId,
      connectorId,
      importId,
      `HASH-DATA-${Date.now()}`,
      `HASH-SRC-${Date.now()}`,
      mappedData.mappingVersion
    );

    const dataset: ImportedDataset = {
      importId,
      connectorId,
      tenantId,
      workspaceId,
      rawPayloadSize: JSON.stringify(rawPayload).length,
      extractedRecords: Array.isArray(rawPayload) ? rawPayload.length : 1,
      trustLevel: trust,
      status: 'PENDING_REVIEW', // Forçado no MVP para passar na aprovação
      lineage,
      violations,
      submittedBy: actorId,
      submittedAt: new Date().toISOString()
    };

    ImportReviewQueue.enqueue(dataset);
    ConnectorAuditLogger.logEvent(tenantId, 'IMPORT_REVIEW_REQUIRED', actorId, importId, connectorId, 'Dataset na fila de Staging.');

    return dataset;
  }
}
