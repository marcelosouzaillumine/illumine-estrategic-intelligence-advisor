import React, { useState } from 'react';
import { useExecutiveCognitive } from '../../context/executive-cognitive/ExecutiveCognitiveProvider';
import { Clock, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useExecutiveFormatter } from "../../core/localization";

export function InstitutionalAttentionQueue() {
    const formatter = useExecutiveFormatter();
  const { prioritizedItems } = useExecutiveCognitive();
  const [showDeferred, setShowDeferred] = useState(false);

  if (prioritizedItems.length === 0) {
    return null;
  }

  const itemsToRender = showDeferred 
    ? prioritizedItems 
    : prioritizedItems.filter(item => !item.deferred);

  const deferredCount = prioritizedItems.filter(item => item.deferred).length;

  return (
    <div className="card-premium p-8 bg-card/45 backdrop-blur-md border border-border/60 space-y-6 animate-executive-fade leading-relaxed">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
            <Clock size={18} />
          </div>
          <div>
            <h3 className="text-h3 font-display font-medium tracking-tight text-foreground">Timeline de Atenção Fiduciária</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Fila ordenada de sinais de controle do Runtime</p>
          </div>
        </div>
        {deferredCount > 0 && (
          <button 
            onClick={() => setShowDeferred(!showDeferred)}
            className="flex items-center gap-1.5 px-3 py-1 bg-surface-container border border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            {showDeferred ? <EyeOff size={11} /> : <Eye size={11} />}
            <span>{showDeferred ? "Ocultar secundários" : `Mostrar +${deferredCount} secundários`}</span>
          </button>
        )}
      </div>

      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
        {itemsToRender.map((item, idx) => (
          <div key={item.signal.id || idx} className="relative group space-y-1">
            {/* Dot indicator */}
            <div className={cn(
              "absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full border bg-background transition-transform group-hover:scale-125",
              item.priority === 'IMMEDIATE' 
                ? "border-red-500 bg-red-500/20" 
                : item.priority === 'CRITICAL'
                ? "border-amber-500 bg-warning-soft0/20"
                : "border-secondary bg-secondary/20"
            )}></div>

            <div className="flex items-center gap-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
              <span>{item.signal.timestamp ? formatter.date(item.signal.timestamp, { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
              <span>•</span>
              <span className="text-foreground font-mono">{item.signal.sourceModule}</span>
              <span>•</span>
              <span className={cn(
                item.priority === 'IMMEDIATE' ? "text-red-400" : "text-secondary"
              )}>{item.priority}</span>
            </div>

            <h4 className="text-xs font-semibold text-foreground leading-normal">{item.signal.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">{item.signal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
