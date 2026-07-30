export interface ExecutiveNarrativeContract {
  readonly narrativeId: string;
  readonly technicalMetricName: string;
  readonly rawValue: string | number;
  readonly executiveNarrativeText: string;
  readonly tone: 'NEUTRAL' | 'WARNING' | 'OPPORTUNITY' | 'CRITICAL';
  readonly generatedAt: string;
}
