import React, { useState } from 'react';
import { 
  MessageSquare, 
  Target, 
  Brain, 
  BarChart, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Zap,
  Info,
  ArrowRight,
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader, SectionHeader, StatusBadge } from '../Common';
import { cn } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const INITIAL_PILLARS = [
  { 
    id: 'frequency', 
    title: 'Frequência de Rituais', 
    description: 'Consistência nas reuniões de 1:1 e ciclos de avaliação.',
    score: 0,
    status: 'Vermelho'
  },
  { 
    id: 'quality', 
    title: 'Qualidade Técnica', 
    description: 'Capacidade das lideranças em fornecer feedbacks construtivos e acionáveis.',
    score: 0,
    status: 'Vermelho'
  },
  { 
    id: 'safety', 
    title: 'Segurança Psicológica', 
    description: 'Nível de abertura para feedbacks ascendentes (equipe para líder).',
    score: 0,
    status: 'Vermelho'
  },
  { 
    id: 'action', 
    title: 'Plano de Desenvolvimento', 
    description: 'Conversão dos feedbacks em planos de ação concretos.',
    score: 0,
    status: 'Vermelho'
  }
];

export function CulturaFeedbackPage({ clientId }: { clientId: string }) {
  const [pillars, setPillars] = useState(INITIAL_PILLARS);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'recommendations'>('overview');
  const [checklistAnswers, setChecklistAnswers] = useState<Record<string, string>>({});

  // Load data from Firestore
  React.useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    
    const q = query(collection(db, 'culture_feedback'), where('clientId', '==', clientId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setPillars(data.pillars || INITIAL_PILLARS);
        setChecklistAnswers(data.checklist || {});
      } else {
        setPillars(INITIAL_PILLARS);
        setChecklistAnswers({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  const handleSave = async () => {
    if (!clientId) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, 'culture_feedback', `feedback_${clientId}`);
      await setDoc(docRef, {
        clientId,
        pillars,
        checklist: checklistAnswers,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving culture feedback:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasData = pillars.some(p => p.score > 0) || Object.keys(checklistAnswers).length > 0;

  return (
    <div className="space-y-10 pb-20">
      <PageHeader
        title="Análise da Cultura de Feedback"
        subtitle="Avalie a maturidade da comunicação e o impacto do programa de feedback no desenvolvimento da equipe."
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 overflow-x-auto max-w-md">
            {[
              { id: 'overview', label: 'PANORAMA', icon: BarChart },
              { id: 'assessment', label: 'AVALIAÇÃO', icon: ShieldCheck },
              { id: 'recommendations', label: 'EVOLUÇÃO', icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving || loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <Zap size={16} fill="currentColor" />
            {isSaving ? 'Salvando...' : 'Salvar Diagnóstico'}
          </button>
        </div>
      </div>


      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Pillars Grid */}
              <div className="grid grid-cols-2 gap-4">
                {pillars.map(pillar => (
                  <div key={pillar.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                        <MessageSquare size={20} />
                      </div>
                      <StatusBadge status={pillar.status as any} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-primary leading-tight">{pillar.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{pillar.description}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-black">
                        <span className="text-slate-400">MATURIDADE</span>
                        <span className="text-primary">{pillar.score}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${pillar.score}%` }}
                          className={cn(
                            "h-full rounded-full",
                            pillar.status === 'Verde' ? "bg-emerald-500" : pillar.status === 'Amarelo' ? "bg-amber-500" : "bg-rose-500"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cultural Insight Card */}
              <div className="bg-primary rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Star size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Brain size={24} className="text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white/60">Insight Cultural</p>
                      <h3 className="text-2xl font-display font-black text-white">Equilíbrio de Poder</h3>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed italic">
                    "Uma cultura de feedback forte não é medida pelo quanto o líder fala, mas pelo quanto a equipe se sente segura para corrigir o líder sem medo de retaliação. A segurança psicológica é o solo onde a inovação floresce."
                  </p>
                  <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Taxa de Adesão</p>
                      <p className="text-2xl font-display font-black text-secondary">{hasData ? '78%' : '---'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Índice de Confiança</p>
                      <p className="text-2xl font-display font-black text-emerald-400">{hasData ? 'B+' : '---'}</p>
                    </div>
                  </div>
                </div>
                <button className="relative z-10 mt-8 w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2">
                  Ver Detalhes do Diagnóstico
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Participation Chart Placeholder */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-premium">
              <SectionHeader title="Volume de Feedback por Nível" subtitle="Distribuição de interações mensais mapeadas no sistema." icon={TrendingUp} />
              <div className="mt-8 h-48 flex items-end gap-6 px-4">
                 {[
                   { label: 'Diretoria', val: hasData ? 90 : 0, color: 'bg-primary' },
                   { label: 'Gerência', val: hasData ? 75 : 0, color: 'bg-secondary' },
                   { label: 'Coordenação', val: hasData ? 60 : 0, color: 'bg-indigo-500' },
                   { label: 'Operacional', val: hasData ? 40 : 0, color: 'bg-slate-300' },
                 ].map(bar => (
                   <div key={bar.label} className="flex-1 space-y-4">
                     <div className="relative group">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${bar.val * 1.5}px` }}
                         className={cn("w-full rounded-xl transition-all", bar.color)}
                       />
                       {hasData && (
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                           {bar.val}%
                         </div>
                       )}
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase text-center">{bar.label}</p>
                   </div>
                 ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'assessment' && (
          <motion.div 
            key="assessment"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <SectionHeader title="Checklist de Maturidade" subtitle="Avalie os componentes fundamentais do programa de feedback da empresa." icon={ShieldCheck} />
            <div className="grid gap-4">
              {[
                { q: "Existe um cronograma oficial de 1:1s respeitado pelas lideranças?", cat: "Rituais" },
                { q: "As lideranças receberam treinamento formal sobre como dar feedback?", cat: "Capacitação" },
                { q: "O feedback é registrado em um sistema ou ferramenta de acompanhamento?", cat: "Gestão" },
                { q: "Há abertura para o feedback 'Bottom-Up' de forma estruturada?", cat: "Cultura" },
                { q: "Os feedbacks resultam em PDIs (Planos de Desenvolvimento Individual) claros?", cat: "Impacto" },
                { q: "A empresa utiliza avaliações 360º em ciclos periódicos?", cat: "Escopo" },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex items-center justify-between group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">{item.cat}</p>
                      <p className="text-sm font-bold text-primary">{item.q}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['Sim', 'Não', 'Parcial'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setChecklistAnswers({...checklistAnswers, [item.q]: opt})}
                        className={cn(
                          "px-4 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all",
                          checklistAnswers[item.q] === opt
                            ? (opt === 'Sim' ? "bg-emerald-500 border-emerald-500 text-white" : opt === 'Não' ? "bg-rose-500 border-rose-500 text-white" : "bg-amber-500 border-amber-500 text-white")
                            : "border-slate-100 text-slate-400 hover:bg-slate-50"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'recommendations' && (
          <motion.div 
            key="recommendations"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {[
              { 
                title: 'Nível 1: Estabilização', 
                icon: ShieldCheck, 
                desc: 'Implementar a agenda obrigatória de 1:1 quinzenais para todos os gestores.',
                tasks: ['Definição de calendário', 'Template padrão de ata', 'Check de participação']
              },
              { 
                title: 'Nível 2: Capacitação', 
                icon: Users, 
                desc: 'Workshop intensivo de Comunicação Não-Violenta e técnicas de feedback radical.',
                tasks: ['Treinamento de gestores', 'Simulações reais', 'Material de apoio (Playbook)']
              },
              { 
                title: 'Nível 3: Institucionalização', 
                icon: Zap, 
                desc: 'Lançamento do primeiro ciclo de Avaliação 360º com foco em competências core.',
                tasks: ['Mapeamento de competências', 'Setup da plataforma', 'Comunicação interna']
              }
            ].map((plan, i) => (
              <div key={i} className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-premium flex flex-col justify-between group hover:-translate-y-2 transition-all">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <plan.icon size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-primary leading-tight">{plan.title}</h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{plan.desc}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Ações Imediatas</p>
                    {plan.tasks.map(t => (
                      <div key={t} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <button className="mt-8 w-full py-4 bg-slate-50 hover:bg-primary hover:text-white text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 group-hover:border-primary">
                  Ativar Plano
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
