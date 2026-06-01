import { ExecutiveIntelligenceReport } from '../runtime/executive-intelligence-runtime';

export class ExportMetadataAdapter {
  public static extractTenantId(report: ExecutiveIntelligenceReport): string {
    // Legacy support extraction
    const contextAny = report.institutionalContext as any;
    const metaAny = report.runtimeMetadata as any;
    const lineageAny = metaAny?.lineage as any;
    return contextAny?.tenantId || lineageAny?.tenantId || 'SANDBOX-TENANT';
  }

  public static extractExecutionId(report: ExecutiveIntelligenceReport): string {
    const metaAny = report.runtimeMetadata as any;
    return metaAny?.importId || report.runtimeMetadata?.executionId || 'EXEC-N/A';
  }

  public static extractDatasetHash(report: ExecutiveIntelligenceReport): string {
    const metaAny = report.runtimeMetadata as any;
    const lineageAny = metaAny?.lineage as any;
    return lineageAny?.datasetHash || metaAny?.lineageHash || 'HASH-N/A';
  }
}
