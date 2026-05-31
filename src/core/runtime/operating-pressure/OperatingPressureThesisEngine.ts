// src/core/runtime/operating-pressure/OperatingPressureThesisEngine.ts

import { PressureRuntimeInput, PressureThesisOutput } from './operating-pressure-types';

export class OperatingPressureThesisEngine {
  public static evaluate(
    input: PressureRuntimeInput,
    scores: {
      overall: number;
      accumulation: number;
      fatigue: number;
      compression: number;
      erosion: number;
      fragility: number;
    }
  ): PressureThesisOutput {
    let operationalFatigueProfile = 'Preservação de capacidade absorsiva operacional. Estrutura de custos em equilíbrio com a margem.';
    if (scores.fatigue > 70) {
      operationalFatigueProfile = 'Redução severa da capacidade de absorção operacional por elevação persistente de custos fixos e SG&A.';
    } else if (scores.fatigue > 40) {
      operationalFatigueProfile = 'Redução moderada na capacidade de absorção operacional sob margem estável mas custos crescentes.';
    }

    let liquidityStrainProfile = 'Estabilidade nos índices de liquidez circulante sem distorções materiais.';
    if (scores.compression > 70) {
      liquidityStrainProfile = 'Compressão acentuada de liquidez circulante sob queima acelerada e distorção de estoque.';
    } else if (scores.compression > 40) {
      liquidityStrainProfile = 'Sinais preliminares de compressão de liquidez operacional com dependência de recebíveis futuros.';
    }

    let treasuryErosionProfile = 'Saldo de tesouraria saudável frente à necessidade operacional anual.';
    if (scores.erosion > 70) {
      treasuryErosionProfile = 'Erosão severa de reservas de tesouraria decorrente de FCO desfavorável contínuo.';
    } else if (scores.erosion > 40) {
      treasuryErosionProfile = 'Drenagem gradual de caixa com redução de runway de segurança de médio prazo.';
    }

    let institutionalOperatingStrain = 'Pressão operacional sob controle fiduciário.';
    if (scores.overall > 80) {
      institutionalOperatingStrain = 'Pressão crítica acumulada com contágio multicanal de restrições operacionais e financeiras.';
    } else if (scores.overall > 50) {
      institutionalOperatingStrain = 'Nível elevado de desgaste operacional com pontos de compressão em FCO e dependência de capital.';
    } else if (scores.overall > 25) {
      institutionalOperatingStrain = 'Fadiga operacional moderada com resiliência estrutural preservada.';
    }

    let thesisSummary = 'A governança operacional demonstra equilíbrio financeiro e suporte fiduciário intacto.';
    if (scores.overall > 70) {
      thesisSummary = 'Desgaste estrutural consolidado exigindo moderação na alocação de recursos e blindagem de liquidez.';
    } else if (scores.overall > 40) {
      thesisSummary = 'Pressão operacional em estágio intermediário com necessidade de controle de overhead e preservação do FCO.';
    }

    const pressureProfile = `Pontuação consolidada de estresse operacional em ${scores.overall.toFixed(1)}/100, classificada sob taxonomia de prudência fiduciária.`;

    return {
      thesisSummary,
      pressureProfile,
      operationalFatigueProfile,
      liquidityStrainProfile,
      treasuryErosionProfile,
      institutionalOperatingStrain
    };
  }
}
