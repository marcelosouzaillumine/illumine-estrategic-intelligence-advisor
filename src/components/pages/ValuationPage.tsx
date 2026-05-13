import React, { useState, useEffect } from 'react';
import { Calculator, Loader2, TrendingUp, Zap, BarChart3, Calendar } from 'lucide-react';
import { PageHeader } from '../Common';
import { cn, formatCurrency } from '../../lib/utils';
import { DATA } from '../../data';
import { useFinancialData } from '../../hooks/useFinancialData';

export function ValuationPage({ clients, selectedClient, selectedYear, selectedMonth }: any) {
  const [multiple, setMultiple] = useState(6.5);
  const [wacc, setWacc] = useState(12.5);
  const [growth, setGrowth] = useState(3.0);
  const [year, setYear] = useState(selectedYear || 2026);
  const [month, setMonth] = useState(selectedMonth || 3);

  useEffect(() => {
    if (selectedYear) setYear(selectedYear);
    if (selectedMonth) setMonth(selectedMonth);
  }, [selectedYear, selectedMonth]);

  const { dbData, loading } = useFinancialData(selectedClient, year, month, 'DRE');
  
  const mockDre = DATA.dre.filter(d => (d as any).id === selectedClient && (d as any).ano === year);
  const monthsInMock = new Set(mockDre.map(d => (d as any).mes)).size || 1;
  
  const mockTotalRevenue = mockDre.filter(d => d.conta === 'Receita Líquida').reduce((acc, curr) => acc + curr.valor, 0);
  const mockTotalEbitda = mockDre.filter(d => d.conta === 'EBITDA').reduce((acc, curr) => acc + curr.valor, 0);
  
  const hasDbData = dbData.length > 0;
  
  const currentRevenue = hasDbData ? 
    (dbData.find((d: any) => d.category === 'Receita Líquida' || d.category === 'Receita Operacional Bruta')?.value || 0) : 0;
  
  let currentEbitda = hasDbData ? (dbData.find((d: any) => d.category === 'EBITDA')?.value || 0) : 0;
  if (hasDbData && currentEbitda === 0) {
    const ebit = dbData.find((d: any) => d.category === 'Lucro Operacional (EBIT)')?.value || 0;
    const da = Math.abs(dbData.find((d: any) => d.category === 'Depreciação e Amortização')?.value || 0);
    currentEbitda = ebit + da;
  }

  const anualizedEbitda = currentEbitda * 12;
  const anualizedRevenue = currentRevenue * 12;
  const valuationEbitda = anualizedEbitda * multiple;
  
  const freeCashFlow = anualizedEbitda * 0.7;
  const terminalValue = (freeCashFlow * (1 + (growth/100))) / ((wacc/100) - (growth/100));
  const enterpriseValueDCF = (freeCashFlow / (1 + (wacc/100))) + (terminalValue / (1 + (wacc/100)));

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Valuation Business" 
        subtitle="Avaliação estratégica de valor de mercado utilizando múltiplos setoriais e fluxo de caixa descontado (DCF)."
        icon={BarChart3}
        color="bg-slate-900"
        actions={
          <div className="flex items-center gap-4">
            <div className="flex bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1">
              <div className="flex items-center px-4 py-2 border-r border-white/10">
                <Calendar size={14} className="text-slate-400 mr-2" />
                <select 
                  value={year} 
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer text-white"
                >
                  <option value={2026} className="bg-slate-900">2026</option>
                  <option value={2025} className="bg-slate-900">2025</option>
                </select>
              </div>
              <div className="flex items-center px-4 py-2">
                <select 
                  value={month} 
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer text-white"
                >
                  <option value={1} className="bg-slate-900">Jan</option>
                  <option value={2} className="bg-slate-900">Fev</option>
                  <option value={3} className="bg-slate-900">Mar</option>
                  <option value={4} className="bg-slate-900">Abr</option>
                  <option value={5} className="bg-slate-900">Mai</option>
                  <option value={6} className="bg-slate-900">Jun</option>
                  <option value={7} className="bg-slate-900">Jul</option>
                  <option value={8} className="bg-slate-900">Ago</option>
                  <option value={9} className="bg-slate-900">Set</option>
                  <option value={10} className="bg-slate-900">Out</option>
                  <option value={11} className="bg-slate-900">Nov</option>
                  <option value={12} className="bg-slate-900">Dez</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm flex items-center gap-3">
              {loading && <Loader2 size={14} className="animate-spin text-secondary" />}
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {hasDbData ? 'Dados Reais' : 'Amostra'}
              </span>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calculator size={18} className="text-secondary" />
              Premissas de Avaliação
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Múltiplo de EBITDA</label>
                  <span className="text-[10px] font-black text-secondary">{multiple}x</span>
                </div>
                <input type="range" min="2" max="15" step="0.5" value={multiple} onChange={(e) => setMultiple(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-secondary" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Taxa WACC (%)</label>
                  <span className="text-[10px] font-black text-secondary">{wacc}%</span>
                </div>
                <input type="range" min="5" max="25" step="0.5" value={wacc} onChange={(e) => setWacc(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-secondary" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crescimento Perpétuo (%)</label>
                  <span className="text-[10px] font-black text-secondary">{growth}%</span>
                </div>
                <input type="range" min="0" max="8" step="0.1" value={growth} onChange={(e) => setGrowth(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all"></div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Resumo Operacional (Anualizado)</h4>
            <div className="space-y-4">
              <div>
                <p className="text-4xl font-black">{formatCurrency(anualizedEbitda)}</p>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">EBITDA Estimado</p>
              </div>
              <div className="h-px bg-white/20" />
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xl font-bold">{formatCurrency(anualizedRevenue)}</p>
                  <p className="text-[9px] font-medium opacity-70">Receita Líquida Est.</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{anualizedRevenue > 0 ? ((anualizedEbitda / anualizedRevenue) * 100).toFixed(1) : 0}%</p>
                  <p className="text-[9px] font-medium opacity-70">Margem EBITDA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Múltiplo de EBITDA</h4>
              <p className="text-3xl font-black text-slate-900 mb-2">{formatCurrency(valuationEbitda)}</p>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg">
                MÉTODO COMPARATIVO
              </div>
              <p className="mt-4 text-[11px] text-slate-400 font-medium leading-relaxed">
                Valor baseado na aplicação do múltiplo de {multiple}x sobre o EBITDA anualizado.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor Presente (DCF)</h4>
              <p className="text-3xl font-black text-slate-900 mb-2">{formatCurrency(enterpriseValueDCF)}</p>
              <div className="px-3 py-1 bg-secondary/20 text-secondary text-[10px] font-black rounded-lg">
                MÉTODO INTRÍNSECO
              </div>
              <p className="mt-4 text-[11px] text-slate-400 font-medium leading-relaxed">
                Cálculo baseado no fluxo de caixa projetado com taxa de desconto de {wacc}% e perpetuidade de {growth}%.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Detalhamento dos Cálculos</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-600">Fluxo de Caixa Livre (Ano 1)</span>
                <span className="text-xs font-black text-slate-900">{formatCurrency(freeCashFlow)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-600">Valor na Perpetuidade</span>
                <span className="text-xs font-black text-slate-900">{formatCurrency(terminalValue)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-600">Taxa de Desconto (WACC)</span>
                <span className="text-xs font-black text-slate-900">{wacc/100}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
