import React from 'react';
import { Activity, ShieldAlert } from 'lucide-react';
import { SystemicRisk } from '../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../lib/utils';

export function SystemicRisksPanel({ risks }: { risks: SystemicRisk[] }) {
  if (!risks || risks.length === 0) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-border shadow-sm">
        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity size={16} className="text-emerald-500" />
          Risco Sistêmico
        </h3>
        <p className="text-xs text-muted-foreground font-medium">Nenhum risco sistêmico de asfixia detectado na estrutura topológica atual.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-8 border border-border shadow-sm">
      <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
        <Activity size={16} className="text-rose-500" />
        Risco Sistêmico e Contágio
      </h3>
      <div className="space-y-4">
        {risks.map((risk, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-rose-100 bg-critical-soft/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                {risk.riskType.replace(/_/g, ' ')}
              </span>
              <span className={cn(
                "text-[9px] font-bold uppercase",
                risk.severity === 'CRITICAL' || risk.severity === 'SEVERE' ? 'text-rose-600' : 'text-amber-600'
              )}>
                {risk.severity}
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              {risk.description}
            </p>
            {risk.potentialDominoEffect && (
              <div className="flex items-center gap-2 mt-2 pt-3 border-t border-rose-100/50">
                <ShieldAlert size={14} className="text-rose-500" />
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">
                  ALERTA: Potencial Efeito Dominó (Trigger: {risk.triggerEntityId})
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
