
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
import { db, storage, auth } from '../../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  const [policies, setPolicies] = useState<any[]>([]);

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

  // Fetch policies
  useEffect(() => {
    if (!clientId) return;
    const q = query(
      collection(db, 'compliance_policies'),
      where('clientId', '==', clientId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPolicies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [clientId]);

  const hasData = dbIndicators.length > 0 || Object.keys(answers).length > 0;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFileName(file.name);
    
    try {
      // 1. Upload to Storage
      const storageRef = ref(storage, `policies/${clientId}/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(uploadResult.ref);

      // 2. Parse PDF
      const text = await extractTextFromPDF(file);
      const results = analyzePolicyText(text);
      setAnalysisResults(results);

      // 3. Save to Firestore
      await addDoc(collection(db, 'compliance_policies'), {
        clientId,
        title: file.name,
        fileUrl,
        results,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid
      });
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
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="px-6 py-3 bg-card border border-border rounded-md shadow-sm flex items-center gap-3">
            <ShieldCheck size={14} className="text-secondary" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {policies.length} Políticas Ativas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={triggerUpload}
            disabled={isUploading}
            className="btn-ghost px-4 md:px-6 py-2 md:py-3"
          >
            {isUploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
            {isUploading ? 'Analisando...' : 'Importar Política (PDF)'}
          </button>
          <button 
            onClick={() => setIsDiagnosing(true)}
            className="btn-executive"
          >
            <ClipboardCheck size={14} /> Iniciar Diagnóstico
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Maturity & Recommendations */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Compliance System Maturity */}
          <div className="card-premium relative overflow-hidden">
             <div className="flex justify-between items-start mb-10">
                <div>
                   <h3 className="text-body-sm font-medium text-foreground uppercase tracking-widest flex items-center gap-3 mb-2">
                      <BarChart3 size={20} className="text-primary" /> Estruturação do Sistema de Compliance
                   </h3>
                   <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Nível de maturidade: <span className="text-primary">{hasData ? currentLevel.level : 'N/A'}</span></p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary/10 px-4 py-2 rounded-md text-center border border-primary/20">
                     <span className="text-[10px] font-medium text-primary uppercase block">Média Geral</span>
                     <span className="text-h3 font-medium text-primary">{hasData ? `${overallAverage}%` : '---'}</span>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="h-[300px]">
                   {hasData ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={maturityData}>
                           <PolarGrid stroke="var(--color-border)" />
                           <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 600, fill: 'var(--color-muted-foreground)' }} />
                           <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                           <Radar
                               name="Maturidade"
                               dataKey="A"
                               stroke="var(--color-secondary)"
                               fill="var(--color-secondary)"
                               fillOpacity={0.6}
                           />
                           <Tooltip 
                               contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-card-foreground)', boxShadow: 'var(--shadow-floating)', fontSize: '10px' }}
                           />
                        </RadarChart>
                     </ResponsiveContainer>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 border-2 border-dashed border-border rounded-md bg-surface-container/50">
                        <BarChart3 size={40} className="mb-4 opacity-20" />
                        <p className="text-body-sm font-medium uppercase tracking-widest text-muted-foreground">Dados Indisponíveis</p>
                     </div>
                   )}
                </div>

                <div className="space-y-4">
                   <h4 className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Lightbulb size={14} /> Recomendações Técnicas
                   </h4>
                   {hasData ? technicalRecommendations.map((rec) => (
                      <div key={rec.id} className="p-5 bg-surface-container/50 border border-border rounded-md group hover:border-primary/20 transition-all">
                         <div className="flex justify-between items-start mb-2">
                            <span className={cn(
                               "px-2 py-0.5 rounded-md text-[7px] font-medium uppercase tracking-widest",
                               rec.priority === 'Alta' ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-warning/10 text-warning border border-warning/20"
                            )}>
                                Prioridade {rec.priority}
                            </span>
                         </div>
                         <h5 className="text-[11px] font-medium text-foreground uppercase mb-1">{rec.title}</h5>
                         <p className="text-[10px] text-muted-foreground font-medium leading-relaxed mb-3">{rec.description}</p>
                         <div className="flex items-center gap-2 text-[9px] font-medium text-primary uppercase cursor-pointer hover:gap-3 transition-all">
                            Plano de Ação <ArrowRight size={12} />
                         </div>
                      </div>
                   )) : (
                     <div className="p-8 text-center text-muted-foreground bg-surface-container/50 rounded-md border border-dashed border-border">
                        <p className="text-[10px] font-medium uppercase tracking-widest italic">Inicie o diagnóstico para gerar recomendações</p>
                     </div>
                   )}
                </div>
             </div>

             {/* Methodology Tooltip/Info */}
             <div className="mt-8 pt-6 border-t border-border">
                <p className="text-[9px] text-muted-foreground font-medium leading-relaxed uppercase tracking-widest">
                  <span className="font-medium text-foreground">Metodologia:</span> Baseada na ISO 37301 (Sistemas de Gestão de Compliance) e COSO. A avaliação considera 6 eixos críticos com pesos diferenciados por impacto estratégico.
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

                       <div className="bg-card p-8 rounded-md border border-border shadow-premium space-y-6">
                          <div className="space-y-2">
                             <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                                Dimensão: {assessmentQuestions[currentQuestionIdx].dimension}
                             </span>
                             <h4 className="text-h3 font-medium text-foreground leading-tight">
                                {assessmentQuestions[currentQuestionIdx].question}
                             </h4>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <button 
                                onClick={() => handleAnswer(true)}
                                className="group p-6 bg-success/5 border border-success/20 rounded-md flex flex-col items-center gap-3 hover:bg-success hover:border-success transition-all"
                             >
                                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success group-hover:bg-card group-hover:text-success">
                                   <Check size={20} strokeWidth={3} />
                                </div>
                                <span className="text-body-sm font-medium text-success uppercase group-hover:text-card">Sim / Implementado</span>
                             </button>
                             <button 
                                onClick={() => handleAnswer(false)}
                                className="group p-6 bg-destructive/5 border border-destructive/20 rounded-md flex flex-col items-center gap-3 hover:bg-destructive hover:border-destructive transition-all"
                             >
                                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive group-hover:bg-card group-hover:text-destructive">
                                   <AlertTriangle size={20} />
                                </div>
                                <span className="text-body-sm font-medium text-destructive uppercase group-hover:text-card">Não / Pendente</span>
                             </button>
                          </div>
                       </div>

                       <button 
                          onClick={() => setIsDiagnosing(false)}
                          className="w-full text-center text-muted-foreground text-[10px] font-medium uppercase tracking-widest hover:text-white transition-colors"
                       >
                          Cancelar Avaliação
                       </button>
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Policy Intelligence & Import Area */}
          <div className="card-premium">
             <div className="flex justify-between items-center mb-10">
                <div>
                   <h3 className="text-body-sm font-medium text-foreground uppercase tracking-widest flex items-center gap-3">
                      <FileSearch size={20} className="text-primary" /> Inteligência de Políticas
                   </h3>
                   <p className="text-[10px] text-muted-foreground font-medium uppercase mt-1">Upload e auditoria automática de documentos normativos</p>
                </div>

                <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileUpload} 
                   accept="application/pdf" 
                   className="hidden" 
                />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Current Policies List */}
                <div className="space-y-4">
                   <h4 className="text-body-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Arquivos Vigentes</h4>
                   <div className="space-y-3">
                      {policies.map(policy => (
                        <div key={policy.id} className="flex items-center justify-between p-4 bg-surface-container/50 rounded-md border border-border">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-md bg-card flex items-center justify-center text-muted-foreground border border-border">
                                 <FileText size={16} />
                              </div>
                              <span className="text-[10px] font-medium text-foreground uppercase tracking-widest">{policy.title}</span>
                           </div>
                           <a href={policy.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Download size={14} className="text-muted-foreground cursor-pointer hover:text-secondary transition-colors" />
                           </a>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Analysis Results */}
                <div className="bg-surface-container/50 border border-border rounded-md p-8 min-h-[240px] flex flex-col">
                   <AnimatePresence mode="wait">
                      {isUploading ? (
                         <motion.div 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                         >
                            <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                                Extraindo inteligência do documento...
                            </p>
                         </motion.div>
                      ) : analysisResults ? (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                           className="space-y-6"
                         >
                            <div className="flex items-center justify-between">
                               <h4 className="text-[10px] font-medium text-success uppercase tracking-widest">Resultado da Auditoria</h4>
                               <span className="text-[8px] font-medium text-muted-foreground italic">{uploadedFileName}</span>
                            </div>
                            <div className="space-y-4">
                               {analysisResults.map((res, i) => (
                                  <div key={i} className="bg-card p-4 rounded-md border border-border shadow-sm">
                                     <div className="flex justify-between items-center mb-2">
                                        <span className="text-[9px] font-medium text-foreground uppercase tracking-widest">{res.category}</span>
                                        <span className="text-[9px] font-medium text-success">{res.score}%</span>
                                     </div>
                                     <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{res.comment}</p>
                                  </div>
                               ))}
                            </div>
                            <button 
                              onClick={() => setAnalysisResults(null)}
                              className="w-full py-3 bg-card border border-border text-muted-foreground rounded-md text-[9px] font-medium uppercase tracking-widest hover:bg-surface-container transition-all"
                            >
                                Nova Análise
                            </button>
                         </motion.div>
                      ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                            <FileSearch size={40} className="text-muted-foreground" />
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-relaxed">
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
          <div className="bg-executive p-10 rounded-md text-white shadow-premium relative overflow-hidden h-full">
             <div className="absolute right-0 top-0 p-8 text-success/10">
                <Scale size={120} strokeWidth={1} />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                   <h3 className="text-body-sm font-medium text-success uppercase tracking-widest flex items-center gap-3">
                      <Zap size={20} /> Diagnóstico Consolidado
                   </h3>
                   <div className="bg-success/20 px-3 py-1 rounded-md inline-block border border-success/30">
                     <span className="text-[8px] font-medium text-success uppercase tracking-widest">{hasData ? currentLevel.level : 'Aguardando Diagnóstico'}</span>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-white/5 p-6 rounded-md border border-white/10">
                      <p className="text-[11px] text-white/50 font-medium uppercase mb-2 tracking-widest">Status do Ecossistema</p>
                      <p className="text-[10px] text-white/70 font-medium leading-relaxed italic">
                         {hasData ? currentLevel.description : 'Realize o diagnóstico técnico para desbloquear a inteligência de governança e compliance da organização.'}
                      </p>
                   </div>
                   
                   {[
                     { label: 'Exposição Regulatória', val: hasData ? 'Baixa' : 'Pendente', color: hasData ? 'text-success' : 'text-white/30' },
                     { label: 'Maturidade de Processos', val: hasData ? 'Média' : 'Pendente', color: hasData ? 'text-warning' : 'text-white/30' },
                     { label: 'Cultura de Ética', val: hasData ? 'Alta' : 'Pendente', color: hasData ? 'text-success' : 'text-white/30' }
                   ].map((risk, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-white/50">{risk.label}</span>
                        <span className={cn("text-xs font-medium uppercase tracking-widest", risk.color)}>{risk.val}</span>
                     </div>
                   ))}
                </div>

                {hasData && (
                   <div className="pt-8">
                      <h4 className="text-[10px] font-medium text-white/50 uppercase tracking-widest mb-6">Próximos Treinamentos</h4>
                      <div className="space-y-4">
                         <div className="flex gap-4 p-4 bg-white/5 rounded-md border border-white/5">
                            <div className="w-10 h-10 bg-secondary/20 rounded-md flex items-center justify-center text-secondary shrink-0 font-medium text-xs">Agendar</div>
                            <div>
                               <p className="text-xs font-medium text-white uppercase tracking-widest">Planejamento de Compliance</p>
                               <p className="text-[10px] text-white/30 font-medium uppercase">Nenhum treinamento agendado</p>
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


