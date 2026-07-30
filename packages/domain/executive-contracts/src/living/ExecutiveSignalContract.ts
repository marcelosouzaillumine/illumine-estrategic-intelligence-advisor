export type ExecutiveSignalSeverity = 'CRITICAL' | 'IMPORTANT' | 'OPPORTUNITY' | 'CELEBRATION' | 'INFORMATIONAL' | 'IGNORE';

export interface ExecutiveSignalContract {
  readonly signalId: string;
  readonly eventId: string;
  readonly severity: ExecutiveSignalSeverity;
  readonly title: string;
  readonly descriptionText: string;
  readonly priorityScore: number; // 0 to 100
  readonly expectedImpactText: string;
  readonly urgencyLevel: 'IMMEDIATE' | 'HIGH' | 'MODERATE' | 'LOW';
  readonly nonActionConsequenceText: string;
  readonly explainabilityJustificationText: string;
  readonly evidenceReferences: readonly string[];
}
