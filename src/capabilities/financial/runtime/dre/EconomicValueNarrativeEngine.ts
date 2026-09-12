export interface EconomicValueInput {
  receitaLiquida: number;
  lucroBruto: number;
  ebitda: number;
  lucroLiquido: number;
  despesasFixas: number;
}

export interface EconomicValueOutput {
  geraValor: 'Sim' | 'Parcialmente' | 'Não';
  fonteProblema: 'Escala' | 'Margem' | 'Eficiência' | 'Estrutura' | 'Nenhum';
  situacaoEconomica: 'Criação de Valor' | 'Estabilização' | 'Destruição de Valor';
  justificativa: string;
}

export class EconomicValueNarrativeEngine {
  public static evaluate(input: EconomicValueInput): EconomicValueOutput {
    const margemBruta = input.receitaLiquida > 0 ? (input.lucroBruto / input.receitaLiquida) * 100 : 0;
    const margemEbitda = input.receitaLiquida > 0 ? (input.ebitda / input.receitaLiquida) * 100 : 0;
    
    let geraValor: 'Sim' | 'Parcialmente' | 'Não' = 'Não';
    let fonteProblema: 'Escala' | 'Margem' | 'Eficiência' | 'Estrutura' | 'Nenhum' = 'Nenhum';
    let situacaoEconomica: 'Criação de Valor' | 'Estabilização' | 'Destruição de Valor' = 'Destruição de Valor';
    let justificativa = '';

    if (input.lucroLiquido > 0 && input.ebitda > 0) {
      geraValor = 'Sim';
      situacaoEconomica = 'Criação de Valor';
      fonteProblema = 'Nenhum';
      justificativa = 'A operação gera caixa sustentável e apresenta lucro líquido, evidenciando um modelo econômico validado e saudável.';
    } else if (input.ebitda > 0 && input.lucroLiquido <= 0) {
      geraValor = 'Parcialmente';
      situacaoEconomica = 'Estabilização';
      fonteProblema = 'Estrutura';
      justificativa = 'A operação core gera caixa (EBITDA positivo), mas o resultado é consumido por despesas financeiras ou depreciações pesadas, destruindo o lucro líquido.';
    } else {
      geraValor = 'Não';
      situacaoEconomica = 'Destruição de Valor';
      
      if (margemBruta < 20) {
         fonteProblema = 'Margem';
         justificativa = `A margem bruta de ${margemBruta.toFixed(1)}% é insuficiente para sustentar a operação. O problema central reside no custo do serviço/produto entregue.`;
      } else if (input.despesasFixas > input.receitaLiquida) {
         fonteProblema = 'Estrutura';
         justificativa = 'A estrutura de custos fixos é incompatível com o modelo de negócio atual, consumindo todos os recursos antes mesmo de gerar resultado.';
      } else {
         fonteProblema = 'Escala';
         justificativa = `A margem bruta permanece positiva e saudável (${margemBruta.toFixed(1)}%). A destruição de valor decorre da incapacidade da receita atual absorver a estrutura fixa instalada.`;
      }
    }

    return {
      geraValor,
      fonteProblema,
      situacaoEconomica,
      justificativa
    };
  }
}
