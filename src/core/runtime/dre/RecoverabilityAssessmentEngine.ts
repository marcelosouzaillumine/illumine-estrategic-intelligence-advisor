export interface RecoverabilityInput {
  receitaLiquida: number;
  lucroBruto: number;
  pontoEquilibrio: number;
  ebitda: number;
}

export interface RecoverabilityOutput {
  classificacao: 'Alta' | 'Moderada' | 'Baixa' | 'Crítica';
  justificativa: string;
}

export class RecoverabilityAssessmentEngine {
  public static evaluate(input: RecoverabilityInput): RecoverabilityOutput {
    if (input.receitaLiquida <= 0) {
      return {
        classificacao: 'Crítica',
        justificativa: 'Sem base de receita operacional. Recuperabilidade indeterminada sem tração comercial.'
      };
    }

    const margemBruta = (input.lucroBruto / input.receitaLiquida) * 100;
    
    // Saudável/Alta
    if (input.ebitda > 0 && input.receitaLiquida >= input.pontoEquilibrio) {
       return {
         classificacao: 'Alta',
         justificativa: 'A operação já superou o ponto de equilíbrio e gera caixa de forma consistente.'
       };
    }

    if (margemBruta < 0) {
      return {
        classificacao: 'Crítica',
        justificativa: 'Margem bruta negativa. A operação destrói valor a cada venda realizada. É necessária revisão total do modelo de negócio ou precificação.'
      };
    } else if (margemBruta > 0 && input.receitaLiquida < input.pontoEquilibrio) {
      if (margemBruta >= 20) {
         return {
           classificacao: 'Moderada',
           justificativa: 'A atividade principal demonstra potencial econômico, porém a escala atual ainda é insuficiente para absorver a estrutura operacional instalada.'
         };
      } else {
         return {
           classificacao: 'Baixa',
           justificativa: 'Embora a margem seja positiva, ela é muito estreita. Exigirá alto volume de vendas para cobrir a estrutura existente.'
         };
      }
    } else if (input.receitaLiquida >= input.pontoEquilibrio && input.ebitda <= 0) {
      return {
        classificacao: 'Moderada',
        justificativa: 'A empresa possui volume comercial adequado, mas ineficiências na linha de despesas consomem a geração de caixa.'
      };
    }

    return {
      classificacao: 'Baixa',
      justificativa: 'contexto estrutural híbrido, exigindo ajustes simultâneos em margem e estrutura de custo.'
    };
  }
}
