
import React, { useMemo, useState } from 'react';
import { 
  ShieldCheck, TrendingUp, Users, Activity, Globe, ShoppingBag, 
  FileText, Zap, BarChart3, Target, ArrowUpRight, LayoutGrid, 
  BookOpen, Lightbulb, Loader2, PieChart as PieIcon, MessageSquare, Scale, ChevronRight, ShieldAlert
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Page } from '../../app/navigation';
import { motion } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip
} from 'recharts';
import { PageHeader, StatusBadge, MarkdownText, KpiCard } from '../Common';
import { formatValue, formatCurrency, cn } from '../../lib/utils';
import { GOVERNANCE_PRINCIPLES, evaluateAxisRules } from '../../lib/governanceIntelligence';
import { GovernanceInsightPanel } from '../GovernanceInsightPanel';
import { orchestrateGovernanceNarrative } from '../../core/orchestration/executiveOrchestrationEngine';
import { DashboardSkeleton } from '../ui/skeletons';
import { useHistoricalDemonstracoes } from '../../hooks/useHistoricalDemonstracoes';
import { useInstitutionalRuntime } from '../../hooks/useInstitutionalRuntime';

interface GovernanceDashboardPageProps {
  clientId: string;
  onNavigate: (page: Page) => void;
  selectedMonth?: number;
  setSelectedMonth?: (month: number) => void;
  selectedYear?: number;
  setSelectedYear?: (year: number) => void;
}

const getValueSizeClass = (maxLen: number) => {
  if (maxLen > 22) return "text-[clamp(0.6rem,1vw,0.75rem)]";
  if (maxLen > 18) return "text-[clamp(0.7rem,1.2vw,0.9rem)]";
  if (maxLen > 15) return "text-[clamp(0.85rem,1.4vw,1.1rem)]";
  if (maxLen > 12) return "text-[clamp(1rem,1.7vw,1.35rem)]";
  if (maxLen > 10) return "text-[clamp(1.2rem,2vw,1.7rem)]";
  return "text-[clamp(1.6rem,2.5vw,2.3rem)]";
};

