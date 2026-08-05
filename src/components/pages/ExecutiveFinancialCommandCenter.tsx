// @ts-nocheck
import React from 'react';
import { BasePageLayout } from '../layout/BasePageLayout';
import { ExecutiveHeading, ExecutiveText, ExecutiveCard } from '../../ui/executive';
import { useExecutiveContext } from '../../../context/ExecutiveContext';

export const ExecutiveFinancialCommandCenter: React.FC = () => {
  const { executiveReport } = useExecutiveContext();

  // Mapeamento dinâmico baseado no executiveReport gerado (ex: BalanceSheetPage / EFOS)
  const data = executiveReport?.financialIntelligence || {
    profile: (executiveReport?.canonicalState as any)?.financialDiagnosis?.diagnosis || 
             "Aguardando sincronização de dados financeiros...",
             
    findings: ((executiveReport?.canonicalState as any)?.financialInsights?.attentionPoints || []).map((point: string) => ({
      finding: point,
      severity: 'HIGH'
    })),
    
    themes: (executiveReport?.canonicalState as any)?.financialDecisionContext?.tradeoffs || [],
    
    questions: (executiveReport?.canonicalState as any)?.financialDiagnosis?.cfoQuestions || [],
    
    history: (executiveReport?.history || []).map((h: any) => ({
      period: h.period || 'Atual',
      profile: h.profile || 'STABLE'
    }))
  };

  return (
    <BasePageLayout 
      title="Financial Command Center" 
      subtitle="Unified Executive Financial Intelligence"
      contextTags={['Orchestration', 'Strategic View', 'Board Ready']}
      onAskAssistant={() => {}}
      onGeneratePdf={() => {}}
      showReportMetadata={true}
    >
      <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-24">
        
        {/* FINANCIAL HEALTH PROFILE */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <ExecutiveCard className="bg-foreground text-background border-transparent">
            <div className="flex items-center gap-3 mb-4 border-b border-background/20 pb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <ExecutiveHeading as="h2" variant="h3" className="mb-0 text-background">Financial Health Profile</ExecutiveHeading>
            </div>
            <ExecutiveText variant="body" className="text-xl leading-relaxed text-background/90 italic">
              "{data.profile}"
            </ExecutiveText>
          </ExecutiveCard>
        </div>

        {/* ASK ILLUMINE FINANCIAL INTELLIGENCE */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 delay-75">
          <ExecutiveCard className="bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <ExecutiveHeading as="h3" variant="h4" className="mb-0 text-primary">Ask Illumine Financial Intelligence™</ExecutiveHeading>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ex: Por que meu caixa aumentou mas meu retorno caiu?" 
                  className="w-full bg-background border border-border rounded-lg py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary text-primary-foreground px-4 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
                  Conversar
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-foreground/60 font-semibold uppercase tracking-wider mr-2 self-center">Sugestões:</span>
                {data.questions.map((q: string, idx: number) => (
                  <button key={idx} className="text-xs bg-surface border border-border px-3 py-1.5 rounded-full hover:border-primary/50 transition-colors text-left truncate max-w-[250px]">
                    {q}
                  </button>
                ))}
                <button className="text-xs bg-surface border border-border px-3 py-1.5 rounded-full hover:border-primary/50 transition-colors text-left">
                  Onde está o maior risco financeiro?
                </button>
              </div>
            </div>
          </ExecutiveCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* TOP STRATEGIC FINDINGS */}
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
            <ExecutiveCard className="h-full">
              <ExecutiveHeading as="h3" variant="h4" className="mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Top Strategic Findings
              </ExecutiveHeading>
              <div className="space-y-4">
                {data.findings.map((f: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                    <span className="font-semibold text-foreground/80">{f.finding.replace(/_/g, ' ')}</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${f.severity === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {f.severity}
                    </span>
                  </div>
                ))}
              </div>
            </ExecutiveCard>
          </div>
            {/* EXECUTIVE MEMORY TIMELINE */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <ExecutiveCard>
            <div className="flex items-center justify-between mb-6">
              <ExecutiveHeading as="h3" variant="h4" className="mb-0 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Executive Memory Timeline™
              </ExecutiveHeading>
              <span className="text-xs font-semibold text-primary/80 uppercase tracking-widest">Active Context</span>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              
              {/* Memory Item 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border bg-surface shadow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-foreground">Decisão Estratégica</span>
                    <time className="text-xs text-foreground/50">Jan 2026</time>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Aprovada a retenção de caixa para expansão comercial. Status: Em execução.
                  </p>
                </div>
              </div>

              {/* Memory Item 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-amber-500/50 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 shadow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-foreground">Risco Monitorado</span>
                    <time className="text-xs text-foreground/50">Fev 2026</time>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Identificada pressão sobre Capital de Giro. Solicitada revisão em Mar/26.
                  </p>
                </div>
              </div>

            </div>
          </ExecutiveCard>
        </div>

          {/* QUESTIONS FOR LEADERSHIP */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
            <ExecutiveCard className="h-full bg-primary/5 border-primary/20">
              <ExecutiveHeading as="h3" variant="h4" className="mb-6 flex items-center gap-2 text-primary">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Questions for Leadership
              </ExecutiveHeading>
              <div className="space-y-5">
                {data.questions.map((q: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-primary font-bold text-lg leading-none mt-1">Q.</span>
                    <ExecutiveText variant="body" className="text-sm text-foreground/80 leading-relaxed m-0">
                      {q}
                    </ExecutiveText>
                  </div>
                ))}
              </div>
            </ExecutiveCard>
          </div>
        </div>

        {/* EVOLUTION TIMELINE */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <ExecutiveCard>
            <ExecutiveHeading as="h3" variant="h4" className="mb-6">Evolution Timeline</ExecutiveHeading>
            <div className="flex items-center justify-between">
              {data.history.map((h: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center relative w-full">
                  <div className="w-4 h-4 rounded-full bg-primary z-10"></div>
                  {idx !== data.history.length - 1 && (
                    <div className="absolute top-2 left-1/2 w-full h-[2px] bg-primary/20"></div>
                  )}
                  <div className="mt-4 text-center">
                    <span className="block font-bold text-lg text-foreground">{h.period}</span>
                    <span className="block text-xs text-foreground/60 mt-1 max-w-[120px] mx-auto uppercase tracking-wider">
                      {h.profile.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ExecutiveCard>
        </div>

      </div>
    </BasePageLayout>
  );
};
