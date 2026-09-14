import { ExecutiveAnalyticsEvidence } from '../types/evidence';

/**
 * Interface base para as métricas devolvidas pelo Engine.
 * O retorno não contém formatação UI nem textos gerados, apenas a conclusão.
 */
export interface CapabilityResult {
  capability: string;
  score: number; // 0 a 100
  status: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'EXCELLENT' | 'INSUFFICIENT_DATA';
  technicalConclusion: string;
  evidence: ExecutiveAnalyticsEvidence;
}

export interface IAnalyticsCapability {
  evaluate(context: any): CapabilityResult;
}
