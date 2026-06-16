export type IndicatorValueType = 'currency' | 'ratio' | 'percentage' | 'number';

export interface CanonicalIndicatorDefinition {
  canonicalKey: string;
  label: string;
  family: string;
  valueType: IndicatorValueType;
  sourceFactKey: string;
  sovereignPanelKey: string;
  purpose?: string;
}

export class BalanceSheetTechnicalIndicatorCanonicalRegistry {
  private static indicators: CanonicalIndicatorDefinition[] = [
    { canonicalKey: 'liquidezCorrente', label: 'Liquidez Corrente', family: 'Liquidez', valueType: 'ratio', sourceFactKey: 'liquidityCurrent', sovereignPanelKey: 'liquidity' },
    { canonicalKey: 'liquidezSeca', label: 'Liquidez Seca', family: 'Liquidez', valueType: 'ratio', sourceFactKey: 'liquidityDry', sovereignPanelKey: 'liquidity' },
    { canonicalKey: 'liquidezImediata', label: 'Liquidez Imediata', family: 'Liquidez', valueType: 'ratio', sourceFactKey: 'liquidityImmediate', sovereignPanelKey: 'liquidity' },
    { canonicalKey: 'liquidezGeral', label: 'Liquidez Geral', family: 'Liquidez', valueType: 'ratio', sourceFactKey: 'liquidityGeneral', sovereignPanelKey: 'liquidity' },
    { canonicalKey: 'liquidezReal', label: 'Liquidez Real', family: 'Liquidez', valueType: 'ratio', sourceFactKey: 'liquidezReal', sovereignPanelKey: 'liquidity' },

    { canonicalKey: 'capitalDeGiroLiquido', label: 'Capital de Giro Líquido', family: 'Capital de Giro', valueType: 'currency', sourceFactKey: 'workingCapital', sovereignPanelKey: 'workingCapital' },
    { canonicalKey: 'necessidadeDeCapitalDeGiro', label: 'Necessidade de Capital de Giro', family: 'Capital de Giro', valueType: 'currency', sourceFactKey: 'workingCapitalNeed', sovereignPanelKey: 'workingCapital' },
    { canonicalKey: 'saldoDeTesouraria', label: 'Saldo de Tesouraria', family: 'Capital de Giro', valueType: 'currency', sourceFactKey: 'treasuryBalance', sovereignPanelKey: 'workingCapital' },

    { canonicalKey: 'endividamentoGeral', label: 'Endividamento Geral', family: 'Estrutura de Capital', valueType: 'percentage', sourceFactKey: 'debtRatio', sovereignPanelKey: 'capitalStructure' },
    { canonicalKey: 'relacaoDividaPl', label: 'Relação Dívida / Patrimônio Líquido', family: 'Estrutura de Capital', valueType: 'ratio', sourceFactKey: 'debtToEquity', sovereignPanelKey: 'capitalStructure' },
    { canonicalKey: 'autonomiaFinanceira', label: 'Autonomia Financeira', family: 'Estrutura de Capital', valueType: 'percentage', sourceFactKey: 'financialAutonomy', sovereignPanelKey: 'capitalStructure' },
    { canonicalKey: 'composicaoDoEndividamento', label: 'Composição do Endividamento', family: 'Estrutura de Capital', valueType: 'percentage', sourceFactKey: 'debtComposition', sovereignPanelKey: 'capitalStructure' },
    { canonicalKey: 'dividaFinanceiraPl', label: 'Dívida Financeira sobre Patrimônio Líquido', family: 'Estrutura de Capital', valueType: 'percentage', sourceFactKey: 'dividaFinanceiraPl', sovereignPanelKey: 'capitalStructure' },
    { canonicalKey: 'qualidadePatrimonioLiquido', label: 'Qualidade do Patrimônio Líquido', family: 'Estrutura de Capital', valueType: 'percentage', sourceFactKey: 'qualidadePatrimonioLiquido', sovereignPanelKey: 'capitalStructure' },

    { canonicalKey: 'imobilizacaoDoPatrimonioLiquido', label: 'Imobilização do Patrimônio Líquido', family: 'Imobilização / Qualidade Estrutural', valueType: 'percentage', sourceFactKey: 'immobilizationOfEquity', sovereignPanelKey: 'assetQuality' },
    { canonicalKey: 'riscoDeConcentracaoDeAtivos', label: 'Risco de Concentração de Ativos', family: 'Imobilização / Qualidade Estrutural', valueType: 'percentage', sourceFactKey: 'assetConcentrationRisk', sovereignPanelKey: 'assetQuality' }
  ];

  public static getIndicators(): CanonicalIndicatorDefinition[] {
    return this.indicators;
  }
}
