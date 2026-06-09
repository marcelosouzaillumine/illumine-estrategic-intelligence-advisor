import { EvidenceRecord } from '../../types/evidence/EvidenceRecord';

export class EvidenceGraphAdapter {
  static adaptEvidenceToGraphNode(evidence: EvidenceRecord) {
    return {
      id: evidence.artifactId,
      type: 'EVIDENCE',
      label: evidence.title,
      properties: {
        evidenceCategory: evidence.evidenceCategory,
        validity: evidence.validUntil ? (new Date(evidence.validUntil) > new Date() ? 'ACTIVE' : 'EXPIRED') : 'PERMANENT',status: evidence.status,
        authenticityHash: evidence.authenticityHash
      },
      tenantId: evidence.tenantId
    };
  }
}
