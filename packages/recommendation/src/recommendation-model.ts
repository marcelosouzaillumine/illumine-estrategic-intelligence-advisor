export interface Recommendation {
  id: string;
  type: string;
  description: string;
  confidence: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  requiresApproval: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
