import React, { useMemo, useState } from 'react';
import { 
  ShieldCheck, TrendingUp, Users, Activity, Globe, ShoppingBag, 
  FileText, Zap, BarChart3, Target, ArrowUpRight, LayoutGrid, 
  BookOpen, Percent, Lightbulb, Loader2, LayoutDashboard, ShieldAlert
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Page } from '../../app/navigation';
import { motion } from 'motion/react';
import { PageHeader, StatusBadge, MarkdownText } from '../Common';
import { formatValue, formatCurrency, cn } from '../../lib/utils';
import { EixoGestao } from '../../types/modules';
import { GOVERNANCE_PRINCIPLES, evaluateAxisRules } from '../../lib/governanceIntelligence';
import { GovernanceInsightPanel } from '../GovernanceInsightPanel';
import { generateGovernanceParecer } from '../../services/governanceAiService';

interface AxisDashboardPageProps {
  axis: EixoGestao;
  clientId: string;
  onNavigate?: (page: Page) => void;
  selectedMonth?: number;
  setSelectedMonth?: (month: number) => void;
  selectedYear?: number;
  setSelectedYear?: (year: number) => void;
}

const AXIS_CONFIG_METADATA: Record<string, any> = {
  'Governança Corporativa': {
    title: 'Dashboard',
    subtitle: 'Monitoramento estratégico de performance e maturidade corporativa.',
    icon: ShieldCheck,
    color: 'bg-slate-900',
    kpiDefinitions: [
      { label: 'Índice de Maturidade', ind: 'Maturidade de Governança', suffix: '%', icon: ShieldCheck },
      { label: 'Reuniões de Conselho', ind: 'Reuniões de Conselho', suffix: '', icon: Users },
      { label: 'Compliance Index', ind: 'Compliance Index', suffix: '%', icon: FileText },
      { label: 'Riscos Mitigados', ind: 'Riscos Mitigados', suffix: '', icon: Target },
      { label: 'Transparência Corporativa', ind: 'Índice de Transparência', suffix: '%', icon: Globe },
      { label: 'Eficácia Decisória', ind: 'Eficácia Decisória', suffix: '%', icon: Zap },
    ]
  },
  'Cultura Organizacional': {
    title: 'Dashboard',
    subtitle: 'Monitoramento de clima organizacional e desenvolvimento humano.',
    icon: Users,
    color: 'bg-purple-900',
    kpiDefinitions: [
      { label: 'eNPS (Clima)', ind: 'eNPS', suffix: '', icon: TrendingUp },
      { label: 'Turnover', ind: 'Turnover', suffix: '%', icon: Activity },
      { label: 'Horas de Treinamento', ind: 'Horas de Treinamento', suffix: 'h', icon: BookOpen },
      { label: 'Taxa de Retenção', ind: 'Taxa de Retenção', suffix: '%', icon: Users },
      { label: 'Absenteísmo', ind: 'Absenteísmo', suffix: '%', icon: ShieldAlert },
      { label: 'Promoção Interna', ind: 'Taxa de Promoção Interna', suffix: '%', icon: Target },
    ]
  },
  'Gestão de Inovação': {
    title: 'Dashboard',
    subtitle: 'Gestão de portfólio de projetos, projetos de inovação e P&D.',
    icon: Lightbulb,
    color: 'bg-cyan-900',
    kpiDefinitions: [
      { label: 'Índice de Inovação', ind: 'Índice de Inovação', suffix: '%', icon: Lightbulb },
      { label: 'Projetos P&D Ativos', ind: 'Projetos P&D Ativos', suffix: '', icon: Activity },
      { label: 'Investimento em P&D', ind: 'Investimento em P&D', isCur: true, icon: Zap },
      { label: 'Tempo até MVP', ind: 'Tempo até MVP', suffix: ' dias', icon: Target },
      { label: 'Receita de Novos Prod.', ind: 'Receita Novos Produtos', suffix: '%', icon: TrendingUp },
      { label: 'Time-to-Market', ind: 'Time-to-Market', suffix: ' dias', icon: Activity },
    ]
  },
  'Gestão de Marketing': {
    title: 'Dashboard',
    subtitle: 'Performance de comunicação, branding e geração de leads.',
    icon: Globe,
    color: 'bg-blue-900',
    kpiDefinitions: [
      { label: 'Brand Awareness', ind: 'Brand Awareness', suffix: '%', icon: Globe },
      { label: 'Custo por Lead (CPL)', ind: 'CPL', isCur: true, icon: Users },
      { label: 'Leads Gerados (MQL)', ind: 'Leads Gerados', suffix: '', icon: Activity },
      { label: 'ROI de Marketing', ind: 'ROI de Marketing', suffix: 'x', icon: TrendingUp },
      { label: 'LTV / CAC Marketing', ind: 'LTV CAC Marketing', suffix: 'x', icon: BarChart3 },
      { label: 'Share of Voice', ind: 'Share of Voice', suffix: '%', icon: Globe },
    ]
  },
  'Gestão Comercial': {
    title: 'Dashboard',
    subtitle: 'Monitoramento de pipeline, conversão e receitas.',
    icon: ShoppingBag,
    color: 'bg-emerald-900',
    kpiDefinitions: [
      { label: 'Receita Recorrente (MRR)', ind: 'MRR', isCur: true, icon: Target },
      { label: 'Taxa de Conversão', ind: 'Taxa de Conversão', suffix: '%', icon: Percent },
      { label: 'Ticket Médio', ind: 'Ticket Médio', isCur: true, icon: ShoppingBag },
      { label: 'CAC Comercial', ind: 'CAC', isCur: true, icon: BarChart3 },
      { label: 'Churn Rate', ind: 'Churn Rate', suffix: '%', icon: ShieldAlert },
      { label: 'Win Rate', ind: 'Win Rate', suffix: '%', icon: Target },
    ]
  },
  'Gestão Operacional': {
    title: 'Monitoramento Estratégico Operacional',
    subtitle: 'Métricas de eficiência, logística e qualidade de produção.',
    icon: LayoutDashboard,
    color: 'bg-slate-900',
    kpiDefinitions: [
      { label: 'OEE (Eficiência)', ind: 'OEE', suffix: '%', icon: Activity },
      { label: 'Lead Time Total', ind: 'Lead Time', suffix: ' dias', icon: Target },
      { label: 'Índice de Qualidade', ind: 'Índice de Qualidade', suffix: '%', icon: ShieldCheck },
      { label: 'Atrasos (Logística)', ind: 'Atrasos', suffix: '%', icon: Activity },
      { label: 'Produtividade p/ Colab.', ind: 'Produtividade Colaborador', suffix: '', icon: Users },
      { label: 'Manutenção Preditiva', ind: 'Manutenção Preditiva', suffix: '%', icon: Zap },
    ]
  },
  'Administração e Finanças': {
    title: 'Dashboard',
    subtitle: 'Indicadores financeiros vitais e estrutura de capital.',
    icon: BarChart3,
    color: 'bg-slate-800',
    kpiDefinitions: [
      { label: 'Margem EBITDA', ind: 'Margem EBITDA', suffix: '%', icon: Zap },
      { label: 'Liquidez Corrente', ind: 'Liquidez Corrente', suffix: '', icon: Activity },
      { label: 'ROIC', ind: 'ROIC', suffix: '%', icon: Target },
      { label: 'Alavancagem', ind: 'Alavancagem', suffix: 'x', icon: TrendingUp },
      { label: 'Margem Líquida', ind: 'Margem Líquida', suffix: '%', icon: Percent },
      { label: 'Cash Runaway', ind: 'Cash Runaway', suffix: ' meses', icon: Activity },
    ]
  }
};

