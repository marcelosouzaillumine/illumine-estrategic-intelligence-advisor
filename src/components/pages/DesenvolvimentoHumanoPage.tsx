
import React, { useMemo } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Zap, 
  BarChart3, 
  ShieldCheck,
  Target,
  MessageSquare,
  Award,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, cn, formatValue } from '../../lib/utils';
import { PageHeader, KpiCard } from '../Common';

interface DesenvolvimentoHumanoPageProps {
  clientId: string;
}

export function DesenvolvimentoHumanoPage({ clientId }: DesenvolvimentoHumanoPageProps) {
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

  const hasData = dbIndicators.length > 0;

  const cultureIndicators = useMemo(() => [
    { label: 'eNPS (Clima)', value: getIndicatorValue('eNPS', 0), suffix: '', status: 'positive', target: 60, icon: Users },
    { label: 'Índice de Clima', value: getIndicatorValue('Índice de Clima Organizacional', 0), suffix: '/100', status: 'positive', target: 80, icon: Heart },
    { label: 'Turnover Mensal', value: getIndicatorValue('Turnover', 0), suffix: '%', status: 'positive', target: 2.0, icon: TrendingUp },
    { label: 'Absenteísmo', value: getIndicatorValue('Absenteísmo', 0), suffix: '%', status: 'negative', target: 1.5, icon: Activity },
    { label: 'Taxa de Promoção', value: getIndicatorValue('Taxa de Promoção Interna', 0), suffix: '%', status: 'positive', target: 10, icon: Award },
    { label: 'Inv. Treinamento', value: getIndicatorValue('Investimento em P&D', 0), isCur: true, status: 'neutral', target: 60000, icon: Zap }
  ], [dbIndicators]);

  return (
    <div className="max-w-[1440px] mx-auto space-y-12 pb-32">
      {/* Strategic Culture Section */}
      <div className="space-y-8">
        <PageHeader 
          title="Desenvolvimento Humano" 
          subtitle="Gestão de Pessoas, Cultura e Capital Humano"
          icon={Users}
          color="executive"
          actions={
            <div className="relative z-10 text-right bg-surface-container/30 backdrop-blur-md border border-border rounded-md px-6 py-4 shadow-inner">
               <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-1">Saúde Organizacional</span>
               <span className="text-success font-medium uppercase text-[10px] flex items-center justify-end gap-2 tracking-widest">
                 <ShieldCheck size={16} />
                 Excelente
               </span>
            </div>
          }
        />

        {/* Culture KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cultureIndicators.map((kpi, idx) => (
            <KpiCard 
              key={idx}
              title={kpi.label}
              value={formatValue(kpi.value, '')}
              suffix={kpi.isCur ? 'R$' : kpi.suffix || ''}
              icon={kpi.icon}
              status={kpi.status === 'positive' ? 'Verde' : kpi.status === 'negative' ? 'Vermelho' : 'Amarelo'}
            />
          ))}
        </div>
      </div>

       {/* Recommendations & Strategy - Hidden if no data */}
      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 card-premium p-10">
              <h3 className="text-[11px] font-medium text-foreground uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Target size={20} className="text-primary" /> Foco em Retenção e Propósito
              </h3>
              <div className="h-[200px] bg-surface-container/30 rounded-md flex items-center justify-center border-2 border-dashed border-border shadow-inner">
                 <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px] italic">Mapa de Talentos e Sucessão (Em Desenvolvimento)</p>
              </div>
           </div>

           <div className="bg-executive p-10 rounded-md text-white shadow-premium relative overflow-hidden border border-white/5">
              <div className="absolute right-0 top-0 p-8 text-secondary/5">
                 <Zap size={120} strokeWidth={1} />
              </div>
              <div className="relative z-10 space-y-8">
                 <h3 className="text-[11px] font-medium text-secondary uppercase tracking-[0.2em] flex items-center gap-3">
                    <MessageSquare size={20} /> Insights de Gente & Gestão
                 </h3>
                 <div className="space-y-6">
                    {[
                      "Implementar programa de feedback 360º para nível de liderança.",
                      "Aumentar o budget de treinamento técnico para a área de Operações.",
                      "Revisar o pacote de benefícios para aumentar a competitividade no eNPS."
                    ].map((rec, i) => (
                      <div key={i} className="flex gap-4 group cursor-default">
                         <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-secondary font-medium text-[10px] shrink-0 group-hover:bg-secondary group-hover:text-primary transition-all shadow-inner">
                            {i + 1}
                         </div>
                         <p className="text-[10px] font-medium text-white/60 leading-relaxed group-hover:text-white transition-colors uppercase tracking-widest italic">
                            {rec}
                         </p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
