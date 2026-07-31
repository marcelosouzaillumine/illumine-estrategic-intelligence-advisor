import React, { useState } from 'react';

export const ExecutiveInsightCard = ({ title, content }: { title: string, content: string }) => (
  <div className="bg-surface-elevated border border-border p-4 rounded-lg mb-4">
    <h4 className="text-sm font-bold text-primary mb-2">{title}</h4>
    <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
  </div>
);

export const ExecutiveRiskCard = ({ title, severity, description }: { title: string, severity: string, description: string }) => (
  <div className="bg-critical-soft/10 border border-critical/20 p-4 rounded-lg mb-4 flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <h4 className="text-sm font-bold text-critical">{title}</h4>
      <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm bg-critical/20 text-critical">{severity}</span>
    </div>
    <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
  </div>
);

export interface ExplainabilityMetadata {
  why: string;
  evidences: string;
  historical: string;
  scenarios: string;
  agents: string;
  risks: string;
  counterpoints: string;
  governance: string;
  confidence: number;
}

export const ExecutiveRecommendationCard = ({ 
  title, 
  urgency, 
  description,
  explainability 
}: { 
  title: string, 
  urgency: string, 
  description: string,
  explainability?: ExplainabilityMetadata
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-surface-elevated border border-border p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-bold text-foreground">{title}</h4>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">{urgency}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
      
      {explainability && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex gap-4 mb-3 text-xs text-muted-foreground">
            <span><strong>Confiança:</strong> {explainability.confidence}%</span>
            <span><strong>Risco:</strong> Moderado</span>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            {isExpanded ? '▲ Ocultar raciocínio executivo' : '▼ Ver raciocínio executivo'}
          </button>
          
          {isExpanded && (
            <div className="mt-3 p-3 bg-surface-container rounded-md text-xs text-foreground space-y-2 border border-border">
              <p><strong>Por que?</strong> {explainability.why}</p>
              <p><strong>1. Evidências analisadas:</strong> {explainability.evidences}</p>
              <p><strong>2. Histórico semelhante:</strong> {explainability.historical}</p>
              <p><strong>3. Cenários avaliados:</strong> {explainability.scenarios}</p>
              <p><strong>4. Agentes consultados:</strong> {explainability.agents}</p>
              <p><strong>5. Riscos encontrados:</strong> {explainability.risks}</p>
              <p><strong>6. Contrapontos considerados:</strong> {explainability.counterpoints}</p>
              <p><strong>7. Governança aplicada:</strong> {explainability.governance}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ExecutiveDecisionCard = ({ question, context, options }: { question: string, context: string, options: string[] }) => (
  <div className="bg-surface-container border border-primary/20 p-4 rounded-lg mb-4">
    <h4 className="text-sm font-bold text-primary mb-2">{question}</h4>
    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{context}</p>
    <div className="flex flex-col gap-2">
      {options.map((opt, i) => (
        <button key={i} className="px-4 py-2 text-sm text-left bg-surface-elevated border border-border hover:border-primary/50 transition-colors rounded-md font-medium text-foreground">
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export const ExecutiveActionCard = ({ label, intent, requiresConfirmation }: { label: string, intent: string, requiresConfirmation: boolean }) => (
  <button className="w-full mb-2 bg-primary text-primary-foreground font-medium text-sm px-4 py-3 rounded-lg shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all active:scale-95 flex justify-between items-center">
    <span>{label}</span>
    {requiresConfirmation && <span className="text-xs opacity-70 border border-primary-foreground/30 px-2 py-0.5 rounded-sm">Requer Confirmação</span>}
  </button>
);
