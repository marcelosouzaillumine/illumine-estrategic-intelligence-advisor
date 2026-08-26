import { NormalizedBalanceSheet } from '../domain/models/NormalizedBalanceSheet';
import { ExecutiveIntelligenceOutput, FinancialIndicator } from '../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';
import { FinancialRiskEngine } from './financial-health/FinancialRiskEngine';
import { CapitalStructureEngine } from './capital-structure/CapitalStructureEngine';
import { FleurietAnalysisEngine } from './working-capital/FleurietAnalysisEngine';
import { FinancialDiagnosticEngine } from './financial-health/FinancialDiagnosticEngine';
import { IndicatorClassificationRules } from './rules/IndicatorClassificationRules';
import { BalanceSheetCalculations } from '../domain/balance-sheet/calculations/BalanceSheetCalculations';

export class BalanceSheetIntelligenceEngine {
  static execute(data: NormalizedBalanceSheet): ExecutiveIntelligenceOutput {
    const indicators: FinancialIndicator[] = [];

    // Calculate all metrics in Domain
    const metrics = BalanceSheetCalculations.calculateMetrics(data);

    // Balance Integrity Check
    const totalAssets = data.assets.total || 0;
    const totalLiabilitiesAndEquity = (data.liabilities.total || 0) + (data.equity.total || 0);
    const difference = totalAssets - totalLiabilitiesAndEquity;
    const tolerance = 0.05; // Gate 3: Tolerância restrita para arredondamento
    const balanced = Math.abs(difference) <= tolerance;
    
    const balanceIntegrity: any = {
      balanced,
      totalAssets,
      totalLiabilitiesAndEquity,
      difference,
      tolerance,
      status: balanced ? 'BALANCED' : 'UNBALANCED'
    };

    const hasData = totalAssets > 0 || totalLiabilitiesAndEquity > 0;
    
    // Confidence Multidimensional
    const dataConfidence = hasData ? 'HIGH' : 'LOW';
    const accountingConfidence = balanced ? 'HIGH' : 'INVALID';
    const temporalConfidence = 'HIGH'; // Assuming current period is valid (Historical Engine will adjust this for history)
    
    // Analytical Confidence depends on the other 3
    let analyticalConfidence = 'HIGH';
    if (accountingConfidence === 'INVALID' || dataConfidence === 'LOW') {
      analyticalConfidence = 'LOW';
    }

    // Overall Confidence is capped by the lowest
    const overallConfidenceLevel = accountingConfidence === 'INVALID' ? 'LOW' : (dataConfidence === 'LOW' ? 'LOW' : 'HIGH');
    
    const confidenceDetail = {
      score: overallConfidenceLevel === 'HIGH' ? 95 : 40,
      level: overallConfidenceLevel,
      dimensions: {
        data: dataConfidence,
        accounting: accountingConfidence,
        temporal: temporalConfidence,
        analytical: analyticalConfidence
      },
      factors: [
        hasData ? 'Dados contábeis preenchidos' : 'Dados insuficientes',
        balanced ? 'Equação patrimonial validada' : `Divergência contábil identificada: R$ ${difference.toFixed(2)}`
      ]
    };

    const buildIndicator = (
      id: string, name: string, value: number | undefined | null, unit: string, category: string,
      statusFn: (val: number) => string, interpretationFn: (val: number) => string, ...extra: any[]) => {
      
      const formula = extra[0];
      const purpose = extra[1];
      const limitations = extra[2];
      const referenceRange = extra[3];
      const methodologicalNotes = extra[4];
      
      if (value === undefined || value === null) {
        indicators.push({
          id, name, unit, category,    
          value: undefined,
          status: 'UNAVAILABLE',
          interpretation: 'Dados insuficientes para calcular este indicador.',
          formula, purpose, limitations, referenceRange, methodologicalNotes
        } as any);
      } else {
        indicators.push({
          id, name, unit, category,    
          value,
          status: statusFn(value),
          interpretation: interpretationFn(value),
          formula, purpose, limitations, referenceRange, methodologicalNotes
        } as any);
      }
    };

    // Interpret metrics in Intelligence
    buildIndicator(
      'current_liquidity', 'Liquidez Corrente', metrics.currentLiquidity, 'x', 'LIQUIDITY',
      IndicatorClassificationRules.getLiquidityStatus,
      (v) => IndicatorClassificationRules.getInterpretation(IndicatorClassificationRules.getLiquidityStatus(v)),
      'Ativo Circulante / Passivo Circulante',
      'Avaliar a capacidade de pagamento das obrigações de curto prazo.',
      'Não considera a liquidez imediata dos estoques.',
      '> 1.0 (Saudável)',
      'Considera valores normalizados de curto prazo.'
    );

    buildIndicator(
      'dry_liquidity', 'Liquidez Seca', metrics.dryLiquidity, 'x', 'LIQUIDITY',
      IndicatorClassificationRules.getDryLiquidityStatus,
      (v) => IndicatorClassificationRules.getInterpretation(IndicatorClassificationRules.getDryLiquidityStatus(v)),
      '(Ativo Circulante - Estoques) / Passivo Circulante',
      'Avaliar a capacidade de cobertura do passivo circulante sem depender da realização dos estoques.',
      'Ignora prazos exatos de recebimento de clientes.',
      '> 0.8 (Controlado)',
      'Exclui o componente menos líquido do ativo circulante.'
    );

    buildIndicator(
      'immediate_liquidity', 'Liquidez Imediata', metrics.immediateLiquidity, 'x', 'LIQUIDITY',
      IndicatorClassificationRules.getImmediateLiquidityStatus,
      (v) => IndicatorClassificationRules.getInterpretation(IndicatorClassificationRules.getImmediateLiquidityStatus(v)),
      'Caixa e Equivalentes / Passivo Circulante',
      'Medir a capacidade imediata de quitar obrigações sem depender de vendas ou recebimentos.',
      'Pode penalizar empresas com giro rápido e previsível.',
      '> 0.1 (Recomendado)',
      'Foca exclusivamente em disponibilidades de conversão instantânea.'
    );

    if (metrics.generalLiquidity !== null && metrics.generalLiquidity !== undefined) {
      buildIndicator(
        'general_liquidity', 'Liquidez Geral', metrics.generalLiquidity, 'x', 'LIQUIDITY',
        IndicatorClassificationRules.getGeneralLiquidityStatus,
        (v) => IndicatorClassificationRules.getInterpretation(IndicatorClassificationRules.getGeneralLiquidityStatus(v)),
        'Ativo Total / Passivo Exigível Total',
        'Visão de longo prazo da capacidade de solver compromissos totais.',
        'Soma horizontes temporais distintos, distorcendo a análise de fluxo de caixa.',
        '> 1.2 (Sólido)',
        'Métrica estrutural de solvência ampla.'
      );
    } else {
       // if null/undefined
       buildIndicator(
        'general_liquidity', 'Liquidez Geral', metrics.generalLiquidity, 'x', 'LIQUIDITY',
        () => 'UNAVAILABLE', () => 'UNAVAILABLE',
        'Ativo Total / Passivo Exigível Total',
        'Visão de longo prazo da capacidade de solver compromissos totais.',
        'Soma horizontes temporais distintos, distorcendo a análise de fluxo de caixa.',
        '> 1.2 (Sólido)',
        'Métrica estrutural de solvência ampla.'
      );
    }

    // STRUCTURE
    buildIndicator(
      'debt_ratio', 'Grau de Endividamento', metrics.debtRatio, '%', 'STRUCTURE',
      IndicatorClassificationRules.getDebtStatus,
      (v) => IndicatorClassificationRules.getInterpretation(IndicatorClassificationRules.getDebtStatus(v)),
      'Passivo Exigível Total / Ativo Total',
      'Demonstrar a proporção dos ativos financiada por capital de terceiros.',
      'Não diferencia dívida financeira onerosa de passivos operacionais sem juros.',
      '< 60% (Adequado)',
      'Medida clássica de dependência financeira total.'
    );

    buildIndicator(
      'short_term_debt_concentration', 'Concentração de Dívida de Curto Prazo', metrics.shortTermDebtConcentration, '%', 'STRUCTURE',
      (v) => v > 0.6 ? 'ATTENTION' : (v < 0.4 ? 'STRONG' : 'NEUTRAL'),
      (v) => 'Proporção do passivo exigível concentrada no curto prazo.',
      'Passivo Circulante / Passivo Exigível Total',
      'Analisar a pressão de vencimentos imediatos na estrutura de capital.',
      'Alta concentração pode ser normal em certos setores do varejo.',
      '< 50% (Equilibrado)',
      'Fundamental cruzar com a liquidez corrente.'
    );

    if (metrics.thirdPartyCapitalRatio !== null && metrics.thirdPartyCapitalRatio !== undefined) {
      buildIndicator(
        'third_party_capital_ratio', 'Participação de Capital de Terceiros (CECT)', metrics.thirdPartyCapitalRatio, '%', 'STRUCTURE',
        (v) => v > 1.5 ? 'ATTENTION' : (v < 0.8 ? 'STRONG' : 'NEUTRAL'),
        (v) => 'Relação entre capital financiado por terceiros e o capital próprio.',
        'Passivo Exigível Total / Patrimônio Líquido',
        'Avaliar o risco financeiro e alavancagem estrutural.',
        'Não aplicável se o Patrimônio Líquido for negativo.',
        '< 100% (Capital próprio superior)',
        'Métrica clássica de alavancagem (Debt to Equity base).'
      );
    }

    if (metrics.equityImmobilization !== null && metrics.equityImmobilization !== undefined) {
      buildIndicator(
        'equity_immobilization', 'Imobilização do Patrimônio Líquido', metrics.equityImmobilization, '%', 'STRUCTURE',
        (v) => v > 1.0 ? 'ATTENTION' : (v < 0.7 ? 'STRONG' : 'NEUTRAL'),
        (v) => 'Proporção do capital próprio alocada em ativos não circulantes.',
        'Ativo Não Circulante / Patrimônio Líquido',
        'Verificar se o PL financia o capital de giro ou está totalmente imobilizado.',
        'Não aplicável com PL negativo.',
        '< 100% (Capital próprio financia o capital de giro)',
        'Quando > 100%, indica que a empresa depende de terceiros para financiar seus ativos permanentes.'
      );
    }

    buildIndicator(
      'asset_liquidity', 'Liquidez do Ativo', metrics.assetLiquidity, '%', 'ASSET_QUALITY',
      (v) => v > 0.3 ? 'STRONG' : (v > 0.15 ? 'NEUTRAL' : 'ATTENTION'),
      (v) => 'Porcentagem dos ativos que apresentam elevada liquidez imediata (Caixa + Clientes).',
      '(Caixa + Equivalentes + Clientes) / Ativo Total',
      'Verificar a parcela do ativo que tem conversibilidade quase imediata em caixa.',
      'Ignora prazos exatos de recebimento de clientes.',
      '> 30% (Alta)',
      'Composição e conversibilidade relativa do ativo, não confundir com capacidade de pagamento (Liquidez Corrente).'
    );

    buildIndicator(
      'cash_concentration', 'Caixa / Ativo Total', metrics.cashConcentration, '%', 'ASSET_QUALITY',
      (v) => 'NEUTRAL',
      (v) => 'Proporção do ativo total mantida em disponibilidades.',
      'Caixa e Equivalentes / Ativo Total',
      'Analisar a preferência por liquidez absoluta.',
      'Níveis altos podem indicar segurança, mas também restringir a otimização de capital se excessivos.',
      'Variável',
      'Impacta diretamente a Liquidez Imediata.'
    );

    buildIndicator(
      'client_concentration', 'Clientes / Ativo Total', metrics.clientConcentration, '%', 'ASSET_QUALITY',
      (v) => 'NEUTRAL',
      (v) => 'Proporção do ativo total alocada em recebíveis de clientes.',
      'Contas a Receber / Ativo Total',
      'Analisar a dependência do financiamento a clientes.',
      'A liquidez real depende do prazo médio de recebimento (PMR).',
      'Variável',
      'Ponto chave do ciclo operacional.'
    );

    buildIndicator(
      'inventory_concentration', 'Estoques / Ativo Total', metrics.inventoryConcentration, '%', 'ASSET_QUALITY',
      (v) => 'NEUTRAL',
      (v) => 'Proporção do ativo imobilizada em estoques.',
      'Estoques / Ativo Total',
      'Analisar o peso dos estoques na estrutura.',
      'O risco de obsolescência não é visível apenas pela proporção.',
      'Variável',
      'Depende fundamentalmente do setor de atuação.'
    );

    // LIABILITY STRUCTURE
    buildIndicator(
      'operational_liability_ratio', 'Composição do Passivo Operacional', metrics.operationalLiabilityRatio, '%', 'LIABILITY_QUALITY',
      (v) => 'NEUTRAL',
      (v) => 'Demonstra a parcela do financiamento proveniente da própria operação.',
      '(Fornecedores + Obrigações Trabalhistas + Tributos) / Passivo Total',
      'Analisar o financiamento automático da operação sem custo financeiro direto.',
      'Uma baixa participação não é necessariamente um problema, e uma alta não é automaticamente saudável (pode indicar atrasos).',
      'Variável por setor',
      'Evita conclusões absolutas sobre oportunidades de crédito comercial gratuito.'
    );

    buildIndicator(
      'financial_debt_concentration', 'Endividamento Financeiro Oneroso', metrics.financialDebtConcentration, '%', 'STRUCTURE',
      IndicatorClassificationRules.getDebtStatus,
      (v) => 'Mede a dependência de crédito bancário e obrigações que geram despesa financeira.',
      'Dívida Financeira (Curto + Longo Prazo) / Passivo Total',
      'Isolar o passivo que gera custo de juros e exige rolagem estruturada.',
      'A taxa real de juros contratada não é visível apenas por esta métrica.',
      '< 30% (Conservador)',
      'Exclui passivos operacionais e provisões.'
    );

    buildIndicator(
      'short_term_financial_debt_profile', 'Perfil da Dívida Financeira', metrics.shortTermFinancialDebtProfile, '%', 'STRUCTURE',
      (v) => v > 0.5 ? 'ATTENTION' : 'STRONG',
      (v) => 'Mostra a parcela da dívida onerosa que vence no curto prazo.',
      'Dívida Financeira de Curto Prazo / Dívida Financeira Total',
      'Avaliar risco de refinanciamento no curto prazo.',
      'Não indica quando exatamente no curto prazo o vencimento ocorrerá.',
      '< 50% (Saudável)',
      'Importante para casar com a Liquidez Corrente.'
    );

    buildIndicator(
      'operational_asset_ratio', 'Qualidade do Ativo (Operacional)', metrics.operationalAssetRatio, '%', 'ASSET_QUALITY',
      (v) => v > 0.7 ? 'STRONG' : 'ATTENTION',
      (v) => 'Demonstra o peso dos ativos diretamente ligados à atividade-fim.',
      '(Contas a Receber + Estoques + Imobilizado) / Ativo Total',
      'Identificar concentração de capital no ciclo produtivo versus aplicações periféricas.',
      'Depende fortemente da natureza do negócio.',
      '> 70% (Típico em empresas não-financeiras)',
      'Pode estar distorcido se a empresa atuar ativamente no mercado financeiro ou tiver excesso de caixa.'
    );

    // WORKING CAPITAL (FLEURIET)
    buildIndicator(
      'ncg', 'Necessidade de Capital de Giro (NCG)', metrics.ncg, 'BRL', 'WORKING_CAPITAL',
      (v) => 'NEUTRAL',
      (v) => 'O montante de recursos necessários para financiar as operações normais do dia a dia.',
      'Ativo Circulante Operacional - Passivo Circulante Operacional',
      'Mensurar o déficit ou superávit de recursos decorrente do ciclo operacional.',
      'Isoladamente não indica risco, análise conjunta com o Saldo de Tesouraria é indicada.',
      'Positivo (típico), Negativo (superávit operacional)',
      'Exclui disponibilidades e dívidas financeiras.'
    );

    buildIndicator(
      'cgl', 'Capital de Giro Líquido (CCL)', metrics.cgl, 'BRL', 'WORKING_CAPITAL',
      (v) => v > 0 ? 'STRONG' : 'ATTENTION',
      (v) => 'A parcela de recursos de longo prazo financiando as operações de curto prazo.',
      '(Patrimônio Líquido + Passivo Não Circulante) - Ativo Não Circulante',
      'Avaliar a folga estrutural de longo prazo.',
      'O ideal depende do NCG da empresa.',
      '> 0 (Positivo)',
      'Equivale matematicamente a Ativo Circulante - Passivo Circulante.'
    );

    buildIndicator(
      'treasury', 'Saldo de Tesouraria', metrics.treasury, 'BRL', 'WORKING_CAPITAL',
      (v) => v > 0 ? 'STRONG' : 'ATTENTION',
      (v) => 'O fôlego financeiro real resultante do equilíbrio entre estrutura e operação.',
      'CCL - NCG',
      'O principal indicador de solvência operacional do modelo Fleuriet.',
      'Não considera a qualidade dos ativos circulantes e exigibilidades ocultas.',
      '> 0 (Positivo)',
      'Um saldo de tesouraria negativo contínuo é indicativo de elevado risco financeiro (efeito tesoura).'
    );

    // Sub-Engines (these should also eventually consume metrics instead of raw data)
    const exposures = FinancialRiskEngine.analyze(data);
    const capitalStructure = CapitalStructureEngine.analyze(data);
    
    // Fleuriet Analysis
    const fleuriet = FleurietAnalysisEngine.analyze(metrics.cgl, metrics.ncg, metrics.treasury);

    // Diagnostics
    const diagnostic = FinancialDiagnosticEngine.analyze(indicators, exposures);

    return {
      capabilityId: 'financial.balance_sheet_intelligence' as any,
      status: 'SUCCESS',
      confidence: confidenceDetail,
      indicators,
      diagnostics: [diagnostic],
      exposures,
      insights: [
        {
          id: 'fleuriet_insight',
          category: 'Working Capital',
          type: fleuriet.riskLevel === 'CRITICAL' ? 'CRITICAL' : (fleuriet.riskLevel === 'HIGH' ? 'WARNING' : 'POSITIVE'),
          title: `Modelo de Fleuriet: ${fleuriet.classification}`,
          description: fleuriet.description
        } as any
      ],
      evidence: {
        balanceIntegrity,
        fleuriet,
        capitalStructure,
        metrics
      }
    };
  }
}

