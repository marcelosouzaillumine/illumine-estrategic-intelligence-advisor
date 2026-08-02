import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Database, Brain, Activity, LineChart, Users, Combine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function ExecutiveAssessmentPage() {
  const { t } = useTranslation('assessment');

  const dimensions = [
    { id: 'governance', title: t('dimensions.governance.title'), question: t('dimensions.governance.question'), icon: ShieldCheck },
    { id: 'information', title: t('dimensions.information.title'), question: t('dimensions.information.question'), icon: Database },
    { id: 'finance', title: t('dimensions.finance.title'), question: t('dimensions.finance.question'), icon: LineChart },
    { id: 'strategy', title: t('dimensions.strategy.title'), question: t('dimensions.strategy.question'), icon: Brain },
    { id: 'operation', title: t('dimensions.operation.title'), question: t('dimensions.operation.question'), icon: Activity },
    { id: 'people', title: t('dimensions.people.title'), titleIcon: Users, question: t('dimensions.people.question'), icon: Users },
    { id: 'learning', title: t('dimensions.learning.title'), question: t('dimensions.learning.question'), icon: Combine },
  ];

  const answersList = t('answers', { returnObjects: true }) as string[];
  const answers = [
    { value: 1, label: answersList[0] },
    { value: 2, label: answersList[1] },
    { value: 3, label: answersList[2] },
    { value: 4, label: answersList[3] },
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

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

    if (percentage < 0.4) return { level: t('maturity.operational.level'), desc: t('maturity.operational.desc'), color: 'text-slate-400' };
    if (percentage < 0.65) return { level: t('maturity.integrated.level'), desc: t('maturity.integrated.desc'), color: 'text-amber-500' };
    if (percentage < 0.85) return { level: t('maturity.executive.level'), desc: t('maturity.executive.desc'), color: 'text-amber-400' };
    return { level: t('maturity.institutional.level'), desc: t('maturity.institutional.desc'), color: 'text-amber-500' };
  };

  if (isComplete) {
    const maturity = calculateMaturity();
    
    return (
      <div className="min-h-[90vh] w-full bg-[#0A0A0B] text-slate-200 flex flex-col p-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-[#0A0A0B] to-[#0A0A0B] z-0 pointer-events-none" />
         
         {!showForm ? (
            <div className="w-[90vw] md:w-[672px] mx-auto my-auto bg-white/5 border border-white/10 p-6 md:p-12 rounded-3xl relative z-10 text-center shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
               <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-6" />
               <h2 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">{t('result.completed_label')}</h2>
               <h3 className="text-3xl font-bold text-white mb-2">{t('result.title')}</h3>
               <div className={cn("text-2xl md:text-3xl font-bold mb-4 mt-6", maturity.color)}>
                  {maturity.level}
               </div>
               <p className="text-sm text-slate-400 mb-8 w-[280px] md:w-[480px] mx-auto">
                  {maturity.desc}
               </p>

               {/* Institutional Evolution Map */}
               <div className="text-left mb-8 bg-[#050506] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Brain className="w-4 h-4 text-amber-500" />
                     {t('result.map_title')}
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
                  
                  <h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-3">{t('result.opportunities_title')}</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                     {(t('result.opportunities', { returnObjects: true }) as string[]).map((opp, idx) => (
                       <li key={idx} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> {opp}</li>
                     ))}
                  </ul>
               </div>
               
               <div className="space-y-4">
                  <button 
                     onClick={() => setShowForm(true)}
                     className="w-full py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                     {t('result.btn_report')}
                     <ArrowRight size={18} />
                  </button>
                  <Link 
                     to="/"
                     className="w-full py-4 bg-transparent border border-white/10 text-slate-400 font-medium rounded-full hover:bg-white/5 transition-colors flex items-center justify-center"
                  >
                     {t('result.btn_home')}
                  </Link>
               </div>
            </div>
         ) : (
            <div className="w-[90vw] md:w-[576px] mx-auto my-auto bg-white/5 border border-white/10 p-6 md:p-12 rounded-3xl relative z-10 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-right-8 duration-500">
               {formSubmitted ? (
                  <div className="text-center animate-in zoom-in-95 duration-500">
                     <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-amber-500" />
                     </div>
                     <h3 className="text-2xl font-bold text-white mb-4">{t('form.success_title')}</h3>
                     <p className="text-slate-400 mb-8">{t('form.success_desc')}</p>
                     <Link 
                        to="/"
                        className="w-full py-4 bg-transparent border border-white/10 text-slate-400 font-medium rounded-full hover:bg-white/5 transition-colors flex items-center justify-center"
                     >
                        {t('result.btn_home')}
                     </Link>
                  </div>
               ) : (
                  <>
                     <h3 className="text-2xl font-bold text-white mb-4">{t('form.title')}</h3>
                     <div className="space-y-4 text-slate-400 mb-8">
                        <p>{t('form.desc_1')}</p>
                        <p>{t('form.desc_2')}</p>
                     </div>
                     
                      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }}>
                        <div>
                           <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-medium">{t('form.name_label')}</label>
                           <input required type="text" className="w-full bg-[#050506] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder={t('form.name_placeholder')} />
                        </div>
                        <div>
                           <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-medium">{t('form.email_label')}</label>
                           <input required type="email" className="w-full bg-[#050506] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder={t('form.email_placeholder')} />
                        </div>
                        <div>
                           <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-medium">{t('form.role_label')}</label>
                           <select className="w-full bg-[#050506] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                              {(t('form.roles', { returnObjects: true }) as string[]).map((role, idx) => (
                                <option key={idx}>{role}</option>
                              ))}
                           </select>
                        </div>
                        
                        <div className="pt-4">
                           <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                              {t('form.btn_submit')}
                              <CheckCircle2 size={18} />
                           </button>
                        </div>
                     </form>
                     <p className="text-center text-xs text-slate-500 mt-6">{t('form.disclaimer')}</p>
                  </>
               )}
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
         <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-4 uppercase tracking-widest">
               <span>{t('progress.dimension_label', { current: currentStep + 1, total: dimensions.length })}</span>
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
         <div key={currentStep} className="animate-in slide-in-from-right-8 fade-in duration-500 w-full">
            <div className="mb-8">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                     <currentDim.icon className="w-5 h-5 text-slate-300" />
                  </div>
                  <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-widest">{currentDim.title}</h2>
               </div>
               <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {currentDim.question}
               </h1>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {answers.map((ans, idx) => (
                  <button
                     key={ans.value}
                     onClick={() => handleAnswer(ans.value)}
                     className="w-full h-full p-4 md:p-5 text-left bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between items-start gap-4 group animate-in slide-in-from-bottom-4 fade-in fill-mode-backwards"
                     style={{ animationDelay: `${idx * 100}ms` }}
                  >
                     <div className="w-full flex justify-between items-end mt-auto">
                        <span className="text-base text-slate-300 group-hover:text-white font-medium pr-4">{ans.label}</span>
                        <div className="w-6 h-6 shrink-0 rounded-full border border-white/20 flex items-center justify-center group-hover:border-amber-500 transition-colors">
                           <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-amber-500 transition-colors" />
                        </div>
                     </div>
                  </button>
               ))}
            </div>
         </div>
         
         <div className="mt-8 flex justify-between items-center text-sm">
            <button 
               onClick={goBack}
               disabled={currentStep === 0}
               className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
            >
               <ArrowLeft size={16} /> {t('progress.btn_back')}
            </button>
            <Link to="/" className="text-slate-500 hover:text-white transition-colors">
               {t('progress.btn_cancel')}
            </Link>
         </div>
      </div>
      
    </div>
  );
}
