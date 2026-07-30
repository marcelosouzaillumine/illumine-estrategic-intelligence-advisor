import { PredictionContract } from '@illumine/executive-contracts';

export class PredictionExplainer {
  public static explainPrediction(prediction: PredictionContract): string {
    return `Previsão de ${prediction.metricCode} para ${prediction.horizonDays} dias: Valor esperado de ${prediction.expectedValue}% (Intervalo: ${prediction.confidenceInterval.min}% a ${prediction.confidenceInterval.max}%). Fator dominante: ${prediction.dominantFactor} (Confiança: ${prediction.confidenceScore}%).`;
  }
}
