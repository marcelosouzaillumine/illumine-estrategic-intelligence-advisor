import React from 'react';
import { ShieldCheck, Calendar, Zap, AlertCircle } from 'lucide-react';

export function SubscriptionStatusCard({ planName, status, isDemo }: { planName: string, status: string, isDemo: boolean }) {
  return (
    <div className="p-6 bg-surface-container border border-border rounded-lg space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {status === 'ACTIVE' ? <ShieldCheck className="text-primary" /> : <AlertCircle className="text-amber-500" />}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Plano Atual</h3>
          <div className="text-2xl font-bold text-foreground flex items-center gap-2">
            {planName} 
            {isDemo && <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase font-bold tracking-widest border border-amber-500/20">Modo Demo</span>}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 border-t border-border pt-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Status da Assinatura</div>
          <div className="text-sm font-medium flex items-center gap-1.5 text-emerald-500">
            <Zap size={14} /> {status}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Próxima Renovação</div>
          <div className="text-sm font-medium flex items-center gap-1.5 text-foreground">
            <Calendar size={14} /> N/A (MVP Mock)
          </div>
        </div>
      </div>
    </div>
  );
}
