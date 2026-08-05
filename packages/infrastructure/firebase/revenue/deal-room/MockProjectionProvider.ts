import { IProjectionProvider } from '@application/revenue/deal-room/ports/IProjectionProvider';
import { DealRoomSnapshot } from '@application/revenue/deal-room/snapshots/DealRoomSnapshot';

export class MockProjectionProvider implements IProjectionProvider {
  // We can simulate an in-memory delay or sync states here
  async getDealRoomProjection(tenantId: string, opportunityId: string): Promise<DealRoomSnapshot | null> {
    if (opportunityId === 'new') {
      return this.buildEmptySnapshot(opportunityId, tenantId);
    }
    
    // Simulate finding a projection
    return this.buildMockRealSnapshot(opportunityId, tenantId);
  }

  private buildEmptySnapshot(opportunityId: string, tenantId: string): DealRoomSnapshot {
    return {
      _metadata: {
        snapshotVersion: '2.0',
        generatedAt: new Date().toISOString(),
        projectionVersion: 1
      },
      opportunityId,
      currentStageId: 'qualification',
      decisionData: {
        expectedRoi: 0, expectedArr: 0, expectedMrr: 0, cac: 0, ltv: 0, margin: 0,
        riskLevel: 'LOW', probability: 0, healthScore: 0
      },
      businessContextData: {
        company: 'Nova Empresa',
        segmentKey: 'segments.enterprise',
        icpKey: 'icp.strategic',
        sponsor: '',
        partner: '',
        tenantId: tenantId,
        regionKey: 'regions.na',
        languageKey: 'languages.en',
        currencyKey: 'currencies.usd'
      },
      workspaceData: { draftId: 'draft', status: 'INITIALIZING' },
      intelligenceData: { insights: [] },
      businessTimeline: [],
      technicalTimeline: []
    };
  }

  private buildMockRealSnapshot(opportunityId: string, tenantId: string): DealRoomSnapshot {
    return {
      _metadata: {
        snapshotVersion: '2.0 (Real Data)',
        generatedAt: new Date().toISOString(),
        projectionVersion: 1
      },
      opportunityId,
      currentStageId: 'qualification', // could be dynamically pulled
      decisionData: {
        expectedRoi: 0,
        expectedArr: 150000,
        expectedMrr: 12500,
        cac: 0,
        ltv: 450000,
        margin: 0,
        riskLevel: 'LOW',
        probability: 50,
        healthScore: 80
      },
      businessContextData: {
        company: 'Stark Industries',
        segmentKey: 'segments.enterprise',
        icpKey: 'icp.strategic',
        sponsor: 'Tony Stark',
        partner: '',
        tenantId: tenantId,
        regionKey: 'regions.na',
        languageKey: 'languages.en',
        currencyKey: 'currencies.usd'
      },
      workspaceData: {
        draftId: 'draft-live',
        status: 'READY' // Sync State
      },
      intelligenceData: {
        insights: []
      },
      businessTimeline: [
        { id: '1', type: 'BUSINESS', titleKey: 'timeline.leadCreated', timestamp: new Date().toISOString() }
      ],
      technicalTimeline: [
        { id: 't1', type: 'TECHNICAL', titleKey: 'timeline.opportunityRecordCreated', timestamp: new Date().toISOString() }
      ]
    };
  }
}
