
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
import { useMethodologicalAnalysis } from '../../hooks/useMethodologicalAnalysis';
import { PageHeader, Semaphore } from '../Common';



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

  const curYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: 11 }, (_, i) => curYear - 5 + i);

  const currentDre = dbDre.length > 0 ? dbDre : [];
  const currentBp = dbBp.length > 0 ? dbBp : [];

  const { analysis, loading: loadingAnalysis, error: errorAnalysis, reprocessAnalysis, currentVersion } = useMethodologicalAnalysis(
    filterClient, year, month, currentDre, currentBp
  );

  const [showReprocessed, setShowReprocessed] = useState(false);

  // Seleciona os dados a exibir (original ou reprocessado se o usuário ativou o toggle)
  const displayData = (showReprocessed && analysis?.reprocessed) 
    ? analysis.reprocessed 
    : analysis;

  const metricsObj = displayData?.metrics || {
    receita: 0, ebitda: 0, lucro: 0, ativoTotal: 0, pl: 0, ac: 0, pc: 0, pnc: 0, est: 0,
    roe: 0, investedCapital: 0, noplat: 0, roic: 0, wacc: 0, eva: 0, dscr: 0,
    totalThirdParty: 0, ct: 0, ce: 0, impl: 0, irpc: 0, gaf: 0
  };

  const {
    receita, ebitda, lucro, ativoTotal, pl, ac, pc, pnc, est,
    roe, investedCapital, noplat, roic, wacc, eva, dscr,
    totalThirdParty, ct, ce, impl, irpc, gaf
  } = metricsObj;

  const methodologyUsed = displayData?.methodologyVersion || 'Pendente';
  const hasMethodologyUpdate = analysis && analysis.methodologyVersion !== currentVersion && !analysis.reprocessed;

  const metrics = [
    { label: 'Criação de Valor (EVA)', value: formatCurrency(eva), sem: eva > 0 ? 'Verde' : 'Vermelho', sub: eva > 0 ? '+ Cap. Gerado' : '- Cap. Destruído' },
    { label: 'Retorno ROIC', value: `${roic.toFixed(2)}%`, sem: roic > wacc ? 'Verde' : 'Amarelo', sub: `vs WACC ${wacc.toFixed(2)}%` },
    { label: 'Solvência (DSCR)', value: `${dscr.toFixed(2)}x`, sem: dscr > 1.2 ? 'Verde' : 'Vermelho', sub: dscr > 1.2 ? 'Cobertura Segura' : 'Risco de Liquidez' },
    { label: 'ROE Anualizado', value: `${roe.toFixed(2)}%`, sem: roe > 10 ? 'Verde' : 'Amarelo', sub: 'Retorno Acionista' },
    { label: 'Alavancagem (GAF)', value: `${gaf.toFixed(2)}x`, sem: gaf > 1 ? 'Verde' : 'Amarelo', sub: gaf > 1 ? 'Favorável' : 'Risco' },
  ] as const;

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <PageHeader 
        title="Inteligência de Capital" 
        subtitle="Análise de eficiência financeira, criação de valor e estrutura de capital estratégica."
        icon={TrendingUp}
        color="bg-slate-900"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            <div className="flex items-center px-4 py-2 border-r border-slate-100">
              <select 
                value={filterClient} 
                onChange={(e) => setFilterClient(e.target.value)}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors max-w-[150px]"
              >
                {clients.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.fantasia}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2 border-r border-slate-100">
              <Calendar size={14} className="text-slate-400 mr-2.5" />
              <select 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {yearsArray.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={month} 
                onChange={(e) => setMonth(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                  <option key={m} value={Number(m)}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl shadow-sm">
            <ShieldCheck size={14} className={analysis?.reprocessed ? "text-blue-500" : "text-emerald-500"} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Análise processada com: <span className="text-slate-800">{methodologyUsed}</span>
            </span>
          </div>

          {analysis?.reprocessed && (
            <button 
              onClick={() => setShowReprocessed(!showReprocessed)}
              className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border", showReprocessed ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              {showReprocessed ? "Ver Original" : "Ver Reprocessada"}
            </button>
          )}

          {hasMethodologyUpdate && (
             <button 
               onClick={reprocessAnalysis}
               className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-xl shadow-sm transition-all"
             >
               <Activity size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">Reprocessar ({currentVersion})</span>
             </button>
          )}

          {(loadingDre || loadingBp || loadingAnalysis) && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm animate-pulse">
              <Loader2 size={14} className="animate-spin text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sincronizando...</span>
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
              {eva !== 0 ? (
                `"A estrutura de capital atual apresenta um spread de ROIC/WACC de ${(roic - wacc).toFixed(2)}%. Com a criação de valor (EVA) em ${formatCurrency(eva)}, a empresa está gerando riqueza real para os acionistas. Recomendamos avaliar a otimização do perfil da dívida para reduzir o custo médio ponderado e ampliar a margem de segurança financeira."`
              ) : (
                "Aguardando dados financeiros consolidados para análise de spread ROIC/WACC e geração de valor econômico (EVA). A análise estratégica será habilitada após a primeira importação de balanço e DRE."
              )}
            </p>
          </div>
        </div>
        
        <div className="bg-primary p-8 rounded-[32px] text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all"></div>
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Custo de Capital (WACC)</h3>
            <p className="text-3xl font-display font-black mb-2">{wacc.toFixed(2)}%</p>
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
                <Semaphore status={m.sem as 'Verde' | 'Amarelo' | 'Vermelho'} />
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
                    <span className="text-base font-black text-slate-900">{item.display || `${item.val.toFixed(2)}%`}</span>
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
                    <span className="text-xs font-black text-slate-900">{item.val.toFixed(2)}%</span>
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
            { name: 'Giro Estoque', val: (receita * 0.4 / (est || 1)).toFixed(2), unit: 'dias', icon: LayoutDashboard, desc: 'Renovação Média' },
            { name: 'Ciclo Operacional', val: currentDre.length > 0 ? '72' : '—', unit: 'dias', icon: Zap, desc: 'Tempo Total' },
            { name: 'Ciclo Financeiro', val: currentDre.length > 0 ? '45' : '—', unit: 'dias', icon: Target, desc: 'Nec. Capital' }
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
