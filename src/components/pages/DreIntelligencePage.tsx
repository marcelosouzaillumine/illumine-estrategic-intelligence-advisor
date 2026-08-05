// @ts-nocheck
import React, { useState } from 'react';
import { BasePageLayout } from '../layout/BasePageLayout';
import { 
  ExecutiveHeading, 
  ExecutiveText, 
  ExecutiveCard,
  DataDisplay
} from '../../ui/executive';
import { useExecutiveContext } from '../../../context/ExecutiveContext';

export const DreIntelligencePage: React.FC = () => {
  const { executiveReport } = useExecutiveContext();
  
  // Mocks based on the new structure
  const performance = executiveReport?.financialPerformance || {
    diagnosis: 'A empresa apresenta crescimento consistente de receita, porém com redução da margem operacional, indicando necessidade de avaliar eficiência dos custos e qualidade do crescimento.',
    performanceRisks: ['Compressão operacional', 'Crescimento com baixa eficiência'],
    growthOpportunities: ['Avaliar rentabilidade por linha', 'Revisar mix de produtos'],
    signals: {
      strengths: ['Crescimento de receita', 'EBITDA positivo', 'Margem bruta preservada'],
      attentionPoints: ['Compressão operacional', 'Lucro sem conversão em caixa', 'Crescimento com baixa eficiência']
    }
  };

  const cfoQuestions = [
    "O crescimento atual aumenta valor econômico ou apenas volume operacional?",
    "A margem EBITDA suporta o plano estratégico de expansão?",
    "O lucro gerado está sendo convertido em caixa?",
    "Quais linhas estão reduzindo a rentabilidade estrutural?"
  ];

  return (
    <BasePageLayout 
      title="Performance Intelligence" 
      subtitle="Income Statement & Value Creation"
      contextTags={['DRE', 'EBITDA', 'Value Creation', 'Cash Conversion']}
      onAskAssistant={() => {}}
      onGeneratePdf={() => {}}
      showReportMetadata={true}
    >
      <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-24">
        
        {/* EXECUTIVE PERFORMANCE INTERPRETATION */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <ExecutiveCard className="bg-surface border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <ExecutiveHeading as="h2" variant="h3" className="mb-0">Executive Performance Interpretation™</ExecutiveHeading>
            </div>
            <ExecutiveText variant="body" className="text-lg leading-relaxed text-foreground/90 pl-13 border-l-2 border-primary/30 ml-5">
              "{performance.diagnosis}"
            </ExecutiveText>
          </ExecutiveCard>
        </div>

        {/* PERFORMANCE SIGNALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <ExecutiveCard className="border-border shadow-sm">
            <ExecutiveHeading as="h3" variant="h4" className="mb-4 text-emerald-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Strengths
            </ExecutiveHeading>
            <ul className="space-y-3">
              {performance.signals.strengths.map((str: string, i: number) => (
                <li key={i} className="flex gap-2 items-start text-sm">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </ExecutiveCard>

          <ExecutiveCard className="border-border shadow-sm">
            <ExecutiveHeading as="h3" variant="h4" className="mb-4 text-amber-500 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Attention Points
            </ExecutiveHeading>
            <ul className="space-y-3">
              {performance.signals.attentionPoints.map((pt: string, i: number) => (
                <li key={i} className="flex gap-2 items-start text-sm">
                  <span className="text-amber-500 font-bold mt-0.5">⚠</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </ExecutiveCard>
        </div>

        {/* CFO PERFORMANCE ROOM */}
        <div className="bg-foreground text-background p-8 rounded-[24px] shadow-xl animate-in fade-in duration-500 delay-300">
          <div className="flex items-center gap-3 mb-6 border-b border-background/20 pb-4">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <ExecutiveHeading as="h3" variant="sectionTitle" className="mb-0 text-background">CFO Performance Room™</ExecutiveHeading>
              <span className="text-background/60 text-xs font-medium uppercase tracking-wider">Perguntas Estratégicas para o Board</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
             {cfoQuestions.map((q, idx) => (
               <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/10 transition-colors">
                 <div className="text-primary font-bold mt-1 text-lg">Q.</div>
                 <p className="text-background/90 text-sm leading-relaxed">{q}</p>
               </div>
             ))}
          </div>
        </div>

      </div>
    </BasePageLayout>
  );
};
