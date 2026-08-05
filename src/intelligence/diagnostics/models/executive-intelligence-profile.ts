import { DiagnosticDomain, MaturityLevel } from '../core/diagnostic-types';

export interface ExecutiveIntelligenceProfile {
  domain: DiagnosticDomain;
  maturityLevel: MaturityLevel;
  strengths: string[];
  attentionPoints: string[];
  executiveInsights: string[];
  recommendedActions: string[];
}
