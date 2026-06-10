import React from 'react';
import { useExecutiveCognitive } from '../../context/executive-cognitive/ExecutiveCognitiveProvider';
import { Eye, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ExecutiveAttentionMap() {
  const { executiveAttentionMap } = useExecutiveCognitive();

  const entries = Object.entries(executiveAttentionMap);

  return (
    <div className="card-premium p-8 bg-card/45 backdrop-blur-md border border-border/60 space-y-6 animate-executive-fade leading-relaxed">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
            <Eye size={18} />
          </div>
          <div>
            <h3 className="text-h3 font-display font-medium tracking-tight text-foreground">Mapa de Atenção Institucional</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Distribuição do foco e sensibilidade por módulo</p>
          </div>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="py-6 text-center italic text-muted-foreground text-xs">
          Aguardando dados de sinalização do Runtime...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {entries.map(([moduleName, weight]) => {
            const level = weight >= 0.85 ? 'crítico' : weight >= 0.65 ? 'alto' : weight >= 0.4 ? 'moderado' : 'baixo';
            return (
              <div 
                key={moduleName} 
                className={cn(
                  "p-4 rounded-xl border flex flex-col justify-between gap-3 bg-surface-container/20 transition-all hover:bg-surface-container/30",
                  level === 'crítico' ? "border-rose-500/25 bg-critical-soft0/[0.02]" : "border-border"
                )}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{moduleName}</span>
                    {level === 'crítico' && <ShieldAlert size={12} className="text-rose-500 animate-pulse" />}
                  </div>
                  <h4 className="text-xs font-semibold text-foreground capitalize mt-1">{level} Foco</h4>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                    <span>Peso de Alocação</span>
                    <span>{(weight * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        level === 'crítico' ? "bg-critical-soft0" : level === 'alto' ? "bg-warning-soft0" : "bg-secondary"
                      )}
                      style={{ width: `${weight * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
