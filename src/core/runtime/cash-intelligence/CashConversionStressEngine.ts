import { InstitutionalCashSignal } from './types';

export class CashConversionStressEngine {
  public static evaluate(fco: number, ebitda: number): InstitutionalCashSignal {
    const conversion = ebitda !== 0 ? (fco / ebitda) * 100 : 0;
    let classification = 'HEALTHY' as any;
    let narrative = 'Estresse de conversão baixo. Ciclo flui naturalmente para liquidez.';

    if (conversion < 0) {
      classification = 'CRITICAL';
      narrative = 'Colapso de conversão. EBITDA positivo sendo totalmente desidratado antes de virar caixa.';
    } else if (conversion < 40) {
      classification = 'ATTENTION';
      narrative = 'Alta fricção na conversão. Estrutura retém mais da metade da geração primária.';
    }

    return {
      id: 'cashConversionStress',
      label: 'Estresse de Conversão',
      classification,
      confidence: 'HIGH',
      value: conversion,
      displayValue: `${conversion.toFixed(1)}%`,
      narrative,
      lineage: ['DFC.FCO', 'DRE.EBITDA'],
      disclosures: []
    };
  }
}
