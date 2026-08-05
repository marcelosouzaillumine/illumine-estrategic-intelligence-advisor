import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { ExecutiveInsight } from '../../../../workspace/data/types/executive-insight.types';

export interface ForecastNarrativeWidgetProps {
  insights: ExecutiveInsight[];
}

export function ForecastNarrativeWidget({ insights }: ForecastNarrativeWidgetProps) {
  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Forecast Insights</h2>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {insights.map((insight, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-lg border ${
              insight.severity === 'warning' 
                ? 'bg-rose-500/5 border-rose-500/20' 
                : insight.severity === 'success' 
                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                  : 'bg-primary/5 border-primary/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${
                insight.severity === 'warning' ? 'text-rose-500' : 
                insight.severity === 'success' ? 'text-emerald-500' : 'text-primary'
              }`}>
                {insight.severity === 'warning' ? <AlertTriangle size={18} /> : 
                 insight.severity === 'success' ? <CheckCircle size={18} /> : <Lightbulb size={18} />}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-foreground">{insight.narrative}</p>
                
                {insight.evidence && insight.evidence.length > 0 && (
                  <ul className="list-disc pl-5 text-sm text-foreground/80 mb-3 space-y-1">
                    {insight.evidence.map((ev, i) => <li key={i}>{ev}</li>)}
                  </ul>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {insight.impact && (
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">Impacto Previsto</span>
                      <p className="text-sm text-foreground/80">{insight.impact}</p>
                    </div>
                  )}
                  {insight.recommendation && (
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">Recomendação</span>
                      <div className="flex items-center gap-1.5">
                        <ArrowRight size={14} className="text-primary shrink-0" />
                        <p className="text-sm font-medium text-foreground">{insight.recommendation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
