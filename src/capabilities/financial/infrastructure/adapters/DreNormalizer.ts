export interface NormalizedDre {
  period: {
    year: number;
    month?: number;
  };
  revenue: {
    grossRevenue: number;
    deductions: number;
    netRevenue: number;
  };
  costs: {
    cogs: number;
  };
  margins: {
    grossProfit: number;
  };
  expenses: {
    opex: number;
    depreciationAndAmortization: number;
  };
  operationalResult: {
    ebitda: number;
    ebit: number;
  };
  financialResult: {
    financialIncome: number;
    financialExpenses: number;
    netFinancialResult: number;
  };
  taxes: {
    incomeTaxes: number;
  };
  netResult: {
    earningsBeforeTaxes: number; // LAIR
    netIncome: number;
  };
  source: string;
}

export interface DreDataset {
  current: NormalizedDre;
  history: NormalizedDre[];
}

export class DreNormalizer {
  public static normalize(rawData: any): DreDataset {
    if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
       throw new Error('DRE Raw data is missing or empty.');
    }

    if (Array.isArray(rawData)) {
      // Assuming array of annual statements or multiple periods
      const history = rawData.map(item => this.normalizeSingle(item)).sort((a, b) => {
         if (a.period.year === b.period.year) {
             return (a.period.month || 0) - (b.period.month || 0);
         }
         return a.period.year - b.period.year;
      });
      const current = history[history.length - 1];
      return { current, history };
    }

    const current = this.normalizeSingle(rawData);
    return { current, history: [current] };
  }

  private static normalizeSingle(data: any): NormalizedDre {
    const findValue = (possibleNames: string[]): number => {
       if (Array.isArray(data)) {
           const match = data.find(d => {
              const cat = (d.category || d.conta || '').toLowerCase().trim();
              return possibleNames.some(name => cat === name || cat.includes(name));
           });
           return match ? (match.value ?? match.valor ?? match.val ?? 0) : 0;
       }
       
       for (const key of Object.keys(data)) {
          const lowerKey = key.toLowerCase();
          if (possibleNames.some(name => lowerKey === name || lowerKey.includes(name))) {
             return data[key] || 0;
          }
       }
       return 0;
    };

    const getArraySum = (possibleNames: string[]): number => {
        if (!Array.isArray(data)) return findValue(possibleNames);
        return data.filter(d => {
            const cat = (d.category || d.conta || '').toLowerCase().trim();
            return possibleNames.some(name => cat === name || cat.includes(name));
        }).reduce((acc, curr) => acc + (curr.value ?? curr.valor ?? curr.val ?? 0), 0);
    };

    // 1. Revenue
    let grossRevenue = getArraySum(['receita bruta', 'faturamento bruto']);
    let deductions = getArraySum(['deduções', 'impostos sobre vendas', 'devoluções', 'abatimentos']);
    let netRevenue = findValue(['receita líquida', 'receita operacional líquida', 'rol']);

    if (!netRevenue && grossRevenue !== 0) {
        netRevenue = grossRevenue + (deductions < 0 ? deductions : -deductions); 
    }

    // 2. Costs & Gross Profit
    let cogs = getArraySum(['custo', 'cmv', 'cpv', 'csp', 'csv', 'custos das vendas']);
    // Normalize costs to positive for internal math or keep them as is. Usually they come negative. Let's force positive for abstraction.
    const absCogs = Math.abs(cogs);

    let grossProfit = findValue(['lucro bruto', 'resultado bruto']);
    if (!grossProfit && netRevenue !== 0) {
        grossProfit = netRevenue - absCogs;
    }

    // 3. OPEX
    let opex = getArraySum(['despesas operacionais', 'despesas com vendas', 'despesas administrativas', 'opex']);
    const absOpex = Math.abs(opex);

    // 4. Operational Results
    let ebitda = findValue(['ebitda', 'lajida']);
    let depAmort = getArraySum(['depreciação', 'amortização']);
    const absDepAmort = Math.abs(depAmort);

    if (!ebitda && grossProfit !== 0) {
        // Fallback: EBITDA = Gross Profit - OPEX (excluding D&A if they are mixed in OPEX). We will assume OPEX here doesn't include D&A for pure math, or if it does, it's just an approximation.
        ebitda = grossProfit - absOpex;
    }

    let ebit = findValue(['ebit', 'lajir', 'resultado operacional antes do resultado financeiro']);
    if (!ebit && ebitda !== 0) {
        ebit = ebitda - absDepAmort;
    }

    // 5. Financial Result
    let finIncome = getArraySum(['receitas financeiras']);
    let finExpenses = getArraySum(['despesas financeiras']);
    let netFinancial = findValue(['resultado financeiro', 'resultado financeiro líquido']);
    if (!netFinancial) {
        netFinancial = finIncome - Math.abs(finExpenses);
    }

    // 6. Net Result
    let ebt = findValue(['lair', 'resultado antes do imposto de renda', 'lucro antes do ir']); // EBT
    if (!ebt && ebit !== 0) {
        ebt = ebit + netFinancial;
    }

    let incomeTaxes = getArraySum(['imposto de renda', 'irpj', 'csll', 'provisão para imposto']);
    const absTaxes = Math.abs(incomeTaxes);

    let netIncome = findValue(['lucro líquido', 'prejuízo líquido', 'resultado líquido']);
    if (!netIncome && ebt !== 0) {
        netIncome = ebt - absTaxes;
    }

    const year = data.ano || data.year || new Date().getFullYear();
    const month = data.mes || data.month;

    return {
      period: { year, month },
      revenue: {
         grossRevenue,
         deductions,
         netRevenue
      },
      costs: {
         cogs: absCogs
      },
      margins: {
         grossProfit
      },
      expenses: {
         opex: absOpex,
         depreciationAndAmortization: absDepAmort
      },
      operationalResult: {
         ebitda,
         ebit
      },
      financialResult: {
         financialIncome: finIncome,
         financialExpenses: Math.abs(finExpenses),
         netFinancialResult: netFinancial
      },
      taxes: {
         incomeTaxes: absTaxes
      },
      netResult: {
         earningsBeforeTaxes: ebt,
         netIncome
      },
      source: data.source || 'NormalizedDRE'
    };
  }
}
