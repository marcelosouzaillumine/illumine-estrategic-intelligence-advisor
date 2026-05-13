
import React, { useMemo, useState } from 'react';
import { 
  ShieldCheck, TrendingUp, Users, Activity, Globe, ShoppingBag, 
  FileText, Zap, BarChart3, Target, ArrowUpRight, LayoutGrid, 
  BookOpen, Lightbulb, Loader2, PieChart as PieIcon, MessageSquare, Scale, ChevronRight
} from 'lucide-react';
import { Page } from '../../app/navigation';
import { motion } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip
} from 'recharts';
import { PageHeader, StatusBadge } from '../Common';
import { formatValue, formatCurrency, cn } from '../../lib/utils';
import { SACERDOTAL_PRINCIPLES, evaluateAxisRules } from '../../lib/sacerdotalIntelligence';
import { SacerdotalInsightPanel } from '../SacerdotalInsightPanel';
import { generateSacerdotalParecer } from '../../services/sacerdotalAiService';

interface GovernanceDashboardPageProps {
  clientId: string;
  onNavigate: (page: Page) => void;
}

export function GovernanceDashboardPage({ clientId, onNavigate }: GovernanceDashboardPageProps) {
  // Strategic KPIs
  const strategicKPIs = useMemo(() => [
    { label: 'ROI (Retorno sobre Investimento)', value: 18.5, suffix: '%', status: 'positive', icon: Target },
    { label: 'EBITDA (Margem)', value: 24.2, suffix: '%', status: 'positive', icon: Zap },
    { label: 'Índice de Alinhamento (Princípios)', value: 85, suffix: '', status: 'positive', icon: BookOpen },
    { label: 'Grau de Maturidade de Risco', value: 85, suffix: '%', status: 'positive', icon: ShieldCheck }
  ], []);

  // Radar Data for Areas
  const radarData = [
    { area: 'Governança', score: 85, fullMark: 100 },
    { area: 'Cultura', score: 92, fullMark: 100 },
    { area: 'Gestão', score: 90, fullMark: 100 },
    { area: 'Inovação', score: 88, fullMark: 100 },
    { area: 'Marketing', score: 85, fullMark: 100 },
    { area: 'Comercial', score: 92, fullMark: 100 },
    { area: 'Operação', score: 82, fullMark: 100 },
  ];

  // Area Snapshots
  const areaSnapshots = [
    { 
      id: 'governanca_estrategica' as Page,
      label: 'Governança', 
      kpi: 'Maturidade', 
      value: 85, 
      suffix: '%', 
      status: 'positive', 
      icon: ShieldCheck,
      color: 'bg-slate-800'
    },
    { 
      id: 'dashboard_cultura' as Page,
      label: 'Cultura', 
      kpi: 'eNPS', 
      value: 72, 
      status: 'positive', 
      icon: Users,
      color: 'bg-purple-500'
    },
    { 
      id: 'dashboard_gestao' as Page,
      label: 'Gestão', 
      kpi: 'EBITDA', 
      value: 24.2, 
      suffix: '%', 
      status: 'positive', 
      icon: BarChart3,
      color: 'bg-indigo-500'
    },
    { 
      id: 'dashboard_inovacao' as Page,
      label: 'Inovação', 
      kpi: 'Índice', 
      value: 68, 
      suffix: '%', 
      status: 'neutral', 
      icon: Lightbulb,
      color: 'bg-cyan-500'
    },
    { 
      id: 'dashboard_marketing' as Page,
      label: 'Marketing', 
      kpi: 'CPL', 
      value: 45, 
      isCur: true, 
      status: 'neutral', 
      icon: Globe,
      color: 'bg-blue-500'
    },
    { 
      id: 'dashboard_comercial' as Page,
      label: 'Comercial', 
      kpi: 'Conversão', 
      value: 24, 
      suffix: '%', 
      status: 'positive', 
      icon: ShoppingBag,
      color: 'bg-emerald-500'
    },
    { 
      id: 'dashboard_operacional' as Page,
      label: 'Operação', 
      kpi: 'OEE', 
      value: 82, 
      suffix: '%', 
      status: 'neutral', 
      icon: Activity,
      color: 'bg-amber-500'
    }
  ];

  const flatMetrics = useMemo(() => {
    return strategicKPIs.reduce((acc: any, kpi: any) => ({...acc, [kpi.label]: kpi.value}), {});
  }, [strategicKPIs]);

  const triggeredRules = useMemo(() => {
    return evaluateAxisRules(flatMetrics, 'Governança');
  }, [flatMetrics]);

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-amber-800 font-black">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleGenerateAnalysis = async () => {
    setLoadingAi(true);
    const result = await generateSacerdotalParecer({
      clientName: 'Sua Empresa',
      industry: 'Geral',
      metrics: flatMetrics,
      topPrinciples: SACERDOTAL_PRINCIPLES.filter(p => p.axis === 'Governança').map(p => p.name)
    });
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      {/* Premium Header - Standardized */}
      <PageHeader 
        title="Dashboard de Governança"
        subtitle="Monitoramento estratégico de performance multisetorial para alta gestão e conselho de administração."
        icon={ShieldCheck}
        color="bg-slate-900"
      />

      {/* Strategic KPIs Grid - Standardized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {strategicKPIs.map((kpi, idx) => (
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
                <kpi.icon size={24} />
              </div>
              <div className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                kpi.status === 'positive' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
              )}>
                {kpi.status === 'positive' ? 'Saudável' : 'Atenção'}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 whitespace-nowrap overflow-hidden text-ellipsis">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-display font-black text-slate-900 tabular-nums tracking-tighter whitespace-nowrap">
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
        ))}
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
                         <insight.icon size={20} />
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
                     <area.icon size={28} />
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
                    {area.isCur ? formatCurrency(area.value) : `${area.value}${area.suffix || ''}`}
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

      {/* Perspectiva Sacerdotal Aplicada ao Eixo de Governança */}
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
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Princípios eternos aplicados aos KPIs de Governança</p>
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
                <p className="text-xs font-medium opacity-80 text-center max-w-md">Os indicadores atuais não disparam nenhum alerta de desalinhamento com os princípios de Governança.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
