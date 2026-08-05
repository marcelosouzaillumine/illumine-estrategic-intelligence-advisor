export interface DecisionTriggerArtifact {
  id: string;
  sourceProduct: string;
  triggerType: string;
  signal: string;
  executiveQuestion: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  requiresBoardReview: boolean;
}
