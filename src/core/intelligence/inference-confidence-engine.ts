export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ConfidenceInference {
  level: ConfidenceLevel;
  score: number; // 0 to 100
  evidence: string[];
  explanation: string;
}

export function calculateInferenceConfidence(
  dreDataLength: number, 
  dataConsistencyCount: number, // Quantos anos estão totalmente consolidados
  historicalVolatility: number // Volatilidade de margem, proxy para solidez causal
): ConfidenceInference {
  let score = 0;
  const evidence: string[] = [];
  
  if (dreDataLength >= 3) {
    score += 50;
    evidence.push('Histórico consolidado (3+ períodos) provê estabilidade temporal');
  } else if (dreDataLength === 2) {
    score += 30;
    evidence.push('Histórico parcial (2 períodos) com causalidade validada restritamente');
  } else {
    score += 10;
    evidence.push('Primeiro ciclo operacional. Dados insuficientes para inferir estabilidade estrutural');
  }

  if (dataConsistencyCount >= dreDataLength && dreDataLength > 0) {
    score += 30;
    evidence.push('Coerência estrutural contábil presente e validada');
  } else {
    evidence.push('Lacunas contábeis diminuem a rastreabilidade causal');
  }

  if (historicalVolatility < 0.2) {
    score += 20;
    evidence.push('Baixa volatilidade operacional garante previsibilidade das inferências');
  } else if (historicalVolatility > 0.5) {
    score -= 10;
    evidence.push('Alta volatilidade distorce parcialmente a capacidade preditiva da engine');
  } else {
    score += 10;
    evidence.push('Volatilidade neutra, indicativa de operação contínua sem quebras');
  }
  
  score = Math.max(0, Math.min(100, score));
  
  let level: ConfidenceLevel = 'LOW';
  let explanation = '';
  
  if (score >= 80) {
    level = 'HIGH';
    explanation = 'Alta Confiança: Recorrência comprovada, estabilidade temporal, múltiplos sinais e coerência consolidada.';
  } else if (score >= 50) {
    level = 'MEDIUM';
    explanation = 'Confiança Média: Causalidade parcialmente validada, com sinais coerentes porém profundidade histórica ainda em consolidação.';
  } else {
    level = 'LOW';
    explanation = 'Baixa Confiança: Inferência parcial por falta de histórico ou primeiro ciclo operacional (High Noise Ratio).';
  }
  
  return {
    level,
    score,
    evidence,
    explanation
  };
}
