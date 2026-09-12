import { FinancialIntegrityResult } from './FinancialIntegrityResult';
import { FinancialIntelligenceAssessment } from '../contracts/FinancialIntelligenceAssessment';
import { ExecutiveFinancialState } from '../contracts/ExecutiveFinancialState';

export class ExecutiveFinancialStateClassifier {
  /**
   * Pura classificação descritiva baseada nos dados e na integridade.
   * Não emite políticas, não bloqueia. Apenas diz a verdade sobre os dados.
   */
  public static classify(
    assessment: FinancialIntelligenceAssessment
  ): ExecutiveFinancialState {
    let status: "HEALTHY" | "ATTENTION" | "STRESSED" | "CRITICAL" = "HEALTHY";
    let evidenceIntegrity: "VALIDATED" | "WARNING" | "REJECTED" = "VALIDATED";

    if (assessment.integrityStatus === 'BLOCKED') {
      evidenceIntegrity = "REJECTED";
      status = "CRITICAL";
    } else if (assessment.integrityStatus === 'WARNING') {
      evidenceIntegrity = "WARNING";
    }

    if (status !== "CRITICAL") {
      if (assessment.solvency.status === 'CRITICAL' || assessment.cashConversion.status === 'CRITICAL') {
        status = "CRITICAL";
      } else if (assessment.solvency.status === 'VULNERABLE' || assessment.cashConversion.status === 'ATTENTION' || assessment.earningsQuality.classification === 'LOW') {
        status = "STRESSED";
      } else if (assessment.earningsQuality.classification === 'MODERATE') {
        status = "ATTENTION";
      }
    }

    return {
      status,
      liquidity: assessment.solvency.liquidityRatio,
      equity: assessment.solvency.equityToAssets, // Simplified: should ideally be raw equity
      cashConversion: assessment.cashConversion.conversionRate,
      evidenceIntegrity
    };
  }
}
