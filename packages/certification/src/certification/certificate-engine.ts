import { EvidenceBuilder } from '../evidence/evidence-builder';
import { SHA256Generator } from '../hash/sha256-generator';
import { Logger } from '../../../core/src/logging/logger';

export interface L4CertificationRecord {
  assetId: string;
  architectureLevel: 'L4';
  ahs: number;
  gci: number;
  evidenceHash: string;
  certifiedAt: string;
  auditor: string;
}

export class CertificateEngine {
  public static certifyL4(assetId: string): L4CertificationRecord {
    Logger.info(`[Certification Engine] Gerando evidências e certificado L4 para: ${assetId}`);

    const bundle = EvidenceBuilder.buildBundle(assetId);
    const hash = SHA256Generator.hash(JSON.stringify(bundle));

    const record: L4CertificationRecord = {
      assetId,
      architectureLevel: 'L4',
      ahs: bundle.ahsScore,
      gci: bundle.gciIndex,
      evidenceHash: hash,
      certifiedAt: new Date().toISOString(),
      auditor: 'AGF Automated Certification Engine v20.4'
    };

    Logger.info(`[Certification Engine] Atestado L4 emitido com sucesso! Hash: ${record.evidenceHash}`);
    return record;
  }
}
