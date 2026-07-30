import { CertifiedDomainDatasetContract } from '../domain-context/CertifiedDomainDatasetContract';

export interface CertifiedEnterpriseDatasetContract {
  readonly enterpriseDatasetId: string;
  readonly companyId: string;
  readonly financial?: CertifiedDomainDatasetContract;
  readonly commercial?: CertifiedDomainDatasetContract;
  readonly operational?: CertifiedDomainDatasetContract;
  readonly people?: CertifiedDomainDatasetContract;
  readonly risk?: CertifiedDomainDatasetContract;
  readonly enterpriseHash: string;
  readonly certificationStatus: 'CERTIFIED' | 'PARTIAL' | 'BLOCKED';
  readonly aggregatedAt: string;
}
