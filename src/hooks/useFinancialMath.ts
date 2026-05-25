// src/hooks/useFinancialMath.ts

export const useFinancialMath = () => {
  return {
    aggregatePositions: (positions: any[], exchangeRates: Record<string, number>) => {
      const totalCurrent = positions.reduce((acc, p) => {
        const rate = exchangeRates[p.moeda] || 1;
        return acc + (p.saldoAtual * rate);
      }, 0);
      
      const totalInitial = positions.reduce((acc, p) => {
        const rate = exchangeRates[p.moeda] || 1;
        return acc + (p.saldoInicial * rate);
      }, 0);

      const variation = totalInitial !== 0 ? ((totalCurrent - totalInitial) / totalInitial) * 100 : 0;
      
      return { totalCurrent, totalInitial, variation };
    },

    aggregateHistory: (positions: any[], exchangeRates: Record<string, number>, monthOrder: string[]) => {
      const normalizeMonth = (m: string) => {
        if (!m) return '';
        const clean = m.replace(/\./g, '').trim();
        return clean.charAt(0).toUpperCase() + clean.slice(1, 3).toLowerCase();
      };

      let allMonths = Array.from(new Set(positions.flatMap(p => p.historico?.map((h: any) => normalizeMonth(h.mes)) || []))) as string[];
      allMonths = allMonths.filter(m => m && monthOrder.includes(m));

      if (allMonths.length === 0 && positions.length > 0) {
        const currentMonth = normalizeMonth(new Date().toLocaleString('pt-BR', { month: 'short' }));
        allMonths = [currentMonth];
      }

      const sortedMonths = allMonths.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
      const currentMonthStr = normalizeMonth(new Date().toLocaleString('pt-BR', { month: 'short' }));

      return sortedMonths.map(m => {
        const total = positions.reduce((acc, p) => {
          const hist = p.historico?.find((h: any) => normalizeMonth(h.mes) === m);
          const rate = exchangeRates[p.moeda] || 1;
          const balance = hist ? hist.saldo : (m === currentMonthStr ? p.saldoAtual : 0);
          return acc + (balance * rate);
        }, 0);
        return { mes: m, saldo: total };
      });
    },

    calculateTotalValue: (items: any[], valueKey: string) => {
      return items.reduce((acc, item) => acc + (Number(item[valueKey]) || 0), 0);
    },

    calculateNetProfit: (revenue: number, costs: number, expenses: number, taxes: number) => {
      return revenue - costs - expenses - taxes;
    }
  };
};
