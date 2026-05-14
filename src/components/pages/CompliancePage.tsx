
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Scale, 
  Search,
  Download,
  Filter,
  Zap,
  MessageSquare,
  Upload,
  BarChart3,
  Lightbulb,
  ArrowRight,
  FileSearch,
  Loader2,
  ClipboardCheck,
  ChevronRight,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { PageHeader } from '../Common';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  complianceMaturityData as initialMaturityData, 
  technicalRecommendations,
  assessmentQuestions,
  complianceMaturityLevels
} from '../../data/complianceData';
import { extractTextFromPDF, analyzePolicyText } from '../../lib/pdfUtils';

interface CompliancePageProps {
  clientId: string;
}

export function CompliancePage({ clientId }: CompliancePageProps) {
  const [dbIndicators, setDbIndicators] = useState<any[]>([]);
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [maturityData, setMaturityData] = useState(initialMaturityData.map(d => ({ ...d, A: 0 })));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any[] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!clientId) return;
    setLoadingIndicators(true);
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId),
      where('setor', '==', 'Compliance')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDbIndicators(data);
      setLoadingIndicators(false);
      
      if (data.length > 0) {
        // Map indicators to maturity data
        const updated = initialMaturityData.map(dim => {
          const match = data.find(i => (i as any).ind === dim.subject);
          return match ? { ...dim, A: (match as any).val } : dim;
        });
        setMaturityData(updated);
      }
    });
    return () => unsubscribe();
  }, [clientId]);

  const hasData = dbIndicators.length > 0 || Object.keys(answers).length > 0;
  const policies: any[] = [];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFileName(file.name);
    
    try {
      const text = await extractTextFromPDF(file);
      const results = analyzePolicyText(text);
      setAnalysisResults(results);
    } catch (error) {
      console.error('Error parsing PDF:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAnswer = (answer: boolean) => {
    const question = assessmentQuestions[currentQuestionIdx];
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIdx < assessmentQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Finalize Diagnosis
      calculateNewMaturity(newAnswers);
      setIsDiagnosing(false);
      setCurrentQuestionIdx(0);
    }
  };

  const calculateNewMaturity = (finalAnswers: Record<string, boolean>) => {
    const newMaturityData = maturityData.map(dim => {
      const questionsForDim = assessmentQuestions.filter(q => q.dimension === dim.subject);
      if (questionsForDim.length === 0) return dim;

      const score = questionsForDim.reduce((acc, q) => {
        return acc + (finalAnswers[q.id] ? 100 * q.weight : 0);
      }, 0) / questionsForDim.reduce((acc, q) => acc + q.weight, 0);

      return { ...dim, A: Math.round(score) };
    });
    setMaturityData(newMaturityData);
  };

  const overallAverage = Math.round(maturityData.reduce((acc, d) => acc + d.A, 0) / maturityData.length);
  const currentLevel = complianceMaturityLevels.find(l => overallAverage >= l.range[0] && overallAverage <= l.range[1]) || complianceMaturityLevels[0];

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      {/* Standardized Header */}
      <PageHeader 
        title="Compliance & Políticas"
        subtitle="Gestão estratégica de integridade, conformidade normativa e governança de risco corporativo."
        icon={ShieldCheck}
        color="bg-slate-900"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Maturity & Recommendations */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Compliance System Maturity */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-start mb-10">
                <div>
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3 mb-2">
                      <BarChart3 size={20} className="text-primary" /> Estruturação do Sistema de Compliance
                   </h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">Nível de maturidade: <span className="text-primary">{currentLevel.level}</span></p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/5 px-4 py-2 rounded-xl text-center">
                     <span className="text-[10px] font-black text-primary uppercase block">Média Geral</span>
                     <span className="text-lg font-black text-primary">{overallAverage}%</span>
                  </div>
                  <button 
                    onClick={() => setIsDiagnosing(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                  >
                    <ClipboardCheck size={14} /> Iniciar Diagnóstico
                  </button>
                </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="h-[300px]">
                   {hasData ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={maturityData}>
                           <PolarGrid stroke="#f1f5f9" />
                           <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 900, fill: '#64748b' }} />
                           <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                           <Radar
                              name="Maturidade"
                              dataKey="A"
                              stroke="#FF8552"
                              fill="#FF8552"
                              fillOpacity={0.6}
                           />
                           <Tooltip 
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                           />
                        </RadarChart>
                     </ResponsiveContainer>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/50">
                        <BarChart3 size={40} className="mb-4 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dados Indisponíveis</p>
                     </div>
                   )}
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Lightbulb size={14} /> Recomendações Técnicas
                   </h4>
                   {hasData ? technicalRecommendations.map((rec) => (
                      <div key={rec.id} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-primary/20 transition-all">
                         <div className="flex justify-between items-start mb-2">
                            <span className={cn(
                               "px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-tighter",
                               rec.priority === 'Alta' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                            )}>
                                Prioridade {rec.priority}
                            </span>
                         </div>
                         <h5 className="text-[11px] font-black text-slate-800 uppercase mb-1">{rec.title}</h5>
                         <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-3">{rec.description}</p>
                         <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase cursor-pointer hover:gap-3 transition-all">
                            Plano de Ação <ArrowRight size={12} />
                         </div>
                      </div>
                   )) : (
                     <div className="p-8 text-center text-slate-400 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-widest">Inicie o diagnóstico para gerar recomendações</p>
                     </div>
                   )}
                </div>
             </div>

             </div>

             {/* Methodology Tooltip/Info */}
             <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
                  <span className="font-black text-slate-600">Metodologia:</span> Baseada na ISO 37301 (Sistemas de Gestão de Compliance) e COSO. A avaliação considera 6 eixos críticos com pesos diferenciados por impacto estratégico.
                </p>
             </div>

             {/* Diagnostic Modal Overlay */}
             <AnimatePresence>
                {isDiagnosing && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/95 z-50 p-10 flex flex-col justify-center"
                  >
                    <div className="max-w-xl mx-auto w-full space-y-8">
                       <div className="flex justify-between items-center text-white">
                          <h3 className="text-lg font-black uppercase tracking-widest text-primary flex items-center gap-3">
                             <ClipboardCheck size={24} /> Diagnóstico Técnico
                          </h3>
                          <span className="text-xs font-black text-slate-400">
                             Questão {currentQuestionIdx + 1} de {assessmentQuestions.length}
                          </span>
                       </div>

                       <div className="bg-white/5 p-8 rounded-[32px] border border-white/10 space-y-6">
                          <div className="space-y-2">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Dimensão: {assessmentQuestions[currentQuestionIdx].dimension}
                             </span>
                             <h4 className="text-xl font-black text-white leading-tight">
                                {assessmentQuestions[currentQuestionIdx].question}
                             </h4>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <button 
                                onClick={() => handleAnswer(true)}
                                className="group p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-emerald-500 hover:border-emerald-500 transition-all"
                             >
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-white group-hover:text-emerald-500">
                                   <Check size={20} strokeWidth={3} />
                                </div>
                                <span className="text-xs font-black text-emerald-500 uppercase group-hover:text-white">Sim / Implementado</span>
                             </button>
                             <button 
                                onClick={() => handleAnswer(false)}
                                className="group p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-rose-500 hover:border-rose-500 transition-all"
                             >
                                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 group-hover:bg-white group-hover:text-rose-500">
                                   <AlertTriangle size={20} />
                                </div>
                                <span className="text-xs font-black text-rose-500 uppercase group-hover:text-white">Não / Pendente</span>
                             </button>
                          </div>
                       </div>

                       <button 
                          onClick={() => setIsDiagnosing(false)}
                          className="w-full text-center text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                       >
                          Cancelar Avaliação
                       </button>
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Policy Intelligence & Import Area (Previous implementation kept here) */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <div>
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                      <FileSearch size={20} className="text-primary" /> Inteligência de Políticas
                   </h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Upload e auditoria automática de documentos normativos</p>
                </div>
                <button 
                  onClick={triggerUpload}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                   {isUploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                   {isUploading ? 'Analisando...' : 'Importar Política (PDF)'}
                </button>
                <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileUpload} 
                   accept="application/pdf" 
                   className="hidden" 
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Current Policies List */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Arquivos Vigentes</h4>
                   <div className="space-y-3">
                      {policies.map(policy => (
                        <div key={policy.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                                 <FileText size={16} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-700 uppercase">{policy.title}</span>
                           </div>
                           <Download size={14} className="text-slate-300 cursor-pointer hover:text-primary transition-colors" />
                        </div>
                      ))}
                   </div>
                </div>

                {/* Analysis Results */}
                <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 min-h-[240px] flex flex-col">
                   <AnimatePresence mode="wait">
                      {isUploading ? (
                         <motion.div 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                         >
                            <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                               Extraindo inteligência do documento...
                            </p>
                         </motion.div>
                      ) : analysisResults ? (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                           className="space-y-6"
                         >
                            <div className="flex items-center justify-between">
                               <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Resultado da Auditoria</h4>
                               <span className="text-[8px] font-bold text-slate-400 italic">{uploadedFileName}</span>
                            </div>
                            <div className="space-y-4">
                               {analysisResults.map((res, i) => (
                                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm">
                                     <div className="flex justify-between items-center mb-2">
                                        <span className="text-[9px] font-black text-slate-800 uppercase">{res.category}</span>
                                        <span className="text-[9px] font-black text-emerald-500">{res.score}%</span>
                                     </div>
                                     <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{res.comment}</p>
                                  </div>
                               ))}
                            </div>
                            <button 
                              onClick={() => setAnalysisResults(null)}
                              className="w-full py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-[9px] font-black uppercase hover:bg-slate-100 transition-all"
                            >
                               Nova Análise
                            </button>
                         </motion.div>
                      ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                            <FileSearch size={40} className="text-slate-300" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                               Nenhum documento em análise.<br />Faça o upload para auditoria técnica.
                            </p>
                         </div>
                      )}
                   </AnimatePresence>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Risk & Culture */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Display */}
          <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden h-full">
             <div className="absolute right-0 top-0 p-8 text-emerald-500/10">
                <Scale size={120} strokeWidth={1} />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-3">
                     <Zap size={20} /> Diagnóstico Consolidado
                  </h3>
                  <div className="bg-emerald-500/20 px-3 py-1 rounded-md inline-block">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{currentLevel.level}</span>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <p className="text-[11px] text-slate-300 font-black uppercase mb-2 tracking-tighter">Status do Ecossistema</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                         {currentLevel.description}
                      </p>
                   </div>
                   
                   {[
                     { label: 'Exposição Regulatória', val: 'Baixa', color: 'text-emerald-400' },
                     { label: 'Maturidade de Processos', val: 'Média', color: 'text-amber-400' },
                     { label: 'Cultura de Ética', val: 'Alta', color: 'text-emerald-400' }
                   ].map((risk, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{risk.label}</span>
                        <span className={cn("text-xs font-black uppercase tracking-widest", risk.color)}>{risk.val}</span>
                     </div>
                   ))}
                </div>

                {hasData && (
                   <div className="pt-8">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Próximos Treinamentos</h4>
                      <div className="space-y-4">
                         <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0 font-black text-xs">Agendar</div>
                            <div>
                               <p className="text-xs font-black text-white uppercase">Planejamento de Compliance</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase">Nenhum treinamento agendado</p>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}