export function GovernanceDashboardPage({ 
  clientId, 
  onNavigate,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear
}: GovernanceDashboardPageProps) {
  // Strategic KPIs - Dynamic
  const [dbIndicators, setDbIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const current = allData.filter((i: any) => i.ano === selectedYear && i.mes === selectedMonth);
      setDbIndicators(current);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [clientId, selectedYear, selectedMonth]);

  const getIndicatorValue = (name: string, fallback: number = 0) => {
    const ind = dbIndicators.find(i => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    return ind ? ind.val : fallback;
  };

  const strategicKPIs = useMemo(() => [
    { label: 'Lucratividade Líquida', value: getIndicatorValue('Margem Líquida'), suffix: '%', status: getIndicatorValue('Margem Líquida') > 10 ? 'positive' : 'neutral', icon: BarChart3 },
    { label: 'EBITDA (Margem)', value: getIndicatorValue('Margem EBITDA'), suffix: '%', status: getIndicatorValue('Margem EBITDA') > 20 ? 'positive' : 'neutral', icon: Zap },
    { label: 'Índice de Transparência', value: getIndicatorValue('Índice de Transparência', 0), suffix: '%', status: getIndicatorValue('Índice de Transparência') > 80 ? 'positive' : 'neutral', icon: Globe },
    { label: 'Churn Rate (Fidelidade)', value: getIndicatorValue('Churn Rate', 0), suffix: '%', status: getIndicatorValue('Churn Rate') < 5 ? 'positive' : 'negative', icon: ShieldAlert }
  ], [dbIndicators]);

  // Radar Data for Areas - Dynamic
  const radarData = useMemo(() => [
    { area: 'Governança', score: getIndicatorValue('Maturidade de Governança', 0), target: 85, fullMark: 100 },
    { area: 'Cultura', score: getIndicatorValue('eNPS', 0), target: 80, fullMark: 100 },
    { area: 'Finanças', score: getIndicatorValue('Margem EBITDA', 0), target: 75, fullMark: 100 },
    { area: 'Inovação', score: getIndicatorValue('Índice de Inovação', 0), target: 80, fullMark: 100 },
    { area: 'Marketing', score: getIndicatorValue('ROI de Marketing', 0) * 10, target: 85, fullMark: 100 },
    { area: 'Comercial', score: getIndicatorValue('Win Rate', 0), target: 75, fullMark: 100 },
    { area: 'Operacional', score: getIndicatorValue('Índice de Qualidade', 0), target: 85, fullMark: 100 },
  ], [dbIndicators]);

  // Area Snapshots - Dynamic
  const areaSnapshots = useMemo(() => [
    { 
      id: 'governanca_estrategica' as Page,
      label: 'Governança Corporativa', 
      kpi: 'Maturidade', 
      value: getIndicatorValue('Maturidade de Governança', 0), 
      suffix: '%', 
      status: getIndicatorValue('Maturidade de Governança') > 70 ? 'positive' : 'neutral', 
      icon: ShieldCheck,
      color: 'bg-slate-800'
    },
    { 
      id: 'dashboard_cultura' as Page,
      label: 'Cultura Organizacional', 
      kpi: 'eNPS', 
      value: getIndicatorValue('eNPS', 0), 
      status: getIndicatorValue('eNPS') > 50 ? 'positive' : 'neutral', 
      icon: Users,
      color: 'bg-purple-500'
    },
    { 
      id: 'dashboard_gestao' as Page,
      label: 'Administração e Finanças', 
      kpi: 'EBITDA', 
      value: getIndicatorValue('Margem EBITDA', 0), 
      suffix: '%', 
      status: getIndicatorValue('Margem EBITDA') > 20 ? 'positive' : 'neutral', 
      icon: BarChart3,
      color: 'bg-indigo-500'
    },
    { 
      id: 'dashboard_inovacao' as Page,
      label: 'Gestão de Inovação', 
      kpi: 'Índice', 
      value: getIndicatorValue('Índice de Inovação', 0), 
      suffix: '%', 
      status: 'neutral', 
      icon: Lightbulb,
      color: 'bg-cyan-500'
    },
    { 
      id: 'dashboard_marketing' as Page,
      label: 'Gestão de Marketing', 
      kpi: 'CPL', 
      value: getIndicatorValue('CPL', 0), 
      isCur: true, 
      status: 'neutral', 
      icon: Globe,
      color: 'bg-blue-500'
    },
    { 
      id: 'dashboard_comercial' as Page,
      label: 'Gestão Comercial', 
      kpi: 'Conversão', 
      value: getIndicatorValue('Taxa de Conversão', 0), 
      suffix: '%', 
      status: 'positive', 
      icon: ShoppingBag,
      color: 'bg-emerald-500'
    },
    { 
      id: 'dashboard_operacional' as Page,
      label: 'Gestão Operacional', 
      kpi: 'OEE', 
      value: getIndicatorValue('OEE', 0), 
      suffix: '%', 
      status: 'neutral', 
      icon: Activity,
      color: 'bg-amber-500'
    }
  ], [dbIndicators]);

  const flatMetrics = useMemo(() => {
    return strategicKPIs.reduce((acc: any, kpi: any) => ({...acc, [kpi.label]: kpi.value}), {});
  }, [strategicKPIs]);

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

  const triggeredRules = useMemo(() => {
    return evaluateAxisRules(flatMetrics, 'Governança Corporativa', isBlocked);
  }, [flatMetrics, isBlocked]);

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [auditTrail, setAuditTrail] = useState<any>(null);


  const handleGenerateAnalysis = async () => {
    setLoadingAi(true);
    const axisPrinciples = GOVERNANCE_PRINCIPLES.filter(p => p.axis === 'Governança Corporativa');
    const { narrative, auditTrail } = await orchestrateGovernanceNarrative({
      clientName: 'Sua Empresa',
      industry: 'Geral',
      metrics: flatMetrics,
      topPrinciples: axisPrinciples.map(p => p.name),
      scenarios: axisPrinciples.map(p => p.situationalScenario).filter(Boolean) as string[]
    });
    console.log('Governance Audit Trail:', auditTrail);
    setAuditTrail(auditTrail);
    setAiAnalysis(narrative);
    setLoadingAi(false);
  };

  const [isYTD, setIsYTD] = useState(false);
  const hasData = dbIndicators.length > 0;

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!loading && !hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-10 animate-executive-fade">
         <div className="relative">
            <div className="absolute inset-0 bg-primary blur-3xl opacity-10 animate-pulse" />
            <div className="w-40 h-40 rounded-[48px] bg-slate-900 flex items-center justify-center text-secondary shadow-2xl relative z-10 border border-white/5">
              <ShieldCheck size={80} strokeWidth={1} />
            </div>
         </div>
         
         <div className="text-center space-y-4 w-full max-w-2xl mx-auto px-6">
            <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight leading-tight">Painel de Governança Silencioso</h2>
            <p className="text-slate-500 w-full max-w-2xl mx-auto font-medium leading-relaxed">
              Não identificamos indicadores financeiros ou estratégicos para o período de <strong>{['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][(selectedMonth || 1) - 1]} de {selectedYear}</strong>. 
              Importe os dados históricos do cliente para ativar o monitoramento de performance.
            </p>
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
                <BookOpen size={14} className="text-secondary mr-2" />
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
            
            <button 
              onClick={() => onNavigate('maintenance')}
              className="px-5 md:px-8 py-2.5 md:py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-slate-900/10"
            >
              IR PARA IMPORTAÇÃO DE DADOS
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-16 pb-32 animate-executive-fade">
      <PageHeader 
        title="Monitoramento Estratégico de Governança"
        subtitle="Monitoramento estratégico de performance multisetorial para alta gestão e conselho de administração."
        icon={ShieldCheck}
        transparent
      />

      <div className="flex items-center justify-start gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-4 bg-card rounded-md px-4 md:px-6 py-2 md:py-2.5 border border-border shadow-sm h-[40px]">
            <span className={cn(
              "text-[10px] font-medium uppercase tracking-widest transition-colors",
              !isYTD ? "text-secondary" : "text-muted-foreground"
            )}>Mensal</span>
            <button 
              onClick={() => setIsYTD(!isYTD)}
              className={cn(
                "w-10 h-5 rounded-full p-1 transition-all duration-500 relative",
                isYTD ? "bg-secondary" : "bg-muted"
              )}
            >
              <motion.div 
                animate={{ x: isYTD ? 20 : 0 }}
                className="w-3 h-3 bg-white rounded-full shadow-md"
              />
            </button>
            <span className={cn(
              "text-[10px] font-medium uppercase tracking-widest transition-colors",
              isYTD ? "text-secondary" : "text-muted-foreground"
            )}>
              Anual
            </span>
          </div>

          <div className="flex items-center bg-card border border-border rounded-md p-1 shadow-sm h-[40px]">
            <div className={cn("flex items-center px-4 py-2", !isYTD && "border-r border-border")}>
              <BookOpen size={14} className="text-secondary mr-2.5" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear?.(Number(e.target.value))}
                className="text-[10px] font-medium uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            {!isYTD && (
              <div className="flex items-center px-4 py-2 animate-in fade-in zoom-in duration-300">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth?.(Number(e.target.value))}
                  className="text-[10px] font-medium uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
                >
                  {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((label, i) => (
                    <option key={i} value={i + 1}>{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Strategic KPIs Grid - Standardized */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {strategicKPIs.map((kpi, idx) => (
          <KpiCard 
            key={idx}
            title={kpi.label}
            value={formatValue(kpi.value, '')}
            suffix={kpi.suffix || ''}
            icon={kpi.icon}
            status={kpi.status === 'positive' ? 'Verde' : kpi.status === 'negative' ? 'Vermelho' : 'Amarelo'}
            trend="Bullish"
            noScroll={true}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Radar Analysis */}
        <div className="card-premium p-12 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-h3 font-medium text-foreground tracking-tight">Performance Multidimensional</h3>
              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest mt-1">Comparativo entre Pilares de Gestão</p>
            </div>
            <div className="w-10 h-10 rounded-md bg-surface-container flex items-center justify-center text-muted-foreground">
               <PieIcon size={20} />
            </div>
          </div>
          <div className="w-full h-[400px] overflow-visible flex items-center justify-center">
             <ResponsiveContainer width="100%" height={380}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                   <defs>
                      {/* Premium colorful radial & linear gradients */}
                      <linearGradient id="radarScoreGrad" x1="0" y1="0" x2="1" y2="1">
                         <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.65} />
                         <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.45} />
                         <stop offset="100%" stopColor="#E07A5F" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="radarTargetGrad" x1="0" y1="0" x2="1" y2="1">
                         <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                         <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
                      </linearGradient>
                   </defs>
                   
                   <PolarGrid stroke="var(--color-border)" opacity={0.6} />
                   <PolarAngleAxis 
                     dataKey="area" 
                     tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10, fontWeight: '900', letterSpacing: '0.05em' }}
                   />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   
                   {/* Meta de Gestão - Secondary colorful indicator */}
                   <Radar
                     name="Meta de Gestão"
                     dataKey="target"
                     stroke="#10b981"
                     fill="url(#radarTargetGrad)"
                     fillOpacity={0.2}
                     strokeWidth={1.5}
                     strokeDasharray="4 4"
                     dot={{ r: 3.5, stroke: '#10b981', strokeWidth: 1, fill: '#fff' }}
                   />
                   
                   {/* Score Real - Highly vibrant multi-colored score */}
                   <Radar
                     name="Score Real"
                     dataKey="score"
                     stroke="#8b5cf6"
                     fill="url(#radarScoreGrad)"
                     fillOpacity={0.55}
                     strokeWidth={2.5}
                     dot={{ r: 4.5, stroke: '#8b5cf6', strokeWidth: 1.5, fill: '#fff' }}
                   />
                   
                   <Tooltip 
                     contentStyle={{ 
                       borderRadius: '12px', 
                       border: '1px solid var(--color-border)', 
                       backgroundColor: 'var(--color-card)', 
                       boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.15)' 
                     }}
                     itemStyle={{ color: 'var(--color-foreground)', fontWeight: '700', fontSize: '11px' }}
                   />
                </RadarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Strategic Insights */}
        <div className="bg-surface-container p-12 rounded-md border border-border shadow-inner flex flex-col justify-between">
           <div className="space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-md bg-executive flex items-center justify-center text-white shadow-premium">
                    <MessageSquare size={24} />
                 </div>
                 <div>
                    <h3 className="text-h3 font-medium text-foreground tracking-tight">Insights Estratégicos</h3>
                    <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest mt-1">Recomendações de Alta Gestão</p>
                 </div>
              </div>

              <div className="space-y-6">
                 {[
                   { title: "Otimização de Capital", text: "O ROIC atual de 18.5% sugere oportunidade de realocação de excesso de caixa em projetos de expansão de margem.", icon: Scale },
                   { title: "Eficiência Operacional", text: "O eixo de Operações apresenta o maior gap de performance. Focar na automação do lead time de produção.", icon: Zap },
                   { title: "Retenção de Talentos", text: "O eNPS de 72 está acima da média setorial, fortalecendo a marca empregadora para atração de key players.", icon: Users }
                 ].map((insight, i) => (
                   <div key={i} className="flex gap-6 p-6 bg-card rounded-md border border-border shadow-sm hover:shadow-md transition-all group cursor-default">
                      <div className="w-12 h-12 rounded-md bg-surface-container flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                         {(() => {
                           const Icon = insight.icon;
                           return <Icon size={20} />;
                         })()}
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-[10px] font-medium text-foreground uppercase tracking-widest">{insight.title}</h4>
                         <p className="text-body-sm text-muted-foreground leading-relaxed font-medium italic">{insight.text}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <button className="btn-executive w-full mt-10">
              Exportar Relatório Mensal de Governança
           </button>
        </div>
      </div>

      {/* Area Snapshots Grid */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
           <div>
              <h3 className="text-h2 font-medium text-foreground tracking-tight">Health Check das Áreas</h3>
              <p className="text-muted-foreground text-body-sm font-medium uppercase tracking-widest mt-1">Visão 360º da Operação</p>
           </div>
           <button className="btn-ghost flex items-center gap-2">
              Ver Todos os Indicadores <ChevronRight size={14} />
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
           {areaSnapshots.map((area, idx) => (
             <KpiCard
               key={idx}
               title={area.label}
               value={formatValue(area.value, '')}
               suffix={area.suffix || (area.isCur ? 'R$' : '')}
               icon={area.icon}
               status={area.status === 'positive' ? 'Verde' : 'Amarelo'}
               trend={area.status === 'positive' ? 'Saudável' : 'Atenção'}
               onClick={() => onNavigate(area.id)}
               className="group"
             />
           ))}
        </div>
      </div>

      {/* Perspectiva Governança Aplicada ao Eixo de Governança */}
      <div className="card-premium p-12 overflow-hidden relative shadow-sm">
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-border pb-8">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-md bg-surface-container text-primary border border-border">
                <ShieldCheck size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-h2 font-medium text-foreground tracking-tight leading-none mb-2">Perspectiva de Governança Integrada</h3>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Fundamentos institucionais aplicados aos KPIs</p>
              </div>
            </div>
            <button 
              onClick={handleGenerateAnalysis}
              disabled={loadingAi}
              className="btn-executive flex items-center gap-2"
            >
              {loadingAi ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} 
              {aiAnalysis ? 'Regerar Análise Integrada' : 'Gerar Análise Integrada (IA)'}
            </button>
          </div>

          {aiAnalysis && (
            <div className="mb-10 bg-surface-container p-8 rounded-md border border-border text-foreground font-medium leading-relaxed text-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldCheck size={64} />
              </div>
              <div className="flex items-center gap-2 mb-4 text-primary font-medium uppercase tracking-widest text-[10px]">
                <Zap size={14} /> Leitura Estratégica AI
              </div>
              <div className="whitespace-pre-wrap relative z-10 text-xs text-muted-foreground font-medium italic">
                {auditTrail?.complianceStatus === 'non_compliant' ? (
                  <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-md mb-8 flex items-start gap-4 text-left not-italic">
                    <ShieldAlert className="text-red-500 shrink-0" size={24} />
                    <div>
                      <h3 className="text-red-500 font-bold text-lg mb-2">Bloqueio Institucional</h3>
                      <p className="text-red-400 font-medium leading-relaxed">
                        Relatório bloqueado pela governança institucional: inconsistências de causalidade, risco ou dados insuficientes impedem validação executiva.
                      </p>
                      {auditTrail.warnings?.length > 0 && (
                        <ul className="mt-4 list-disc list-inside text-red-400/80 text-sm">
                          {auditTrail.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {auditTrail?.complianceStatus === 'partially_compliant' && (
                      <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-md mb-8 flex items-center gap-3 text-left not-italic">
                        <ShieldAlert className="text-yellow-500 shrink-0" size={20} />
                        <p className="text-yellow-500 font-bold text-sm">Leitura institucional parcial — dados insuficientes para inferência completa.</p>
                      </div>
                    )}
                    <MarkdownText text={aiAnalysis} />
                  </>
                )}
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
              <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center p-12 bg-success/5 border border-success/20 rounded-md text-success">
                <ShieldCheck size={48} className="mb-4 opacity-50" />
                <h4 className="text-body-md font-medium tracking-tight mb-1 uppercase">Eixo Saudável e Alinhado</h4>
                <p className="text-[10px] font-medium opacity-80 text-center w-full max-w-2xl uppercase tracking-widest">Os indicadores atuais não disparam nenhum alerta de desalinhamento com os princípios de Governança.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
