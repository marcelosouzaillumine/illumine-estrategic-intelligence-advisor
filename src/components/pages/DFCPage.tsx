
import React, { useMemo } from 'react';
import { PageHeader } from '../Common';
import { formatCurrency, cn } from '../../lib/utils';

import { DATA } from '../../data';
import { useAllFinancialData } from '../../hooks/useFinancialData';
import { Loader2, WalletCards } from 'lucide-react';

export function DFCPage({ clients, selectedClient, selectedYear }: any) {
  const { dbData, loading } = useAllFinancialData(selectedClient);

  const { lucro, depreciação } = useMemo(() => {
    // Busca do Firebase
    const dbDre = dbData.filter(d => d.type === 'DRE' && d.year === selectedYear);
    
    let lucroReal = 0;
    let depReal = 0;

    if (dbDre.length > 0) {
      const lucroLine = dbDre.find((d: any) => 
        (d.conta || d.category) === 'Lucro Líquido' || 
        (d.conta || d.category) === 'Lucro Líquido do Exercício'
      );
      const depLine = dbDre.find((d: any) => 
        (d.conta || d.category) === 'Depreciação e Amortização'
      );
      
      lucroReal = lucroLine?.valor || lucroLine?.value || 0;
      depReal = Math.abs(depLine?.valor || depLine?.value || 0);
      return { lucro: lucroReal, depreciação: depReal };
    }

    // Fallback para mock
    const mockDre = DATA.dre.filter((d: any) => d.id === selectedClient && d.ano === selectedYear);
    if (mockDre.length > 0) {
      lucroReal = mockDre.find(d => d.conta === 'Lucro Líquido')?.valor || 0;
      depReal = Math.abs(mockDre.find(d => d.conta === 'Depreciação e Amortização')?.valor || 0);
      return { lucro: lucroReal, depreciação: depReal };
    }

    return { lucro: 0, depreciação: 0 };
  }, [dbData, selectedClient, selectedYear]);

  const dfcData = [
    { category: 'Atividades Operacionais', items: [
      { item: 'Lucro Líquido do Exercício', valor: lucro },
      { item: 'Ajuste: Depreciação e Amortização', valor: depreciação },
      { item: '(-) Aumento nas Contas a Receber', valor: 0 },
      { item: '(+) Aumento em Fornecedores', valor: 0 },
      { item: 'Caixa Líquido das Atividades Operacionais', valor: lucro + depreciação, isSubTotal: true },
    ]},
    { category: 'Atividades de Investimento', items: [
      { item: 'Aquisição de Imobilizado (CAPEX)', valor: 0 },
      { item: 'Venda de Ativos', valor: 0 },
      { item: 'Caixa Líquido das Atividades de Investimento', valor: 0, isSubTotal: true },
    ]},
    { category: 'Atividades de Financiamento', items: [
      { item: 'Ingressos de Empréstimos Bancários', valor: 0 },
      { item: 'Amortização de Empréstimos / Financiamentos', valor: 0 },
      { item: 'Pagamento de Dividendos', valor: 0 },
      { item: 'Caixa Líquido das Atividades de Financiamento', valor: 0, isSubTotal: true },
    ]},
    { category: 'Resumo do Caixa', items: [
      { item: 'Aumento / Redução de Caixa e Equivalentes', valor: lucro + depreciação, isTotal: true },
      { item: 'Saldo Inicial de Caixa e Equivalentes', valor: 0 },
      { item: 'Saldo Final de Caixa e Equivalentes', valor: lucro + depreciação, isTotal: true },
    ]}
  ];

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Demonstração do Fluxo de Caixa" 
        subtitle="Análise estruturada das movimentações financeiras operacionais, de investimento e financiamento pelo método indireto."
        icon={WalletCards}
        color="bg-slate-900"
      />

      {loading && (
        <div className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm -mt-6 mb-8">
          <Loader2 size={16} className="animate-spin text-blue-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sincronizando Dados...</span>
        </div>
      )}


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
