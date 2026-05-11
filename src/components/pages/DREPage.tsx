import React, { useMemo } from 'react';
import { DATA } from '../../data';
import { formatCurrency, cn } from '../../lib/utils';
import { PageHeader } from '../Common';
import { useAnnualFinancialData } from '../../hooks/useFinancialData';

export function DREPage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
  const { dbData: dbDataCurrent } = useAnnualFinancialData(selectedClient, selectedYear, 'DRE');
  const { dbData: dbDataPrev } = useAnnualFinancialData(selectedClient, selectedYear - 1, 'DRE');

  const data = useMemo(() => {
    if (dbDataCurrent && dbDataCurrent.length > 0) return dbDataCurrent;
    return DATA.dre.filter(d => d.id === selectedClient && d.ano === selectedYear && d.mes === selectedMonth);
  }, [selectedClient, selectedYear, selectedMonth, dbDataCurrent]);

  const prevYearData = useMemo(() => {
    if (dbDataPrev && dbDataPrev.length > 0) return dbDataPrev;
    return DATA.dre.filter(d => d.id === selectedClient && d.ano === selectedYear - 1 && d.mes === selectedMonth);
  }, [selectedClient, selectedYear, selectedMonth, dbDataPrev]);

  const rows = [
    'Receita Operacional Bruta',
    '(-) Deduções e Impostos',
    'Receita Líquida',
    '(-) Custos (CPV/CSP)',
    'Lucro Bruto',
    '(-) Despesas Operacionais',
    'EBITDA',
    '(-) Depreciação e Amortização',
    'EBIT',
    '(+/-) Resultado Financeiro',
    'LAIR (Lucro Antes do IR)',
    '(-) Provisão IR/CSLL',
    'Lucro Líquido'
  ];

  const getValue = (source: any[], name: string) => source.find(s => s.conta === name)?.val || source.find(s => s.conta === name)?.valor || 0;

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        title="Demonstrativo de Resultados (DRE)" 
        description={`Análise detalhada da performance financeira do cliente ${clients.find(c => c.id === selectedClient)?.fantasia} para ${selectedMonth}/${selectedYear}.`}
      />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 z-10">Descrição da Conta</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Realizado {selectedMonth}/{selectedYear}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Realizado {selectedMonth}/{selectedYear - 1}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Variação (YoY)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Vertical (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row, i) => {
                const val = getValue(data, row);
                const prevVal = getValue(prevYearData, row);
                const recLiquida = getValue(data, 'Receita Líquida') || 1;
                const vertical = (val / recLiquida) * 100;
                const yoy = prevVal !== 0 ? ((val - prevVal) / Math.abs(prevVal)) * 100 : 0;

                const isTotal = ['Receita Líquida', 'Lucro Bruto', 'EBITDA', 'EBIT', 'LAIR (Lucro Antes do IR)', 'Lucro Líquido'].includes(row);

                return (
                  <tr key={i} className={cn(
                    "hover:bg-slate-50/50 transition-colors group",
                    isTotal ? "bg-slate-50/30 font-bold" : ""
                  )}>
                    <td className="px-8 py-4 text-sm text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r border-slate-50">
                      {row}
                    </td>
                    <td className={cn(
                        "px-8 py-4 text-sm text-right font-mono",
                        val < 0 ? "text-rose-500" : "text-slate-900",
                        isTotal ? "font-black" : ""
                    )}>
                      {formatCurrency(val)}
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-400 text-right font-mono">{formatCurrency(prevVal)}</td>
                    <td className={cn(
                      "px-8 py-4 text-xs text-right font-black",
                      yoy > 0 ? "text-emerald-500" : yoy < 0 ? "text-rose-500" : "text-slate-300"
                    )}>
                      {yoy !== 0 ? `${yoy > 0 ? '+' : ''}${yoy.toFixed(1)}%` : '—'}
                    </td>
                    <td className="px-8 py-4 text-xs text-slate-400 text-right font-bold">{vertical.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
