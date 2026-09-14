export interface DreCashEvidence {
  netIncome: number | null;
  netIncomeSourceAccount: string | null;
  depreciationAndAmortization: number;
  netRevenue: number;
  ebitda: number;
  financialExpenses: number;
  taxes: number;
}

export interface BalanceSheetCashEvidence {
  ativoTotal: number;
  ativoCirculante: number;
  passivoCirculante: number;
  patrimonioLiquido: number;
  caixaEEquivalentesAnterior: number | null;
  caixaEEquivalentesAtual: number;
  
  // Variações de Capital de Giro (Anterior - Atual -> positivo gera caixa)
  varClientes: number;
  varEstoque: number;
  varFornecedores: number;
  
  // Variações de Investimento e Financiamento
  varImobilizadoIntangivel: number;
  varDividasBancarias: number;
  varCapitalSocial: number;
  dividendosPagos: number;
  
  // Exposição a Sócios
  creditosSociosCirculantes: number;
  creditosSociosTotais: number;
  varPassivosSocios: number;
  varCreditosSocios: number;
}

export interface DfcPrimaryEvidence {
  fco: number;
  fci: number;
  fcf: number;
  caixaInicial: number | null;
  caixaFinal: number | null;
  
  // Classificações extraídas de lançamentos oficiais
  fluxoPartesRelacionadas: number;
  saidasParaPartesRelacionadas: number;
  fluxoCapitalizacao: number;
  fluxoArtificial: number;
  relatedPartyEffectsInsideFCO: number;
  relatedPartyEffectsInsideFCI: number;
  relatedPartyEffectsInsideFCF: number;
  hasRelatedPartyInDfc: boolean;
}
