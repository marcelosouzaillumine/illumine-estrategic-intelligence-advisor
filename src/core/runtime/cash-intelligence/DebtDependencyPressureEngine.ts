import { InstitutionalCashSignal } from './types';

export class DebtDependencyPressureEngine {
  public static evaluate(fco: number, thirdPartyFunding: number): InstitutionalCashSignal {
    let classification = 'HEALTHY' as any;
    let narrative = 'Operação autofinanciada ou com baixa dependência de liquidez de terceiros.';

    if (fco < 0 && thirdPartyFunding > 0) {
      if (thirdPartyFunding > Math.abs(fco) * 1.5) {
        classification = 'CRITICAL';
        narrative = 'Alta dependência fiduciária: operação sustentada primariamente por alavancagem / funding de terceiros.';
      } else {
        classification = 'DETERIORATING';
        narrative = 'Dependência fiduciária ativa: déficits operacionais sendo cobertos por captações exógenas.';
      }
    } else if (thirdPartyFunding > 0 && fco > 0) {
      classification = 'ATTENTION';
      narrative = 'Captação ativa apesar de geração operacional positiva. Pode indicar pipeline de expansão ou rolagem defensiva.';
    }

    return {
      id: 'debtDependencyPressure',
      label: 'Dependência de Financiamento Exógeno',
      classification,
      confidence: 'HIGH',
      value: thirdPartyFunding,
      displayValue: thirdPartyFunding.toString(),
      narrative,
      lineage: ['DFC.FCO', 'DFC.FCI', 'DFC.CaptaçãoDeTerceiros'],
      disclosures: []
    };
  }
}
