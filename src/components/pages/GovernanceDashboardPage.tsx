
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
import { PageHeader, StatusBadge, MarkdownText } from '../Common';
import { formatValue, formatCurrency, cn } from '../../lib/utils';
import { GOVERNANCE_PRINCIPLES, evaluateAxisRules } from '../../lib/governanceIntelligence';
import { GovernanceInsightPanel } from '../GovernanceInsightPanel';
import { generateGovernanceParecer } from '../../services/governanceAiService';

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
    { area: 'Governança', score: getIndicatorValue('Maturidade de Governança', 0), fullMark: 100 },
    { area: 'Cultura', score: getIndicatorValue('eNPS', 0), fullMark: 100 },
    { area: 'Finanças', score: getIndicatorValue('Margem EBITDA', 0), fullMark: 100 },
    { area: 'Inovação', score: getIndicatorValue('Índice de Inovação', 0), fullMark: 100 },
    { area: 'Marketing', score: getIndicatorValue('ROI de Marketing', 0) * 10, fullMark: 100 },
    { area: 'Comercial', score: getIndicatorValue('Win Rate', 0), fullMark: 100 },
    { area: 'Operacional', score: getIndicatorValue('Índice de Qualidade', 0), fullMark: 100 },
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

  const triggeredRules = useMemo(() => {
    return evaluateAxisRules(flatMetrics, 'Governança Corporativa');
  }, [flatMetrics]);

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');


  const handleGenerateAnalysis = async () => {
    setLoadingAi(true);
    const axisPrinciples = GOVERNANCE_PRINCIPLES.filter(p => p.axis === 'Governança Corporativa');
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-10 animate-executive-fade">
         <div className="relative">
            <div className="absolute inset-0 bg-primary blur-3xl opacity-10 animate-pulse" />
            <div className="w-40 h-40 rounded-[48px] bg-slate-900 flex items-center justify-center text-secondary shadow-2xl relative z-10 border border-white/5">
              <ShieldCheck size={80} strokeWidth={1} />
            </div>
         </div>
         
         <div className="text-center space-y-4 max-w-xl mx-auto px-6">
            <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight leading-tight">Painel de Governança Silencioso</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Não identificamos indicadores financeiros ou estratégicos para o período de <strong>{['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][(selectedMonth || 1) - 1]} de {selectedYear}</strong>. 
              Importe os dados históricos do cliente para ativar o monitoramento de performance.
            </p>
         </div>

         <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-slate-200 rounded-2xl p-1 shadow-sm">
              <div className="flex items-center px-4 py-2 border-r border-slate-100">
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
            
            <button 
              onClick={() => onNavigate('maintenance')}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-slate-900/10"
            >
              IR PARA IMPORTAÇÃO DE DADOS
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Monitoramento Estratégico de Governança"
        subtitle="Monitoramento estratégico de performance multisetorial para alta gestão e conselho de administração."
        icon={ShieldCheck}
        color="bg-slate-900"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            <div className="flex items-center px-4 py-2 border-r border-slate-100">
              <BookOpen size={14} className="text-secondary mr-2.5" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear?.(Number(e.target.value))}
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
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
                  <option key={i} value={i + 1}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-2.5 border border-slate-200 shadow-sm">
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
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
              "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
              isYTD ? "text-secondary" : "text-slate-400"
            )}>
              Anual
            </span>
          </div>
        </div>
      </div>


      {/* Strategic KPIs Grid - Standardized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(() => {
          const maxGroupLen = Math.max(...strategicKPIs.map(kpi => formatValue(kpi.value, kpi.suffix || '').length));
          const groupSizeClass = getValueSizeClass(maxGroupLen);
          
          return strategicKPIs.map((kpi, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {(() => {
                    const Icon = kpi.icon;
                    return <Icon size={24} />;
                  })()}
                </div>
              </div>

              <div>
                <h4 className="text-[clamp(1rem,1.3vw,1.5rem)] font-display font-black text-slate-900 leading-tight group-hover:text-secondary transition-colors whitespace-nowrap overflow-hidden text-ellipsis mb-1.5">
                  {kpi.label}
                </h4>
                <div className="flex items-center gap-2 mb-4">
                  <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm shrink-0", kpi.status === 'positive' ? "bg-emerald-500" : "bg-amber-500")} />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Governança</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className={cn(
                    "font-display font-black text-slate-900 tabular-nums tracking-tighter break-all whitespace-nowrap",
                    groupSizeClass
                  )}>
                    {formatValue(kpi.value, kpi.suffix || '')}
                  </p>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg tabular-nums",
                    kpi.status === 'positive' ? "text-emerald-600" : "text-amber-600"
                  )}>
                    <ArrowUpRight size={12} /> 2.4%
                  </div>
                </div>
              </div>
            </motion.div>
          ));
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Radar Analysis */}
        <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Performance Multidimensional</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Comparativo entre Eixos de Gestão</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
               <PieIcon size={20} />
            </div>
          </div>
          <div className="flex-1 min-h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                   <PolarGrid stroke="#f1f5f9" />
                   <PolarAngleAxis 
                     dataKey="area" 
                     tick={{ fill: '#64748b', fontSize: 10, fontWeight: '900' }}
                   />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar
                     name="Score"
                     dataKey="score"
                     stroke="#3b82f6"
                     fill="#3b82f6"
                     fillOpacity={0.1}
                     strokeWidth={3}
                   />
                   <Tooltip 
                     contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                     itemStyle={{ color: '#0f172a', fontWeight: '900', fontSize: '12px' }}
                   />
                </RadarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Strategic Insights */}
        <div className="bg-slate-50 p-12 rounded-[48px] border border-slate-200/60 shadow-inner flex flex-col justify-between">
           <div className="space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                    <MessageSquare size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Insights Estratégicos</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Recomendações de Alta Gestão</p>
                 </div>
              </div>

              <div className="space-y-6">
                 {[
                   { title: "Otimização de Capital", text: "O ROIC atual de 18.5% sugere oportunidade de realocação de excesso de caixa em projetos de expansão de margem.", icon: Scale },
                   { title: "Eficiência Operacional", text: "O eixo de Operações apresenta o maior gap de performance. Focar na automação do lead time de produção.", icon: Zap },
                   { title: "Retenção de Talentos", text: "O eNPS de 72 está acima da média setorial, fortalecendo a marca empregadora para atração de key players.", icon: Users }
                 ].map((insight, i) => (
                   <div key={i} className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-default">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shrink-0">
                         {(() => {
                           const Icon = insight.icon;
                           return <Icon size={20} />;
                         })()}
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-sm font-black text-slate-800">{insight.title}</h4>
                         <p className="text-xs text-slate-500 leading-relaxed font-medium">{insight.text}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary transition-all shadow-xl shadow-slate-900/10">
              Exportar Relatório Mensal de Governança
           </button>
        </div>
      </div>

      {/* Area Snapshots Grid */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
           <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Health Check das Áreas</h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Visão 360º da Operação</p>
           </div>
           <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all">
              Ver Todos os Indicadores <ChevronRight size={14} />
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {areaSnapshots.map((area, idx) => (
             <motion.div 
               key={idx}
               whileHover={{ y: -8 }}
               onClick={() => onNavigate(area.id)}
               className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden cursor-pointer"
             >
               <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-5 transition-opacity group-hover:opacity-10", area.color)} />
               
               <div className="flex justify-between items-start mb-8">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", area.color)}>
                     {(() => {
                       const Icon = area.icon;
                       return <Icon size={28} />;
                     })()}
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                    area.status === 'positive' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {area.status === 'positive' ? 'Saudável' : 'Atenção'}
                  </div>
               </div>

               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{area.label}</p>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">{area.kpi}</h4>
               </div>

               <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">
                    {formatValue(area.value, area.isCur ? 'R$' : area.suffix || '')}
                  </span>
                  <span className="text-xs font-black text-slate-300 uppercase">Realizado</span>
               </div>

               <div className="mt-10 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: area.status === 'positive' ? '85%' : '60%' }}
                    className={cn("h-full rounded-full", area.color)}
                  />
               </div>
             </motion.div>
           ))}
        </div>
      </div>

      {/* Perspectiva Governança Aplicada ao Eixo de Governança */}
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
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fundamentos institucionais aplicados aos KPIs</p>
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
                <p className="text-xs font-medium opacity-80 text-center max-w-md">Os indicadores atuais não disparam nenhum alerta de desalinhamento com os princípios de Governança.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
