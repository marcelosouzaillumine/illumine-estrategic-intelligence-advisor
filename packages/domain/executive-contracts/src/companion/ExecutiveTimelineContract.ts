export interface ExecutiveTimelineEventContract {
  readonly eventId: string;
  readonly dateIso: string;
  readonly title: string;
  readonly impactDescription: string;
  readonly category: 'GOVERNANCE' | 'FINANCIAL' | 'ADVISORY' | 'ROI' | 'EXPANSION' | 'RISK_ELIMINATION';
  readonly responsiblePersonName: string;
  readonly valueGeneratedFormatted: string;
  readonly keyLearningText: string;
}

export interface ExecutiveTimelineContract {
  readonly timelineId: string;
  readonly companyId: string;
  readonly events: readonly ExecutiveTimelineEventContract[];
  readonly totalEventsCount: number;
}
