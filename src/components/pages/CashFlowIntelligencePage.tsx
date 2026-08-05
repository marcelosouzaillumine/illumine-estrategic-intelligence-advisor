// @ts-nocheck
import React, { useState } from 'react';
import { BasePageLayout } from '../layout/BasePageLayout';
import { 
  ExecutiveHeading, 
  ExecutiveText, 
  ExecutiveCard
} from '../../ui/executive';
import { useExecutiveContext } from '../../../context/ExecutiveContext';

export const CashFlowIntelligencePage: React.FC = () => {
  const { executiveReport } = useExecutiveContext();
  
  // Mocks based on the new structure
  const cashFlow = executiveReport?.financialCashFlow || {
    diagnosis: 'A empresa apresenta forte geração operacional de caixa, porém parte relevante dos recursos permanece comprometida em capital de giro, reduzindo a capacidade de financiar expansão exclusivamente com recursos próprios.',
    cashGenerationProfile: 'GROWTH_CONSUMER',
    liquidityRisks: ['Crescimento pressionando capital de giro', 'Necessidade de monitorar conversão de lucro'],
    investmentSignals: ['CAPEX sem retorno comprovado'],
    signals: {
      strengths: ['Geração operacional positiva', 'Boa conversão EBITDA em caixa', 'Baixa dependência financeira'],
      attentionPoints: ['Crescimento pressionando capital de giro', 'Necessidade de monitorar conversão de lucro', 'CAPEX sem retorno comprovado']
    },
    cfoQuestions: [
      "O crescimento atual está sendo financiado pela própria operação?",
      "A geração de caixa suporta os investimentos planejados?",
      "O lucro apresentado possui qualidade financeira?"
    ]
  };

  return (
    <BasePageLayout 
      title="Cash Flow Intelligence" 
      subtitle="Financial Reality & Liquidity"
      contextTags={['Cash Conversion', 'Working Capital', 'Free Cash Flow', 'Investment Efficiency']}
      onAskAssistant={() => {}}
      onGeneratePdf={() => {}}
      showReportMetadata={true}
    >
      <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-24">
        
        {/* EXECUTIVE CASH INTERPRETATION */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <ExecutiveCard className="bg-surface border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <ExecutiveHeading as="h2" variant="h3" className="mb-0">Executive Cash Interpretation™</ExecutiveHeading>
              </div>
              <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest">
                Profile: {cashFlow.cashGenerationProfile.replace('_', ' ')}
              </div>
            </div>
            <ExecutiveText variant="body" className="text-lg leading-relaxed text-foreground/90 pl-13 border-l-2 border-primary/30 ml-5">
              "{cashFlow.diagnosis}"
            </ExecutiveText>
          </ExecutiveCard>
        </div>

        {/* CASH QUALITY SIGNALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <ExecutiveCard className="border-border shadow-sm">
            <ExecutiveHeading as="h3" variant="h4" className="mb-4 text-emerald-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Strengths
            </ExecutiveHeading>
            <ul className="space-y-3">
              {cashFlow.signals.strengths.map((str: string, i: number) => (
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
              {cashFlow.signals.attentionPoints.map((pt: string, i: number) => (
                <li key={i} className="flex gap-2 items-start text-sm">
                  <span className="text-amber-500 font-bold mt-0.5">⚠</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </ExecutiveCard>
        </div>

        {/* CFO CASH ROOM */}
        <div className="bg-foreground text-background p-8 rounded-[24px] shadow-xl animate-in fade-in duration-500 delay-300">
          <div className="flex items-center gap-3 mb-6 border-b border-background/20 pb-4">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <ExecutiveHeading as="h3" variant="sectionTitle" className="mb-0 text-background">CFO Cash Room™</ExecutiveHeading>
              <span className="text-background/60 text-xs font-medium uppercase tracking-wider">Perguntas Estratégicas sobre Liquidez</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
             {cashFlow.cfoQuestions.map((q, idx) => (
               <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/10 transition-colors">
                 <div className="text-emerald-400 font-bold mt-1 text-lg">Q.</div>
                 <p className="text-background/90 text-sm leading-relaxed">{q}</p>
               </div>
             ))}
          </div>
        </div>

      </div>
    </BasePageLayout>
  );
};
