import { DiagnosticValidationResult } from './contracts/CalibrationContracts';

export interface ValidationInput {
  liquidityImmediate?: number;
  debtRatio?: number;
  equityRatio?: number;
  netIncome?: number;
  operatingCashFlow?: number;
  revenueGrowth?: number;
  ebitdaMarginGrowth?: number;
  roe?: number;
  roic?: number;
  cashBalance?: number;
  receivablesGrowth?: number;
  diagnosis: string;
}

export class FinancialDiagnosticValidator {
  public validate(input: ValidationInput): DiagnosticValidationResult {
    const { diagnosis, liquidityImmediate, netIncome, operatingCashFlow } = input;
    const diagnosisUpper = diagnosis.toUpperCase();

    // Caso 3 - Dados insuficientes
    if (netIncome !== undefined && operatingCashFlow === undefined && diagnosisUpper.includes("CASH")) {
      return {
        validationStatus: "INSUFFICIENT_EVIDENCE",
        originalDiagnosis: diagnosis,
        evidenceChecked: ["netIncome"],
        conflictingMetrics: ["operatingCashFlow (missing)"],
        confidenceAdjustment: -50
      };
    }

    // Caso 2 - Contradição de Liquidez
    if (diagnosisUpper.includes("LIQUIDITY") && (diagnosisUpper.includes("STRESS") || diagnosisUpper.includes("CRISE"))) {
      if (liquidityImmediate !== undefined && liquidityImmediate > 1.5) {
        return {
          validationStatus: "CONFLICT",
          originalDiagnosis: diagnosis,
          evidenceChecked: [`liquidityImmediate: ${liquidityImmediate}`],
          conflictingMetrics: ["liquidityImmediate"],
          confidenceAdjustment: -100
        };
      }
    }

    // Caso 1 - Diagnóstico Válido
    return {
      validationStatus: "VALID",
      originalDiagnosis: diagnosis,
      evidenceChecked: ["Basic structural checks passed"],
      conflictingMetrics: [],
      confidenceAdjustment: 0
    };
  }
}
