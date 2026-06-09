import { InstitutionalSnapshot } from './PredictiveTypes';

export interface InstitutionalTrendRepository {
  getSnapshots(companyId: string): InstitutionalSnapshot[];
  saveSnapshot?(companyId: string, snapshot: InstitutionalSnapshot): void;
}

export class InMemoryTrendRepository implements InstitutionalTrendRepository {
  private memory: Record<string, InstitutionalSnapshot[]> = {};

  public getSnapshots(companyId: string): InstitutionalSnapshot[] {
    return this.memory[companyId] || [];
  }

  public saveSnapshot(companyId: string, snapshot: InstitutionalSnapshot): void {
    if (!this.memory[companyId]) {
      this.memory[companyId] = [];
    }
    this.memory[companyId].push(snapshot);
  }

  // Pre-populates mock data for UI testing before Firestore integration
  public seedMockData(companyId: string) {
    this.memory[companyId] = [
      { id: '1', timestamp: '2026-03-01T00:00:00Z', governanceScore: 60, cescfScore: 70, bpHealth: 65, dfcHealth: 80, dreHealth: 75, esgMaturity: 50 },
      { id: '2', timestamp: '2026-04-01T00:00:00Z', governanceScore: 65, cescfScore: 72, bpHealth: 62, dfcHealth: 75, dreHealth: 72, esgMaturity: 55 },
      { id: '3', timestamp: '2026-05-01T00:00:00Z', governanceScore: 70, cescfScore: 75, bpHealth: 58, dfcHealth: 60, dreHealth: 65, esgMaturity: 60 },
      { id: '4', timestamp: '2026-06-01T00:00:00Z', governanceScore: 78, cescfScore: 80, bpHealth: 50, dfcHealth: 45, dreHealth: 60, esgMaturity: 65 }
    ];
  }
}
