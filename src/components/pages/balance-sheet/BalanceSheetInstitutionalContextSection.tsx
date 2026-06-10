import React from 'react';
import { Building2, Compass, Briefcase, Zap } from 'lucide-react';
import { BalanceSheetInstitutionalContextViewModel } from './view-models';

export function BalanceSheetInstitutionalContextSection({
  context
}: {
  context: BalanceSheetInstitutionalContextViewModel;
}) {
  return (
    <div className="bg-surface-container/30 rounded-[32px] p-6 md:p-8 border border-border mt-8 mb-12 relative overflow-hidden">
      <h3 className="text-xl font-black text-primary mb-6">Contexto Institucional da Operação</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Segmento */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               <Building2 size={18} />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Segmento de Atuação</span>
           </div>
           <span className="text-lg font-black text-primary">{context.segment}</span>
        </div>

        {/* Modelo de Negócio */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
               <Briefcase size={18} />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Modelo de Negócio</span>
           </div>
           <span className="text-lg font-black text-foreground">{context.businessModel}</span>
        </div>

        {/* Maturidade */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
               <Compass size={18} />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Grau de Maturidade</span>
           </div>
           <span className="text-lg font-black text-foreground">{context.stage}</span>
        </div>

        {/* Intensidade de Capital */}
        <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600">
               <Zap size={18} />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Intensidade de Capital</span>
           </div>
           <span className="text-lg font-black text-foreground">{context.capitalIntensity}</span>
        </div>

      </div>
    </div>
  );
}
