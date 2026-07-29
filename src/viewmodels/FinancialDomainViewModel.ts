export interface DFCItem {
  id: string;
  categoria: string;
  tipo: 'operacional' | 'investimento' | 'financiamento';
  valor: number;
  mes: number;
  ano: number;
}

export interface DLPAItem {
  id: string;
  descricao: string;
  saldoInicial: number;
  lucroLiquido: number;
  dividendos: number;
  reservas: number;
  saldoFinal: number;
}

export class FinancialDomainViewModel {
  public static calculateDFCTotals(items: DFCItem[]) {
    const operacional = items.filter(i => i.tipo === 'operacional').reduce((a, b) => a + b.valor, 0);
    const investimento = items.filter(i => i.tipo === 'investimento').reduce((a, b) => a + b.valor, 0);
    const financiamento = items.filter(i => i.tipo === 'financiamento').reduce((a, b) => a + b.valor, 0);
    const fluxoLiquido = operacional + investimento + financiamento;

    return {
      operacional,
      investimento,
      financiamento,
      fluxoLiquido
    };
  }

  public static calculateDLPASummary(items: DLPAItem[]) {
    const totalLucro = items.reduce((a, b) => a + b.lucroLiquido, 0);
    const totalDividendos = items.reduce((a, b) => a + b.dividendos, 0);
    const totalReservas = items.reduce((a, b) => a + b.reservas, 0);
    const saldoFinalConsolidado = items.reduce((a, b) => a + b.saldoFinal, 0);

    return {
      totalLucro,
      totalDividendos,
      totalReservas,
      saldoFinalConsolidado
    };
  }

  public static filterFinancialDataByPeriod(data: any[], year: number, month?: number) {
    return data.filter(d => {
      const y = d.year || d.ano;
      const m = d.month || d.mes;
      if (month) {
        return y === year && m === month;
      }
      return y === year;
    });
  }

  public static toContract(state: any = {}, computed: any = {}, actions: any = {}) {
    return { state, computed, actions };
  }
}
