import { HistoricalCycleData } from '../institutional-memory/types';
import { CausalSequence, StructuralPropagationVector, LongitudinalRiskPattern } from './types';
import { ExecutiveNarrativeSanitizer } from './ExecutiveNarrativeSanitizer';

export class ExecutiveCausalNarrativeComposer {
  public static compose(
    cycles: HistoricalCycleData[],
    sequences: CausalSequence[],
    propagationVectors: StructuralPropagationVector[],
    longitudinalPatterns: LongitudinalRiskPattern[]
  ): string {
    if (!cycles || cycles.length < 3) {
      return 'Histórico insuficiente para inferência causal longitudinal.';
    }

    const sentences: string[] = [];

    if (sequences.length > 0) {
      const firstSeq = sequences[0];
      const stepsDesc = firstSeq.steps.map(s => `${s.eventDescription} (ciclo ${s.cycleYear})`).join(' que precedeu ');
      sentences.push(`Com base no histórico analisado, observou-se uma trajetória em que houve ${stepsDesc.toLowerCase()}.`);
    }

    const activeVectors = propagationVectors.map(v => v.description);
    if (activeVectors.length > 0) {
      sentences.push(activeVectors.join(' '));
    }

    const activePatterns = longitudinalPatterns.map(p => p.description);
    if (activePatterns.length > 0) {
      sentences.push(activePatterns.join(' '));
    }

    if (sentences.length === 0) {
      sentences.push('A análise longitudinal indica persistência operacional e estabilidade dos fundamentos de governança nos períodos avaliados, sem sinais de pressões estruturais acumuladas.');
    }

    const fullNarrative = sentences.join(' ');

    return ExecutiveNarrativeSanitizer.sanitize(fullNarrative);
  }
}
