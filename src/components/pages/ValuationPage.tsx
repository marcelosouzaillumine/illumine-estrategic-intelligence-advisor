
import React, { useState, useEffect } from 'react';
import { Calculator, Loader2, TrendingUp, Zap, BarChart3 } from 'lucide-react';
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

  // Sync
  useEffect(() => {
    if (selectedYear) setYear(selectedYear);
    if (selectedMonth) setMonth(selectedMonth);
  }, [selectedYear, selectedMonth]);

  // For valuation, we'll use selected month/year as reference or dynamic data
  const { dbData, loading } = useFinancialData(selectedClient, year, month, 'DRE');
  
  const mockDre = DATA.dre.filter(d => (d as any).id === selectedClient && (d as any).ano === year);
  // Get count of unique months in mock data to avoid division by hardcoded 3
  const monthsInMock = new Set(mockDre.map(d => (d as any).mes)).size || 1;
  
  const mockTotalRevenue = mockDre.filter(d => d.conta === 'Receita Líquida').reduce((acc, curr) => acc + curr.valor, 0);
  const mockTotalEbitda = mockDre.filter(d => d.conta === 'EBITDA').reduce((acc, curr) => acc + curr.valor, 0);
  
  // Logic: if DB has data for the reference month, use it. Otherwise use annualized mock data.
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
  
  // Simple DCF for demonstration
  const freeCashFlow = anualizedEbitda * 0.7; // Proxy
  const terminalValue = (freeCashFlow * (1 + (growth/100))) / ((wacc/100) - (growth/100));
  const enterpriseValueDCF = (freeCashFlow / (1 + (wacc/100))) + (terminalValue / (1 + (wacc/100)));

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="flex-1">
          <PageHeader 
            title="Valuation Business" 
            subtitle="Avaliação estratégica de valor de mercado utilizando múltiplos setoriais e fluxo de caixa descontado (DCF)." 
            icon={BarChart3}
            color="bg-slate-900"
          />
        </div>
        <div className="flex items-center gap-4 pt-10">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <select 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))} 
              className="bg-transparent px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
            <div className="w-px bg-slate-200 mx-1" />
            <select 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))} 
              className="bg-transparent px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value={1}>Jan</option>
              <option value={2}>Fev</option>
              <option value={3}>Mar</option>
            </select>
          </div>
          <div className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3">
            {loading && <Loader2 size={14} className="animate-spin text-blue-600" />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {hasDbData ? 'Dados Reais' : 'Amostra'}
            </span>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calculator size={18} className="text-blue-600" />
              Premissas de Avaliação
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Múltiplo de EBITDA</label>
                  <span className="text-[10px] font-black text-blue-600">{multiple}x</span>
                </div>
                <input type="range" min="2" max="15" step="0.5" value={multiple} onChange={(e) => setMultiple(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Taxa WACC (%)</label>
                  <span className="text-[10px] font-black text-blue-600">{wacc}%</span>
                </div>
                <input type="range" min="5" max="25" step="0.5" value={wacc} onChange={(e) => setWacc(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Crescimento Perpétuo (%)</label>
                  <span className="text-[10px] font-black text-blue-600">{growth}%</span>
                </div>
                <input type="range" min="0" max="8" step="0.1" value={growth} onChange={(e) => setGrowth(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-200">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Resumo Operacional (Anualizado)</h4>
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
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor Presente (DCF)</h4>
              <p className="text-3xl font-black text-slate-900 mb-2">{formatCurrency(enterpriseValueDCF)}</p>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg">
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
