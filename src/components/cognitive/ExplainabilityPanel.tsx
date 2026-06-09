import React from 'react';
import { CognitiveDriverItem } from '../../viewmodels/cognitive/ExecutiveCognitiveViewModel';
import { GitMerge } from 'lucide-react';

interface ExplainabilityPanelProps {
  primaryDrivers: CognitiveDriverItem[];
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ primaryDrivers }) => {
  if (!primaryDrivers || primaryDrivers.length === 0) {
    return (
      <div className="p-6 mb-6 bg-surface-container/30 border border-border rounded-xl">
        <h3 className="text-lg font-bold text-foreground mb-2">Explicabilidade e Drivers Primários</h3>
        <p className="text-sm text-muted-foreground">
          Dados insuficientes para explicabilidade fiduciária. ("Fail Closed").
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 mb-6 bg-card border border-border shadow-sm rounded-xl">
      <h3 className="text-lg font-bold text-foreground mb-2">Explicabilidade e Drivers Primários</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Fatores institucionais e operacionais que causaram esta conclusão estrutural.
      </p>
      <ul className="space-y-0">
        {primaryDrivers.map((driver, index) => (
          <React.Fragment key={driver.id}>
            <li className="flex items-start gap-4 py-3">
              <div className="mt-1">
                <GitMerge className="text-primary" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{driver.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tipo: <span className="font-semibold">{driver.type}</span> | Relação: <span className="font-semibold">{driver.relationType}</span> | Nível Causacional: <span className="font-semibold">{driver.impactScore ?? 'UNKNOWN'}</span>
                </p>
              </div>
            </li>
            {index < primaryDrivers.length - 1 && <div className="h-px w-full bg-border" />}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};
