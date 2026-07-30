export interface CertifiedDomainDatasetContract {
  readonly identity: {
    readonly datasetId: string;
    readonly domain: 'FINANCIAL' | 'COMMERCIAL' | 'OPERATIONAL' | 'PEOPLE' | 'RISK';
    readonly schemaVersion: string;
    readonly generatedAt: string;
    readonly datasetHash: string;
  };
  readonly governance: {
    readonly certificationStatus: 'CERTIFIED' | 'UNCERTIFIED' | 'REVOKED';
    readonly runtimePermission: 'ALLOW' | 'RESTRICT' | 'BLOCK';
  };
  readonly quality: {
    readonly dataQualityScore: number;
    readonly healthIndex: number;
    readonly freshnessHours: number;
    readonly completenessPercent: number;
    readonly consistencyPercent: number;
    readonly reliabilityPercent: number;
  };
  readonly lineage: {
    readonly sourceSystem: string;
    readonly transformationPipeline: string;
    readonly validatorService: string;
    readonly certifierAuthority: string;
  };
  readonly runtimePermissions: {
    readonly allowedCapabilities: readonly (
      | 'EXECUTIVE_ANALYSIS'
      | 'EXECUTIVE_DECISION'
      | 'FORECAST'
      | 'RECOMMENDATION'
    )[];
  };
}
