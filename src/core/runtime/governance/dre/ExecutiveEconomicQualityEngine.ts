export type EconomicQualityClassification = 'ESTRUTURAÇÃO_INICIAL' | 'ESCALA_INSUFICIENTE' | 'MARGEM_INSUFICIENTE' | 'ESTRUTURA_EXCESSIVA' | 'OPERAÇÃO_SAUDÁVEL' | 'NAO_AVALIADO';

export interface EconomicQualityReport {
  classification: EconomicQualityClassification;
  narrative: string;
  strategicPriority: string;
}

export class ExecutiveEconomicQualityEngine {
  static evaluate(
    receitaLiquida: number,
    margemBruta: number,
    ebitda: number,
    lucroLiquido: number,
    pontoEquilibrio: number,
    despesasOperacionais: number,
    historicoCiclos: number
  ): EconomicQualityReport {
    if (receitaLiquida <= 0) {
      return {
        classification: 'NAO_AVALIADO',
        narrative: 'Dados operacionais insuficientes para avaliação de qualidade econômica.',
        strategicPriority: 'Estruturação de dados primários.'
      };
    }

    const mbPercent = receitaLiquida > 0 ? (margemBruta / receitaLiquida) : 0;
    
    // A. Estruturação Inicial
    if (receitaLiquida < pontoEquilibrio && mbPercent > 0.40 && ebitda < 0 && historicoCiclos < 3) {
      return {
        classification: 'ESTRUTURAÇÃO_INICIAL',
        narrative: 'A operação demonstra capacidade de geração de valor em nível bruto (Margem Bruta forte), porém trata-se de um estágio de estruturação institucional recente, necessitando de maturação comercial para absorção da estrutura.',
        strategicPriority: 'Aceleração de maturidade comercial e proteção de caixa estrutural.'
      };
    }

    // B. Escala Insuficiente
    if (receitaLiquida < pontoEquilibrio && mbPercent > 0.40 && ebitda < 0 && historicoCiclos >= 3) {
      return {
        classification: 'ESCALA_INSUFICIENTE',
        narrative: 'A operação demonstra capacidade de geração de valor em nível bruto, porém ainda não atingiu escala suficiente (historicamente validada) para absorção integral da estrutura operacional.',
        strategicPriority: 'Expansão agressiva de Market Share e volume de vendas.'
      };
    }

    // C. Margem Insuficiente
    if (mbPercent <= 0.40 && ebitda < 0) {
      return {
        classification: 'MARGEM_INSUFICIENTE',
        narrative: 'A rentabilidade primária do negócio não tem força para sustentar a operação. O custo do produto/serviço asfixia a geração de caixa antes mesmo das despesas administrativas.',
        strategicPriority: 'Revisão urgente de pricing, renegociação de fornecedores ou reposicionamento de portfólio.'
      };
    }

    // D. Estrutura Excessiva
    if (mbPercent > 0.40 && despesasOperacionais > margemBruta) {
      return {
        classification: 'ESTRUTURA_EXCESSIVA',
        narrative: 'Apesar de uma margem bruta forte atestando o valor do produto, a carga de despesas operacionais (OPEX) é desproporcional à escala, destruindo o caixa livre.',
        strategicPriority: 'Downsizing e otimização imediata da estrutura de custos fixos.'
      };
    }

    // E. Operação Saudável
    if (mbPercent > 0.40 && ebitda > 0 && lucroLiquido > 0) {
      return {
        classification: 'OPERAÇÃO_SAUDÁVEL',
        narrative: 'A qualidade econômica é validada por uma conversão eficiente desde a margem bruta até a última linha, cobrindo com folga as despesas estruturais e gerando valor contábil líquido.',
        strategicPriority: 'Expansão alavancada e otimização de capital (ROCE).'
      };
    }

    // Fallback if none matches exactly
    return {
      classification: 'NAO_AVALIADO',
      narrative: 'A operação apresenta um estágio misto sem desvios severos diagnosticados.',
      strategicPriority: 'Monitoramento contínuo da margem e estrutura.'
    };
  }
}
