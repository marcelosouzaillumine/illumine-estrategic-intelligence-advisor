import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Database, Brain, Activity, LineChart, Users, Combine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const dimensions = [
  { id: 'governance', title: 'Governança', question: 'A organização possui mecanismos claros de decisão baseados em dados auditáveis?', icon: ShieldCheck },
  { id: 'information', title: 'Informação', question: 'Os dados disponíveis hoje possuem contexto executivo ou são apenas números soltos?', icon: Database },
  { id: 'finance', title: 'Finanças', question: 'Existe visão antecipatória de capital e caixa integrada à operação?', icon: LineChart },
  { id: 'strategy', title: 'Estratégia', question: 'Decisões estratégicas passadas possuem acompanhamento ativo das suas consequências?', icon: Brain },
  { id: 'operation', title: 'Operação', question: 'Existem sinais precoces de ineficiência antes que eles afetem a margem?', icon: Activity },
  { id: 'people', title: 'Pessoas', titleIcon: Users, question: 'As dependências críticas de capital humano são quantificadas em risco para a operação?', icon: Users },
  { id: 'learning', title: 'Aprendizado', question: 'A empresa preserva rigorosamente sua memória decisória (Institutional Learning Loop)?', icon: Combine },
];

const answers = [
  { value: 1, label: 'Não, o processo é manual ou instintivo.' },
  { value: 2, label: 'Parcialmente, mas dependemos de planilhas isoladas.' },
  { value: 3, label: 'Sim, temos ferramentas, mas o contexto se perde.' },
  { value: 4, label: 'Sim, temos total rastreabilidade e antecipação sistêmica.' },
];

