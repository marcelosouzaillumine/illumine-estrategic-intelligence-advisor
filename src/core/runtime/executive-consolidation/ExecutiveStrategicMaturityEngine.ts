export interface ExecutiveStrategicMaturityInput {
  fco: number;
  fcf: number;
  lucroLiquido: number;
  patrimonioLiquido: number;
  runwayMonths: number;
  capitalConsumido: number;
}

export type SurvivalStatus = 
  | 'Sustentável' 
  | 'Sustentável com Pressão' 
  | 'Dependente de Capitalização' 
  | 'Dependente de Liquidez Externa' 
  | 'Continuidade Sob Risco';

export type ValueCreationStatus = 
  | 'Criação Consistente de Valor' 
  | 'Criação Moderada' 
  | 'Equilíbrio Econômico' 
  | 'Destruição de Valor' 
  | 'Destruição Acelerada';

export type CapitalProtectionStatus = 
  | 'Capital Expandido' 
  | 'Capital Preservado' 
  | 'Capital em Recomposição' 
  | 'Capital Fragilizado';

export interface ExecutiveStrategicMaturityResult {
  survivalStatus: SurvivalStatus;
  valueCreationStatus: ValueCreationStatus;
  capitalProtectionStatus: CapitalProtectionStatus;
}

export class ExecutiveStrategicMaturityEngine {
  public static evaluate(input: ExecutiveStrategicMaturityInput): ExecutiveStrategicMaturityResult {
    let survivalStatus: SurvivalStatus;
    if (input.fco > 0 && input.fcf >= 0) {
      survivalStatus = 'Sustentável';
    } else if (input.fco > 0 && input.fcf < 0) {
      survivalStatus = 'Sustentável com Pressão';
    } else if (input.fco <= 0 && input.runwayMonths > 6) {
      survivalStatus = 'Dependente de Capitalização';
    } else if (input.fco <= 0 && input.runwayMonths > 0 && input.runwayMonths <= 6) {
      survivalStatus = 'Dependente de Liquidez Externa';
    } else {
      survivalStatus = 'Continuidade Sob Risco';
    }

    let valueCreationStatus: ValueCreationStatus;
    if (input.lucroLiquido > 0 && input.fco > 0) {
      valueCreationStatus = 'Criação Consistente de Valor';
    } else if (input.lucroLiquido > 0 && input.fco <= 0) {
      valueCreationStatus = 'Criação Moderada';
    } else if (input.lucroLiquido === 0) {
      valueCreationStatus = 'Equilíbrio Econômico';
    } else if (input.lucroLiquido < 0 && input.fco >= 0) {
      valueCreationStatus = 'Destruição de Valor';
    } else {
      valueCreationStatus = 'Destruição Acelerada';
    }

    let capitalProtectionStatus: CapitalProtectionStatus;
    // capitalConsumido > 0 indica que lucros retidos diminuíram ou o capital reduziu
    // capitalConsumido < 0 indica que aumentou
    if (input.patrimonioLiquido <= 0) {
      capitalProtectionStatus = 'Capital Fragilizado';
    } else if (input.capitalConsumido > 0) {
      if (input.lucroLiquido > 0) {
        // Consumiu capital no passado mas agora lucrou (recompondo)
        capitalProtectionStatus = 'Capital em Recomposição';
      } else {
        capitalProtectionStatus = 'Capital Fragilizado';
      }
    } else if (input.capitalConsumido < 0) {
      capitalProtectionStatus = 'Capital Expandido';
    } else {
      capitalProtectionStatus = 'Capital Preservado';
    }

    return {
      survivalStatus,
      valueCreationStatus,
      capitalProtectionStatus
    };
  }
}
