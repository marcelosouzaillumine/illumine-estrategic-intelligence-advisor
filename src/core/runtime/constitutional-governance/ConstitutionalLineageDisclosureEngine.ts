import { ConstitutionalLineageInformation } from './constitutional-dashboard-types';

export class ConstitutionalLineageDisclosureEngine {
  public static extractLineage(runtimeOutput: any): ConstitutionalLineageInformation {
    const lineageHash = runtimeOutput?.canonicalState?.lineageHash || 'UNKNOWN_LINEAGE';
    const isBroken = runtimeOutput?.canonicalState?.isLineageIncomplete;

    return {
      constitutionalHash: `cst_${lineageHash}`,
      runtimeHash: lineageHash,
      propagationLineage: [
        'Data Ingestion',
        'Fiduciary Mapping',
        'Treasury Engine',
        'Executive Consolidation',
        'Constitutional Guard'
      ],
      evidenceCount: runtimeOutput?.canonicalState?.evidenceCount || 0,
      traceabilityStatus: isBroken ? 'UNTRACEABLE' : 'FULLY_TRACEABLE'
    };
  }
}
