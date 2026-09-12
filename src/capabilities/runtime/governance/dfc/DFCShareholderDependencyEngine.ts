import { ShareholderDependencyStatus } from './CashFlowGovernanceOutput';

export class DFCShareholderDependencyEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static evaluate(
    fco: number,
    shareholderContributions: number, // Positive amount
    runwayMonths: number, // If applicable
    isRecurrentNegativeFCO: boolean = false
  ): ShareholderDependencyStatus {
    
    // Autossuficiente: FCO positivo e FCF societário irrelevante (aportes não são necessários para a operação)
    if (fco > 0) {
      return 'AUTOSSUFICIENTE';
    }

    // A partir daqui, FCO <= 0. 
    // Necessidade de caixa para cobrir FCO negativo.
    const cashBurn = Math.abs(fco);
    
    // Se não há queima, ou queima é zero, mas estamos aqui, tecnicamente é autossuficiente ou estagnado
    if (cashBurn === 0) return 'AUTOSSUFICIENTE';

    const coverageRatio = shareholderContributions / cashBurn;

    // Dependência moderada: FCO negativo, runway adequado (ex: > 6 meses), aportes <= 30%
    // Para simplificar a regra base de materialidade da engine, focamos no percentual, o runway entra se disponível.
    if (coverageRatio <= 0.30 && runwayMonths > 6 && !isRecurrentNegativeFCO) {
      return 'DEPENDENCIA_MODERADA';
    }

    // Dependência crítica: aportes > 70% ou FCO negativo recorrente
    if (coverageRatio > 0.70 || isRecurrentNegativeFCO) {
      return 'DEPENDENCIA_CRITICA';
    }

    // Dependência relevante: aportes entre 30% e 70%
    if (coverageRatio > 0.30 && coverageRatio <= 0.70) {
      return 'DEPENDENCIA_RELEVANTE';
    }

    // Fallback conservador se runway for curto mas aporte baixo
    return 'DEPENDENCIA_MODERADA';
  }
}
