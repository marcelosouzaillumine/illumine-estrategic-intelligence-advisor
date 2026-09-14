export interface ValueEvidenceRecord {
  id: string;
  tenantId: string;
  initialHypothesis: string;
  recommendation: string;
  decision: string;
  expectedImpactBrl: number;
  realizedImpactBrl: number;
  evidenceHash: string;
  recordedAt: string;
}

export class ValueEvidenceEngine {
  private records = new Map<string, ValueEvidenceRecord[]>();

  public registerEvidence(record: ValueEvidenceRecord): void {
    const list = this.records.get(record.tenantId) || [];
    list.push(record);
    this.records.set(record.tenantId, list);
  }

  public getEvidences(tenantId: string): ValueEvidenceRecord[] {
    return this.records.get(tenantId) || [];
  }
}

export const valueEvidenceEngine = new ValueEvidenceEngine();
