// src/core/runtime/causal-intelligence/engines/RootCausePrioritizationEngine.ts

import { CausalChain } from '../causal-types';

export class RootCausePrioritizationEngine {
  public static prioritize(chains: CausalChain[]): { primaryCause: string; secondaryCauses: string[] } {
    if (chains.length === 0) {
      return { primaryCause: 'NENHUM_DESVIO_CAUSAL_DETECTADO', secondaryCauses: [] };
    }

    // Score and sort chains by structural priority
    const scoredChains = chains.map(chain => {
      let score = 0;

      // 1. Category Base Weight
      switch (chain.category) {
        case 'CONSTITUTIONAL':
          score += 100;
          break;
        case 'TREASURY':
          score += 80;
          break;
        case 'WORKING_CAPITAL':
          score += 60;
          break;
        case 'OPERATIONAL':
          score += 40;
          break;
        default:
          score += 20;
          break;
      }

      // 2. Severity Modulator
      switch (chain.severity) {
        case 'RESTRICTIVE':
          score += 50;
          break;
        case 'CRITICAL':
          score += 30;
          break;
        case 'WARNING':
          score += 10;
          break;
        default:
          score += 0;
          break;
      }

      return { chain, score };
    });

    // Sort descending by score
    scoredChains.sort((a, b) => b.score - a.score);

    const primaryCause = scoredChains[0].chain.cause;
    const secondaryCauses: string[] = [];

    for (let i = 1; i < scoredChains.length; i++) {
      const cause = scoredChains[i].chain.cause;
      if (cause !== primaryCause && !secondaryCauses.includes(cause)) {
        secondaryCauses.push(cause);
      }
    }

    return { primaryCause, secondaryCauses };
  }
}
