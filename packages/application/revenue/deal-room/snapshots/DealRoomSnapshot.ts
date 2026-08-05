export interface SnapshotMetadata {
  snapshotVersion: string;
  generatedAt: string;
  projectionVersion: number;
}

export interface DealRoomSnapshot {
  _metadata: SnapshotMetadata;
  opportunityId: string;
  currentStageId: string;
  
  // Executive Decision Panel Data
  decisionData: {
    expectedRoi: number;
    expectedArr: number;
    expectedMrr: number;
    cac: number;
    ltv: number;
    margin: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    probability: number;
    healthScore: number;
  };
  
  // Business Context Panel Data
  businessContextData: {
    company: string;
    segmentKey: string;
    icpKey: string;
    sponsor: string;
    partner?: string;
    tenantId: string;
    regionKey: string;
    languageKey: string;
    currencyKey: string;
  };
  
  // The specific workspace data based on the stage
  workspaceData: any; 
  
  // Enterprise Intelligence
  intelligenceData: any;
  
  // Timelines
  businessTimeline: any[];
  technicalTimeline: any[];
}
