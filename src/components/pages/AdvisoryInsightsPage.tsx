
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
  BookOpen
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
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader 
          title="Conselho de Estratégia CFO" 
          description="Inteligência integrada para gestão de valor e governança corporativa." 
        />
        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl flex items-center gap-8 min-w-[320px] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={80} /></div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Illumine Health Score</p>
             <div className="flex items-baseline gap-2">
               <h2 className="text-5xl font-black">{isNaN(healthScore) ? 0 : healthScore}</h2>
               <span className="text-xs font-bold text-slate-400">/ 100</span>
             </div>
           </div>
           <div className="flex-1">
             <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${healthScore}%` }}
                 className={cn(
                   "h-full rounded-full",
                   healthScore > 80 ? "bg-emerald-500" : healthScore > 60 ? "bg-blue-500" : "bg-rose-500"
                 )} 
               />
             </div>
             <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest leading-tight">
               {healthScore > 80 ? 'Saúde Financeira de Elite' : healthScore > 60 ? 'Operação em Equilíbrio' : 'Atenção: Risco Estrutural'}
             </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Diagnostic Panel */}
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader 
            icon={Activity} 
            title="Diagnóstico de Performance" 
            subtitle="Alertas proativos baseados em padrões de consultoria estratégica" 
            tone="blue"
          />
          
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {patterns.length > 0 ? (
                patterns.map((pattern, idx) => (
                  <motion.div 
                    key={pattern.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "bg-white rounded-3xl border p-8 shadow-sm group relative overflow-hidden",
                      pattern.severity === 'critical' ? "border-rose-200 bg-rose-50/10" : "border-amber-200 bg-amber-50/10"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-xl",
                          pattern.severity === 'critical' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                        )}>
                          <AlertTriangle size={20} />
                        </div>
                        <h4 className="text-lg font-black text-slate-900">{pattern.name}</h4>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                        pattern.severity === 'critical' ? "bg-rose-600 text-white" : "bg-amber-600 text-white"
                      )}>
                        {pattern.severity}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Identificação</p>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed">{pattern.description}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Impacto Estratégico</p>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed italic">"{pattern.impact}"</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Zap size={12} /> Solução Recomendada
                      </p>
                      <p className="text-sm font-bold text-slate-900">{pattern.recommendation}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-12 text-center text-emerald-900">
                  <Sparkles size={48} className="mx-auto mb-4 opacity-40" />
                  <p className="font-bold">Nenhum risco estrutural detectado neste período.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('cfo')}
              className={cn("px-4 py-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all", activeTab === 'cfo' ? "border-blue-500 text-blue-700" : "border-transparent text-slate-400 hover:text-slate-600")}
            >
              Parecer CFO (IA)
            </button>
            <button
              onClick={() => setActiveTab('sacerdotal')}
              className={cn("px-4 py-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all", activeTab === 'sacerdotal' ? "border-amber-500 text-amber-700" : "border-transparent text-slate-400 hover:text-slate-600")}
            >
              Perspectiva Sacerdotal
            </button>
          </div>
          
          {activeTab === 'cfo' ? (
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={120} />
            </div>
            
            <div className="flex-1 overflow-y-auto mb-6 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              {loadingAi ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                  <Loader2 size={32} className="animate-spin text-blue-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Analisando KPIs...</p>
                </div>
              ) : aiParecer ? (
                <div className="text-xs leading-relaxed font-medium text-slate-200 whitespace-pre-wrap advisory-ai-content">
                  {aiParecer}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 text-center">
                  <Activity size={32} strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-widest max-w-[200px]">Clique abaixo para gerar a análise síntetica via Gemini.</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleGenerateAi}
              disabled={loadingAi}
              className={cn(
                "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                loadingAi ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-900/20"
              )}
            >
              <Sparkles size={16} />
              {loadingAi ? 'Processando Intelligence...' : 'Gerar Parecer via IA'}
            </button>
          </div>
          ) : (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 text-amber-900 relative overflow-hidden shadow-sm border border-amber-100 min-h-[500px] flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-600">
              <BookOpen size={120} />
            </div>
            
            <div className="flex-1 overflow-y-auto mb-6 bg-white/60 border border-amber-100 rounded-2xl p-6 relative z-10">
              {loadingSacerdotal ? (
                <div className="h-full flex flex-col items-center justify-center text-amber-600 gap-4">
                  <Loader2 size={32} className="animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Analisando alinhamento...</p>
                </div>
              ) : sacerdotalParecer ? (
                <div className="text-xs leading-relaxed font-medium text-amber-900 whitespace-pre-wrap">
                  {sacerdotalParecer}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-amber-700/50 gap-4 text-center">
                  <BookOpen size={32} strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-widest max-w-[200px]">Clique abaixo para gerar a leitura sacerdotal via IA.</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleGenerateSacerdotal}
              disabled={loadingSacerdotal}
              className={cn(
                "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 relative z-10",
                loadingSacerdotal ? "bg-amber-200 text-amber-600 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700 text-white shadow-xl shadow-amber-900/20"
              )}
            >
              <BookOpen size={16} />
              {loadingSacerdotal ? 'Processando Leitura...' : 'Gerar Perspectiva Sacerdotal'}
            </button>
          </div>
          )}

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Benchmarks do Setor ({sector})</h4>
             <div className="space-y-8">
                {[
                  { label: 'Margem EBITDA', value: clientMetrics.ebitdaMargin, benchmark: benchmarks.ebitdaMargin, inverse: false },
                  { label: 'Liquidez Corrente', value: clientMetrics.currentLiquidity, benchmark: benchmarks.currentLiquidity, inverse: false },
                  { label: 'Alavancagem (Dív./EBITDA)', value: clientMetrics.leverage, benchmark: benchmarks.leverage, inverse: true },
                  { label: 'Margem Líquida', value: clientMetrics.netMargin, benchmark: benchmarks.netMargin, inverse: false },
                ].map((item, i) => {
                  const { min, median, top, unit } = item.benchmark;
                  // Calculate position (0 to 100)
                  // For a simple visualization, we use min as start (0%) and top as end (100%) or some range
                  const range = top - min;
                  const safeRange = range === 0 ? 1 : range;
                  let rawPos = ((item.value - min) / safeRange) * 100;
                  if (isNaN(rawPos)) rawPos = 50;
                  const pos = Math.max(0, Math.min(100, rawPos));
                  
                  let rawMedianPos = ((median - min) / safeRange) * 100;
                  if (isNaN(rawMedianPos)) rawMedianPos = 50;
                  const medianPos = Math.max(0, Math.min(100, rawMedianPos));
                  
                  return (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">{item.label}</p>
                        <p className="text-xs font-black text-slate-900">{isNaN(item.value) ? '0.0' : item.value.toFixed(1)}{item.benchmark.unit}</p>
                      </div>
                      
                      <div className="relative h-2 bg-slate-100 rounded-full">
                        {/* Sector Range (Min to Top) */}
                        <div className="absolute top-0 bottom-0 left-0 right-0 rounded-full bg-slate-200 opacity-20" />
                        
                        {/* Colored Regions based on Median */}
                        <div 
                          className={cn(
                            "absolute top-0 bottom-0 left-0 rounded-l-full",
                            item.inverse ? "bg-emerald-500/20" : "bg-rose-500/20"
                          )} 
                          style={{ width: `${medianPos}%` }} 
                        />
                        
                        {/* Benchmarks Markers */}
                        <div className="absolute top-0 bottom-0 left-0 border-r-2 border-slate-300 h-full" style={{ left: '0%' }}>
                          <span className="absolute -top-4 -translate-x-1/2 text-[8px] font-bold text-slate-400">Min {min}</span>
                        </div>
                        <div className="absolute top-0 bottom-0 border-r-2 border-slate-900 h-full z-10" style={{ left: `${medianPos}%` }}>
                          <span className="absolute -bottom-4 -translate-x-1/2 text-[8px] font-black text-slate-900">Med {median}</span>
                        </div>
                        <div className="absolute top-0 bottom-0 border-r-2 border-emerald-500 h-full" style={{ left: '100%' }}>
                          <span className="absolute -top-4 -translate-x-1/2 text-[8px] font-bold text-emerald-600">Top {top}</span>
                        </div>

                        {/* Client Position */}
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, left: `${pos}%` }}
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-xl z-20",
                            item.inverse 
                              ? (item.value <= median ? "bg-emerald-500" : "bg-rose-500")
                              : (item.value >= median ? "bg-emerald-500" : "bg-rose-500")
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
             </div>
             
             <div className="mt-10 pt-6 border-t border-slate-100">
               <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Fontes de Dados Consolidadas</p>
               <div className="flex flex-wrap gap-x-4 gap-y-2">
                 {BENCHMARK_SOURCES.map((source, idx) => (
                   <span key={idx} className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                     <ShieldCheck size={10} className="text-blue-400" /> {source.name}
                   </span>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Strategic Matrix */}
      <div className="bg-white rounded-[40px] border border-slate-200 p-10 overflow-hidden relative">
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="relative">
          <SectionHeader 
            icon={Target} 
            title="Matriz de Priorização Estratégica" 
            subtitle="Focos de atuação para o próximo trimestre basedo em impacto financeiro" 
            tone="blue"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
            <MatrixQuadrant 
              title="Quick Wins" 
              list={patterns.some(p => p.id === 'scissor_effect') ? ['Revisão PMP fornecedores', 'Redução taxas bank fees'] : ['Estímulo antecipação', 'Venda ativos ociosos']} 
              color="emerald" 
            />
            <MatrixQuadrant 
              title="Must Do" 
              list={patterns.length > 0 ? ['Ajuste Estrutura Capital', 'Corte Gastos Variantes'] : ['Expansão Comercial', 'Treinamento Vendas']} 
              color="blue" 
            />
            <MatrixQuadrant 
              title="Strategic" 
              list={['Governança Familiar', 'Preparação para M&A']} 
              color="indigo" 
            />
            <MatrixQuadrant 
              title="Low Priority" 
              list={['Troca mobiliário', 'Novo site institucional']} 
              color="slate" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
