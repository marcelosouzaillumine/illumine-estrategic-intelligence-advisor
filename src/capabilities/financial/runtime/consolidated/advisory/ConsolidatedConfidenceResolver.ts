import { RuntimeConfidence } from '../../../../runtime/types';
import { CrossEntityCausality, SystemicRisk } from './advisoryTypes';

export class ConsolidatedConfidenceResolver {
  static recalibrate(
    baseConfidence: RuntimeConfidence,
    causalities: CrossEntityCausality[],
    risks: SystemicRisk[]
  ): RuntimeConfidence {
    const confidenceLevels: Record<RuntimeConfidence, number> = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };
    let finalLevel = baseConfidence;

    // Se a confiança original já é LOW, não há como piorar.
    if (finalLevel === 'LOW') return 'LOW';

    // 1. Riscos sistêmicos críticos rebaixam para LOW
    const hasCriticalRisk = risks.some(r => r.severity === 'CRITICAL' || r.severity === 'SEVERE');
    if (hasCriticalRisk) {
      return 'LOW';
    }

    // 2. Crescimento artificial severo rebaixa no mínimo para MEDIUM
    const hasArtificialGrowth = causalities.some(c => c.causalityType === 'ARTIFICIAL_GROWTH');
    if (hasArtificialGrowth && confidenceLevels[finalLevel] > confidenceLevels['MEDIUM']) {
      finalLevel = 'MEDIUM';
    }

    // 3. Parasitismo severo ou subsidiação material rebaixa para MEDIUM
    const hasParasitism = causalities.some(c => c.causalityType === 'OPERATIONAL_PARASITISM' || c.causalityType === 'ARTIFICIAL_SUBSIDIZATION');
    if (hasParasitism && confidenceLevels[finalLevel] > confidenceLevels['MEDIUM']) {
      finalLevel = 'MEDIUM';
    }

    return finalLevel;
  }
}
