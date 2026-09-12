import { ExecutiveDiagnosis } from '../contracts/ExecutiveDiagnosis';

export interface ResolvedEvidence {
  overallConfidence: number;
  kpiSummary: Record<string, string>;
}

export class EvidenceResolver {
  /**
   * Consolida KPIs, elimina duplicidades e calcula o score final (Overall Confidence).
   * Sem números soltos daqui pra frente.
   */
  public static resolve(diagnosis: ExecutiveDiagnosis, rawFinancialData: any): ResolvedEvidence {
    
    // OverallConfidence = MIN(FinancialIntegrity, EvidenceIntegrity, NarrativeConfidence)
    // Simplified for demonstration:
    let overallConfidence = 100;
    
    if (diagnosis.financialState.evidenceIntegrity === 'REJECTED') {
      overallConfidence = 0; // Fiduciary multiplier rule
    } else if (diagnosis.financialState.status === 'STRESSED') {
      overallConfidence = Math.min(overallConfidence, 70);
    }

    return {
      overallConfidence,
      kpiSummary: {
        driver: diagnosis.primaryDriver,
        riskLevel: diagnosis.financialState.status
      }
    };
  }
}