const getValueSizeClass = (maxLen: number) => {
  if (maxLen > 22) return "text-[clamp(0.6rem,1vw,0.75rem)]";
  if (maxLen > 18) return "text-[clamp(0.7rem,1.2vw,0.9rem)]";
  if (maxLen > 15) return "text-[clamp(0.85rem,1.4vw,1.1rem)]";
  if (maxLen > 12) return "text-[clamp(1rem,1.7vw,1.35rem)]";
  if (maxLen > 10) return "text-[clamp(1.2rem,2vw,1.7rem)]";
  return "text-[clamp(1.6rem,2.5vw,2.3rem)]";
};

export function AxisDashboardPage({ axis, clientId, onNavigate, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }: AxisDashboardPageProps) {
  const [dbIndicators, setDbIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId),
      where('ano', '==', selectedYear),
      where('mes', '==', selectedMonth)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDbIndicators(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [clientId, selectedYear, selectedMonth]);

  const config = AXIS_CONFIG_METADATA[axis] || AXIS_CONFIG_METADATA['Governança Corporativa'];
  
  const primaryKPIs = useMemo(() => {
    return (config.kpiDefinitions || []).map((def: any) => {
      const ind = dbIndicators.find(i => i.ind === def.ind || i.ind?.toLowerCase() === def.ind.toLowerCase());
      const value = ind ? ind.val : 0;
      return {
        ...def,
        value,
        status: value > 0 ? 'positive' : 'neutral'
      };
    });
  }, [config.kpiDefinitions, dbIndicators]);

  const flatMetrics = useMemo(() => {
    return primaryKPIs.reduce((acc: any, kpi: any) => ({...acc, [kpi.label]: kpi.value}), {});
  }, [primaryKPIs]);

  // Pegar os alertas sacerdotais (regras violadas) para este eixo baseado nos KPIs
  const triggeredRules = useMemo(() => {
    return evaluateAxisRules(flatMetrics, axis);
  }, [axis, flatMetrics]);

  // Se precisar mandar pro Gemini, mandamos os princípios relacionados em geral
  const axisPrinciples = useMemo(() => {
    return GOVERNANCE_PRINCIPLES.filter(p => p.axis === axis);
  }, [axis]);


  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

  const handleGenerateAnalysis = async () => {
    setLoadingAi(true);
    const result = await generateGovernanceParecer({
      clientName: 'Sua Empresa',
      industry: 'Geral',
      metrics: flatMetrics,
      topPrinciples: axisPrinciples.map(p => p.name),
      scenarios: axisPrinciples.map(p => p.situationalScenario).filter(Boolean) as string[]
    });
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  const [isYTD, setIsYTD] = useState(false);
  const hasData = dbIndicators.length > 0;

  if (!loading && !hasData) {
    const Icon = config.icon;
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-10 animate-executive-fade">
         <div className="relative">
            <div className="absolute inset-0 bg-primary blur-3xl opacity-10 animate-pulse" />
            <div className={cn("w-40 h-40 rounded-[48px] flex items-center justify-center text-secondary shadow-2xl relative z-10 border border-white/5", config.color)}>
              <Icon size={80} strokeWidth={1} />
            </div>
         </div>
         
         <div className="text-center space-y-4 max-w-xl mx-auto px-6">
            <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight leading-tight">Dashboard de {axis} Indisponível</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Não identificamos indicadores financeiros ou estratégicos para o eixo de <strong>{axis}</strong> no período selecionado. 
              Por favor, realize a importação dos dados históricos para visualizar a performance.
            </p>
         </div>

         <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-slate-200 rounded-2xl p-1 shadow-sm">
              <div className="flex items-center px-4 py-2 border-r border-slate-100">
                <ShieldAlert size={14} className="text-secondary mr-2" />
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear?.(Number(e.target.value))}
                  className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
                >
                  {[2024, 2025, 2026].map(y => (
                    <option key={y} value={y} className="bg-white">{y}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center px-4 py-2">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth?.(Number(e.target.value))}
                  className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
                >
                  {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((label, i) => (
                    <option key={i} value={i + 1} className="bg-white">{label}</option>
                  ))}
                </select>
              </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              {(() => {
                const Icon = config.icon;
                return <Icon size={20} className="text-secondary" />;
              })()}
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">{config.title === 'Dashboard' ? `Monitoramento de ${axis}` : config.title}</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">{config.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {/* Group 1: Time Filters */}
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-1 shadow-inner">
            <div className="flex items-center px-4 py-2 border-r border-white/5">
              <ShieldAlert size={14} className="text-secondary mr-2" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear?.(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y} className="bg-slate-900">{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center px-4 py-2">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth?.(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((label, i) => (
                  <option key={i} value={i + 1} className="bg-slate-900">{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Group 2: View Toggle */}
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl px-5 py-2.5 border border-white/10 shadow-inner h-[46px]">
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", !isYTD ? "text-secondary" : "text-slate-500")}>Mensal</span>
            <button 
              onClick={() => setIsYTD(!isYTD)}
              className={cn(
                "w-10 h-5 rounded-full p-1 transition-colors relative group",
                isYTD ? "bg-secondary" : "bg-slate-700 hover:bg-slate-600"
              )}
            >
              <motion.div 
                animate={{ x: isYTD ? 20 : 0 }}
                className="w-3 h-3 bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform" 
              />
            </button>
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", isYTD ? "text-secondary" : "text-slate-500")}>Anual</span>
          </div>
        </div>
      </div>

      {/* KPI Grid - Standardized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(() => {
          const maxGroupLen = Math.max(...primaryKPIs.map((kpi: any) => formatValue(kpi.value, kpi.isCur ? 'R$' : kpi.suffix || '').length));
          const groupSizeClass = getValueSizeClass(maxGroupLen);
          
          return primaryKPIs.map((kpi: any, idx: number) => {
            const Icon = kpi.icon !== 'AlertCircle' ? kpi.icon : Activity;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Icon size={24} />
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      sessionStorage.setItem('pending_action', JSON.stringify({
                        title: `Ação para: ${kpi.label}`,
                        origin: axis,
                        description: `Focar na melhoria do indicador ${kpi.label} do eixo ${axis}.`
                      }));
                      window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'plano_acao' }));
                    }}
                    title="Criar Ação Estratégica"
                    className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-secondary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Zap size={16} />
                  </button>
                </div>

                <div>
                  <h4 className="text-[clamp(1rem,1.3vw,1.5rem)] font-display font-black text-slate-900 leading-tight group-hover:text-secondary transition-colors whitespace-nowrap overflow-hidden text-ellipsis mb-1.5">
                    {kpi.label}
                  </h4>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm shrink-0", kpi.status === 'positive' ? "bg-emerald-500" : kpi.status === 'negative' ? "bg-rose-500" : "bg-amber-500")} />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">{axis}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className={cn(
                      "font-black text-slate-900 tabular-nums tracking-tighter whitespace-nowrap",
                      groupSizeClass
                    )}>
                      {formatValue(kpi.value, kpi.isCur ? 'R$' : kpi.suffix || '')}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          });
        })()}
      </div>

      {/* Perspectiva Governança Aplicada ao Eixo */}
      <div className="bg-white rounded-[48px] border border-slate-200 p-12 overflow-hidden relative shadow-sm">
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-60" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <ShieldCheck size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Perspectiva de Governança Integrada</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fundamentos institucionais aplicados aos KPIs de {axis}</p>
              </div>
            </div>
            <button 
              onClick={handleGenerateAnalysis}
              disabled={loadingAi}
              className="px-6 py-4 bg-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20 disabled:opacity-50 flex items-center gap-2"
            >
              {loadingAi ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} 
              {aiAnalysis ? 'Regerar Análise Integrada' : 'Gerar Análise Integrada (IA)'}
            </button>
          </div>

          {aiAnalysis && (
            <div className="mb-10 bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 text-indigo-900 font-medium leading-relaxed text-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldCheck size={64} />
              </div>
              <div className="flex items-center gap-2 mb-4 text-indigo-600 font-black uppercase tracking-widest text-[10px]">
                <Zap size={14} /> Leitura Estratégica AI
              </div>
              <div className="whitespace-pre-wrap relative z-10 text-xs text-indigo-900/90">
                <MarkdownText text={aiAnalysis} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {triggeredRules.map((rule) => (
              <GovernanceInsightPanel 
                key={rule.id}
                principleId={rule.principle.id}
                misalignment={rule.misalignment}
                impact={rule.impact}
                recommendation={rule.recommendation}
              />
            ))}
            {triggeredRules.length === 0 && (
              <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center p-12 bg-emerald-50/50 border border-emerald-100 rounded-3xl text-emerald-700">
                <ShieldCheck size={48} className="mb-4 opacity-50" />
                <h4 className="text-lg font-black tracking-tight mb-1">Eixo Saudável e Alinhado</h4>
                <p className="text-xs font-medium opacity-80 text-center max-w-md">Os indicadores atuais não disparam nenhum alerta de desalinhamento com os princípios de {axis}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
