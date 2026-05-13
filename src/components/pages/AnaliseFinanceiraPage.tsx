
import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Activity, 
  Target, 
  ShieldCheck, 
  LayoutDashboard,
  ArrowRight,
  Loader2,
  Calendar,
  ChevronRight,
  Zap,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ArrowRightLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts';

import { cn, formatCurrency } from '../../lib/utils';
import { DATA } from '../../data';
import { FULL_MONTH_LABELS } from '../../constants';
import { useFinancialData } from '../../hooks/useFinancialData';

function Semaphore({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    'Verde': 'bg-emerald-500',
    'Amarelo': 'bg-amber-500',
    'Vermelho': 'bg-rose-500'
  };
  return <div className={cn("w-2 h-2 rounded-full", colorMap[status] || 'bg-emerald-500')} />;
}

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

  // Data Extraction
  const receita = getVal(currentDre, 'Receita Líquida');
  const ebitda = getVal(currentDre, 'EBITDA');
  const lucro = getVal(currentDre, 'Lucro Líquido');
  const ativoTotal = getVal(currentBp, 'Ativo Total');
  const pl = getVal(currentBp, 'Patrimônio Líquido');
  const ac = getVal(currentBp, 'Ativo Circulante');
  const pc = getVal(currentBp, 'Passivo Circulante');
  const pnc = getVal(currentBp, 'Passivo Não Circulante');
  const est = getVal(currentBp, 'Estoques');

  // Logic Calculations
  const roe = pl > 0 ? (lucro / pl) * 100 : 0;
  const investedCapital = pl + pnc;
  const noplat = ebitda * 0.66; 
  const roic = investedCapital > 0 ? (noplat / investedCapital) * 100 : 0;
  
  const costOfEquity = 0.15;
  const costOfDebt = 0.12;
  const wacc = investedCapital > 0 ? ((pl / investedCapital) * costOfEquity + (pnc / investedCapital) * costOfDebt) * 100 : 13.5;
  const eva = (investedCapital * (roic - wacc) / 100);
  const dscr = (pnc > 0) ? (ebitda / (pnc / 12)) : 5;

  const totalThirdParty = pc + pnc;
  const ct = totalThirdParty > 0 ? (pc / totalThirdParty) * 100 : 0;
  const ce = totalThirdParty > 0 ? (pnc / totalThirdParty) * 100 : 0;
  const impl = pl > 0 ? (totalThirdParty / pl) * 100 : 0;
  const irpc = totalThirdParty > 0 ? (pc / totalThirdParty) * 100 : 0;
  const gaf = (pl > 0 && lucro > 0) ? ((ebitda) / (lucro)) : 1;

  const metrics = [
    { label: 'Criação de Valor (EVA)', value: formatCurrency(eva), sem: eva > 0 ? 'Verde' : 'Vermelho', sub: eva > 0 ? '+ Cap. Gerado' : '- Cap. Destruído' },
    { label: 'Retorno ROIC', value: `${roic.toFixed(1)}%`, sem: roic > wacc ? 'Verde' : 'Amarelo', sub: `vs WACC ${wacc.toFixed(1)}%` },
    { label: 'Solvência (DSCR)', value: `${dscr.toFixed(2)}x`, sem: dscr > 1.2 ? 'Verde' : 'Vermelho', sub: dscr > 1.2 ? 'Cobertura Segura' : 'Risco de Liquidez' },
    { label: 'ROE Anualizado', value: `${roe.toFixed(1)}%`, sem: roe > 10 ? 'Verde' : 'Amarelo', sub: 'Retorno Acionista' },
    { label: 'Alavancagem (GAF)', value: `${gaf.toFixed(2)}x`, sem: gaf > 1 ? 'Verde' : 'Amarelo', sub: gaf > 1 ? 'Favorável' : 'Risco' },
  ];

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      {/* Strategic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-secondary" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">Inteligência de Capital</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Análise de eficiência financeira, criação de valor e estrutura de capital.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1">
            <div className="flex items-center px-4 py-2 border-r border-white/10">
              <select 
                value={filterClient} 
                onChange={(e) => setFilterClient(e.target.value)}
                className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer max-w-[150px]"
              >
                {clients.map((c: any) => (
                  <option key={c.id} value={c.id} className="bg-slate-900">{c.fantasia}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2 border-r border-white/10">
              <Calendar size={14} className="text-slate-400 mr-2" />
              <select 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))}
                className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
              >
                <option value={2026} className="bg-slate-900">2026</option>
                <option value={2025} className="bg-slate-900">2025</option>
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={month} 
                onChange={(e) => setMonth(Number(e.target.value))}
                className="text-xs font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
              >
                {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                  <option key={m} value={Number(m)} className="bg-slate-900">{label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(loadingDre || loadingBp) && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl animate-pulse">
              <Loader2 size={14} className="animate-spin text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync...</span>
            </div>
          )}
        </div>
      </div>

      {/* CFO Executive Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="shrink-0">
             <div className="w-20 h-20 rounded-[32px] bg-secondary/10 flex items-center justify-center text-secondary relative">
                <Sparkles size={40} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                </div>
             </div>
          </div>
          <div>
            <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.3em] mb-3">Insight de Capital</h3>
            <p className="executive-note">
              "A estrutura de capital atual apresenta um spread de ROIC/WACC de {(roic - wacc).toFixed(1)}%. Com a criação de valor (EVA) em {formatCurrency(eva)}, a empresa está gerando riqueza real para os acionistas. Recomendamos avaliar a otimização do perfil da dívida para reduzir o custo médio ponderado e ampliar a margem de segurança financeira."
            </p>
          </div>
        </div>
        
        <div className="bg-primary p-8 rounded-[32px] text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all"></div>
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Custo de Capital (WACC)</h3>
            <p className="text-3xl font-display font-black mb-2">{wacc.toFixed(1)}%</p>
            <div className="flex items-center gap-2 text-emerald-400">
               <ShieldCheck size={16} />
               <span className="text-xs font-bold">Estrutura Estável</span>
            </div>
          </div>
          <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Simular Novos Contratos
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        {metrics.map(m => (
          <div key={m.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-elegant group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{m.label}</p>
                <Semaphore status={m.sem} />
              </div>
              <p className="text-2xl font-display font-black tracking-tight text-primary group-hover:text-secondary transition-colors">
                {m.value}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 italic">
                  {m.sub}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Eficiência de Capital */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Eficiência de Capital</h2>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm interactive-card">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Activity size={14} className="text-secondary" /> Retorno sobre Ativos e Capital
            </h3>
            <div className="space-y-8">
              {[
                { label: 'ROI Operacional (EBITDA/Ativo)', val: ((ebitda / ativoTotal) * 100), color: 'bg-blue-600' },
                { label: 'Invested Capital Ratio (Cap/Ativo)', val: (investedCapital / ativoTotal * 100), color: 'bg-emerald-600' },
                { label: 'Asset Turnover (Receita/Ativo)', val: (receita / ativoTotal) * 20, display: `${(receita / ativoTotal).toFixed(2)}x`, color: 'bg-amber-600' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-bold text-slate-600">{item.label}</span>
                    <span className="text-base font-black text-slate-900">{item.display || `${item.val.toFixed(1)}%`}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(item.val, 100)}%` }}
                      className={cn("h-full transition-all duration-1000", item.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Estrutura de Capital */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-sans">Estrutura de Capital</h2>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm interactive-card">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <PieChartIcon size={14} className="text-secondary" /> Composição de Passivos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                {[
                  { label: 'Cap. Terceiros (IMPL)', val: impl },
                  { label: 'Curto Prazo (CT)', val: ct },
                  { label: 'Longo Prazo (CE)', val: ce },
                  { label: 'Endividamento PC', val: irpc }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between py-3 border-b border-slate-50 last:border-0">
                    <span className="text-xs font-bold text-slate-500">{item.label}</span>
                    <span className="text-xs font-black text-slate-900">{item.val.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <div className="relative w-full aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-[12px] border-slate-200" />
                    <div className="absolute w-32 h-32 rounded-full border-[12px] border-blue-600" style={{ clipPath: `inset(0 0 0 ${100-ct}%)` }} />
                    <div className="absolute w-32 h-32 rounded-full border-[12px] border-blue-300" style={{ clipPath: `inset(0 ${100-ce}% 0 0)`, transform: `rotate(${ct * 3.6}deg)` }} />
                  </div>
                  <div className="text-center z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Dívida Total</p>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(totalThirdParty)}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">CP</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-300" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">LP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ciclos e Atividade */}
      <div className="space-y-6 pt-12">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] font-sans">Ciclos e Atividade Operacional</h2>
          <div className="h-px flex-1 bg-slate-100 mx-8"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'Giro do Ativo', val: (receita / ativoTotal).toFixed(2), unit: 'x', icon: ArrowRightLeft, desc: 'Eficiência de Uso' },
            { name: 'Giro Estoque', val: (receita * 0.4 / (est || 1)).toFixed(1), unit: 'dias', icon: LayoutDashboard, desc: 'Renovação Média' },
            { name: 'Ciclo Operacional', val: '72', unit: 'dias', icon: Zap, desc: 'Tempo Total' },
            { name: 'Ciclo Financeiro', val: '45', unit: 'dias', icon: Target, desc: 'Nec. Capital' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-secondary/20 transition-all">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary transition-all mb-4">
                <item.icon size={20} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.name}</p>
              <p className="text-2xl font-display font-black text-primary">
                {item.val}<span className="text-xs ml-1 font-bold text-slate-400 uppercase">{item.unit}</span>
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
