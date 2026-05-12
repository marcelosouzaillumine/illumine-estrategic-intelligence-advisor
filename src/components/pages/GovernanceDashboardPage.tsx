
import React, { useMemo } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Activity, 
  Globe, 
  ShoppingBag, 
  FileText, 
  Zap, 
  BarChart3, 
  Target,
  ArrowUpRight,
  PieChart as PieIcon,
  MessageSquare,
  Scale,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import { Page } from '../../app/navigation';
import { motion } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { formatCurrency, cn } from '../../lib/utils';

interface GovernanceDashboardPageProps {
  clientId: string;
  onNavigate: (page: Page) => void;
}

export function GovernanceDashboardPage({ clientId, onNavigate }: GovernanceDashboardPageProps) {
  // Strategic KPIs
  const strategicKPIs = useMemo(() => [
    { label: 'ROIC (Retorno s/ Cap. Investido)', value: 18.5, suffix: '%', status: 'positive', icon: Target },
    { label: 'EBITDA (Margem)', value: 24.2, suffix: '%', status: 'positive', icon: Zap },
    { label: 'Margem Líquida', value: 12.8, suffix: '%', status: 'neutral', icon: TrendingUp },
    { label: 'Grau de Maturidade de Risco', value: 85, suffix: '%', status: 'positive', icon: ShieldCheck }
  ], []);

  // Radar Data for Areas
  const radarData = [
    { area: 'Marketing', score: 85, fullMark: 100 },
    { area: 'Vendas', score: 92, fullMark: 100 },
    { area: 'Operações', score: 78, fullMark: 100 },
    { area: 'RH', score: 88, fullMark: 100 },
    { area: 'Compliance', score: 95, fullMark: 100 },
    { area: 'Financeiro', score: 90, fullMark: 100 },
  ];

  // Area Snapshots
  const areaSnapshots = [
    { 
      id: 'marketing_estrategico' as Page,
      label: 'Marketing', 
      kpi: 'CAC', 
      value: 450, 
      isCur: true, 
      status: 'positive', 
      icon: Globe,
      color: 'bg-blue-500'
    },
    { 
      id: 'comercial_estrategico' as Page,
      label: 'Comercial', 
      kpi: 'Conversão', 
      value: 24, 
      suffix: '%', 
      status: 'positive', 
      icon: ShoppingBag,
      color: 'bg-emerald-500'
    },
    { 
      id: 'producao' as Page,
      label: 'Operacional', 
      kpi: 'OEE', 
      value: 82, 
      suffix: '%', 
      status: 'neutral', 
      icon: Activity,
      color: 'bg-amber-500'
    },
    { 
      id: 'desenvolvimento_humano' as Page,
      label: 'Pessoas (DHO)', 
      kpi: 'eNPS', 
      value: 72, 
      status: 'positive', 
      icon: Users,
      color: 'bg-purple-500'
    },
    { 
      id: 'compliance_page' as Page,
      label: 'Compliance', 
      kpi: 'Aderência', 
      value: 98, 
      suffix: '%', 
      status: 'positive', 
      icon: ShieldCheck,
      color: 'bg-slate-800'
    },
    { 
      id: 'administrativa_indicadores' as Page,
      label: 'Administrativa', 
      kpi: 'Eficiência', 
      value: 85, 
      suffix: '%', 
      status: 'positive', 
      icon: FileText,
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="space-y-10 pb-32">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-slate-900 p-12 rounded-[48px] text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
            <ShieldCheck size={200} strokeWidth={1} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <LayoutGrid size={24} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Governance & Strategy</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">Dashboard de Governança</h1>
            <p className="text-slate-400 font-medium max-w-xl leading-relaxed">
              Monitoramento estratégico de performance multisetorial para alta gestão e conselho de administração.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] text-right">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Performance Global</span>
             <div className="flex items-center gap-3 justify-end">
                <span className="text-3xl font-black text-emerald-400">92.4</span>
                <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  Otimizado
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Strategic KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {strategicKPIs.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all mb-6">
               <kpi.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <div className="flex items-end gap-3">
               <p className="text-3xl font-black text-slate-800 tracking-tighter">
                 {kpi.value}{kpi.suffix}
               </p>
               <div className={cn(
                 "mb-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                 kpi.status === 'positive' ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
               )}>
                 <ArrowUpRight size={12} /> 2.4%
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
                     tick={{ fill: '#64748b', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' }}
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
    </div>
  );
}
