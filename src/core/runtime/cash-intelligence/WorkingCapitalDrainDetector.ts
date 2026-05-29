import { InstitutionalCashSignal } from './types';

export class WorkingCapitalDrainDetector {
  public static evaluate(workingCapitalVariation: number, fco: number): InstitutionalCashSignal {
    let classification = 'HEALTHY' as any;
    let narrative = 'Dinâmica de capital de giro sob controle.';

    if (workingCapitalVariation < 0) {
      if (Math.abs(workingCapitalVariation) > Math.abs(fco) && fco < 0) {
        classification = 'CRITICAL';
        narrative = 'O dreno de liquidez é impulsionado massivamente por necessidades incrementais de capital de giro. Asfixia severa.';
      } else {
        classification = 'ATTENTION';
        narrative = 'Necessidade de capital de giro consome parcela relevante da geração operacional.';
      }
    } else if (workingCapitalVariation > 0 && fco < 0) {
      classification = 'DETERIORATING';
      narrative = 'Mesmo com liberação de capital de giro, a operação não sustenta geração positiva. Sintoma de margens destrutivas.';
    }

    return {
      id: 'workingCapitalPressure',
      label: 'Pressão de Capital de Giro',
      classification,
      confidence: 'HIGH',
      value: workingCapitalVariation,
      displayValue: workingCapitalVariation.toString(),
      narrative,
      lineage: ['DFC.VariacaoCapitalGiro', 'DFC.FCO'],
      disclosures: []
    };
  }
}
