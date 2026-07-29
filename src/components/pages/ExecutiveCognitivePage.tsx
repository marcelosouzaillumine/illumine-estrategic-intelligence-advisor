


import React, { useState } from 'react';
import { useExecutiveCognitiveInsight } from '../../hooks/useExecutiveCognitiveInsight';
import { CognitiveSummaryCard } from '../cognitive/CognitiveSummaryCard';
import { EvidencePanel } from '../cognitive/EvidencePanel';
import { ExplainabilityPanel } from '../cognitive/ExplainabilityPanel';
import { CausalPathPanel } from '../cognitive/CausalPathPanel';
import { DecisionImpactPanel } from '../cognitive/DecisionImpactPanel';
import { Loader2, BrainCircuit } from 'lucide-react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { StatusBadge } from '../Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useExecutiveCognitivePageViewModel } from '../../viewmodels/useExecutiveCognitivePageViewModel';

export const ExecutiveCognitivePage: React.FC = () => {
  // Adapter: useExecutiveCognitivePageAdapter
  // ViewModel: useExecutiveCognitivePageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useExecutiveCognitivePageViewModel({ clientId: '' });
  const portal = createPortal;
  const [searchInput, setSearchInput] = useState<string>('');
  const [targetNodeId, setTargetNodeId] = useState<string | undefined>(undefined);

  const { loading, viewModel, error } = useExecutiveCognitiveInsight(targetNodeId);

  const handleSearch = () => {
    if (searchInput.trim()) {
      setTargetNodeId(searchInput.trim());
    }
  };

  return (
    <ExecutivePageTemplate header={{
      title: (
        <span className="flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-secondary" />
          <span>Executive Cognitive Layer</span>
        </span>
      ),
      description: "Interface de consulta cognitiva institucional determinística. Rastreabilidade de vínculos causais dentro do Knowledge Graph Fiduciário.",
    }}>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Grafo Conectado" />
        </div>
        <div className="flex gap-4 flex-1 max-w-lg">
          <input 
            type="text"
            className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ex: RISK-LIQ-001, DECISION-BD-102"
          />
          <button 
            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 text-xs transition-colors shrink-0"
            onClick={handleSearch}
          >
            Consultar Grafo
          </button>
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Relações de Causa e Efeito (Knowledge Graph)"
        subtitle="Monitore a explicabilidade de decisões e o impacto propagado de riscos corporativos."
        variant="analytics"
        defaultExpanded={true}
      >

      <div className="space-y-8">

       {!targetNodeId && (
         <ExecutiveEmptyState 
           title="Nenhum Nó Selecionado"
           description="Insira o ID de um nó institucional (Risco, Decisão, Fator, Indicador) no painel superior para visualizar o rastreio cognitivo e explicabilidade determinística."
           icon={<BrainCircuit className="w-12 h-12 text-muted-foreground" />}
         />
       )}

       {targetNodeId && loading && (
         <div className="flex justify-center p-20">
           <Loader2 className="animate-spin text-secondary" size={40} />
         </div>
       )}

       {targetNodeId && !loading && error && (
         <div className="p-6 bg-critical-soft border border-rose-200 text-critical rounded-xl space-y-1">
           <ExecutiveText as="div" variant="bodyStandard" className="font-bold uppercase tracking-widest">Falha de Rastreabilidade</ExecutiveText>
           <ExecutiveText as="div" variant="bodyStandard">{error}</ExecutiveText>
         </div>
       )}

      {targetNodeId && !loading && !error && viewModel && (
        <div className="mt-8">
          <CognitiveSummaryCard 
            title={viewModel.title}
            summary={viewModel.summary}
            confidenceLevel={viewModel.confidenceLevel}
            evidenceCount={viewModel.evidenceCount}
          />

          <div className="flex flex-col gap-6">
            <EvidencePanel evidences={viewModel.evidences} />
            <ExplainabilityPanel primaryDrivers={viewModel.primaryDrivers} />
            <CausalPathPanel causalPath={viewModel.causalPath} />
            <DecisionImpactPanel decisions={viewModel.connectedDecisions} />
          </div>
        </div>
      )}
       <ExecutiveSummarySection 
         status={{ label: 'Camada Cognitiva Ativa', variant: 'success' }}
         question="Qual a rastreabilidade causal e a explicabilidade dos modelos fiduciários?"
         opinion="O comitê fiduciário homologa os grafos de causalidade, garantindo transparência nas inferências de inteligência."
         driver="Knowledge Graph, nós causais, matriz de explicabilidade e conexões de decisão."
         implication="Prevenção de decisões baseadas em correlações espúrias ou modelos opacos."
         action="Verificar os nós de maior centralidade no grafo quinzenalmente."
       >
         <ExecutiveStrategicTensions tensions={[]} />
         <ExecutiveDecisionTrace trace={[]} />
       </ExecutiveSummarySection>
      </div>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
};
