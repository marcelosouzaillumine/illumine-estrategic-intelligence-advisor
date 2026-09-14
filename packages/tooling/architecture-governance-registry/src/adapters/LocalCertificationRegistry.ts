import { 
  CertificationCertificate, 
  CertificationId, 
  CertificationWriter, 
  CertificationReader 
} from '@illumine/architecture-governance-certification';
import fs from 'fs';
import path from 'path';

export class LocalCertificationRegistry implements CertificationWriter, CertificationReader {
  private readonly storageDir: string;

  constructor(workspaceRoot: string) {
    this.storageDir = path.join(workspaceRoot, 'artifacts', 'architecture-certification');
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async issueCertificate(certificate: CertificationCertificate): Promise<void> {
    const certDir = path.join(this.storageDir, certificate.id);
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }
    const filePath = path.join(certDir, 'certificate.json');
    fs.writeFileSync(filePath, JSON.stringify(certificate, null, 2), 'utf-8');
  }

  async revokeCertificate(id: CertificationId, reason: string): Promise<void> {
    const certDir = path.join(this.storageDir, id);
    const filePath = path.join(certDir, 'certificate.json');
    if (fs.existsSync(filePath)) {
      const cert: CertificationCertificate = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const updated = { ...cert, status: 'REVOKED', revocationReason: reason };
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
    }
  }

  async expireCertificate(id: CertificationId): Promise<void> {
    const certDir = path.join(this.storageDir, id);
    const filePath = path.join(certDir, 'certificate.json');
    if (fs.existsSync(filePath)) {
      const cert: CertificationCertificate = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const updated = { ...cert, status: 'EXPIRED' };
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
    }
  }

  async findByCapability(capabilityId: string): Promise<CertificationCertificate[]> {
    const certs = await this.history();
    return certs.filter(c => c.decision.evidenceReferences.some(e => e.targetId.includes(capabilityId) || e.sourceId.includes(capabilityId)));
  }

  async findByBaseline(baselineId: string): Promise<CertificationCertificate[]> {
    const certs = await this.history();
    return certs.filter(c => c.fingerprint.gitCommit.includes(baselineId));
  }

  async history(): Promise<CertificationCertificate[]> {
    if (!fs.existsSync(this.storageDir)) return [];
    
    const certDirs = fs.readdirSync(this.storageDir);
    const certs: CertificationCertificate[] = [];
    
    for (const dir of certDirs) {
      const filePath = path.join(this.storageDir, dir, 'certificate.json');
      if (fs.existsSync(filePath)) {
        certs.push(JSON.parse(fs.readFileSync(filePath, 'utf-8')));
      }
    }
    
    return certs;
  }
}
