import React, { useMemo } from 'react';
import { PageHeader } from '../Common';
import { formatCurrency, cn } from '../../lib/utils';
import { DATA } from '../../data';
import { useAllFinancialData } from '../../hooks/useFinancialData';
import { Loader2 } from 'lucide-react';

export function DLPAPage({ clients, selectedClient, selectedYear }: any) {
  const { dbData, loading } = useAllFinancialData(selectedClient);

  const lucroLiquido = useMemo(() => {
    // Tenta buscar dos dados reais (Firebase)
    const dreEntries = dbData.filter(d => d.type === 'DRE' && d.year === selectedYear && d.conta === 'Lucro Líquido');
    if (dreEntries.length > 0) {
      return dreEntries.reduce((sum, entry) => sum + (Number(entry.valor) || 0), 0);
    }
    
    // Fallback para os dados locais simulados
    const mockDreEntries = DATA.dre.filter((d: any) => d.id === selectedClient && d.ano === selectedYear && d.conta === 'Lucro Líquido');
    if (mockDreEntries.length > 0) {
      return mockDreEntries.reduce((sum: number, entry: any) => sum + (Number(entry.valor) || 0), 0);
    }
    
    // Se não houver lançamentos, retorna 0
    return 0;
  }, [dbData, selectedClient, selectedYear]);
  
  const dlpaData = [
    { item: 'Saldo Inicial de Lucros Acumulados', valor: 0 },
    { item: 'Ajustes de Exercícios Anteriores', valor: 0 },
    { item: 'Lucro Líquido do Exercício', valor: lucroLiquido },
    { item: 'Transferência para Reservas', valor: - (lucroLiquido * 0.05) },
    { item: 'Dividendos Propostos', valor: - (lucroLiquido * 0.25) },
    { item: 'Saldo Final de Lucros Acumulados', valor: lucroLiquido - (lucroLiquido * 0.05) - (lucroLiquido * 0.25), isTotal: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <PageHeader 
          title="DLPA" 
          description="Demonstração dos Lucros ou Prejuízos Acumulados"
        />
        {loading && (
          <div className="flex items-center text-slate-400 text-sm font-semibold">
            <Loader2 size={16} className="animate-spin mr-2" />
            Carregando dados...
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Composição de Lucros Acumulados</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 italic">Descrição da Conta</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dlpaData.map((row, idx) => (
                <tr key={idx} className={cn(
                  "hover:bg-slate-50/50 transition-colors",
                  row.isTotal ? "bg-blue-50/30" : ""
                )}>
                  <td className={cn(
                    "px-8 py-4 text-sm",
                    row.isTotal ? "font-black text-blue-900" : "font-semibold text-slate-700"
                  )}>{row.item}</td>
                  <td className={cn(
                    "px-8 py-4 text-sm text-right font-black",
                    row.valor < 0 ? "text-rose-500" : row.isTotal ? "text-blue-600" : "text-slate-900"
                  )}>
                    {formatCurrency(row.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
