import { HistoricalCycleData } from '../institutional-memory/types';
import { CausalConfidenceProfile, LOW_CONFIDENCE, HIGH_CONFIDENCE, MEDIUM_CONFIDENCE } from './types';

export class CausalConfidenceEngine {
  public static evaluate(cycles: HistoricalCycleData[]): CausalConfidenceProfile {
    if (!cycles || cycles.length < 3) {
      return {
        temporalConfidence: 0.0,
        structuralCoherenceConfidence: 0.0,
        evidenceDensityConfidence: 0.0,
        globalConfidence: LOW_CONFIDENCE
      };
    }

    const evidenceDensityConfidence = 1.0;
    let temporalConfidence = 1.0;
    const sortedYears = [...cycles].map(c => c.year).sort((a, b) => a - b);
    for (let i = 1; i < sortedYears.length; i++) {
      if (sortedYears[i] <= sortedYears[i - 1]) {
        temporalConfidence = 0.0;
        break;
      }
      if (sortedYears[i] - sortedYears[i - 1] > 2) {
        temporalConfidence = 0.5;
      }
    }

    let structuralCoherenceConfidence = 1.0;
    for (const c of cycles) {
      const bpData = c.bpData || [];
      let activeSum = 0;
      let passiveSum = 0;
      let plSum = 0;

      for (const entry of bpData) {
        const code = entry.code || '';
        const val = entry.value || 0;
        if (code.startsWith('1')) activeSum += val;
        else if (code.startsWith('2')) passiveSum += val;
        else if (code.startsWith('3')) plSum += val;
      }

      if (activeSum > 0 && passiveSum > 0) {
        const diff = Math.abs(activeSum - (passiveSum + plSum));
        if (diff > activeSum * 0.02) {
          structuralCoherenceConfidence = 0.5;
        }
      }
    }

    const avg = (temporalConfidence + structuralCoherenceConfidence + evidenceDensityConfidence) / 3;
    let globalConfidence = MEDIUM_CONFIDENCE;
    if (avg >= 0.9) globalConfidence = HIGH_CONFIDENCE;
    else if (avg < 0.5) globalConfidence = LOW_CONFIDENCE;

    return {
      temporalConfidence,
      structuralCoherenceConfidence,
      evidenceDensityConfidence,
      globalConfidence
    };
  }
}
