
import React from 'react';
import { PageHeader } from '../Common';
import { formatCurrency, cn } from '../../lib/utils';
import { modelData } from '../../data';

export function DLPAPage({ clients, selectedClient, selectedYear }: any) {
  // Derivando dados da modelagem para o cliente exemplo
  const dre = modelData.dreAnual;
  const lucro2026 = dre.rows.find(r => r.item === 'Lucro Líquido')?.values[0] || 0;
  
  const dlpaData = [
    { item: 'Saldo Inicial de Lucros Acumulados', valor: 850000 },
    { item: 'Ajustes de Exercícios Anteriores', valor: 0 },
    { item: 'Lucro Líquido do Exercício', valor: lucro2026 },
    { item: 'Transferência para Reservas', valor: - (lucro2026 * 0.05) },
    { item: 'Dividendos Propostos', valor: - (lucro2026 * 0.25) },
    { item: 'Saldo Final de Lucros Acumulados', valor: 850000 + lucro2026 - (lucro2026 * 0.3), isTotal: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <PageHeader 
          title="DLPA" 
          description="Demonstração dos Lucros ou Prejuízos Acumulados"
        />
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
