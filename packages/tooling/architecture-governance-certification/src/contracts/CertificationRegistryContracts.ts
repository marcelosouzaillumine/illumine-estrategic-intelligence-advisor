import { CertificationCertificate, CertificationId } from '../models';

export interface CertificationWriter {
  issueCertificate(certificate: CertificationCertificate): Promise<void>;
  revokeCertificate(id: CertificationId, reason: string): Promise<void>;
  expireCertificate(id: CertificationId): Promise<void>;
}

export interface CertificationReader {
  findByCapability(capabilityId: string): Promise<CertificationCertificate[]>;
  findByBaseline(baselineId: string): Promise<CertificationCertificate[]>;
  history(): Promise<CertificationCertificate[]>;
}
