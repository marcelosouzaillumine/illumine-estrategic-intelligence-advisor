import React, { useState } from 'react';
import { useExecutiveCognitive } from '../../context/executive-cognitive/ExecutiveCognitiveProvider';
import { ShieldAlert, ChevronDown, ChevronUp, Bell, Flame } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ExecutivePriorityStack() {
  const { prioritizedItems, cognitiveLoad, signalDensity } = useExecutiveCognitive();
  const [expandDeferred, setExpandDeferred] = useState(false);

  if (prioritizedItems.length === 0) {
    return (
      <div className="card-premium p-6 text-center italic text-muted-foreground border-dashed">
        Sem alertas ou preocupações de governança ativos no momento.
      </div>
    );
  }

  const activeItems = prioritizedItems.filter(item => !item.deferred);
  const deferredItems = prioritizedItems.filter(item => item.deferred);

  return (
    <div className="card-premium p-8 bg-card/45 backdrop-blur-md border border-border/60 space-y-6 animate-executive-fade">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-critical-soft0/10 text-rose-500 rounded-lg">
            <Flame size={18} />
          </div>
          <div>
            <h3 className="text-h3 font-display font-medium tracking-tight text-foreground">Fila de Prioridades Governamentais</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
              Carga Cognitiva: {cognitiveLoad} | Densidade: {signalDensity}
            </p>
          </div>
        </div>
      </div>

      {/* Main Attention List */}
      <div className="space-y-4">
        {activeItems.map((item, idx) => (
          <div 
            key={item.signal.id || idx} 
            className={cn(
              "p-4 rounded-xl border flex justify-between items-start gap-4 transition-all hover:bg-surface-container/20",
              item.priority === 'IMMEDIATE' 
                ? "bg-critical-soft0/5 border-rose-500/25" 
                : "bg-surface-container/40 border-border"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                  item.priority === 'IMMEDIATE'
                    ? "bg-critical-soft0/10 text-rose-500 border-rose-500/20"
                    : item.priority === 'CRITICAL'
                    ? "bg-warning-soft0/10 text-amber-500 border-amber-500/20"
                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                  {item.priority}
                </span>
                <span className="text-[9px] text-muted-foreground font-mono">{item.signal.sourceModule}</span>
              </div>
              <h4 className="text-xs font-semibold text-foreground leading-normal">{item.signal.title}</h4>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">{item.signal.description}</p>
            </div>
            
            <div className="text-right shrink-0">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Urgency</span>
              <p className="text-[10px] font-black uppercase text-foreground mt-0.5">{item.urgency}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Deferred Items Traceability Section */}
      {deferredItems.length > 0 && (
        <div className="pt-4 border-t border-border/40 space-y-4">
          <button
            onClick={() => setExpandDeferred(!expandDeferred)}
            className="flex items-center justify-between w-full p-3 rounded-lg bg-surface-container/60 hover:bg-surface-container border border-border/40 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all"
          >
            <div className="flex items-center gap-2">
              <Bell size={13} />
              <span>
                {expandDeferred 
                  ? "Recolher detalhes comprimidos" 
                  : `Visualizar +${deferredItems.length} sinalizações secundárias comprimidas`}
              </span>
            </div>
            {expandDeferred ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expandDeferred && (
            <div className="space-y-3 pl-2 border-l border-border/60 animate-executive-fade">
              {deferredItems.map((item, idx) => (
                <div key={item.signal.id || idx} className="p-3 bg-surface-container/20 border border-border/30 rounded-lg text-xs flex justify-between items-center gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase text-muted-foreground bg-surface-container border border-border/60 px-1.5 py-0.5 rounded">
                        {item.priority}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60 font-mono">{item.signal.sourceModule}</span>
                    </div>
                    <p className="font-semibold text-foreground">{item.signal.title}</p>
                    <p className="text-muted-foreground leading-normal">{item.signal.description}</p>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground shrink-0">{item.urgency}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
