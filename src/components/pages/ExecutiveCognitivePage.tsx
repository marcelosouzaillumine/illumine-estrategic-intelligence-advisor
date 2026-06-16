import React, { useState } from 'react';
import { useExecutiveCognitiveInsight } from '../../hooks/useExecutiveCognitiveInsight';
import { CognitiveSummaryCard } from '../cognitive/CognitiveSummaryCard';
import { EvidencePanel } from '../cognitive/EvidencePanel';
import { ExplainabilityPanel } from '../cognitive/ExplainabilityPanel';
import { CausalPathPanel } from '../cognitive/CausalPathPanel';
import { DecisionImpactPanel } from '../cognitive/DecisionImpactPanel';
import { Loader2 } from 'lucide-react';

export const ExecutiveCognitivePage: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [targetNodeId, setTargetNodeId] = useState<string | undefined>(undefined);

  const { loading, viewModel, error } = useExecutiveCognitiveInsight(targetNodeId);

  const handleSearch = () => {
    if (searchInput.trim()) {
      setTargetNodeId(searchInput.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-foreground mb-2 text-primary">
        Executive Cognitive Layer
      </h1>
   <p className="text-executive-secondary mb-8 text-lg max-w-4xl">
        Interface de consulta cognitiva institucional determinística. Nenhuma inteligência generativa é utilizada nesta camada. Todos os dados representam vínculos causais rastreáveis dentro do Knowledge Graph Fiduciário.
      </p>

      <div className="flex gap-4 mb-8">
        <input 
          type="text"
          className="flex-1 max-w-md px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Ex: RISK-LIQ-001, DECISION-BD-102"
        />
        <button 
          className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          onClick={handleSearch}
        >
          Consultar Grafo
        </button>
      </div>

      {!targetNodeId && (
        <div className="p-12 text-center bg-surface-container/50 border border-border border-dashed rounded-xl">
     <p className="text-executive-secondary">
            Insira o ID de um nó institucional (Risco, Decisão, Fator, Indicador) para visualizar o rastreio executivo.
          </p>
        </div>
      )}

      {targetNodeId && loading && (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      )}

      {targetNodeId && !loading && error && (
        <div className="p-6 bg-critical-soft border border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-400 rounded-xl">
          <p className="font-bold mb-1">Falha Cognitiva</p>
          <p className="text-sm">{error}</p>
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
    </div>
  );
};
