import React, { useMemo, useState } from 'react';
import { 
  ShieldCheck, TrendingUp, Users, Activity, Globe, ShoppingBag, 
  FileText, Zap, BarChart3, Target, ArrowUpRight, LayoutGrid, 
  BookOpen, Percent, Lightbulb, Loader2, LayoutDashboard, ShieldAlert
} from 'lucide-react';
import { collection, query, where, onSnapshot, getDocs, limit } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Page } from '../../app/navigation';
import { motion } from 'motion/react';
import { PageHeader, StatusBadge, MarkdownText, KpiCard } from '../Common';
import { formatValue, formatCurrency, cn } from '../../lib/utils';
import { EixoGestao } from '../../types/modules';
import { GOVERNANCE_PRINCIPLES, evaluateAxisRules } from '../../lib/governanceIntelligence';
import { GovernanceInsightPanel } from '../GovernanceInsightPanel';
import { ExecutivePerspectiveSection } from '../ExecutivePerspectiveSection';
import { useExecutiveAdvisory } from '../../hooks/useExecutiveAdvisory';
import { useHistoricalDemonstracoes } from '../../hooks/useHistoricalDemonstracoes';
import { useInstitutionalRuntime } from '../../hooks/useInstitutionalRuntime';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';

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
      { label: 'Valor de Mercado', ind: 'Valor de Mercado', isCur: true, icon: TrendingUp },
      { label: 'Taxa WACC', ind: 'WACC', suffix: '%', icon: Percent },
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
  const [hasOperationalData, setHasOperationalData] = useState(false);
  const [cashRunawayFallback, setCashRunawayFallback] = useState<number | null>(null);

  // Hook for fallback data calculation from financial_entries
  const { kpis: calculatedKPIs } = useRealIndicatorData(clientId, selectedMonth || 1, selectedYear || 2024);

  React.useEffect(() => {
    if (!clientId) return;
    
    // Check for operational data to avoid "Unavailable" screen
    const checkOperationalData = async () => {
      try {
        const collectionsToCheck = ['payables', 'receivables', 'cash_flows', 'financial_entries', 'assets', 'financial_positions'];
        const results = await Promise.all(collectionsToCheck.map(col => 
          getDocs(query(collection(db, col), where('clientId', '==', clientId), limit(1)))
        ));
        const hasAny = results.some(snap => !snap.empty);
        setHasOperationalData(hasAny);

        // Fetch Cash Runaway fallback if needed
        const cfSnap = await getDocs(query(collection(db, 'cash_flows'), where('clientId', '==', clientId), limit(1)));
        if (!cfSnap.empty) {
          const cfData = cfSnap.docs[0].data();
          const runwayKpi = cfData.KPIs?.find((k: any) => k.Indicador === "Dias de caixa (Runway)");
          if (runwayKpi) {
            setCashRunawayFallback(Math.round(Number(runwayKpi["Fórmula / Valor"]) / 30)); // Convert to months
          }
        }
      } catch (err) {
        console.warn('Error checking operational data:', err);
      }
    };

    checkOperationalData();

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
    const baseKPIs = (config.kpiDefinitions || []).map((def: any) => {
      const ind = dbIndicators.find(i => i.ind === def.ind || i.ind?.toLowerCase() === def.ind.toLowerCase());
      
      // Try fallback from calculatedKPIs if indicator is missing from DB
      let value = ind ? ind.val : 0;
      if (!ind) {
        if (def.ind === 'Margem EBITDA') value = calculatedKPIs.ebitdaMargin || 0;
        if (def.ind === 'Liquidez Corrente') value = calculatedKPIs.liquidezCorrente || 0;
        if (def.ind === 'Margem Líquida') value = calculatedKPIs.margemLiquida || 0;
        if (def.ind === 'EBITDA') value = calculatedKPIs.ebitda || 0;
        if (def.ind === 'Cash Runaway') value = cashRunawayFallback || 0;
        
        // Strategic Fallbacks
        if (def.ind === 'Valor de Mercado' && calculatedKPIs.ebitda > 0) {
          // Valuation based on 6.5x Multiple (Standard)
          value = calculatedKPIs.ebitda * 12 * 6.5;
        }
        if (def.ind === 'WACC') value = 12.5; // Default assumption
      }

      return {
        ...def,
        value,
        status: value > 0 ? 'positive' : 'neutral'
      };
    });

    // Add extra indicators found in DB that were not in the hardcoded list
    const extraKPIs = dbIndicators
      .filter(ind => !baseKPIs.some(k => k.ind === ind.ind))
      .map(ind => ({
        label: ind.ind,
        ind: ind.ind,
        value: ind.val,
        suffix: ind.un || '',
        icon: Activity,
        status: ind.sem === 'Verde' ? 'positive' : ind.sem === 'Vermelho' ? 'negative' : 'neutral'
      }));

    return [...baseKPIs, ...extraKPIs];
  }, [config.kpiDefinitions, dbIndicators, calculatedKPIs, cashRunawayFallback]);

  const flatMetrics = useMemo(() => {
    return primaryKPIs.reduce((acc: any, kpi: any) => ({...acc, [kpi.label]: kpi.value}), {});
  }, [primaryKPIs]);

  // Institucional Runtime Integration
  const currentYear = selectedYear || new Date().getFullYear();
  const { dbData: financialData } = useHistoricalDemonstracoes(clientId, currentYear);
  const runtimeInput = useMemo(() => ({
    rawFinancialData: financialData,
    historicalCyclesCount: financialData.length,
    isMockData: false
  }), [financialData]);
  
  const { runtimeOutput } = useInstitutionalRuntime({ input: runtimeInput });
  const isBlocked = runtimeOutput?.inferences?.['ExecutiveDecisionEngine']?.metrics?.blockedInferences?.length > 0;

  // Pegar os alertas sacerdotais (regras violadas) para este eixo baseado nos KPIs
  const triggeredRules = useMemo(() => {
    return evaluateAxisRules(flatMetrics, axis, isBlocked);
  }, [flatMetrics, axis, isBlocked]);

  // Se precisar mandar pro Gemini, mandamos os princípios relacionados em geral
  const axisPrinciples = useMemo(() => {
    return GOVERNANCE_PRINCIPLES.filter(p => p.axis === axis);
  }, [axis]);

  const { advisoryReport, loading: advisoryLoading } = useExecutiveAdvisory(clientId, selectedYear || new Date().getFullYear(), selectedMonth || 1);
  const [isYTD, setIsYTD] = useState(false);
  const hasData = dbIndicators.length > 0 || hasOperationalData;

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
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-2 border border-slate-200 shadow-sm h-[40px]">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors",
                !isYTD ? "text-secondary" : "text-slate-400"
              )}>Mensal</span>
              <button 
                onClick={() => setIsYTD(!isYTD)}
                className={cn(
                  "w-10 h-5 rounded-full p-1 transition-all duration-500 relative",
                  isYTD ? "bg-secondary" : "bg-slate-200"
                )}
              >
                <motion.div 
                  animate={{ x: isYTD ? 20 : 0 }}
                  className="w-3 h-3 bg-white rounded-full shadow-md"
                />
              </button>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors",
                isYTD ? "text-secondary" : "text-slate-400"
              )}>
                Anual
              </span>
            </div>

            <div className="flex items-center bg-white/10 backdrop-blur-md border border-slate-200 rounded-2xl p-1 shadow-sm h-[40px]">
              <div className={cn("flex items-center px-4 py-2", !isYTD && "border-r border-slate-100")}>
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
              {!isYTD && (
                <div className="flex items-center px-4 py-2 animate-in fade-in zoom-in duration-300">
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
              )}
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-16 pb-32 animate-executive-fade">
      <PageHeader 
        title={config.title === 'Dashboard' ? `Monitoramento de ${axis}` : config.title}
        subtitle={config.subtitle}
        icon={config.icon}
        color={config.color}
        transparent={config.title?.includes('Monitoramento Estratégico')}
      />

      <div className="flex items-center justify-start gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-4 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm px-5 py-2 h-[40px]">
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", !isYTD ? "text-secondary" : "text-slate-400")}>Mensal</span>
            <button 
              onClick={() => setIsYTD(!isYTD)}
              className={cn(
                "w-10 h-5 rounded-full p-1 transition-colors relative group",
                isYTD ? "bg-secondary" : "bg-slate-200 hover:bg-slate-300"
              )}
            >
              <motion.div 
                animate={{ x: isYTD ? 20 : 0 }}
                className="w-3 h-3 bg-white rounded-full shadow-lg group-hover:scale-110 transition-transform" 
              />
            </button>
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", isYTD ? "text-secondary" : "text-slate-400")}>Anual</span>
          </div>

          <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm h-[40px]">
            <div className={cn("flex items-center px-4 py-2", !isYTD && "border-r border-slate-100")}>
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
            {!isYTD && (
              <div className="flex items-center px-4 py-2 animate-in fade-in zoom-in duration-300">
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
            )}
          </div>
        </div>
      </div>

      {/* Section specific for Culture: Anthropological Intelligence */}
      {axis === 'Cultura Organizacional' && (() => {
        const turnover = flatMetrics['Turnover'] || 0;
        const enps = flatMetrics['eNPS (Clima)'] || 0;
        const absent = flatMetrics['Absenteísmo'] || 0;
        const training = flatMetrics['Horas de Treinamento'] || 0;

        const isCentralized = turnover > 15 && enps > 50;
        const isFatigued = absent > 5 || (training < 2 && training > 0);
        const isSilent = turnover < 5 && enps < 30 && enps !== 0;

        return (
          <div className="bg-white p-10 md:p-14 rounded-[56px] border border-slate-200 shadow-sm relative overflow-hidden mb-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                  <Users size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Inteligência Antropológica & Clima</h3>
                  <p className="text-xs text-slate-500 font-medium">Detectando sinais invisíveis de fadiga, centralização e saúde cultural.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Centralization Signal */}
                <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sinal de Centralização</p>
                     <div className={cn("w-2 h-2 rounded-full", isCentralized ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-emerald-500")} />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-lg font-black text-slate-900">{isCentralized ? "Risco Identificado" : "Liderança Distribuída"}</h4>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">
                       {isCentralized 
                         ? "Correlação entre Turnover em posições chave e score de eNPS indica possíveis gargalos decisórios no topo." 
                         : "O fluxo de talentos e a satisfação indicam uma estrutura de comando equilibrada e participativa."}
                     </p>
                  </div>
                </div>

                {/* Fatigue Signal */}
                <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fadiga Organizacional</p>
                     <div className={cn("w-2 h-2 rounded-full", isFatigued ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-emerald-500")} />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-lg font-black text-slate-900">{isFatigued ? "Alerta de Estresse" : "Ritmo Sustentável"}</h4>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">
                       {isFatigued 
                         ? "Índices de absenteísmo ou falta de desenvolvimento sugerem sobrecarga física ou mental nas equipes." 
                         : "Os indicadores de presença e investimento em pessoas sugerem um ritmo operacional saudável e resiliente."}
                     </p>
                  </div>
                </div>

                {/* Silent Climate Signal */}
                <div className={cn("p-8 rounded-[40px] space-y-6 shadow-xl transition-colors duration-500", isSilent ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900")}>
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Clima Silencioso</p>
                     <div className={cn("w-2 h-2 rounded-full", isSilent ? "bg-purple-500 animate-pulse" : "bg-emerald-500")} />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-lg font-black">{isSilent ? "Risco de Conformidade" : "Transparência Plena"}</h4>
                     <p className="text-xs opacity-70 leading-relaxed font-medium">
                       {isSilent 
                         ? "Baixo turnover com baixo eNPS sugerem um ambiente onde os problemas não são vocalizados por medo ou apatia." 
                         : "A relação entre engajamento e retenção aponta para um ambiente de diálogo aberto e segurança psicológica."}
                     </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* KPI Grid - Standardized */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {primaryKPIs.map((kpi: any, idx: number) => (
          <KpiCard 
            key={idx}
            title={kpi.label}
            value={formatValue(kpi.value, '')}
            suffix={kpi.suffix || (kpi.isCur ? 'R$' : '')}
            icon={kpi.icon !== 'AlertCircle' ? kpi.icon : Activity}
            status={kpi.value === 0 ? 'Pendente' : (kpi.status === 'positive' ? 'Verde' : kpi.status === 'negative' ? 'Vermelho' : 'Amarelo')}
            trend={kpi.value === 0 ? 'Pendente' : (kpi.status === 'positive' ? 'Em Alta' : kpi.status === 'negative' ? 'Em Queda' : 'Estável')}
            className="group"
          />
        ))}
      </div>

      <ExecutivePerspectiveSection 
        report={advisoryReport} 
        loading={advisoryLoading}
        className="mt-12"
      />
    </div>
  );
}