export function ExecutiveAssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAnswer = (value: number) => {
    const newScores = { ...scores, [dimensions[currentStep].id]: value };
    setScores(newScores);
    
    if (currentStep < dimensions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => setIsComplete(true), 500);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateMaturity = () => {
    const total = Object.values(scores).reduce((acc, curr) => acc + curr, 0);
    const max = dimensions.length * 4;
    const percentage = total / max;

    if (percentage < 0.4) return { level: 'Operational Visibility', desc: 'A organização opera com espelhos retrovisores, focada no que já passou.', color: 'text-slate-400' };
    if (percentage < 0.65) return { level: 'Integrated Intelligence', desc: 'Existem conexões de dados, mas as decisões ainda dependem de consolidações lentas.', color: 'text-blue-400' };
    if (percentage < 0.85) return { level: 'Executive Intelligence', desc: 'Alta capacidade analítica com visão de risco, mas a memória institucional ainda pode falhar.', color: 'text-amber-400' };
    return { level: 'Institutional Intelligence', desc: 'Maturidade de ponta. A empresa possui Gêmeo Digital e memória causal para cada decisão.', color: 'text-primary' };
  };

  if (isComplete) {
    const maturity = calculateMaturity();
    
    return (
      <div className="min-h-[90vh] bg-[#0A0A0B] text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-[#0A0A0B] to-[#0A0A0B] z-0 pointer-events-none" />
         
         {!showForm ? (
            <div className="max-w-2xl w-full bg-white/5 border border-white/10 p-12 rounded-3xl relative z-10 text-center shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
               <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-6" />
               <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">Diagnóstico Concluído</h2>
               <h3 className="text-3xl font-bold text-white mb-2">Executive Intelligence Maturity Index™</h3>
               <div className={cn("text-2xl md:text-3xl font-bold mb-4 mt-6", maturity.color)}>
                  {maturity.level}
               </div>
               <p className="text-sm text-slate-400 mb-8 max-w-lg mx-auto">
                  {maturity.desc}
               </p>

               {/* Institutional Evolution Map */}
               <div className="text-left mb-8 bg-[#050506] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Brain className="w-4 h-4 text-primary" />
                     Institutional Evolution Map™
                  </h4>
                  <div className="space-y-4 mb-6">
                     {dimensions.map((dim) => {
                        const score = scores[dim.id] || 1;
                        const percentage = Math.round((score / 4) * 100);
                        return (
                           <div key={dim.id} className="flex items-center justify-between">
                              <span className="text-slate-400 text-sm">{dim.title}</span>
                              <div className="flex items-center gap-3">
                                 <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/60" style={{ width: `${percentage}%` }} />
                                 </div>
                                 <span className="text-white text-sm font-mono w-10 text-right">{percentage}%</span>
                              </div>
                           </div>
                        );
                     })}
                  </div>
                  
                  <h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-3">Intelligence Opportunities™</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                     <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Preservação contínua de contexto decisório.</li>
                     <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Integração entre a estratégia aprovada e a execução tática.</li>
                     <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Formação de uma memória institucional perene.</li>
                  </ul>
               </div>
               
               <div className="space-y-4">
                  <button 
                     onClick={() => setShowForm(true)}
                     className="w-full py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                     Receber Executive Insight Report™ e Agendar Reunião
                     <ArrowRight size={18} />
                  </button>
                  <Link 
                     to="/"
                     className="w-full py-4 bg-transparent border border-white/10 text-slate-400 font-medium rounded-full hover:bg-white/5 transition-colors flex items-center justify-center"
                  >
                     Voltar para a Página Inicial
                  </Link>
               </div>
            </div>
         ) : (
            <div className="max-w-xl w-full bg-white/5 border border-white/10 p-12 rounded-3xl relative z-10 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-right-8 duration-500">
               <h3 className="text-2xl font-bold text-white mb-2">Acesso ao Relatório Institucional</h3>
               <p className="text-slate-400 mb-8">Insira suas credenciais executivas para enviarmos a análise completa do seu diagnóstico de maturidade e agendarmos uma apresentação da plataforma Illumine.</p>
               
               <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                     <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-medium">Nome Completo</label>
                     <input type="text" className="w-full bg-[#050506] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Ex: João Silva" />
                  </div>
                  <div>
                     <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-medium">Email Corporativo</label>
                     <input type="email" className="w-full bg-[#050506] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="joao@empresa.com" />
                  </div>
                  <div>
                     <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-medium">Cargo / Função</label>
                     <select className="w-full bg-[#050506] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                        <option>CEO / Conselheiro</option>
                        <option>CFO / Diretor Financeiro</option>
                        <option>COO / Diretor Operacional</option>
                        <option>Consultor / Executive Advisor</option>
                        <option>Outro Cargo Executivo</option>
                     </select>
                  </div>
                  
                  <div className="pt-4">
                     <button className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                        Solicitar Reunião de Advisory
                        <CheckCircle2 size={18} />
                     </button>
                  </div>
               </form>
               <p className="text-center text-xs text-slate-500 mt-6">Seus dados serão tratados com total sigilo corporativo conforme nossa Trust Architecture™.</p>
            </div>
         )}
      </div>
    );
  }

  const currentDim = dimensions[currentStep];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 flex flex-col pt-24 pb-12 px-6">
      
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center">
         {/* Progress */}
         <div className="mb-12">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-4 uppercase tracking-widest">
               <span>Dimensão {currentStep + 1} de {dimensions.length}</span>
               <span>{Math.round(((currentStep) / dimensions.length) * 100)}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden flex">
               {dimensions.map((_, idx) => (
                  <div 
                     key={idx} 
                     className={cn(
                        "h-full flex-1 transition-colors duration-500",
                        idx < currentStep ? "bg-primary" : idx === currentStep ? "bg-primary/50" : "bg-transparent",
                        idx !== 0 && "border-l border-[#0A0A0B]"
                     )}
                  />
               ))}
            </div>
         </div>

         {/* Question Area */}
         <div className="mb-16 animate-in slide-in-from-right-4 fade-in duration-300" key={currentStep}>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <currentDim.icon className="w-5 h-5 text-slate-300" />
               </div>
               <h2 className="text-sm font-semibold text-primary uppercase tracking-widest">{currentDim.title}</h2>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
               {currentDim.question}
            </h1>
         </div>

         {/* Options */}
         <div className="space-y-4">
            {answers.map((ans) => (
               <button
                  key={ans.value}
                  onClick={() => handleAnswer(ans.value)}
                  className="w-full p-6 text-left bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-between group"
               >
                  <span className="text-lg text-slate-300 group-hover:text-white font-medium">{ans.label}</span>
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary transition-colors">
                     <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-primary transition-colors" />
                  </div>
               </button>
            ))}
         </div>
         
         <div className="mt-12 flex justify-between items-center text-sm">
            <button 
               onClick={goBack}
               disabled={currentStep === 0}
               className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
            >
               <ArrowLeft size={16} /> Voltar
            </button>
            <Link to="/" className="text-slate-500 hover:text-white transition-colors">
               Cancelar Assessment
            </Link>
         </div>
      </div>
      
    </div>
  );
}
