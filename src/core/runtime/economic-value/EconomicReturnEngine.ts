// src/core/runtime/economic-value/EconomicReturnEngine.ts

export type EconomicReturnClassification =
  | 'Criação Consistente de Valor'
  | 'Criação Moderada de Valor'
  | 'Retorno Insuficiente'
  | 'Destruição de Valor'
  | 'Destruição Acelerada de Valor';

export type EconomicReturnConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface EconomicReturnOutput {
  returnRate: number; // Percentage
  capitalEmployed: number;
  ebit: number;
  classification: EconomicReturnClassification;
  confidence: EconomicReturnConfidence;
  confidenceReason: string;
}

export class EconomicReturnEngine {
  public static evaluate(
    ebit: number,
    ativoTotal: number,
    passivoCirculante: number,
    patrimonioLiquido: number,
    historicalCyclesCount: number,
    wacc: number = 0.12
  ): EconomicReturnOutput {
    let capitalEmployed = ativoTotal - passivoCirculante;
    if (capitalEmployed <= 0) {
      capitalEmployed = patrimonioLiquido > 0 ? patrimonioLiquido : 1.0; // Fallback to PL
    }

    const returnRate = capitalEmployed !== 0 ? ebit / capitalEmployed : 0;
    
    // Classifications
    let classification: EconomicReturnClassification = 'Destruição Acelerada de Valor';
    if (returnRate >= wacc) {
      classification = 'Criação Consistente de Valor';
    } else if (returnRate >= wacc * 0.5) {
      classification = 'Criação Moderada de Valor';
    } else if (returnRate >= 0) {
      classification = 'Retorno Insuficiente';
    } else if (returnRate >= -0.15) {
      classification = 'Destruição de Valor';
    }

    // Confidence
    let confidence: EconomicReturnConfidence = 'LOW';
    let confidenceReason = 'Apenas 1 ciclo contábil analisado. Alta sensibilidade a oscilações temporais.';
    
    if (historicalCyclesCount >= 3) {
      confidence = 'HIGH';
      confidenceReason = 'Série histórica robusta com 3 ou mais exercícios analisados.';
    } else if (historicalCyclesCount === 2) {
      confidence = 'MEDIUM';
      confidenceReason = 'Histórico de 2 ciclos disponível. Tendência em consolidação.';
    }

    return {
      returnRate: returnRate * 100, // Return as percentage (e.g. 15.4)
      capitalEmployed,
      ebit,
      classification,
      confidence,
      confidenceReason,
    };
  }
}
