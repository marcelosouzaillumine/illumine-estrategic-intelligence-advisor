import React, { useMemo, useState } from 'react';
import { 
  ShieldCheck, TrendingUp, Users, Activity, Globe, ShoppingBag, 
  FileText, Zap, BarChart3, Target, ArrowUpRight, LayoutGrid, 
  BookOpen, Percent, Lightbulb, Loader2, LayoutDashboard
} from 'lucide-react';
import { Page } from '../../app/navigation';
import { motion } from 'motion/react';
import { PageHeader, StatusBadge } from '../Common';
import { formatValue, formatCurrency, cn } from '../../lib/utils';
import { EixoGestao } from '../../types/modules';
import { SACERDOTAL_PRINCIPLES, evaluateAxisRules } from '../../lib/sacerdotalIntelligence';
import { SacerdotalInsightPanel } from '../SacerdotalInsightPanel';
import { generateSacerdotalParecer } from '../../services/sacerdotalAiService';

interface AxisDashboardPageProps {
  axis: EixoGestao;
  clientId: string;
  onNavigate?: (page: Page) => void;
  selectedMonth?: number;
  setSelectedMonth?: (month: number) => void;
  selectedYear?: number;
  setSelectedYear?: (year: number) => void;
}

const AXIS_CONFIG: Record<string, any> = {
  'Governança Corporativa': {
    title: 'Dashboard',
    subtitle: 'Monitoramento estratégico de performance e maturidade corporativa.',
    icon: ShieldCheck,
    color: 'bg-slate-900',
    primaryKPIs: [
      { label: 'Índice de Maturidade', value: 85, suffix: '%', status: 'positive', icon: ShieldCheck },
      { label: 'Reuniões de Conselho', value: 12, suffix: '', status: 'positive', icon: Users },
      { label: 'Compliance Index', value: 98, suffix: '%', status: 'positive', icon: FileText },
      { label: 'Riscos Mitigados', value: 24, suffix: '', status: 'positive', icon: Target },
    ]
  },
  'Cultura Organizacional': {
    title: 'Dashboard',
    subtitle: 'Monitoramento de clima organizacional e desenvolvimento humano.',
    icon: Users,
    color: 'bg-purple-900',
    primaryKPIs: [
      { label: 'eNPS (Clima)', value: 72, suffix: '', status: 'positive', icon: TrendingUp },
      { label: 'Turnover', value: 2.4, suffix: '%', status: 'positive', icon: Activity },
      { label: 'Horas de Treinamento', value: 1240, suffix: 'h', status: 'positive', icon: BookOpen },
      { label: 'Taxa de Retenção', value: 92, suffix: '%', status: 'positive', icon: Users },
    ]
  },
  'Gestão de Inovação': {
    title: 'Dashboard',
    subtitle: 'Gestão de portfólio de projetos, projetos de inovação e P&D.',
    icon: Lightbulb,
    color: 'bg-cyan-900',
    primaryKPIs: [
      { label: 'Índice de Inovação', value: 68, suffix: '%', status: 'neutral', icon: Lightbulb },
      { label: 'Projetos P&D Ativos', value: 6, suffix: '', status: 'positive', icon: Activity },
      { label: 'Investimento em P&D', value: 250000, isCur: true, status: 'positive', icon: Zap },
      { label: 'Tempo até MVP', value: 45, suffix: ' dias', status: 'positive', icon: Target },
    ]
  },
  'Gestão de Marketing': {
    title: 'Dashboard',
    subtitle: 'Performance de comunicação, branding e geração de leads.',
    icon: Globe,
    color: 'bg-blue-900',
    primaryKPIs: [
      { label: 'Brand Awareness', value: 65, suffix: '%', status: 'positive', icon: Globe },
      { label: 'Custo por Lead (CPL)', value: 45, isCur: true, status: 'neutral', icon: Users },
      { label: 'Leads Gerados (MQL)', value: 1250, suffix: '', status: 'positive', icon: Activity },
      { label: 'ROI de Marketing', value: 3.5, suffix: 'x', status: 'positive', icon: TrendingUp },
    ]
  },
  'Gestão Comercial': {
    title: 'Dashboard',
    subtitle: 'Monitoramento de pipeline, conversão e receitas.',
    icon: ShoppingBag,
    color: 'bg-emerald-900',
    primaryKPIs: [
      { label: 'Receita Recorrente (MRR)', value: 185000, isCur: true, status: 'positive', icon: Target },
      { label: 'Taxa de Conversão', value: 24, suffix: '%', status: 'positive', icon: Percent },
      { label: 'Ticket Médio', value: 2850, isCur: true, status: 'positive', icon: ShoppingBag },
      { label: 'CAC', value: 450, isCur: true, status: 'neutral', icon: BarChart3 },
    ]
  },
  'Gestão Operacional': {
    title: 'Monitoramento Estratégico Operacional',
    subtitle: 'Métricas de eficiência, logística e qualidade de produção.',
    icon: LayoutDashboard,
    color: 'bg-slate-900',
    primaryKPIs: [
      { label: 'OEE (Eficiência)', value: 82, suffix: '%', status: 'neutral', icon: Activity },
      { label: 'Lead Time Total', value: 14, suffix: ' dias', status: 'positive', icon: Target },
      { label: 'Índice de Qualidade', value: 98.5, suffix: '%', status: 'positive', icon: ShieldCheck },
      { label: 'Atrasos (Logística)', value: 3.2, suffix: '%', status: 'neutral', icon: Activity }, // mocked icon
    ]
  },
  'Administração e Finanças': {
    title: 'Dashboard',
    subtitle: 'Indicadores financeiros vitais e estrutura de capital.',
    icon: BarChart3,
    color: 'bg-slate-800',
    primaryKPIs: [
      { label: 'Margem EBITDA', value: 24.2, suffix: '%', status: 'positive', icon: Zap },
      { label: 'Liquidez Corrente', value: 1.8, suffix: '', status: 'positive', icon: Activity },
      { label: 'ROIC', value: 18.5, suffix: '%', status: 'positive', icon: Target },
      { label: 'Alavancagem', value: 1.2, suffix: 'x', status: 'positive', icon: TrendingUp },
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
  const config = AXIS_CONFIG[axis] || AXIS_CONFIG['Governança Corporativa'];
  const flatMetrics = useMemo(() => {
    return config.primaryKPIs.reduce((acc: any, kpi: any) => ({...acc, [kpi.label]: kpi.value}), {});
  }, [config.primaryKPIs]);

  // Pegar os alertas sacerdotais (regras violadas) para este eixo baseado nos KPIs
  const triggeredRules = useMemo(() => {
    return evaluateAxisRules(flatMetrics, axis);
  }, [axis, flatMetrics]);

  // Se precisar mandar pro Gemini, mandamos os princípios relacionados em geral
  const axisPrinciples = useMemo(() => {
    return SACERDOTAL_PRINCIPLES.filter(p => p.axis === axis);
  }, [axis]);

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-amber-800 font-black">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

  const handleGenerateAnalysis = async () => {
    setLoadingAi(true);
    const result = await generateSacerdotalParecer({
      clientName: 'Sua Empresa',
      industry: 'Geral',
      metrics: flatMetrics,
      topPrinciples: axisPrinciples.map(p => p.name)
    });
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  const [isYTD, setIsYTD] = useState(false);

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
              <BookOpen size={14} className="text-secondary mr-2" />
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
          const maxGroupLen = Math.max(...config.primaryKPIs.map((kpi: any) => formatValue(kpi.value, kpi.isCur ? 'R$' : kpi.suffix || '').length));
          const groupSizeClass = getValueSizeClass(maxGroupLen);
          
          return config.primaryKPIs.map((kpi: any, idx: number) => {
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

      {/* Perspectiva Sacerdotal Aplicada ao Eixo */}
      <div className="bg-white rounded-[48px] border border-slate-200 p-12 overflow-hidden relative shadow-sm">
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-amber-50 rounded-full blur-3xl opacity-60" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <BookOpen size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Perspectiva Sacerdotal Integrada</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Princípios eternos aplicados aos KPIs de {axis}</p>
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
            <div className="mb-10 bg-amber-50/50 p-8 rounded-3xl border border-amber-100 text-amber-900 font-medium leading-relaxed text-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <BookOpen size={64} />
              </div>
              <div className="flex items-center gap-2 mb-4 text-amber-600 font-black uppercase tracking-widest text-[10px]">
                <Zap size={14} /> Leitura Estratégica AI
              </div>
              <div className="whitespace-pre-wrap relative z-10 text-xs text-amber-900/90">{renderMarkdown(aiAnalysis)}</div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {triggeredRules.map((rule) => (
              <SacerdotalInsightPanel 
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
