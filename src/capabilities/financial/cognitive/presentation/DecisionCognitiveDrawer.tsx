import React from 'react';
import { useCognitiveNavigation } from '../../../../context/cognitive-navigation/CognitiveNavigationContext';
import { useExecutiveCognitiveInsight } from '../../../../hooks/useExecutiveCognitiveInsight';
import { EvidenceDetailPanel } from '../../../../components/cognitive/EvidenceDetailPanel';
import { ExplainabilityDetailPanel } from '../../../../components/cognitive/ExplainabilityDetailPanel';
import { InstitutionalGraphViewer } from '../../../../components/cognitive/InstitutionalGraphViewer';
import { X, ArrowLeft, Loader2, BrainCircuit } from 'lucide-react';
import { InvestigationLauncherWrapper } from '../../../../components/investigation/InvestigationLauncherWrapper';

export const DecisionCognitiveDrawer: React.FC = () => {
  const { state, closeDrawer, goBack } = useCognitiveNavigation();
  const { isDrawerOpen, targetNodeId, history } = state;

  const { loading, viewModel, error } = useExecutiveCognitiveInsight(targetNodeId || undefined);

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" 
        onClick={closeDrawer} 
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-card border-l border-border shadow-2xl z-[101] flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface-container/30">
          <div className="flex items-center gap-3">
            {history.length > 1 && (
              <button 
                onClick={goBack}
                className="p-1.5 hover:bg-surface-container rounded-full text-muted-foreground transition-colors"
                title="Voltar"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <BrainCircuit className="text-primary" size={20} />
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
                Inteligência Cognitiva
              </h2>
            </div>
          </div>
          <button 
            onClick={closeDrawer}
            className="p-1.5 hover:bg-surface-container rounded-full text-muted-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <Loader2 className="animate-spin text-primary" size={32} />
              <span className="text-xs uppercase tracking-widest font-bold">Consultando Grafo Institucional...</span>
            </div>
          )}

          {!loading && error && (
            <div className="p-4 bg-critical-soft border border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-400 rounded-xl">
              <p className="font-bold text-sm mb-1 uppercase tracking-wider">Falha Cognitiva</p>
              <p className="text-xs">{error}</p>
            </div>
          )}

          {!loading && !error && viewModel && (
            <div className="space-y-8 animate-in fade-in duration-300 pb-12">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                  Nó Alvo: {targetNodeId}
                </span>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {viewModel.title}
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container border border-border">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Confiança:
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      viewModel.confidenceLevel === 'DETERMINISTIC' ? 'text-emerald-500' :
                      viewModel.confidenceLevel === 'HIGH' ? 'text-blue-500' :
                      viewModel.confidenceLevel === 'MODERATE' ? 'text-amber-500' :
                      'text-muted-foreground'
                    }`}>
                      {viewModel.confidenceLevel}
                    </span>
                  </div>
                  {targetNodeId && (
                    <InvestigationLauncherWrapper 
                      tenantId="SYSTEM_TENANT" 
                      nodeId={targetNodeId} 
                      originSurface="COGNITIVE_DRAWER" 
                    />
                  )}
                </div>
              </div>

              {/* Panels */}
              <div className="space-y-8">
                <EvidenceDetailPanel evidences={viewModel.evidences} />
                <ExplainabilityDetailPanel primaryDrivers={viewModel.primaryDrivers} causalPath={viewModel.causalPath} />
                <InstitutionalGraphViewer primaryDrivers={viewModel.primaryDrivers} causalPath={viewModel.causalPath} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
