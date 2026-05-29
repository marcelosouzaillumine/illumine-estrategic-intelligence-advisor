import { InstitutionalCashSignal } from './types';

export class OperatingCashIntegrityEngine {
  public static evaluate(fco: number, ebitda: number): InstitutionalCashSignal {
    let classification = 'HEALTHY' as any;
    let narrative = 'Capacidade robusta de geração operacional de caixa livre.';

    if (fco < 0) {
      classification = 'CRITICAL';
      narrative = 'A operação central não se sustenta financeiramente, queimando caixa estruturalmente.';
    } else if (fco > 0 && ebitda > 0 && fco < ebitda * 0.5) {
      classification = 'ATTENTION';
      narrative = 'Integridade operacional sob pressão: a operação gera caixa, mas reverte menos da metade do EBITDA.';
    }

    return {
      id: 'operatingCashIntegrity',
      label: 'Integridade de Caixa Operacional',
      classification,
      confidence: 'HIGH',
      value: fco,
      displayValue: fco.toString(),
      narrative,
      lineage: ['DFC.FCO', 'DRE.EBITDA'],
      disclosures: []
    };
  }
}
