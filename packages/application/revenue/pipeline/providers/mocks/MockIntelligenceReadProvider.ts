import { IIntelligenceReadProvider } from '../IIntelligenceReadProvider';
import { IntelligenceReadModel } from '../../read-models/IntelligenceReadModel';
export class MockIntelligenceReadProvider implements IIntelligenceReadProvider {
  async getInsights(leadId: string): Promise<IntelligenceReadModel[]> {
    return [
      { id: '1', title: 'High Propensity to Buy', impact: 'Based on recent engagement', recommendation: 'Accelerate proposal', icon: 'Star' as any }
    ];
  }
}