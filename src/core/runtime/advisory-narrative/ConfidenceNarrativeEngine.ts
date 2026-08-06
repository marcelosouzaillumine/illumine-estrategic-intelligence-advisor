// src/core/runtime/advisory-narrative/ConfidenceNarrativeEngine.ts
//
// Confidence Narrative Engine
// Explains the level of predictive confidence, support quality, and data limitations.

import { AdvisoryAudience } from './advisory-narrative-types';

export class ConfidenceNarrativeEngine {
  /**
   * Generates statements detailing data completeness, confidence bounds, and predictions limitations.
   */
  public static generateConfidenceStatement(
    report: any,
    audience: AdvisoryAudience
  ): string {
    const confidence = report.compliance?.confidenceLevel ?? report.confidenceLevel ?? 'HIGH_CONFIDENCE';
    const completeness = report.compliance?.dataCompleteness ?? report.dataCompleteness ?? 100;
    const historyLength = report.historicalDecisions?.length ?? report.historyLength ?? 0;

    let statement = `AVALIAÇÃO DE CONFIANÇA E LIMITAÇÕES DOS DADOS:\n`;
    statement += `- Grau de Confiança: Classificado como "${confidence}".\n`;
    statement += `- Completude de Dados Financeiros: Medida em ${completeness}% dos campos necessários para modelagem de ciclo imediato.\n`;
    statement += `- Base Histórica Decisória: Conta com ${historyLength} registros armazenados no decision ledger (lineage fiduciário).\n`;

    if (historyLength < 4) {
      statement += `- Limitação Preditiva Importante: O histórico decisório inferior a 4 registros reduz o grau de assertividade das tendências longitudinais de fadiga e desvio comportamental.`;
    } else {
      statement += `- Suporte Histórico: O volume de histórico é suficiente para calibração das curvas de EMA comportamental.`;
    }

    return statement;
  }
}
