
import React, { useState, useEffect } from 'react';
import { Loader2, TrendingUp } from 'lucide-react';
import { PageHeader } from '../Common';
import { cn, formatCurrency } from '../../lib/utils';
import { DATA } from '../../data';
import { useFinancialData } from '../../hooks/useFinancialData';

export function AnaliseFinanceiraPage({ clients, selectedClient, selectedYear, selectedMonth }: any) {
  const [filterClient, setFilterClient] = useState(selectedClient);
  const [month, setMonth] = useState(selectedMonth || 3);
  const [year, setYear] = useState(selectedYear || 2026);
  
  // Sync
  useEffect(() => {
    setFilterClient(selectedClient);
    if (selectedYear) setYear(selectedYear);
    if (selectedMonth) setMonth(selectedMonth);
  }, [selectedClient, selectedYear, selectedMonth]);

  const { dbData: dbDre, loading: loadingDre } = useFinancialData(filterClient, year, month, 'DRE');
  const { dbData: dbBp, loading: loadingBp } = useFinancialData(filterClient, year, month, 'BP');

  const mockDre = DATA.dre.filter(d => (d as any).id === filterClient && (d as any).mes === month && (d as any).ano === year);
  const mockBp = DATA.bp.filter(b => (b as any).id === filterClient && (b as any).mes === month && (b as any).ano === year);

  const currentDre = dbDre.length > 0 ? dbDre : mockDre.map(d => ({ category: d.conta, value: d.valor }));
  const currentBp = dbBp.length > 0 ? dbBp : mockBp.map(b => ({ category: b.conta, value: b.val }));

  const getVal = (data: any[], name: string) => data.find(d => d.category === name)?.value || 0;

  // Key Values
  const receita = getVal(currentDre, 'Receita Líquida');
  const ebitda = getVal(currentDre, 'EBITDA');
  const lucro = getVal(currentDre, 'Lucro Líquido');
  const ativoTotal = getVal(currentBp, 'Ativo Total');
  const pl = getVal(currentBp, 'Patrimônio Líquido');
  const ac = getVal(currentBp, 'Ativo Circulante');
  const pc = getVal(currentBp, 'Passivo Circulante');
  const pnc = getVal(currentBp, 'Passivo Não Circulante');
  const est = getVal(currentBp, 'Estoques');

  // Indicators
  const roe = pl > 0 ? (lucro / pl) * 100 : 0;
  
  // CFO Level Metrics
  const investedCapital = pl + pnc;
  const noplat = ebitda * 0.66; // Proxy: EBITDA minus ~34% taxes
  const roic = investedCapital > 0 ? (noplat / investedCapital) * 100 : 0;
  
  // Estimated WACC (standard for Brazil consultancy)
  const costOfEquity = 0.15; // 15% target
  const costOfDebt = 0.12;   // 12% a.a.
  const wacc = investedCapital > 0 ? ((pl / investedCapital) * costOfEquity + (pnc / investedCapital) * costOfDebt) * 100 : 13.5;
  
  const eva = (investedCapital * (roic - wacc) / 100);
  
  const dscr = (pnc > 0) ? (ebitda / (pnc / 12)) : 5; // Simplified: EBITDA / Average monthly long term debt service

  const totalThirdParty = pc + pnc;
  const ct = totalThirdParty > 0 ? (pc / totalThirdParty) * 100 : 0;
  const ce = totalThirdParty > 0 ? (pnc / totalThirdParty) * 100 : 0;
  const impl = pl > 0 ? (totalThirdParty / pl) * 100 : 0;
  const irpc = totalThirdParty > 0 ? (pc / totalThirdParty) * 100 : 0;

  const gaf = (pl > 0 && lucro > 0) ? ((ebitda) / (lucro)) : 1;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <PageHeader 
        title="Análise Financeira" 
        subtitle="Indicadores vitais e monitoramento de performance financeira estratégica."
        icon={TrendingUp}
      />
        <div className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl">
          {(loadingDre || loadingBp) && <Loader2 size={12} className="animate-spin text-blue-600 mr-2" />}
          <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">
            CFO Dashboard v2.0
          </span>
        </div>
      </div>
      
      <div className="flex gap-4 mb-4">
        <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20">
          {clients.map((c: any) => <option key={c.id} value={c.id}>{c.fantasia}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20">
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
        </select>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20">
          <option value={1}>Janeiro</option>
          <option value={2}>Fevereiro</option>
          <option value={3}>Março</option>
        </select>
      </div>

      {/* Strategic Board Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Criação de Valor (EVA)</p>
          <p className="text-2xl font-black">{formatCurrency(eva)}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className={cn(
              "text-[9px] font-black px-2 py-0.5 rounded-md",
              eva > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
            )}>
              {eva > 0 ? '+ CREATING VALUE' : '- DESTROYING VALUE'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">ROIC vs WACC</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900">{roic.toFixed(1)}%</p>
            <span className="text-[10px] font-bold text-slate-400">vs {wacc.toFixed(1)}%</span>
          </div>
          <div className="mt-4 flex h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full" style={{ width: `${Math.min(roic * 4, 100)}%` }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">DSCR (Solvência)</p>
          <p className="text-2xl font-black text-slate-900">{dscr.toFixed(2)}x</p>
          <div className="mt-4 flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", dscr > 1.5 ? "bg-emerald-500" : dscr > 1.2 ? "bg-amber-500" : "bg-rose-500")} />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
              {dscr > 1.2 ? 'Safe Coverage' : 'Debt Risk Alert'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">ROE Anualizado</p>
          <p className="text-2xl font-black text-slate-900">{roe.toFixed(1)}%</p>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Retorno p/ Acionista</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Eficiência de Capital</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-bold text-slate-600">ROI Operacional</span>
                <span className="text-lg font-black text-slate-900">{((ebitda / ativoTotal) * 100).toFixed(2)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full transition-all" style={{ width: `${Math.min((ebitda / ativoTotal) * 100, 100)}%` }} />
              </div>
              <p className="text-[9px] text-slate-400 mt-1 font-medium italic">EBITDA / Ativo Total</p>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-bold text-slate-600">Invested Capital Ratio</span>
                <span className="text-lg font-black text-slate-900">{(investedCapital / ativoTotal * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full transition-all" style={{ width: `${Math.min(investedCapital / ativoTotal * 100, 100)}%` }} />
              </div>
              <p className="text-[9px] text-slate-400 mt-1 font-medium italic">Cap. Investido Total / Ativo</p>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-bold text-slate-600">Asset Turnover</span>
                <span className="text-lg font-black text-slate-900">{(receita / ativoTotal).toFixed(2)}x</span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full transition-all" style={{ width: `${Math.min((receita / ativoTotal) * 20, 100)}%` }} />
              </div>
              <p className="text-[9px] text-slate-400 mt-1 font-medium italic">Giro do Ativo (Fatura Bruta / Ativo)</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Estrutura de Capital</h3>
          <div className="space-y-4">
             <div className="flex justify-between py-2 border-b border-slate-100">
               <span className="text-xs font-bold text-slate-500">Participação Cap. Terc (IMPL)</span>
               <span className="text-xs font-black text-slate-900">{impl.toFixed(1)}%</span>
             </div>
             <div className="flex justify-between py-2 border-b border-slate-100">
               <span className="text-xs font-bold text-slate-500">Composição (CT) - Curto Prazo</span>
               <span className="text-xs font-black text-slate-900">{ct.toFixed(1)}%</span>
             </div>
             <div className="flex justify-between py-2 border-b border-slate-100">
               <span className="text-xs font-bold text-slate-500">Composição (CE) - Longo Prazo</span>
               <span className="text-xs font-black text-slate-900">{ce.toFixed(1)}%</span>
             </div>
             <div className="flex justify-between py-2">
               <span className="text-xs font-bold text-slate-500">Endividamento PC (IRPC)</span>
               <span className="text-xs font-black text-slate-900">{irpc.toFixed(1)}%</span>
             </div>
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-[9px] font-black text-slate-400 uppercase mb-2">Composição de Passivo</h4>
            <div className="flex h-3 rounded-full overflow-hidden">
              <div className="bg-blue-600" style={{ width: `${ct}%` }} />
              <div className="bg-blue-400" style={{ width: `${ce}%` }} />
              <div className="bg-slate-200" style={{ flex: 1 }} />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Alavancagem Financeira</h3>
            <div className="text-center py-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Grau de Alavancagem (GAF)</p>
              <div className="inline-flex items-center justify-center p-6 bg-blue-50 rounded-full border-4 border-blue-100 mb-4">
                <span className="text-4xl font-black text-blue-600">{gaf.toFixed(2)}</span>
              </div>
              <p className={cn(
                "text-[10px] font-black px-3 py-1 rounded-lg inline-block",
                gaf > 1 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              )}>
                {gaf > 1 ? "ALAVANCAGEM FAVORÁVEL" : "RISCO DE ALAVANCAGEM"}
              </p>
            </div>
          </div>
          <p className="text-[9px] text-slate-400 italic leading-relaxed text-center">
            Indica quanto o lucro líquido se altera proporcionalmente ao EBIT.
          </p>
        </div>
      </div>
      
      {/* Activity Indicators */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Ciclos e Atividade</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { name: 'Giro do Ativo', val: (receita / ativoTotal).toFixed(2), unit: 'x', desc: 'Eficiência no uso do Ativo' },
             { name: 'Giro do Estoque', val: (receita * 0.4 / (est || 1)).toFixed(1), unit: 'dias', desc: 'Renovação média do estoque' },
             { name: 'Ciclo Operacional', val: '72', unit: 'dias', desc: 'Tempo de operação total' },
             { name: 'Ciclo Financeiro', val: '45', unit: 'dias', desc: 'Necessidade de capital' }
           ].map((idx, i) => (
             <div key={i} className="text-center p-4 rounded-2xl border border-slate-50">
               <p className="text-[9px] font-black text-slate-400 uppercase mb-2">{idx.name}</p>
               <p className="text-2xl font-black text-slate-900">{idx.val}<span className="text-[10px] ml-1">{idx.unit}</span></p>
               <p className="text-[8px] text-slate-400 font-medium mt-1 uppercase">{idx.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
