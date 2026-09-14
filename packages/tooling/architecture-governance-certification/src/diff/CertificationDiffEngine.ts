import { CertificationCertificate } from '../models/index';

export interface CertificationDiffResult {
  fromCertificateId: string;
  toCertificateId: string;
  changes: {
    evidenceAdded: number;
    evidenceRemoved: number;
    policyChanged: boolean;
    decisionChanged: boolean;
    statusChange?: {
      from: string;
      to: string;
    };
  };
}

export class CertificationDiffEngine {
  compare(from: CertificationCertificate, to: CertificationCertificate): CertificationDiffResult {
    const fromEvidenceCount = from.decision.evidenceReferences.length;
    const toEvidenceCount = to.decision.evidenceReferences.length;
    
    // Simplificação de diff para efeitos de auditoria semântica.
    // Em um caso real faríamos diff por ID de evidência (set difference).
    const added = Math.max(0, toEvidenceCount - fromEvidenceCount);
    const removed = Math.max(0, fromEvidenceCount - toEvidenceCount);

    const policyChanged = from.decision.policyVersion !== to.decision.policyVersion;
    const decisionChanged = from.decision.status !== to.decision.status;

    const statusChange = decisionChanged ? {
      from: from.decision.status,
      to: to.decision.status
    } : undefined;

    return {
      fromCertificateId: from.id,
      toCertificateId: to.id,
      changes: {
        evidenceAdded: added,
        evidenceRemoved: removed,
        policyChanged,
        decisionChanged,
        statusChange
      }
    };
  }
}
