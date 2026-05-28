export interface SemanticKPI {
  name: string;
  val: number | string;
  unit: string;
  status: 'Verde' | 'Amarelo' | 'Vermelho' | 'Neutro';
  trend: string;
  semanticInterpretation: string;
  fiduciaryJustification: string;
}

export class KPISemanticIntelligenceEngine {
  public static enrich(
    kpi: { name: string; val: any; unit: string; status: 'Verde' | 'Amarelo' | 'Vermelho' | 'Neutro'; trend: string },
    segment: string
  ): SemanticKPI {
    const name = kpi.name;
    const val = kpi.val;
    const numVal = typeof val === 'number' ? val : parseFloat(val) || 0;

    let semanticInterpretation = '';
    let fiduciaryJustification = '';

    switch (name) {
      case 'Margem EBITDA':
      case 'margemEbitda':
        if (numVal < 0) {
          semanticInterpretation = 'Destruição operacional de valor contínua.';
          fiduciaryJustification = 'A operação gera receita insuficiente para absorver a estrutura fixa de custos operacionais instalados.';
        } else if (numVal < 0.10) {
          semanticInterpretation = 'Margem operacional estreita e vulnerável.';
          fiduciaryJustification = 'A operação opera próxima ao ponto de equilíbrio, sujeita a asfixia em qualquer oscilação de faturamento.';
        } else if (numVal < 0.20) {
          semanticInterpretation = 'Geração operacional saudável.';
          fiduciaryJustification = 'Alinhado aos benchmarks médios de mercado, indicando capacidade razoável de autofinanciamento e cobertura de opex.';
        } else {
          semanticInterpretation = 'Excelente eficiência operacional de margem.';
          fiduciaryJustification = 'Forte geração operacional, com amplo espaço para investimento em crescimento ou remuneração de sócios.';
        }
        break;

      case 'Liquidez Corrente':
      case 'liquidezCorrente':
        if (numVal < 1.0) {
          semanticInterpretation = 'Asfixia e insolvência imediata projetada.';
          fiduciaryJustification = 'O total de ativos conversíveis em 12 meses não cobre as obrigações que vencem no mesmo período.';
        } else if (numVal < 1.5) {
          semanticInterpretation = 'Margem de liquidez reduzida.';
          fiduciaryJustification = 'Exige controle rigoroso sobre o contas a receber para evitar atrasos pontuais com fornecedores.';
        } else {
          semanticInterpretation = 'Ampla cobertura de passivos circulantes.';
          fiduciaryJustification = 'Folga financeira confortável, garantindo resiliência contra volatilidade cíclica de mercado.';
        }
        break;

      case 'Conversão EBITDA em Caixa':
      case 'ebitdaToCashConversion':
        if (numVal === null || numVal === undefined) {
          semanticInterpretation = 'Conversão não aplicável (sem EBITDA positivo).';
          fiduciaryJustification = 'Ambas as métricas estão em quadrante deficitário, impedindo aferição de giro.';
        } else if (numVal < 0.2) {
          semanticInterpretation = 'Conversão crítica de lucro em caixa.';
          fiduciaryJustification = 'O lucro operacional fica asfixiado no capital de giro (contas a receber e estoques), não gerando liquidez.';
        } else if (numVal < 0.6) {
          semanticInterpretation = 'Conversão parcial de resultados econômicos.';
          fiduciaryJustification = 'Conversão moderada, com retenção esperada de recursos na cadeia de suprimentos.';
        } else {
          semanticInterpretation = 'Excelente eficiência de conversão econômica.';
          fiduciaryJustification = 'O EBITDA operacional converte-se quase integralmente em caixa líquido na conta corrente.';
        }
        break;

      case 'ROIC':
      case 'roic':
        if (numVal < 0.05) {
          semanticInterpretation = 'Destruição de capital investido.';
          fiduciaryJustification = 'O retorno sobre o capital empregado está abaixo do custo de oportunidade livre de risco.';
        } else if (numVal < 0.12) {
          semanticInterpretation = 'Retorno sobre capital modesto.';
          fiduciaryJustification = 'O retorno empata ou supera marginalmente a taxa básica de juros de mercado.';
        } else {
          semanticInterpretation = 'Geração excepcional sobre capital empregado.';
          fiduciaryJustification = 'Alta eficiência na alocação de recursos, gerando retorno real e prêmio expressivo sobre o custo de capital.';
        }
        break;

      case 'Payout Ratio':
      case 'payoutRatio':
        if (numVal > 1.0) {
          semanticInterpretation = 'Drenagem patrimonial societária agressiva.';
          fiduciaryJustification = 'Os dividendos pagos superam o lucro gerado, forçando o encolhimento das reservas e do PL.';
        } else if (numVal > 0.5) {
          semanticInterpretation = 'Distribuição agressiva de resultados.';
          fiduciaryJustification = 'Retirada expressiva de caixa pelos acionistas, limitando a capacidade de reinvestimento da empresa.';
        } else if (numVal > 0) {
          semanticInterpretation = 'Política de distribuição equilibrada.';
          fiduciaryJustification = 'Retorno razoável aos acionistas mantendo parcela importante do caixa para fortalecimento interno.';
        } else {
          semanticInterpretation = 'Retenção integral de lucros na operação.';
          fiduciaryJustification = 'Postura austera voltada exclusivamente ao fortalecimento do caixa ou reinvestimento estrutural.';
        }
        break;

      default:
        semanticInterpretation = 'Indicador econômico-financeiro operacional.';
        fiduciaryJustification = `Análise e monitoramento contínuo sob a dinâmica setorial de ${segment}.`;
        break;
    }

    return {
      ...kpi,
      semanticInterpretation,
      fiduciaryJustification
    };
  }
}
