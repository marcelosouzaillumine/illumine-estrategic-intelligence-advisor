export interface ValidationIssue {
  id: string;
  category: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
}

export interface IntelligenceAssuranceProvenance {
  source: string;
  rulesApplied: string[];
  validatedAt: string;
}

export interface IntelligenceAssuranceResult {
  status: 'VALID' | 'WARNING' | 'FAILED';
  confidence: {
    score: number;
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    factors: string[];
  };
  issues: ValidationIssue[];
  validations: {
    mathematical: boolean;
    accounting: boolean;
    narrative: boolean;
  };
  provenance: IntelligenceAssuranceProvenance;
  timestamp: Date;
}
