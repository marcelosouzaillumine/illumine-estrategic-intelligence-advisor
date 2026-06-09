import React from 'react';
import { CognitiveCausalStep } from '../../viewmodels/cognitive/ExecutiveCognitiveViewModel';
import { ArrowDown } from 'lucide-react';

interface CausalPathPanelProps {
  causalPath: CognitiveCausalStep[];
}

export const CausalPathPanel: React.FC<CausalPathPanelProps> = ({ causalPath }) => {
  if (!causalPath || causalPath.length === 0) {
    return (
      <div className="p-6 mb-6 bg-surface-container/30 border border-border rounded-xl">
        <h3 className="text-lg font-bold text-foreground mb-2">Trajetória Causal</h3>
        <p className="text-sm text-muted-foreground">
          Sem caminho causal contíguo isolado. A inferência atual não pôde remontar a trajetória linear determinística ("Fail Closed").
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 mb-6 bg-card border border-border shadow-sm rounded-xl">
      <h3 className="text-lg font-bold text-foreground mb-2">Trajetória Causal Determinística</h3>
      <p className="text-sm text-muted-foreground mb-4">
        O diagrama visualiza o trajeto de dependências lógicas que resultaram nesta inferência.
      </p>
      
      <div className="flex flex-col items-start mt-4">
        {causalPath.map((step, index) => (
          <div key={step.stepId} className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{step.sourceNodeLabel}</span>
            </div>
            
            <div className="flex items-center my-2 ml-4 border-l-2 border-dashed border-border pl-4 py-2">
              <ArrowDown className="text-muted-foreground mr-2" size={16} />
              <span className="px-2 py-1 text-xs border border-primary/30 text-primary rounded-full bg-primary/5">
                {step.relationshipType}
              </span>
            </div>
            
            {index === causalPath.length - 1 && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">{step.targetNodeLabel}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
