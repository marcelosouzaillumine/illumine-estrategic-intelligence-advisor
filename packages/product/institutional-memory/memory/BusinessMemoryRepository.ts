export interface DecisionRecord {
  id: string;
  tenantId: string;
  context: string;
  assumptions: string[];
  selectedAction: string;
  expectedImpact: string;
  actualImpact?: string;
  lessonsLearned?: string[];
  createdAt: string;
}

export class BusinessMemoryRepository {
  private records = new Map<string, DecisionRecord[]>();

  public saveDecision(record: DecisionRecord): void {
    const list = this.records.get(record.tenantId) || [];
    list.push(record);
    this.records.set(record.tenantId, list);
  }

  public getDecisions(tenantId: string): DecisionRecord[] {
    return this.records.get(tenantId) || [];
  }
}

export const businessMemoryRepository = new BusinessMemoryRepository();
