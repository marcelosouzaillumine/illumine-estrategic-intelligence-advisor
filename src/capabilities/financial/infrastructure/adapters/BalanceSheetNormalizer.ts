import { NormalizedBalanceSheet } from '../../domain/models/NormalizedBalanceSheet';

export class BalanceSheetNormalizer {
  static normalize(rawData: any): NormalizedBalanceSheet {
    // Adapter that converts the raw UI/Firestore data to the domain structure
    return {
      year: Number(rawData.ano || new Date().getFullYear()),
      assets: {
        currentAssets: Number(rawData.ativoCirculante || 0),
        nonCurrentAssets: Number(rawData.ativoNaoCirculante || 0),
        cashAndEquivalents: Number(rawData.caixaEquivalentes || 0),
        accountsReceivable: Number(rawData.clientes || 0),
        inventory: Number(rawData.estoques || 0),
        fixedAssets: Number(rawData.imobilizado || 0),
        total: Number(rawData.ativoTotal || 0)
      },
      liabilities: {
        currentLiabilities: Number(rawData.passivoCirculante || 0),
        nonCurrentLiabilities: Number(rawData.passivoNaoCirculante || 0),
        suppliers: Number(rawData.fornecedores || 0),
        laborObligations: Number(rawData.obrigacoesTrabalhistas || 0),
        taxes: Number(rawData.tributos || 0),
        financialDebtsShortTerm: Number(rawData.passivosFinanceiros || 0), // Simplifying for now
        financialDebtsLongTerm: Number(rawData.passivosFinanceirosNaoCirculante || 0),
        total: Number(rawData.passivoTotal || 0)
      },
      equity: {
        capital: Number(rawData.capitalSocial || 0),
        retainedEarnings: Number(rawData.lucrosAcumulados || 0),
        total: Number(rawData.patrimonioLiquido || 0)
      }
    };
  }
}
