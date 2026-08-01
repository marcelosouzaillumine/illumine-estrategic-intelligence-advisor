import React from 'react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveDashboardRenderer } from '../ui/ExecutiveDashboardRenderer';
import { DashboardStateBuilder } from '../../../packages/intelligence/executive-intelligence-layer/src/presentation/DashboardStateBuilder';
import { InstitutionalDecisionOS } from '../../../packages/intelligence/executive-intelligence-layer/src/orchestration/InstitutionalDecisionOS';

export function ExecutiveDeliberationCenterPage() {
  
  // Fake state for demonstration
  const boardPackage = InstitutionalDecisionOS.runSession(
    { 
      id: 'q-delib-1', 
      text: 'Devemos seguir com o plano de expansão e M&A?', 
      questionType: 'ACQUISITION', 
      askedBy: 'Conselho de Administração', 
      askedAt: new Date(),
      decisionContext: {
        currentState: 'Caixa negativo, Dívida elevada, Mercado crescendo',
        constraints: ['Liquidez'],
        strategicMoment: '2025'
      },
      businessProblem: 'Necessidade de ganho de market share',
      decisionToEnable: 'Aprovação de M&A',
      strategicHypothesis: 'M&A acelera crescimento',
      financialImpact: 'Alto',
      timeHorizon: '24 meses',
      decisionMaker: 'Board',
      decisionCriteria: ['ROI > 20%'],
      successDefinition: 'Market share 15%',
      nonNegotiables: ['Não queimar caixa'],
      stakeholders: ['Acionistas'] 
    },
    { assets: 25000000, liabilities: 20000000, equity: 5000000, liquidity: 0.8, ebitda: 1000000, revenue: 15000000 }
  );

  const dashboardState = DashboardStateBuilder.buildFromBoardPackage(boardPackage);

  return (
    <ExecutivePageTemplate header={{ title: "Executive Deliberation Center™", description: "Painel institucional para submissão de Questões Executivas, análise de Pareceres Técnicos e tomada de Decisão Governada." }}>
      
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">Sessão em Andamento: {boardPackage.sessionId}</h2>
        <div className="bg-slate-50 p-6 rounded-2xl border border-border">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Executive Question</p>
          <h3 className="text-3xl font-black text-executive-secondary mb-4">{boardPackage.executiveQuestion.text}</h3>
          <p className="text-sm text-muted-foreground">Submetido por: {boardPackage.executiveQuestion.askedBy}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="p-6 border border-border rounded-2xl">
          <h4 className="font-bold mb-4">Parecer: Balanço Patrimonial</h4>
          <p className="text-sm font-medium text-executive-secondary mb-2">Status: {boardPackage.assessments.financialAssessment?.executiveState}</p>
          <ul className="text-sm list-disc pl-4 space-y-2">
            {boardPackage.assessments.financialAssessment?.limitations.map((r, i) => (
              <li key={i} className="text-critical-soft0">{r}</li>
            ))}
          </ul>
        </div>
        
        <div className="p-6 border border-border rounded-2xl">
          <h4 className="font-bold mb-4">Simulador Estratégico Integrado</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Simulações são recursos da deliberação. Qualquer alteração de premissa submeterá um novo pacote de pareceres ao Comitê.
          </p>
          <button className="px-6 py-3 bg-executive-primary text-white rounded-lg font-bold text-sm hover:opacity-90 w-full">
            Rodar Nova Simulação (Recalcular Deliberação)
          </button>
        </div>
      </div>

      <ExecutiveDashboardRenderer model={dashboardState} />

      {/* 5. Human Decision & 6. Board Package (Mocked Visuals for Wave 3.8C) */}
      <div className="mt-12 bg-white p-8 rounded-[32px] border-2 border-executive-primary/20 shadow-xl">
        <h3 className="text-2xl font-black text-executive-secondary mb-6">Human Decision Record</h3>
        <p className="text-sm text-muted-foreground mb-8">
          A Inteligência Artificial preparou os cenários e expôs os conflitos. A decisão fiduciária pertence ao Comitê.
        </p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boardPackage.optionsConsidered.map(opt => (
              <button key={opt.id} className="p-4 border border-border rounded-xl text-left hover:border-executive-primary hover:bg-slate-50 transition-all">
                <h4 className="font-bold text-executive-secondary mb-2">{opt.name}</h4>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </button>
            ))}
          </div>
          
          <div className="pt-6 border-t border-border flex justify-end">
            <button className="px-8 py-4 bg-executive-primary text-white rounded-xl font-bold hover:bg-executive-primary/90 transition-all shadow-md">
              Assinar Deliberação & Registrar no Board Package
            </button>
          </div>
        </div>
      </div>

    </ExecutivePageTemplate>
  );
}
