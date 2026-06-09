import React from 'react';

import { formatCurrency } from '../../lib/utils';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  baseData: any;
  output: any;
}

export function BeforeAfterComparisonPanel({ baseData, output }: Props) {
  const { projectedData } = output;

  const metrics = [
    {
      label: 'Receita Líquida',
      base: baseData.operational.receitaLiquida,
      proj: projectedData.projectedOperational.receitaLiquida,
      isPositiveGood: true
    },
    {
      label: 'EBITDA',
      base: baseData.operational.ebitda,
      proj: projectedData.projectedOperational.ebitda,
      isPositiveGood: true
    },
    {
      label: 'Caixa Operacional (Geração)',
      base: baseData.cashFlow.operatingCashFlow,
      proj: projectedData.projectedCashFlow.operatingCashFlow,
      isPositiveGood: true
    },
    {
      label: 'Saldo Bancário Final',
      base: baseData.cashFlow.currentCashBalance,
      proj: projectedData.projectedCashFlow.currentCashBalance,
      isPositiveGood: true
    },
    {
      label: 'Despesas e Custos Fixos',
      base: baseData.operational.custosFixos + baseData.operational.despesasOperacionais,
      proj: projectedData.projectedOperational.custosFixos + projectedData.projectedOperational.despesasOperacionais,
      isPositiveGood: false
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-6">Comparativo Financeiro Base vs Projetado</h2>
      
      <div className="space-y-4">
        {metrics.map((m, i) => {
          const delta = m.proj - m.base;
          const isNeutral = delta === 0;
          let isGood = isNeutral ? null : m.isPositiveGood ? delta > 0 : delta < 0;
          
          return (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-bold text-slate-600 mb-2 md:mb-0 w-1/3">{m.label}</span>
              
              <div className="flex items-center gap-4 w-2/3 justify-end font-mono text-sm">
                <span className="text-slate-500">{formatCurrency(m.base)}</span>
                <ArrowRight size={14} className="text-slate-300" />
                <span className="font-bold text-slate-900">{formatCurrency(m.proj)}</span>
                
                <span className={cn(
                  "w-24 text-right text-xs font-bold",
                  isNeutral ? "text-slate-400" : isGood ? "text-emerald-500" : "text-rose-500"
                )}>
                  {delta > 0 ? '+' : ''}{formatCurrency(delta)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
