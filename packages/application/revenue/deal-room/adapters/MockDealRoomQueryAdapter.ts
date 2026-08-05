import { IDealRoomQueryPort } from '../ports/IDealRoomQueryPort';
import { DealRoomSnapshot } from '../snapshots/DealRoomSnapshot';

export class MockDealRoomQueryAdapter implements IDealRoomQueryPort {
  async getDealRoomSnapshot(opportunityId: string): Promise<DealRoomSnapshot> {
    const isNew = opportunityId === 'new';
    
    return {
      _metadata: {
        snapshotVersion: '1.0',
        generatedAt: new Date().toISOString(),
        projectionVersion: 42
      },
      opportunityId,
      currentStageId: isNew ? 'qualification' : 'proposal',
      decisionData: {
        expectedRoi: isNew ? 0 : 125,
        expectedArr: isNew ? 0 : 250000,
        expectedMrr: isNew ? 0 : 20833,
        cac: isNew ? 0 : 15000,
        ltv: isNew ? 0 : 750000,
        margin: isNew ? 0 : 78,
        riskLevel: isNew ? 'LOW' : 'LOW',
        probability: isNew ? 0 : 80,
        healthScore: isNew ? 0 : 92
      },
      businessContextData: {
        company: isNew ? 'Nova Empresa (Rascunho)' : 'Stark Industries',
        segmentKey: 'segments.enterprise',
        icpKey: 'icp.strategic',
        sponsor: isNew ? '' : 'Tony Stark',
        partner: isNew ? '' : 'Avengers Advisory',
        tenantId: isNew ? 'pending' : 'stark-global',
        regionKey: 'regions.na',
        languageKey: 'languages.en',
        currencyKey: 'currencies.usd'
      },
      workspaceData: {
        // mock payload for whatever workspace is active
        draftId: 'draft-99',
        status: 'pending_review'
      },
      intelligenceData: {
        insights: isNew ? [] : [
          { type: 'risk', message: 'Budget cycle ends in 30 days.' }
        ]
      },
      businessTimeline: isNew ? [] : [
        { id: '1', type: 'BUSINESS', titleKey: 'timeline.leadCreated', timestamp: new Date(Date.now() - 86400000 * 10).toISOString() },
        { id: '2', type: 'BUSINESS', titleKey: 'timeline.discoveryCompleted', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() }
      ],
      technicalTimeline: isNew ? [] : [
        { id: 't1', type: 'TECHNICAL', titleKey: 'timeline.opportunityRecordCreated', timestamp: new Date(Date.now() - 86400000 * 10).toISOString() }
      ]
    };
  }
}
