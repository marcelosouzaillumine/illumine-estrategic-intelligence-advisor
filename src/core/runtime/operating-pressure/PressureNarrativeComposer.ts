// src/core/runtime/operating-pressure/PressureNarrativeComposer.ts

import { OperatingPressureSeverity } from './operating-pressure-types';

export class PressureNarrativeComposer {
  public static mapSeverityLabel(severity: OperatingPressureSeverity): string {
    switch (severity) {
      case 'STABLE':
        return 'Estabilidade operacional';
      case 'MODERATE':
        return 'Pressão operacional moderada';
      case 'ELEVATED':
        return 'Pressão operacional elevada';
      case 'CRITICAL':
        return 'Pressão operacional crítica';
      case 'ACUTE':
        return 'Pressão crítica acumulada';
      default:
        return 'Status sob análise';
    }
  }

  public static composeDisclosures(
    severity: OperatingPressureSeverity,
    scores: {
      overall: number;
      accumulation: number;
      fatigue: number;
      compression: number;
      erosion: number;
      fragility: number;
    }
  ): string[] {
    const disclosures: string[] = [];

    disclosures.push(`Avaliação de pressão estrutural consolidada em score ${scores.overall.toFixed(0)}/100.`);

    if (severity === 'ACUTE') {
      disclosures.push('Alerta de Governança: Identificada pressão crítica acumulada sobre a capacidade de tesouraria de curto prazo.');
    } else if (severity === 'CRITICAL') {
      disclosures.push('Recomendação Fiduciária: Monitoramento contínuo das obrigações correntes e preservação de margens operacionais.');
    }

    if (scores.fatigue > 60) {
      disclosures.push('Aceleração de custos administrativos reduz a conversão de caixa (fadiga estrutural).');
    }
    if (scores.compression > 60) {
      disclosures.push('Desgaste na velocidade do caixa requer atenção para otimização de estoques e recebíveis.');
    }
    if (scores.fragility > 60) {
      disclosures.push('Elevada rolagem de curto prazo exige repactuação prudente com credores.');
    }

    return disclosures;
  }
}
