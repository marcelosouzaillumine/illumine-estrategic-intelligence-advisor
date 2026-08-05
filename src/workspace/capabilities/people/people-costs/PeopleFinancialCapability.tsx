import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { usePeopleFinancialImpact } from '../../../data/adapters/people-intelligence.adapter';

interface PeopleFinancialCapabilityProps {
  context: ExecutiveContext;
}

export const PeopleFinancialCapability: React.FC<PeopleFinancialCapabilityProps> = ({ context }) => {
  const { data, loading } = usePeopleFinancialImpact(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Impacto Financeiro...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">People Financial Impact</h1>
        <p className="text-slate-400 text-sm mt-1">People Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Total Payroll</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 text-emerald-400">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalPayroll)}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Labor Cost % (vs Rev)</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {(data.laborCostPercentage * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Profit per Employee</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.profitPerEmployee)}
          </div>
        </div>
      </div>
    </div>
  );
};
