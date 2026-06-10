import React from 'react';
import { UIWarRoomImpact } from '../../viewmodels/war-room/WarRoomViewModel';
import { AlertTriangle, Map } from 'lucide-react';
import { ScenarioNavigationEngine } from '../../core/war-room/ScenarioNavigationEngine';
import { useNavigate } from 'react-router-dom';

interface RiskPropagationViewerProps {
  impacts: UIWarRoomImpact[];
}

export const RiskPropagationViewer: React.FC<RiskPropagationViewerProps> = ({ impacts }) => {
  const navigate = useNavigate();
  const riskImpacts = impacts.filter(i => i.type === 'RISK_VECTOR' || i.severity === 'CRITICAL');

  if (impacts.length === 0) {
    return (
      <div className="card-premium p-6 h-full flex flex-col items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-muted-foreground mb-3" />
        <h4 className="text-sm font-bold text-foreground">Nenhuma cadeia de risco disponível.</h4>
        <p className="text-xs text-muted-foreground mt-2 text-center max-w-sm">
          A visualização de riscos atua apenas sobre vetores previamente persistidos no Knowledge Graph.
        </p>
      </div>
    );
  }

  return (
    <div className="card-premium overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border bg-surface-container-highest flex items-center justify-between">
        <h3 className="text-eyebrow text-foreground uppercase tracking-widest flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Cadeia de Riscos
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {riskImpacts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-medium text-muted-foreground">Nenhum risco sistêmico ativado neste cenário.</p>
          </div>
        ) : (
          riskImpacts.map(risk => (
            <div key={risk.id} className="p-3 bg-critical-soft0/5 border border-rose-500/20 rounded-lg">
              <div className="flex items-start justify-between">
                <p className="text-xs text-rose-200/80 font-medium leading-relaxed pr-4">
                  {risk.description}
                </p>
                <button 
                  onClick={() => ScenarioNavigationEngine.navigateToImpactInInvestigation(navigate, 'SYSTEM', risk.id)}
                  className="p-1.5 bg-surface-container hover:bg-surface-container-highest rounded transition-colors text-muted-foreground"
                  title="Investigar vetor no Graph"
                >
                  <Map className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
