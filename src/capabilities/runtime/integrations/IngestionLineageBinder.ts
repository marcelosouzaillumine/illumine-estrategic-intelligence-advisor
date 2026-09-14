import { IngestionLineageReference } from './IntegrationGovernanceTypes';

export class IngestionLineageBinder {
  /**
   * Vincula um upload/ingestão ao lineage institucional inquebrável.
   */
  static bind(
    tenantId: string,
    workspaceId: string,
    connectorId: string,
    importId: string,
    datasetHash: string,
    sourceHash: string,
    mappingVersion: string
  ): IngestionLineageReference {
    return {
      tenantId,
      workspaceId,
      connectorId,
      importId,
      datasetHash,
      sourceHash,
      mappingVersion,
      timestamp: new Date().toISOString()
    };
  }
}
