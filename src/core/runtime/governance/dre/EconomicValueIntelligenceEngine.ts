export type EconomicValueClassification = 'VALUE_CREATING' | 'VALUE_NEUTRAL' | 'VALUE_DESTROYING';

export interface EconomicValueAssessment {
  classification: EconomicValueClassification;
  rationale: string;
  confidence: string;
  evidence: string;
  economicScaleRatio: number;
}

export class EconomicValueIntelligenceEngine {
  static evaluate(
    receitaLiquida: number,
    lucroLiquido: number,
    ebitda: number,
    pontoEquilibrio: number
  ): EconomicValueAssessment {
    const economicScaleRatio = pontoEquilibrio > 0 ? receitaLiquida / pontoEquilibrio : (receitaLiquida > 0 ? 999 : 0);

    let classification: EconomicValueClassification = 'VALUE_NEUTRAL';
    let rationale = '';
    let evidence = '';

    // VALUE_CREATING requirements: ebitda > 0, lucroLiquido > 0, economicScaleRatio > 0.8
    if (ebitda > 0 && lucroLiquido > 0 && economicScaleRatio >= 0.8) {
      classification = 'VALUE_CREATING';
      rationale = 'A operação demonstra capacidade sustentada de converter atividade comercial em caixa operacional e reter valor residual positivo após obrigações fixas e financeiras.';
      evidence = `EBITDA positivo associado à absorção estrutural ${economicScaleRatio > 1.2 ? 'consolidada' : 'em zona de transição segura'}.`;
    } 
    // VALUE_DESTROYING requirements: ebitda < 0, lucroLiquido < 0, economicScaleRatio < 0.8
    else if (ebitda < 0 && lucroLiquido < 0 && economicScaleRatio < 0.8) {
      classification = 'VALUE_DESTROYING';
      rationale = 'A operação encontra-se estruturalmente subabsorvida, destruindo valor operacional primário e corroendo o patrimônio a cada ciclo.';
      evidence = 'EBITDA negativo acompanhado de déficit na cobertura de custos e despesas operacionais.';
    }
    // Salvaguarda: Lucro positivo mas escala insuficiente (economicScaleRatio < 0.8)
    else if (lucroLiquido > 0 && economicScaleRatio < 0.8) {
      classification = 'VALUE_NEUTRAL';
      rationale = 'Apesar do resultado contábil positivo, o núcleo operacional ainda não demonstra escala e absorção de estrutura suficientes para garantir criação sustentável de valor.';
      evidence = 'Estrutura não absorvida limitando a qualificação da geração de caixa.';
    }
    // VALUE_NEUTRAL (all other cases)
    else {
      classification = 'VALUE_NEUTRAL';
      rationale = 'A operação encontra-se em estágio de transição estrutural, sustentando a operação mas com limitada capacidade de multiplicação orgânica do capital.';
      evidence = 'Rentabilidade operacional limitada frente à estrutura instalada.';
    }

    return {
      classification,
      rationale,
      confidence: 'Baseada na Demonstração do Resultado',
      evidence,
      economicScaleRatio
    };
  }
}
