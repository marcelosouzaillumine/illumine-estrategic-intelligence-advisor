export interface BudgetEntry {
  id?: string;
  clientId: string;
  year: number;
  month: number;
  accountId: string;
  accountCode: string;
  accountName: string;
  unidade: string;
  filial: string;
  centroCusto: string;
  valor: number;
  type?: string;
  status?: string;
  requiresApproval?: boolean;
}

export class OrcamentoViewModel {
  public static getBudgetsByCC(
    budgets: BudgetEntry[],
    localMonth: number,
    viewType: 'mensal' | 'anual'
  ): [string, number][] {
    const map: Record<string, number> = {};
    const baseList = viewType === 'mensal' 
      ? budgets.filter(b => b.month === localMonth)
      : budgets;

    baseList.forEach(b => {
      const cc = b.centroCusto || 'Geral';
      map[cc] = (map[cc] || 0) + b.valor;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }

  public static getFilteredBudgets(
    budgets: BudgetEntry[],
    searchTerm: string,
    localMonth: number,
    viewType: 'mensal' | 'anual'
  ): BudgetEntry[] {
    const term = searchTerm.toLowerCase();
    const list = budgets.filter(b => 
      (b.accountName.toLowerCase().includes(term) || 
       b.accountCode.includes(searchTerm) ||
       b.centroCusto.toLowerCase().includes(term) ||
       b.unidade.toLowerCase().includes(term)) &&
      (viewType === 'mensal' ? b.month === localMonth : true)
    );

    if (viewType === 'anual') {
      const grouped: Record<string, BudgetEntry> = {};
      list.forEach(b => {
        const key = `${b.accountId}_${b.unidade}_${b.filial}_${b.centroCusto}`;
        if (!grouped[key]) {
          grouped[key] = { ...b };
        } else {
          grouped[key].valor += b.valor;
        }
      });
      return Object.values(grouped);
    }

    return list;
  }

  public static getTotalBudget(filteredBudgets: BudgetEntry[]): number {
    return filteredBudgets.reduce((acc, curr) => acc + curr.valor, 0);
  }

  public static getYears(): number[] {
    const current = new Date().getFullYear();
    const list: number[] = [];
    for (let i = current - 5; i <= current + 5; i++) {
      list.push(i);
    }
    return list;
  }

  public static getMonths() {
    return [
      { v: 1, l: 'Janeiro' }, { v: 2, l: 'Fevereiro' }, { v: 3, l: 'Março' },
      { v: 4, l: 'Abril' }, { v: 5, l: 'Maio' }, { v: 6, l: 'Junho' },
      { v: 7, l: 'Julho' }, { v: 8, l: 'Agosto' }, { v: 9, l: 'Setembro' },
      { v: 10, l: 'Outubro' }, { v: 11, l: 'Novembro' }, { v: 12, l: 'Dezembro' }
    ];
  }

  public static toContract(state: any = {}, computed: any = {}, actions: any = {}) {
    return { state, computed, actions };
  }
}
