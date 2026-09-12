import { BPSummary } from '../../../lib/bpEngine';
import { ShareholderExposureProfile, StructuralCapitalSignal } from './types';

export class ShareholderExposureEngine {
  /**
   * Avalia a tensão fiduciária e a exposição patrimonial na relação sócios x operação.
   * Utiliza linguagem institucional rigorosamente desprovida de acusações.
   */
  static evaluate(bpSummary: BPSummary): ShareholderExposureProfile {
    if (!bpSummary) {
      return {
        shareholderCurrentAccountRatio: 0,
        shareholderConcentration: 0,
        impliedGovernanceFrailty: false,
        fiduciaryTensionLevel: 'NONE',
        activeSignals: [],
        explanation: 'Dados insuficientes para avaliar exposição patrimonial dos sócios.'
      };
    }

    const {
      creditosSocios,
      ativoTotal,
      patrimonioLiquido
    } = bpSummary;

    if (!creditosSocios || creditosSocios <= 0) {
      return {
        shareholderCurrentAccountRatio: 0,
        shareholderConcentration: 0,
        impliedGovernanceFrailty: false,
        fiduciaryTensionLevel: 'NONE',
        activeSignals: [],
        explanation: 'Não há indícios de concentração patrimonial cruzada (conta corrente de sócios material).'
      };
    }

    // Cálculos
    const shareholderCurrentAccountRatio = ativoTotal > 0 ? creditosSocios / ativoTotal : 0;
    const shareholderConcentration = patrimonioLiquido > 0 ? creditosSocios / patrimonioLiquido : creditosSocios > 0 ? 999 : 0;

    const activeSignals: StructuralCapitalSignal[] = [];
    const explanations: string[] = [];

    // Thresholds
    let tensionLevel: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' = 'NONE';

    if (shareholderCurrentAccountRatio > 0.20) {
      activeSignals.push('HIGH_SHAREHOLDER_OPERATIONAL_INTERDEPENDENCE');
      explanations.push(`Alta interdependência operacional detectada: direitos sobre sócios compõem ${(shareholderCurrentAccountRatio * 100).toFixed(1)}% da base de ativos.`);
      tensionLevel = tensionLevel === 'NONE' ? 'MODERATE' : tensionLevel; // Base level
    }

    if (shareholderConcentration > 0.30) {
      activeSignals.push('SHAREHOLDER_PATRIMONIAL_CONCENTRATION');
      explanations.push(`Exposição patrimonial relevante: capital imobilizado no círculo societário atinge ${(shareholderConcentration * 100).toFixed(1)}% do Patrimônio Líquido.`);
      tensionLevel = 'HIGH'; // Overrides
    }

    const impliedGovernanceFrailty = shareholderCurrentAccountRatio > 0.20 && shareholderConcentration > 0.30;
    
    if (impliedGovernanceFrailty) {
      explanations.push('Este contexto sinaliza fragilidade de governança na preservação do capital operacional, sugerindo tensão fiduciária.');
    }

    let explanation = '';
    if (activeSignals.length === 0) {
      explanation = 'A exposição a partes relacionadas/sócios encontra-se dentro de limites que não inferem tensão fiduciária material.';
    } else {
      explanation = explanations.join(' ');
    }

    return {
      shareholderCurrentAccountRatio,
      shareholderConcentration,
      impliedGovernanceFrailty,
      fiduciaryTensionLevel: tensionLevel,
      activeSignals,
      explanation
    };
  }
}
