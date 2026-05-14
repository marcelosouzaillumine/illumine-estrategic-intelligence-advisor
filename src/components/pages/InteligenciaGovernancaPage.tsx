import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Target, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  ChevronRight,
  Brain,
  Activity,
  Download,
  Share2,
  Loader2,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer
} from 'recharts';
import { PageHeader, MarkdownText } from '../Common';
import { cn } from '../../lib/utils';
import { 
  GOVERNANCE_PRINCIPLES, 
  calculateGovernanceMaturityScore, 
  calculateAxisMaturity,
  getMaturityClassification,
  GOVERNANCE_ALIGNMENT_ASSESSMENT, 
  getPrincipleById,
  crossValidateWithIndicators,
  calculateGovernanceAlignmentScore
} from '../../lib/governanceIntelligence';
import { db } from '../../lib/firebase';
import { query, collection, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateGovernanceDiagnosis } from '../../services/aiService';

export function InteligenciaGovernancaPage({ clientId }: { clientId: string }) {
  const [activeTab, setActiveTab] = useState<'principios' | 'score'>('score');
  const [selectedAxis, setSelectedAxis] = useState<string>('Todos');
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [aiDiagnosis, setAiDiagnosis] = useState<any>(null);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [saving, setSaving] = useState(false);

  const eixos = ['Todos', 'Governança Corporativa', 'Cultura Organizacional', 'Gestão Administrativa e Financeira', 'Gestão de Inovação', 'Gestão de Marketing', 'Gestão Comercial', 'Gestão Operacional'];

  // Fetch real indicators
  useEffect(() => {
    if (!clientId) return;
    const today = new Date();
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId),
      where('ano', '==', today.getFullYear()),
      where('mes', '==', today.getMonth() + 1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());
      setIndicators(docs);
    });

    return () => unsubscribe();
  }, [clientId]);

  // Load latest diagnosis
  useEffect(() => {
    if (!clientId) return;
    const q = query(
      collection(db, 'governance_diagnostics'),
      where('clientId', '==', clientId),
      orderBy('date', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const latest = snapshot.docs[0].data();
        setResponses(latest.responses || {});
        setAiDiagnosis(latest.diagnosis);
        setShowResults(true);
      }
    });

    return () => unsubscribe();
  }, [clientId]);

  const filteredPrinciples = selectedAxis === 'Todos' 
    ? GOVERNANCE_PRINCIPLES 
    : GOVERNANCE_PRINCIPLES.filter(p => p.axis === selectedAxis);

  const handleScoreChange = (principleId: string, value: number) => {
    setResponses(prev => ({ ...prev, [principleId]: value }));
  };

  // Cross-validation logic
  const finalResponses = useMemo(() => {
    if (!indicators.length) return responses;
    return crossValidateWithIndicators(responses, indicators);
  }, [responses, indicators]);

  const maturityScore = calculateGovernanceMaturityScore(finalResponses);
  const alignmentScore = calculateGovernanceAlignmentScore(indicators);
  const classification = getMaturityClassification(maturityScore);

  const radarData = eixos.filter(e => e !== 'Todos').map(e => ({
    subject: e.replace('Gestão ', ''),
    A: calculateAxisMaturity(finalResponses, e as any),
    fullMark: 100,
  }));

  const handleGenerateIntelligence = async () => {
    setShowResults(true);
    setLoadingDiagnosis(true);
    
    const axisScores: Record<string, number> = {};
    eixos.filter(e => e !== 'Todos').forEach(e => {
      axisScores[e] = calculateAxisMaturity(finalResponses, e as any);
    });

    const diagnosis = await generateGovernanceDiagnosis(axisScores, indicators, "Empresa");
    setAiDiagnosis(diagnosis);
    setLoadingDiagnosis(false);
  };

  const handleSaveDiagnosis = async () => {
    if (!aiDiagnosis) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'governance_diagnostics'), {
        clientId,
        date: serverTimestamp(),
        maturityScore,
        alignmentScore,
        classification: classification.label,
        responses: finalResponses,
        diagnosis: aiDiagnosis,
        axisScores: eixos.filter(e => e !== 'Todos').reduce((acc, e) => ({
          ...acc,
          [e]: calculateAxisMaturity(finalResponses, e as any)
        }), {})
      });
      alert('Diagnóstico salvo com sucesso no histórico executivo.');
    } catch (error) {
      console.error('Erro ao salvar diagnóstico:', error);
      alert('Erro ao salvar diagnóstico.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title="Inteligência de Governança" 
        subtitle="O motor de maturidade organizacional baseado em princípios de gestão e dados reais." 
        icon={Brain}
        color="bg-slate-900"
      />

      {/* Indicadores de Status - Reposicionados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-amber-500/10 rounded-[22px] flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <Target size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Maturidade Sistêmica</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-slate-900">{maturityScore}</h2>
              <span className="text-[10px] font-bold text-slate-400">/100</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-[22px] flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Alinhamento Operacional</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-slate-900">{alignmentScore}</h2>
              <span className="text-[10px] font-bold text-slate-400">/100</span>
            </div>
          </div>
        </div>

        <div className={cn("p-8 rounded-[32px] border shadow-sm flex flex-col justify-center items-center text-center space-y-2", classification.bg, classification.border)}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status Organizacional</p>
          <h3 className={cn("text-xl font-black uppercase tracking-widest", classification.color)}>
            {classification.label}
          </h3>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('score')}
          className={cn(
            "px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
            activeTab === 'score' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Checklist de Maturidade
        </button>
        <button
          onClick={() => setActiveTab('principios')}
          className={cn(
            "px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
            activeTab === 'principios' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Biblioteca de Princípios
        </button>
      </div>

      {activeTab === 'principios' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-wrap gap-2">
            {eixos.map(eixo => (
              <button
                key={eixo}
                onClick={() => setSelectedAxis(eixo)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  selectedAxis === eixo 
                    ? "bg-slate-900 text-white shadow-xl scale-105" 
                    : "bg-white text-slate-500 border border-slate-200 hover:border-amber-300 hover:text-amber-600"
                )}
              >
                {eixo}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPrinciples.map(principle => (
                <motion.div
                  key={principle.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all flex flex-col h-full group"
                >
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-amber-50 transition-colors">
                        <BookOpen size={20} className="text-amber-500" />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                         {principle.reference}
                      </span>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{principle.axis}</p>
                       <h3 className="text-xl font-black text-slate-800">{principle.name}</h3>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-slate-500 italic mb-8 leading-relaxed">"{principle.description}"</p>
                  
                  <div className="mt-auto space-y-6 pt-6 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Impacto Estratégico</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={10} 
                              className={cn(
                                star <= principle.strategicImpact ? "fill-amber-500 text-amber-500" : "fill-slate-100 text-slate-200"
                              )} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cross-Impact</p>
                        <p className="text-[10px] font-bold text-slate-600 leading-tight">{principle.crossAxisImpact}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Plano de Ação Executivo (12 Etapas)</p>
                       <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {principle.executiveRecommendations.map((rec, i) => (
                            <div key={i} className="flex gap-3 items-start group/item">
                              <div className="w-5 h-5 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 text-[9px] font-black group-hover/item:bg-amber-500 group-hover/item:text-white transition-colors">
                                {i + 1}
                              </div>
                              <p className="text-[11px] font-semibold text-slate-600 leading-snug pt-0.5">
                                 {rec}
                              </p>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {activeTab === 'score' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {!showResults ? (
            <div className="space-y-16">
              <div className="bg-white rounded-[48px] p-12 md:p-16 border border-slate-200 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50 rounded-full -mr-32 -mt-32 blur-[100px] opacity-60" />
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full -ml-20 -mb-20 blur-[80px] opacity-40" />
                 
                 <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
                   <div className="shrink-0 relative">
                     <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 animate-pulse" />
                     <div className="w-24 h-24 bg-slate-900 rounded-[32px] flex items-center justify-center text-amber-500 shadow-2xl relative z-10 rotate-3 group-hover:rotate-0 transition-all duration-700">
                       <Target size={40} />
                     </div>
                   </div>
                   
                   <div className="flex-1 space-y-4">
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Activity size={12} /> Avaliação Inteligente
                     </div>
                     <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-[1.1]">
                       Checklist de Maturidade Sistêmica
                     </h2>
                     <p className="text-slate-500 text-lg leading-relaxed max-w-2xl font-medium">
                       Esta jornada cruzará sua percepção qualitativa com os indicadores reais da organização, gerando uma camada semântica de análise sobre a integridade e maturidade da sua gestão.
                     </p>
                   </div>
                   
                   <div className="hidden xl:block w-px h-24 bg-slate-100" />
                   
                   <div className="hidden xl:flex flex-col items-center gap-2 px-8">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progresso</p>
                     <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-20 h-20 rotate-[-90deg]">
                          <circle cx="40" cy="40" r="36" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                          <circle cx="40" cy="40" r="36" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray={`${(Object.keys(responses).length / 50) * 226} 226`} strokeLinecap="round" className="transition-all duration-1000" />
                        </svg>
                        <span className="absolute text-sm font-black text-slate-900">{Math.round((Object.keys(responses).length / 50) * 100)}%</span>
                     </div>
                   </div>
                 </div>
              </div>

              {/* Questionnaire */}
              <div className="space-y-12">
                {GOVERNANCE_ALIGNMENT_ASSESSMENT.map((axisGroup) => (
                  <div key={axisGroup.axis} className="space-y-8">
                    <div className="flex items-center gap-6">
                       <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">{axisGroup.axis}</h3>
                       <div className="h-px w-full bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {axisGroup.questions.map((q) => {
                        const principle = q;
                        if (!principle) return null;
                        
                        return (
                          <motion.div 
                            key={q.id}
                            className={cn(
                              "bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm transition-all space-y-8 relative overflow-hidden group hover:border-amber-200 hover:shadow-2xl",
                              responses[principle.id] !== undefined && "border-amber-200 bg-amber-50/10"
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">{principle.name}</span>
                                <h4 className="text-lg font-bold text-slate-800 leading-snug max-w-md">{principle.maturityQuestion}</h4>
                              </div>
                              <div className="bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 text-[10px] font-black text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 group-hover:border-amber-200 transition-colors flex items-center gap-2">
                                <span className="uppercase">Impacto</span>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      size={8} 
                                      className={cn(
                                        star <= principle.strategicImpact ? "fill-amber-500 text-amber-500" : "fill-slate-300 text-slate-300"
                                      )} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
                                <span>Inexistente (0)</span>
                                <span>Referência (5)</span>
                              </div>
                              <div className="flex gap-3">
                                {[0, 1, 2, 3, 4, 5].map((val) => (
                                  <button
                                    key={val}
                                    onClick={() => handleScoreChange(principle.id, val)}
                                    className={cn(
                                      "flex-1 py-5 rounded-[24px] text-xl font-black transition-all border-2",
                                      responses[principle.id] === val 
                                        ? "bg-amber-500 border-amber-600 text-white shadow-xl shadow-amber-500/30 scale-110 z-10" 
                                        : "bg-slate-50 border-slate-100 text-slate-300 hover:border-amber-200 hover:text-amber-500"
                                    )}
                                  >
                                    {val}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                               <div className="space-y-2">
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                    Evidências Esperadas
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {principle.expectedEvidences.map((ev, i) => (
                                      <span key={i} className="text-[9px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100">{ev}</span>
                                    ))}
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle size={12} />
                                    Risco Crítico
                                  </p>
                                  <p className="text-[10px] font-bold text-rose-600 leading-tight bg-rose-50 p-2 rounded-xl border border-rose-100">
                                    {principle.risksWhenNeglected[0]}
                                  </p>
                                </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 text-white p-20 rounded-[64px] text-center shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 space-y-10">
                  <div className="w-24 h-24 bg-amber-500 rounded-[32px] mx-auto flex items-center justify-center text-amber-950 shadow-2xl rotate-3 group-hover:rotate-12 transition-transform">
                    <Zap size={48} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black tracking-tight">Finalizar Diagnóstico Sistêmico</h3>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                      O motor de IA consolidará {Object.keys(responses).length} respostas com os indicadores reais da empresa para gerar o Índice de Maturidade Governança Organizacional.
                    </p>
                  </div>
                  <button 
                    onClick={handleGenerateIntelligence}
                    className="bg-amber-500 hover:bg-amber-400 text-amber-950 px-16 py-6 rounded-[24px] text-sm font-black uppercase tracking-widest transition-all shadow-2xl shadow-amber-500/40 active:scale-95 flex items-center gap-4 mx-auto"
                  >
                    Gerar Inteligência Estratégica
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-1000">
               {/* Dashboard de Resultados */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Radar Chart Section */}
                  <div className="lg:col-span-8 bg-white p-12 rounded-[56px] border border-slate-200 shadow-xl flex flex-col">
                    <div className="flex justify-between items-start mb-12">
                      <div>
                        <h3 className="text-2xl font-black text-slate-800">Mapa de Maturidade Organizacional</h3>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">Análise por Eixos de Gestão</p>
                      </div>
                      <div className="flex gap-2">
                         <button 
                           onClick={handleSaveDiagnosis}
                           disabled={saving || !aiDiagnosis}
                           className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors disabled:opacity-50"
                           title="Salvar no Histórico"
                         >
                            {saving ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                         </button>
                         <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
                            <Download size={20} />
                         </button>
                         <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
                            <Share2 size={20} />
                         </button>
                      </div>
                    </div>

                    <div className="flex-1 min-h-[500px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={500}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#e2e8f0" strokeWidth={2} />
                          <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                          />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name="Maturidade"
                            dataKey="A"
                            stroke="#f59e0b"
                            strokeWidth={4}
                            fill="#f59e0b"
                            fillOpacity={0.15}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-100">
                        {radarData.map(d => (
                          <div key={d.subject} className="space-y-2 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{d.subject}</p>
                            <p className="text-xl font-black text-slate-800">{d.A}%</p>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${d.A}%` }}
                                className={cn("h-full", d.A > 80 ? "bg-indigo-500" : d.A > 60 ? "bg-emerald-500" : "bg-amber-500")}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Classification Card */}
                  <div className="lg:col-span-4 space-y-8">
                    <div className={cn("p-10 rounded-[56px] border-2 shadow-2xl flex flex-col items-center text-center space-y-6", classification.bg, classification.border)}>
                        <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg", classification.bg, "border border-current opacity-30")}>
                          <ShieldCheck size={40} className={classification.color} />
                        </div>
                        <div className="space-y-2">
                           <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Classificação Atual</p>
                           <h3 className={cn("text-4xl font-black", classification.color)}>{classification.label}</h3>
                        </div>
                        <div className="text-6xl font-black text-slate-900 tracking-tighter">
                          {maturityScore}<span className="text-2xl text-slate-300">%</span>
                        </div>
                        <div className="text-xs font-bold text-slate-400 mt-2 italic leading-relaxed">
                          <MarkdownText text={`Sua organização está no nível **"${classification.label}"**, indicando ${maturityScore > 60 ? 'uma base sólida mas com oportunidades de refino.' : 'necessidade urgente de estruturação básica.'}`} />
                        </div>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[56px] text-white space-y-8">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-amber-950">
                             <Zap size={20} />
                          </div>
                          <h4 className="text-lg font-black tracking-tight">Parecer Executivo</h4>
                       </div>
                       
                       <div className="space-y-6">
                         {loadingDiagnosis ? (
                           <div className="space-y-4 py-8 flex flex-col items-center">
                             <Loader2 size={32} className="text-amber-500 animate-spin" />
                             <p className="text-xs font-black uppercase tracking-widest text-slate-400">IA Consolidando Diagnóstico...</p>
                           </div>
                         ) : (
                           <>
                             <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                               <p className="text-amber-400 text-xs font-black uppercase tracking-widest">Resumo Estratégico</p>
                               <p className="text-sm text-slate-300 leading-relaxed">
                                 {aiDiagnosis?.resumoExecutivo || "Aguardando geração do diagnóstico para exibir o resumo estratégico..."}
                               </p>
                             </div>

                             <div className="space-y-4">
                                <p className="text-white font-black text-xs uppercase tracking-widest">Ações Prioritárias</p>
                                <ul className="space-y-4">
                                  {(aiDiagnosis?.recomendacoesPrioritarias || []).map((item: string, i: number) => (
                                    <li key={i} className="flex gap-4 items-start">
                                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 text-[10px] font-black">{i+1}</div>
                                      <p className="text-xs text-slate-400 font-bold leading-snug">{item}</p>
                                    </li>
                                  ))}
                                  {!aiDiagnosis?.recomendacoesPrioritarias && (
                                    <p className="text-[10px] text-slate-500 italic">Gere o diagnóstico para visualizar as ações prioritárias.</p>
                                  )}
                                </ul>
                             </div>
                           </>
                         )}
                       </div>

                       <button 
                         onClick={() => setShowResults(false)}
                         className="w-full py-5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-all"
                       >
                         Recalcular Maturidade
                       </button>
                    </div>
                  </div>
               </div>

               {/* AI Intelligence Detailed Report */}
               {!loadingDiagnosis && aiDiagnosis && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-6">
                       <h4 className="text-lg font-black text-slate-800 flex items-center gap-3">
                          <AlertTriangle className="text-rose-500" size={20} />
                          Riscos e Gargalos
                       </h4>
                       <div className="space-y-3">
                          {aiDiagnosis.principaisRiscos.map((r: string, i: number) => (
                            <div key={i} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                               <p className="text-xs font-bold text-rose-700 leading-tight">{r}</p>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-6">
                       <h4 className="text-lg font-black text-slate-800 flex items-center gap-3">
                          <Activity className="text-indigo-500" size={20} />
                          Potenciais Ocultos
                       </h4>
                       <div className="space-y-3">
                          {aiDiagnosis.potenciaisOcultos.map((p: string, i: number) => (
                            <div key={i} className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                               <p className="text-xs font-bold text-indigo-700 leading-tight">{p}</p>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-6">
                       <h4 className="text-lg font-black text-slate-800 flex items-center gap-3">
                          <TrendingUp className="text-emerald-500" size={20} />
                          Plano de Ação
                       </h4>
                       <div className="space-y-3">
                          {aiDiagnosis.planoAcaoSugerido.map((a: string, i: number) => (
                            <div key={i} className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3">
                               <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                               <p className="text-xs font-bold text-emerald-700 leading-tight">{a}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
               )}

               {/* Heatmap Section */}
               <div className="bg-white p-12 rounded-[56px] border border-slate-200 shadow-sm mt-8">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h4 className="text-2xl font-black text-slate-800">Mapa de Calor: Princípios Críticos</h4>
                      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Visão 360º de Riscos e Oportunidades</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-rose-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Crítico</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-amber-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alerta</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-emerald-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maturidade</span>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {GOVERNANCE_PRINCIPLES.map(p => {
                      const score = finalResponses[p.id] ?? 0;
                      const isAdjusted = responses[p.id] !== undefined && finalResponses[p.id] < responses[p.id];
                      
                      return (
                        <div key={p.id} className={cn(
                          "p-6 rounded-[24px] border text-center space-y-2 transition-all relative overflow-hidden group hover:scale-105",
                          score <= 1 ? "bg-rose-50 border-rose-100 text-rose-700" :
                          score <= 3 ? "bg-amber-50 border-amber-100 text-amber-700" :
                          "bg-emerald-50 border-emerald-100 text-emerald-700"
                        )}>
                          {isAdjusted && (
                            <div className="absolute top-2 right-2">
                               <AlertTriangle size={12} className="text-rose-500" />
                            </div>
                          )}
                          <p className="text-[8px] font-black uppercase tracking-tighter truncate opacity-60">{p.name}</p>
                          <p className="text-2xl font-black">{score}</p>
                          <div className="h-1 bg-current opacity-20 rounded-full w-1/2 mx-auto" />
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
