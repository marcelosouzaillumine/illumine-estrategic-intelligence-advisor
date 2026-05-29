// src/core/runtime/war-gaming/CrisisExplainabilityEngine.ts

import { CrisisPropagationNode, CrisisExplainabilityProfile, InstitutionalSurvivalThesis, TreasurySurvivalProfile } from './war-gaming-types';

export class CrisisExplainabilityEngine {
  public static generateProfile(
    scenarioHash: string,
    lineageHash: string,
    nodes: CrisisPropagationNode[],
    thesis: InstitutionalSurvivalThesis,
    treasury: TreasurySurvivalProfile
  ): CrisisExplainabilityProfile {
    
    const activatedChains = nodes.map(n => `${n.variable} (${n.severity})`);
    
    const brokenConstraints: string[] = [];
    if (treasury.criticalCovenantBreached) {
      brokenConstraints.push('Rompimento Projetado de Covenant');
    }
    if (treasury.exhaustionPointReached) {
      brokenConstraints.push('Exaustão de Liquidez (Cash Burn > Run Rate)');
    }

    const escalatedPressures: string[] = [];
    if (thesis.fiduciaryPressureLevel === 'EXTREMA' || thesis.fiduciaryPressureLevel === 'ALTA') {
      escalatedPressures.push(`Pressão Fiduciária ${thesis.fiduciaryPressureLevel}`);
    }

    const explanation = `A simulação ativou ${nodes.length} nós de propagação. A resiliência institucional marcou ${thesis.resilienceScore}/100. O evento raiz se desdobrou em pressões estruturais que culminaram em um runway projetado de ${treasury.availableRunwayMonths} meses.`;

    return {
      scenarioHash,
      lineageHash,
      activatedChains,
      brokenConstraints,
      escalatedPressures,
      institutionalStressExplanation: explanation,
      fiduciaryWarnings: [
        'Este cenário é uma simulação estrutural determinística e não representa uma previsão fiduciária.'
      ]
    };
  }
}
