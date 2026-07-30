export type ConnectorSourceType = 'ERP' | 'CRM' | 'BANKING' | 'SPREADSHEET' | 'API' | 'MANUAL';
export type ConnectorFrequency = 'REALTIME' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MANUAL';
export type ConnectorStatus = 'HEALTHY' | 'SYNCING' | 'DEGRADED' | 'ERROR';

export interface ConnectorSpecification {
  readonly connectorId: string;
  readonly name: string;
  readonly sourceType: ConnectorSourceType;
  readonly frequency: ConnectorFrequency;
  readonly schemaVersion: string;
  readonly status: ConnectorStatus;
  readonly lastSyncTimestamp: string;
  readonly totalRecordsProcessed: number;
}

export interface DataLineageTrace {
  readonly traceId: string;
  readonly dataSourceId: string;
  readonly dataSourceName: string;
  readonly transformationName: string;
  readonly metricCode: string;
  readonly metricValue: number | string;
  readonly insightId?: string;
  readonly timestamp: string;
}

export interface DataQualityReport {
  readonly reportId: string;
  readonly tenantId: string;
  readonly dataCoveragePercent: number;
  readonly inconsistencyCount: number;
  readonly delayedRecordsCount: number;
  readonly confidenceScore: number;
  readonly lastAuditTimestamp: string;
}

export interface DataEventContract {
  readonly eventId: string;
  readonly tenantId: string;
  readonly companyId: string;
  readonly eventType: 'TRANSACTION_REGISTERED' | 'METRIC_UPDATED' | 'CONNECTOR_SYNCED';
  readonly payload: Record<string, unknown>;
  readonly timestamp: string;
}

export * from './ConnectorManifestContract';
export * from './RawDataIsolationContract';
export * from './CertifiedEnterpriseDatasetContract';

