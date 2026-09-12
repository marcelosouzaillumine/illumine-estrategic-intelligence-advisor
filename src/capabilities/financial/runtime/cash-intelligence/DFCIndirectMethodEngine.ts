import { DreCashEvidence, BalanceSheetCashEvidence } from './CashEvidenceContracts';

export interface DFCIndirectMethodResult {
  fco: number;
  fci: number;
  fcf: number;
  variacaoCaixa: number;
  fluxoPartesRelacionadas: number;
  saidasParaPartesRelacionadas: number;
  fluxoCapitalizacao: number;
  relatedPartyEffectsInsideFCF: number;
}

export class DFCIndirectMethodEngine {
  /**
   * PURE FUNCTION: Infere os fluxos de caixa através das evidências consolidadas de DRE e BP.
   * Não deve mutar as entradas.
   */
  public static evaluate(dre: DreCashEvidence, bp: BalanceSheetCashEvidence): DFCIndirectMethodResult {
    // 1. FCO (Fluxo de Caixa Operacional)
    // FCO = Lucro Liquido + Depreciação + Var(Clientes) + Var(Estoques) + Var(Fornecedores)
    // Nota: Variações aqui já devem vir como (Anterior - Atual) para contas de Ativo, 
    // e (Atual - Anterior) para contas de Passivo, ou o contrário. 
    // O adapter passará as vars de forma que valores positivos geram caixa.
    const lucro = dre.netIncome !== null ? dre.netIncome : 0;
    const fco = lucro + dre.depreciationAndAmortization + bp.varClientes + bp.varEstoque + bp.varFornecedores;

    // 2. FCI (Fluxo de Caixa de Investimento)
    const fci = bp.varImobilizadoIntangivel - dre.depreciationAndAmortization;

    // 3. FCF (Fluxo de Caixa de Financiamento)
    const fcf = bp.varDividasBancarias + bp.varCapitalSocial - bp.dividendosPagos;

    // 4. Efeitos Fiduciários e Sócios
    // Pelo método indireto clássico, a variação de ativos e passivos societários compõe o fluxo de capital.
    const fluxoPartesRelacionadas = bp.varCreditosSocios + bp.varPassivosSocios;
    const saidasParaPartesRelacionadas = fluxoPartesRelacionadas < 0 ? fluxoPartesRelacionadas : 0;
    
    const relatedPartyEffectsInsideFCF = fluxoPartesRelacionadas;
    const fluxoCapitalizacao = bp.varCapitalSocial;

    return {
      fco,
      fci,
      fcf,
      variacaoCaixa: fco + fci + fcf,
      fluxoPartesRelacionadas,
      saidasParaPartesRelacionadas,
      fluxoCapitalizacao,
      relatedPartyEffectsInsideFCF
    };
  }
}
