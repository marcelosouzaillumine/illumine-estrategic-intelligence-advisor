import React, { useMemo } from 'react';
import { 
  Database, 
  Activity, 
  Truck, 
  Box, 
  Settings, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Zap,
  MessageSquare,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { StatusBadge, PageHeader } from '../Common';
import { formatValue, formatCurrency, cn } from '../../lib/utils';

interface OperacionalPageProps {
  type: 'logistica' | 'producao';
  clientId: string;
}

const getValueSizeClass = (maxLen: number) => {
  if (maxLen > 22) return "text-[clamp(0.6rem,1vw,0.75rem)]";
  if (maxLen > 18) return "text-[clamp(0.7rem,1.2vw,0.9rem)]";
  if (maxLen > 15) return "text-[clamp(0.85rem,1.4vw,1.1rem)]";
  if (maxLen > 12) return "text-[clamp(1rem,1.7vw,1.35rem)]";
  if (maxLen > 10) return "text-[clamp(1.2rem,2vw,1.7rem)]";
  return "text-[clamp(1.6rem,2.5vw,2.3rem)]";
};

export function OperacionalPage({ type, clientId }: OperacionalPageProps) {
  const [dbIndicators, setDbIndicators] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth() + 1);

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

  const isLogistica = type === 'logistica';

  const indicators = useMemo(() => {
    if (isLogistica) {
      return [
        { label: 'OTIF (Entrega no Prazo)', value: getIndicatorValue('OTIF', 0), suffix: '%', status: 'positive', target: 95, icon: Truck },
        { label: 'Giro de Estoque', value: getIndicatorValue('Giro de Estoque', 0), suffix: 'x', status: 'neutral', target: 6.0, icon: Box },
        { label: 'Custo Frete / Receita', value: getIndicatorValue('Custo Frete', 0), suffix: '%', status: 'negative', target: 6.0, icon: TrendingUp },
        { label: 'Tempo Médio Entrega', value: getIndicatorValue('Lead Time Entrega', 0), suffix: ' dias', status: 'positive', target: 4.0, icon: Clock }
      ];
    } else {
      return [
        { label: 'OEE (Eficiência Equip.)', value: getIndicatorValue('OEE', 0), suffix: '%', status: 'positive', target: 85, icon: Settings },
        { label: 'Nível de Refugo', value: getIndicatorValue('Nível de Refugo', 0), suffix: '%', status: 'negative', target: 1.5, icon: AlertCircle },
        { label: 'Lead Time Produção', value: getIndicatorValue('Lead Time Produção', 0), suffix: ' dias', status: 'neutral', target: 10, icon: Clock },
        { label: 'Produtividade Hora', value: getIndicatorValue('Produtividade Hora', 0), suffix: ' und/h', status: 'positive', target: 140, icon: Activity }
      ];
    }
  }, [isLogistica, dbIndicators]);

  const recommendations = useMemo(() => {
    if (isLogistica) {
      return [
        "Negociar tabelas de frete com transportadoras alternativas para rotas críticas.",
        "Implementar sistema de roteirização inteligente para otimizar entregas locais.",
        "Reduzir estoque de segurança de itens C para melhorar o giro total."
      ];
    } else {
      return [
        "Implementar manutenção preventiva programada para reduzir paradas não planejadas.",
        "Treinar operadores em técnicas de Lean Manufacturing para redução de desperdício.",
        "Revisar fluxo de processos na linha 3 para eliminar gargalos identificados."
      ];
    }
  }, [isLogistica]);

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      {/* Strategic Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-primary p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              {isLogistica ? <Truck size={20} className="text-secondary" /> : <Activity size={20} className="text-secondary" />}
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">{isLogistica ? 'Eficiência em Logística' : 'Produção & Processos'}</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">{isLogistica ? 'Monitoramento estratégico de entregas, fretes e cadeia de suprimentos.' : 'Otimização de processos, produtividade e controle de qualidade.'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="relative z-10 text-right bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Eficiência Operacional</span>
             <span className="text-emerald-400 font-black uppercase text-sm flex items-center justify-end gap-2">
               <ShieldCheck size={16} />
               {isLogistica ? 'Estável' : 'Alta Performance'}
             </span>
          </div>
        </div>
      </div>


      {/* KPI Grid - Standardized */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(() => {
          const maxGroupLen = Math.max(...indicators.map(kpi => formatValue(kpi.value, kpi.suffix || '').length));
          const groupSizeClass = getValueSizeClass(maxGroupLen);
          
          return indicators.map((kpi, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
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
                  <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm shrink-0", kpi.status === 'positive' ? "bg-emerald-500" : kpi.status === 'negative' ? "bg-rose-500" : "bg-amber-500")} />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">{isLogistica ? 'Logística' : 'Produção'}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className={cn(
                    "font-black text-slate-900 tabular-nums tracking-tighter whitespace-nowrap",
                    groupSizeClass
                  )}>
                    {formatValue(kpi.value, kpi.suffix || '')}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-2">
                  <div className="h-1 flex-1 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full", kpi.status === 'positive' ? "bg-emerald-500" : kpi.status === 'negative' ? "bg-rose-500" : "bg-amber-500")}
                      style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums">Meta: {formatValue(kpi.target, kpi.suffix || '')}</span>
                </div>
              </div>
            </motion.div>
          ));
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Chart Placeholder */}
         <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                  <BarChart3 size={20} className="text-primary" /> Histórico de Eficiência
               </h3>
               <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">Diário</button>
                  <button className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Semanal</button>
               </div>
            </div>
            <div className="h-[300px] bg-slate-50 rounded-[32px] flex items-center justify-center border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Monitoramento em Tempo Real</p>
            </div>
         </div>

         {/* Recommendations */}
         <div className="bg-primary p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 p-8 text-secondary/5">
               <Zap size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10 space-y-8">
               <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-3">
                  <MessageSquare size={20} /> Insights do Eixo Operacional
               </h3>
               <div className="space-y-6">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-4 group cursor-default">
                       <div className="w-8 h-8 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-black text-xs shrink-0 group-hover:bg-secondary group-hover:text-primary transition-all">
                          {i + 1}
                       </div>
                       <p className="text-xs font-medium text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                          {rec}
                       </p>
                    </div>
                  ))}
               </div>
               <button className="w-full py-4 bg-secondary text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                  Otimizar Processos
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
