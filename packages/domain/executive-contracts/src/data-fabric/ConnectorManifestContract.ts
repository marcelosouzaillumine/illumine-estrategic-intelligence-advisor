import { CertifiedDomainDatasetContract } from '../domain-context/CertifiedDomainDatasetContract';

export type DataClassificationType = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

export interface ConnectorManifestContract {
  readonly connectorId: string;
  readonly sourceSystem: string;
  readonly domain: 'FINANCIAL' | 'COMMERCIAL' | 'OPERATIONAL' | 'PEOPLE' | 'RISK';
  readonly targetBoundary: string;
  readonly outputDataset: CertifiedDomainDatasetContract;
  readonly authenticationMethod: string;
  readonly dataClassification: DataClassificationType;
  readonly certificationRequired: boolean;
}
