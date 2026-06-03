import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';
import { PatrimonialInterpretationOutput } from './PatrimonialExecutiveInterpretationEngine';

export interface BoardAdvisoryReport {
  situacaoPatrimonial: string;
  liquidez: string;
  preservacaoCapital: string;
  estruturaCapital: string;
  recomendacaoPrioritaria: string;
  fullText: string;
  boardAssessment: {
    patrimonialSituation: string;
    liquidityAssessment: string;
    capitalPreservationAssessment: string;
    capitalStructureAssessment: string;
    boardRecommendation: string;
  };
}

export class BoardPatrimonialAdvisoryEngine {
  public static generate(
    indicators: PatrimonialIndicator[],
    interpretations: PatrimonialInterpretationOutput
  ): BoardAdvisoryReport {
    
    // Extracted values
    const liqReal = indicators.find(i => i.metricName === 'Liquidez Real')?.value as number | 'INSUFFICIENT_DATA';
    const lossAbsorption = indicators.find(i => i.metricName === 'Loss Absorption Capacity')?.value as number | 'INSUFFICIENT_DATA';
    const fundingCapacity = indicators.find(i => i.metricName === 'Funding Capacity Ratio')?.classification || '';
    const equityQuality = indicators.find(i => i.metricName === 'Equity Quality Index')?.classification || '';
    
    const isLRFragil = typeof liqReal === 'number' && liqReal < 0.75;
    const isLACritica = typeof lossAbsorption === 'number' && lossAbsorption < 2.0;
    const isConsumoCap = equityQuality === 'Consumo de Capital' || equityQuality === 'Erosão Patrimonial';

    // 1. Situação Patrimonial
    let situacaoPatrimonial = 'A estrutura patrimonial permanece operacionalmente funcional, porém exige monitoramento.';
    if (isLRFragil && isLACritica) situacaoPatrimonial = 'A estrutura patrimonial encontra-se sob stress severo de sobrevivência e proteção de capital.';
    else if (!isLRFragil && !isLACritica && fundingCapacity === 'Excelente') situacaoPatrimonial = 'A estrutura patrimonial apresenta robustez e está preparada para suportar iniciativas de expansão.';
    else if (isConsumoCap) situacaoPatrimonial = 'A organização apresenta viabilidade operacional, porém registra corrosão material do capital investido.';

    // 2. Liquidez
    let liquidez = 'A liquidez apresenta níveis adequados para a operação corrente.';
    if (isLRFragil) liquidez = 'Fragilidade relevante de liquidez, indicando dependência da conversão de estoques e descasamento operacional de curto prazo.';
    else if (typeof liqReal === 'number' && liqReal > 1.2) liquidez = 'Forte conversibilidade imediata, com capacidade ociosa de caixa que poderia ser otimizada.';

    // 3. Preservação de Capital
    let preservacaoCapital = 'Margem de segurança satisfatória contra choques externos.';
    if (isLACritica) preservacaoCapital = 'Baixa capacidade de absorção de perdas patrimoniais, com risco de rápida deterioração em caso de adversidades.';
    else if (isConsumoCap) preservacaoCapital = 'Ocorre queima progressiva e estrutural do capital, exigindo estabilização imediata da margem de lucros retidos.';

    // 4. Estrutura de Capital & Síntese
    let estruturaCapital = 'Perfil de funding equilibrado e dependência moderada de capital de terceiros.';
    
    const fundingCapacityVal = indicators.find(i => i.metricName === 'Funding Capacity Ratio')?.value as number | 'INSUFFICIENT_DATA';
    const isFundingRestrito = typeof fundingCapacityVal === 'number' && fundingCapacityVal < 70;

    if (fundingCapacity === 'Baixa' || fundingCapacity === 'Crítica') {
      estruturaCapital = 'Capacidade de sustentar crescimento fortemente restrita, limitando drasticamente as opções de crescimento não-orgânico.';
    } else if (isLRFragil || isLACritica || isFundingRestrito) {
      if (isLRFragil && (isConsumoCap || isLACritica)) {
        estruturaCapital = 'A estrutura patrimonial encontra-se sob stress relevante de liquidez e preservação de capital. A elevada concentração de recursos em estoques, associada ao consumo de parcela significativa do capital originalmente aportado pelos sócios, reduz a capacidade de absorção de perdas e limita a flexibilidade financeira da organização. Embora o patrimônio líquido permaneça positivo, a recuperação da qualidade patrimonial dependerá da recomposição gradual da rentabilidade e do fortalecimento da liquidez operacional.';
        preservacaoCapital = ''; // Limpa a redundância
        liquidez = ''; // Limpa a redundância
        situacaoPatrimonial = ''; // Sintetizado na estruturaCapital
      } else {
        estruturaCapital = 'A capacidade de sustentar crescimento encontra-se materialmente limitada pelas restrições de liquidez e pela reduzida capacidade de absorção de perdas.';
      }
    } else if (fundingCapacity === 'Excelente' || fundingCapacity === 'Alta') {
      estruturaCapital = 'Margem de endividamento preservada, oferecendo elevada capacidade de captação ou auto-financiamento.';
    }

    // 5. Recomendação Prioritária
    let recomendacaoPrioritaria = 'Recomenda-se a manutenção das políticas atuais com otimização gradual do ciclo de caixa.';
    if (isLRFragil) recomendacaoPrioritaria = 'Prioridade máxima para ações de liberação de capital de giro, redução de estoques e alongamento do perfil de passivos operacionais.';
    else if (isLACritica || isConsumoCap) recomendacaoPrioritaria = 'Mandatório o estancamento da queima de caixa e recomposição do colchão de liquidez; suspender distribuição de dividendos e novos capex.';
    else if (fundingCapacity === 'Excelente') recomendacaoPrioritaria = 'Avaliar alocação estratégica do excesso de capacidade de captação para gerar retorno superior ao custo de capital (ROIC > WACC).';

    return {
      situacaoPatrimonial,
      liquidez,
      preservacaoCapital,
      estruturaCapital,
      recomendacaoPrioritaria,
      fullText: `${situacaoPatrimonial} ${liquidez} ${preservacaoCapital} ${estruturaCapital} Recomendação: ${recomendacaoPrioritaria}`,
      boardAssessment: {
        patrimonialSituation: situacaoPatrimonial,
        liquidityAssessment: liquidez,
        capitalPreservationAssessment: preservacaoCapital,
        capitalStructureAssessment: estruturaCapital,
        boardRecommendation: recomendacaoPrioritaria
      }
    };
  }
}
