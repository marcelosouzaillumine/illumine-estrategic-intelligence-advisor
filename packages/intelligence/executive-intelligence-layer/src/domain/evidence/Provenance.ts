export interface Provenance {
  /**
   * Qual o nome do indicador, fato ou motor que gerou a afirmação.
   */
  origin: string;

  /**
   * Fórmula matemática ou regra de negócio utilizada.
   */
  formula?: string;

  /**
   * Grau de confiança estatística ou fiduciária na afirmação (0 a 100).
   */
  confidence: number;

  /**
   * Motor responsável por atestar a veracidade da informação.
   * Ex: "FinancialIntegrityEngine", "CausalDiagnosticEngine".
   */
  validatedBy: string;
}
