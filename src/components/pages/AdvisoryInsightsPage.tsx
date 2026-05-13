
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Zap, 
  MessageSquare, 
  Loader2, 
  Save, 
  Rocket, 
  Target,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  Presentation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../Common';
import { cn, formatCurrency } from '../../lib/utils';
import { DATA } from '../../data';
import { SECTOR_BENCHMARKS, BENCHMARK_SOURCES } from '../../data/benchmarks';
import { useFinancialData } from '../../hooks/useFinancialData';
import { detectPatterns, calculateIllumineScore, FinancialPattern } from '../../lib/financialIntelligence';
import { generateAdvisoryParecer } from '../../services/advisoryAiService';
import { generateSacerdotalParecer } from '../../services/sacerdotalAiService';

function SectionHeader({ icon: Icon, title, subtitle, tone }: any) {
  const tones: any = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };
  
  return (
    <div className="flex items-center gap-5">
      <div className={cn("p-4 rounded-2xl border", tones[tone])}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight leading-none mb-1">{title}</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{subtitle}</p>
      </div>
    </div>
  );
}

function MatrixQuadrant({ title, list, color }: { title: string, list: string[], color: string }) {
  return (
    <div className="space-y-4">
      <h5 className={cn(
        "text-[10px] font-black uppercase tracking-widest mb-4 pb-2 border-b-2",
        color === 'emerald' ? "text-emerald-600 border-emerald-600" :
        color === 'blue' ? "text-blue-600 border-blue-600" :
        color === 'indigo' ? "text-indigo-600 border-indigo-600" : "text-slate-600 border-slate-600"
      )}>{title}</h5>
      <ul className="space-y-3">
        {list.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
            <div className={cn("w-1.5 h-1.5 rounded-full", color === 'emerald' ? "bg-emerald-500" : color === 'blue' ? "bg-blue-500" : "bg-indigo-500")} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdvisoryInsightsPage({ clients, selectedClient, selectedYear, selectedMonth }: any) {
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiParecer, setAiParecer] = useState('');
  const [activeTab, setActiveTab] = useState<'cfo' | 'sacerdotal'>('cfo');
  const [sacerdotalParecer, setSacerdotalParecer] = useState('');
  const [loadingSacerdotal, setLoadingSacerdotal] = useState(false);

  const month = selectedMonth || 3;
  const year = selectedYear || 2026;

  const { dbData: dbDre } = useFinancialData(selectedClient, year, month, 'DRE');
  const { dbData: dbBp } = useFinancialData(selectedClient, year, month, 'BP');

  const mockDre = DATA.dre.filter(d => (d as any).id === selectedClient && (d as any).mes === month && (d as any).ano === year);
  const mockBp = DATA.bp.filter(b => (b as any).id === selectedClient && (b as any).mes === month && (b as any).ano === year);

  const currentDre = dbDre.length > 0 ? dbDre : mockDre.map(d => ({ category: d.conta, value: d.valor }));
  const currentBp = dbBp.length > 0 ? dbBp : mockBp.map(b => ({ category: b.conta, value: b.val }));

  const getVal = (data: any[], name: string) => data.find(d => d.category === name)?.value || 0;

  const revenue = getVal(currentDre, 'Receita Líquida') || getVal(currentDre, 'Receita Operacional Bruta');
  let ebitda = getVal(currentDre, 'EBITDA');
  if (ebitda === 0) {
    const ebit = getVal(currentDre, 'Lucro Operacional (EBIT)');
    const da = Math.abs(getVal(currentDre, 'Depreciação e Amortização'));
    ebitda = ebit + da;
  }
  const netProfit = getVal(currentDre, 'Lucro Líquido') || getVal(currentDre, 'Lucro Líquido do Exercício');
  const cashFlowOp = getVal(currentDre, 'Fluxo de Caixa Operacional') || (ebitda * 0.7); 
  const ncg = getVal(currentBp, 'Ativo Circulante Operacional') - getVal(currentBp, 'Passivo Circulante Operacional') || (revenue * 0.2);
  const debt = getVal(currentBp, 'Passivo Não Circulante') + getVal(currentBp, 'Empréstimos e Financiamentos');
  
  const dimensions = useMemo(() => {
    const d = {
      liquidity: Math.min(100, (getVal(currentBp, 'Ativo Circulante') / (getVal(currentBp, 'Passivo Circulante') || 1)) * 50),
      profitability: Math.min(100, (netProfit / (revenue || 1)) * 400),
      capitalStructure: Math.min(100, 100 - (debt / (getVal(currentBp, 'Ativo Total') || 1)) * 100),
      efficiency: Math.min(100, (ebitda / (revenue || 1)) * 300),
      valueCreation: Math.min(100, (netProfit / (getVal(currentBp, 'Patrimônio Líquido') || 1)) * 500)
    };
    return {
      liquidity: isNaN(d.liquidity) ? 0 : d.liquidity,
      profitability: isNaN(d.profitability) ? 0 : d.profitability,
      capitalStructure: isNaN(d.capitalStructure) ? 0 : d.capitalStructure,
      efficiency: isNaN(d.efficiency) ? 0 : d.efficiency,
      valueCreation: isNaN(d.valueCreation) ? 0 : d.valueCreation,
    };
  }, [currentBp, revenue, netProfit, ebitda, debt]);

  const healthScore = useMemo(() => {
    const score = Math.round(calculateIllumineScore(dimensions));
    return isNaN(score) ? 0 : score;
  }, [dimensions]);

  const patterns = useMemo(() => detectPatterns({
    receita: revenue,
    ebitda,
    lucro: netProfit,
    fluxoOperacional: cashFlowOp,
    ncg,
    prazoMedioRecebimento: 45,
    prazoMedioPagamento: 30,
    caixa: getVal(currentBp, 'Caixa e Equivalentes'),
    endividamentoTotal: debt
  }), [revenue, ebitda, netProfit, cashFlowOp, ncg, currentBp, debt]);

  const client = clients.find((c: any) => c.id === selectedClient);
  const sector = client?.segmento || 'Serviços';
  const benchmarks = SECTOR_BENCHMARKS[sector] || SECTOR_BENCHMARKS['Serviços'];

  const clientMetrics = useMemo(() => {
    const ebitdaMargin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
    const currentLiquidity = getVal(currentBp, 'Passivo Circulante') > 0 ? getVal(currentBp, 'Ativo Circulante') / getVal(currentBp, 'Passivo Circulante') : 0;
    const leverage = ebitda > 0 ? debt / ebitda : 0;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    
    return {
      ebitdaMargin: isNaN(ebitdaMargin) ? 0 : ebitdaMargin,
      currentLiquidity: isNaN(currentLiquidity) ? 0 : currentLiquidity,
      leverage: isNaN(leverage) ? 0 : leverage,
      netMargin: isNaN(netMargin) ? 0 : netMargin,
    };
  }, [revenue, ebitda, netProfit, currentBp, debt]);

  const handleGenerateAi = async () => {
    setLoadingAi(true);
    const client = clients.find((c: any) => c.id === selectedClient);
    const result = await generateAdvisoryParecer({
      clientName: client?.fantasia || 'Cliente',
      industry: client?.segmento || 'Estratégico',
      month: String(month),
      year,
      metrics: {
        'Receita Líquida': revenue,
        'EBITDA': ebitda,
        'Lucro Líquido': netProfit,
        'Health Score': healthScore
      },
      patterns
    });
    setAiParecer(result);
    setLoadingAi(false);
  };

  const handleGenerateSacerdotal = async () => {
    setLoadingSacerdotal(true);
    const client = clients.find((c: any) => c.id === selectedClient);
    const result = await generateSacerdotalParecer({
      clientName: client?.fantasia || 'Cliente',
      industry: client?.segmento || 'Estratégico',
      metrics: {
        'Receita Líquida': revenue,
        'EBITDA': ebitda,
        'Lucro Líquido': netProfit,
        'Health Score': healthScore
      },
      topPrinciples: []
    });
    setSacerdotalParecer(result);
    setLoadingSacerdotal(false);
  };

  return (
    <div className="space-y-12 pb-32 animate-executive-fade">
      {/* Hero Section with Integrated Score */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex-1 overflow-hidden min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
              <Presentation size={20} className="text-secondary" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight truncate">Conselho Estrategico CFO</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium truncate">Inteligência integrada para análise da geração de valor.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <SectionHeader 
              icon={Activity} 
              title="Diagnóstico de Performance" 
              subtitle="Alertas proativos baseados em padrões de consultoria estratégica" 
              tone="blue"
            />
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
               <span className="px-4 py-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Real-Time Audit</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {patterns.length > 0 ? (
                patterns.map((pattern, idx) => (
                  <motion.div 
                    key={pattern.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "bg-white rounded-[32px] border p-8 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden",
                      pattern.severity === 'critical' ? "border-rose-100 hover:border-rose-200" : "border-amber-100 hover:border-amber-200"
                    )}
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                      <AlertTriangle size={120} />
                    </div>

                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                          pattern.severity === 'critical' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                        )}>
                          <AlertTriangle size={24} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-900 tracking-tight">{pattern.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full animate-pulse",
                              pattern.severity === 'critical' ? "bg-rose-500" : "bg-amber-500"
                            )} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pattern.severity} severity</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Análise de Padrão</p>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{pattern.description}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risco Estratégico</p>
                        <p className="text-sm text-slate-900 font-black italic">"{pattern.impact}"</p>
                      </div>
                    </div>

                    <div className={cn(
                      "mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10",
                    )}>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                          <Zap size={12} className="fill-blue-600" /> Executive Action Plan
                        </p>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{pattern.recommendation}</p>
                      </div>
                      <button className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-colors whitespace-nowrap shadow-lg shadow-slate-900/10">
                        IMPLEMENTAR SOLUÇÃO
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-emerald-50/30 rounded-[40px] border border-emerald-100 p-20 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                  <Sparkles size={64} className="mx-auto mb-6 text-emerald-500/40 group-hover:scale-110 transition-transform duration-700" />
                  <h4 className="text-xl font-black text-emerald-900 mb-2">Equilíbrio Estrutural Detectado</h4>
                  <p className="text-emerald-700/60 font-medium max-w-sm mx-auto">Sua operação não apresenta riscos críticos de padrão financeiro neste período.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
          {/* Premium Score Display - Moved from Header */}
          <div className="bg-slate-900 p-8 rounded-[32px] text-white border border-white/5 shadow-2xl flex flex-col gap-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Illumine Health Score</span>
              <ShieldCheck size={18} className="text-blue-400" />
            </div>

            <div className="flex items-end gap-3 relative z-10">
              <h2 className="text-7xl font-display font-black tracking-tighter leading-none">
                {isNaN(healthScore) ? 0 : healthScore}
              </h2>
              <span className="text-lg font-bold text-slate-500 mb-2">/ 100</span>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className={cn(
                    "h-full rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]",
                    healthScore > 80 ? "bg-emerald-400" : healthScore > 60 ? "bg-blue-400" : "bg-rose-400"
                  )} 
                />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex justify-between">
                <span>{healthScore > 80 ? 'Status: Elite' : healthScore > 60 ? 'Status: Estável' : 'Status: Alerta'}</span>
                <span className="text-blue-400">{healthScore}% Performance</span>
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-2 rounded-[24px] border border-slate-200 shadow-sm flex items-center sticky top-8 z-30">
            <button
              onClick={() => setActiveTab('cfo')}
              className={cn(
                "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                activeTab === 'cfo' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Parecer CFO
            </button>
            <button
              onClick={() => setActiveTab('sacerdotal')}
              className={cn(
                "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                activeTab === 'sacerdotal' ? "bg-amber-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              )}
            >
              Sacerdotal
            </button>
          </div>
          
          <div className="sticky top-28 space-y-8">
            {activeTab === 'cfo' ? (
              <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl min-h-[580px] flex flex-col border border-white/5">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={160} /></div>
                
                <div className="flex-1 overflow-y-auto mb-8 bg-white/5 border border-white/10 rounded-[32px] p-8 custom-scrollbar">
                  {loadingAi ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-6">
                      <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Consulting AI...</p>
                    </div>
                  ) : aiParecer ? (
                    <div className="text-sm leading-relaxed font-medium text-slate-300 whitespace-pre-wrap advisory-ai-content italic opacity-90">
                      {aiParecer}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-6 text-center">
                      <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
                        <Activity size={32} strokeWidth={1} className="text-blue-400/50" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-[200px] leading-loose">
                        Solicite uma análise sintética da saúde financeira via Gemini Intelligence.
                      </p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleGenerateAi}
                  disabled={loadingAi}
                  className={cn(
                    "w-full py-5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group",
                    loadingAi ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20"
                  )}
                >
                  {loadingAi ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="group-hover:scale-125 transition-transform" />}
                  {loadingAi ? 'PROCESSANDO...' : 'GERAR PARECER CFO'}
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl min-h-[580px] flex flex-col border border-white/10">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-white"><BookOpen size={160} /></div>
                
                <div className="flex-1 overflow-y-auto mb-8 bg-black/10 border border-white/10 rounded-[32px] p-8 custom-scrollbar">
                  {loadingSacerdotal ? (
                    <div className="h-full flex flex-col items-center justify-center text-white gap-6">
                      <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Sacerdotal Vision...</p>
                    </div>
                  ) : sacerdotalParecer ? (
                    <div className="text-sm leading-relaxed font-medium text-white/90 whitespace-pre-wrap italic">
                      {sacerdotalParecer}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-white/40 gap-6 text-center">
                      <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center">
                        <BookOpen size={32} strokeWidth={1} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-[200px] leading-loose">
                        Busque uma perspectiva de alinhamento com os princípios de uma gestão sacerdotal.
                      </p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleGenerateSacerdotal}
                  disabled={loadingSacerdotal}
                  className={cn(
                    "w-full py-5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group",
                    loadingSacerdotal ? "bg-white/10 text-white/50 cursor-not-allowed" : "bg-white text-amber-900 hover:bg-amber-50 shadow-xl"
                  )}
                >
                  {loadingSacerdotal ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16} className="group-hover:rotate-12 transition-transform" />}
                  {loadingSacerdotal ? 'ANALISANDO...' : 'GERAR LEITURA SACERDOTAL'}
                </button>
              </div>
            )}

            {/* Benchmarks Section Refined */}
            <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                 <TrendingUp size={120} />
               </div>
               
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Setor: {sector}</h4>
               
               <div className="space-y-10">
                  {[
                    { label: 'Margem EBITDA', value: clientMetrics.ebitdaMargin, benchmark: benchmarks.ebitdaMargin, inverse: false },
                    { label: 'Liquidez Corrente', value: clientMetrics.currentLiquidity, benchmark: benchmarks.currentLiquidity, inverse: false },
                    { label: 'Alavancagem', value: clientMetrics.leverage, benchmark: benchmarks.leverage, inverse: true },
                    { label: 'Margem Líquida', value: clientMetrics.netMargin, benchmark: benchmarks.netMargin, inverse: false },
                  ].map((item, i) => {
                    const { min, median, top, unit } = item.benchmark;
                    const range = top - min || 1;
                    const pos = Math.max(0, Math.min(100, ((item.value - min) / range) * 100));
                    const medianPos = Math.max(0, Math.min(100, ((median - min) / range) * 100));
                    
                    return (
                      <div key={i} className="space-y-4">
                        <div className="flex justify-between items-baseline">
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{item.label}</p>
                          <div className="flex items-center gap-2">
                             <span className={cn(
                               "text-xs font-black",
                               item.inverse 
                                ? (item.value <= median ? "text-emerald-600" : "text-rose-600")
                                : (item.value >= median ? "text-emerald-600" : "text-rose-600")
                             )}>{item.value.toFixed(1)}{unit}</span>
                          </div>
                        </div>
                        
                        <div className="relative h-1.5 bg-slate-100 rounded-full">
                          <div className="absolute inset-0 bg-slate-200 opacity-20 rounded-full" />
                          <div 
                            className="absolute top-0 bottom-0 left-0 border-r border-slate-900/20 h-full z-10" 
                            style={{ left: `${medianPos}%` }} 
                          />
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pos}%` }}
                            className={cn(
                              "absolute h-full rounded-full transition-colors duration-1000",
                              item.inverse 
                                ? (item.value <= median ? "bg-emerald-500" : "bg-rose-500")
                                : (item.value >= median ? "bg-emerald-500" : "bg-rose-500")
                            )}
                          />
                        </div>
                        <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                          <span>Min {min}</span>
                          <span className="text-slate-900">Med {median}</span>
                          <span>Top {top}</span>
                        </div>
                      </div>
                    );
                  })}
               </div>
               
               <div className="mt-12 pt-6 border-t border-slate-100">
                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Fontes de Auditoria</p>
                 <div className="flex flex-wrap gap-x-4 gap-y-2">
                   {BENCHMARK_SOURCES.slice(0, 3).map((source, idx) => (
                     <span key={idx} className="text-[9px] font-bold text-slate-400 flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                       <ShieldCheck size={10} className="text-blue-500" /> {source.name}
                     </span>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Board Refactored */}
      <div className="bg-white rounded-[60px] border border-slate-200 p-12 md:p-20 overflow-hidden relative shadow-sm">
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <SectionHeader 
            icon={Target} 
            title="Matriz de Priorização Estratégica" 
            subtitle="Focos de atuação baseados no cruzamento de dados e impacto financeiro" 
            tone="blue"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-20">
            <MatrixQuadrant 
              title="Quick Wins" 
              list={patterns.some(p => p.id === 'scissor_effect') ? ['Revisão PMP Fornecedores', 'Taxas Bank Fees'] : ['Estímulo Antecipação', 'Venda Ativos Ociosos']} 
              color="emerald" 
            />
            <MatrixQuadrant 
              title="Must Do" 
              list={patterns.length > 0 ? ['Ajuste Estrutura Capital', 'Corte Gastos Variáveis'] : ['Expansão Comercial', 'Sales Optimization']} 
              color="blue" 
            />
            <MatrixQuadrant 
              title="Strategic" 
              list={['Governança Familiar', 'Preparação para M&A', 'Equity Valuation']} 
              color="indigo" 
            />
            <MatrixQuadrant 
              title="Low Priority" 
              list={['Site Institucional', 'Troca de Mobiliário', 'Branding Local']} 
              color="slate" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
