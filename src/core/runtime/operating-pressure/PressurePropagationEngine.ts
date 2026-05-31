// src/core/runtime/operating-pressure/PressurePropagationEngine.ts

import { PressureRuntimeInput, PressurePropagationOutput } from './operating-pressure-types';

export class PressurePropagationEngine {
  public static evaluate(
    input: PressureRuntimeInput,
    scores: {
      accumulation: number;
      fatigue: number;
      compression: number;
      erosion: number;
      fragility: number;
    }
  ): PressurePropagationOutput {
    const propagationChain: string[] = [];
    const activePathways: string[] = [];

    // Chain 1: Margem Comprimida (Fatigue)
    if (scores.fatigue > 30) {
      activePathways.push('Fadiga de Estrutura');
      propagationChain.push('Erosão de margem operacional e eficiência administrativa');
    }

    // Chain 2: Caixa Operacional (Erosion / Accumulation)
    if (scores.fatigue > 50 && scores.erosion > 30) {
      activePathways.push('Contágio de Caixa Operacional');
      propagationChain.push('Overhead consome margem bruta gerando defasagem no FCO');
    }

    // Chain 3: Liquidez (Compression)
    if (scores.compression > 30) {
      activePathways.push('Compressão de Liquidez');
      propagationChain.push('FCO defasado acelera contração do caixa operacional ativo');
    }

    // Chain 4: Tesouraria (Erosion)
    if (scores.erosion > 50) {
      activePathways.push('Erosão de Tesouraria');
      propagationChain.push('Consumo contínuo do caixa reduz runway e margem de sobrevivência operacional');
    }

    // Chain 5: Funding (Fragility)
    if (scores.erosion > 60 && scores.fragility > 30) {
      activePathways.push('Instabilidade de Funding');
      propagationChain.push('Erosão de tesouraria força dependência de capital de terceiros com rollover acelerado');
    }

    // Chain 6: Governança (Systemic)
    if (scores.fragility > 50 && scores.accumulation > 50) {
      activePathways.push('Desgaste Sistêmico de Governança');
      propagationChain.push('Instabilidade de funding e acúmulo histórico de pressões degradam margem fiduciária');
    }

    let propagationLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SYSTEMIC' = 'LOW';
    const pathwaysCount = activePathways.length;

    if (pathwaysCount >= 5) {
      propagationLevel = 'SYSTEMIC';
    } else if (pathwaysCount >= 3) {
      propagationLevel = 'HIGH';
    } else if (pathwaysCount >= 1) {
      propagationLevel = 'MODERATE';
    }

    return {
      propagationLevel,
      propagationChain,
      activePathways
    };
  }
}
