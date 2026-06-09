import React from 'react';
import { CognitiveDecisionImpact } from '../../viewmodels/cognitive/ExecutiveCognitiveViewModel';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface DecisionImpactPanelProps {
  decisions: CognitiveDecisionImpact[];
}

export const DecisionImpactPanel: React.FC<DecisionImpactPanelProps> = ({ decisions }) => {
  if (!decisions || decisions.length === 0) {
    return (
      <div className="p-6 mb-6 bg-surface-container/30 border border-border rounded-xl">
        <h3 className="text-lg font-bold text-foreground mb-2">Impacto em Decisões Fiduciárias</h3>
        <p className="text-sm text-muted-foreground">
          Não há desdobramentos mapeados sobre decisões em aberto ou recomendações executivas diretas ("Fail Closed").
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 mb-6 bg-card border border-border shadow-sm rounded-xl">
      <h3 className="text-lg font-bold text-foreground mb-2">Impacto em Decisões Fiduciárias</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Decisões institucionais e ações corporativas que são diretamente suportadas, afetadas ou bloqueadas por esta percepção cognitiva.
      </p>
      <ul className="space-y-2">
        {decisions.map((dec) => (
          <li key={dec.decisionId} className="flex items-start gap-3 p-3 bg-surface-container/50 rounded-lg hover:bg-surface-container transition-colors">
            <div className="mt-0.5">
              {dec.impactType === 'BLOCKS' ? (
                <AlertCircle className="text-rose-500" size={20} />
              ) : (
                <CheckCircle2 className="text-emerald-500" size={20} />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">{dec.decisionLabel}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tipo de Impacto Causal: {dec.impactType}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
