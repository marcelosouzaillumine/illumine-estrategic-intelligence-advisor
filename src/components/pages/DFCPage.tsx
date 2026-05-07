
import React from 'react';
import { PageHeader } from '../Common';
import { formatCurrency, cn } from '../../lib/utils';

import { modelData } from '../../data';

export function DFCPage({ clients, selectedClient, selectedYear }: any) {
  const dre = modelData.dreAnual;
  const lucro = dre.rows.find(r => r.item === 'Lucro Líquido')?.values[0] || 0;
  const depreciação = Math.abs(dre.rows.find(r => r.item === 'Depreciação e Amortização')?.values[0] || 0);

  const dfcData = [
    { category: 'Atividades Operacionais', items: [
      { item: 'Lucro Líquido do Exercício', valor: lucro },
      { item: 'Ajuste: Depreciação e Amortização', valor: depreciação },
      { item: '(-) Aumento nas Contas a Receber', valor: -120000 },
      { item: '(+) Aumento em Fornecedores', valor: 45000 },
      { item: 'Caixa Líquido das Atividades Operacionais', valor: lucro + depreciação - 120000 + 45000, isSubTotal: true },
    ]},
    { category: 'Atividades de Investimento', items: [
      { item: 'Aquisição de Imobilizado (CAPEX)', valor: -500000 },
      { item: 'Venda de Ativos', valor: 20000 },
      { item: 'Caixa Líquido das Atividades de Investimento', valor: -480000, isSubTotal: true },
    ]},
    { category: 'Atividades de Financiamento', items: [
      { item: 'Ingressos de Empréstimos Bancários', valor: 250000 },
      { item: 'Amortização de Empréstimos / Financiamentos', valor: -180000 },
      { item: 'Pagamento de Dividendos', valor: -150000 },
      { item: 'Caixa Líquido das Atividades de Financiamento', valor: -80000, isSubTotal: true },
    ]},
    { category: 'Resumo do Caixa', items: [
      { item: 'Aumento / Redução de Caixa e Equivalentes', valor: (lucro + depreciação - 120000 + 45000) - 480000 - 80000, isTotal: true },
      { item: 'Saldo Inicial de Caixa e Equivalentes', valor: 1200000 },
      { item: 'Saldo Final de Caixa e Equivalentes', valor: 1200000 + ((lucro + depreciação - 120000 + 45000) - 480000 - 80000), isTotal: true },
    ]}
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <PageHeader 
          title="DFC" 
          description="Demonstração do Fluxo de Caixa (Método Indireto)"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Descrição</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dfcData.map((cat, catIdx) => (
                <React.Fragment key={catIdx}>
                  <tr className="bg-slate-50/30">
                    <td colSpan={2} className="px-8 py-3 text-[11px] font-black text-blue-600 uppercase tracking-widest">{cat.category}</td>
                  </tr>
                  {cat.items.map((row, idx) => (
                    <tr key={idx} className={cn(
                      "hover:bg-slate-50/20 transition-colors",
                      row.isSubTotal ? "bg-slate-50/40" : row.isTotal ? "bg-blue-50/30" : ""
                    )}>
                      <td className={cn(
                        "px-8 py-4 text-sm",
                        (row.isTotal || row.isSubTotal) ? "font-black" : "font-medium text-slate-600"
                      )}>{row.item}</td>
                      <td className={cn(
                        "px-8 py-4 text-sm text-right font-black",
                        row.valor < 0 ? "text-rose-500" : (row.isTotal || row.isSubTotal) ? "text-slate-900" : "text-slate-700"
                      )}>
                        {formatCurrency(row.valor)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
