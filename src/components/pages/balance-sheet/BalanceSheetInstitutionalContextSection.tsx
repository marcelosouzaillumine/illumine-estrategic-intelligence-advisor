import React from 'react';
import { Building2, Compass, Briefcase, Zap } from 'lucide-react';
import { BalanceSheetInstitutionalContextViewModel } from './view-models';
import { ExecutiveSurface } from '../../ui/executive-surface';

export function BalanceSheetInstitutionalContextSection({
  context
}: {
  context: BalanceSheetInstitutionalContextViewModel;
}) {
  return (
    <ExecutiveSurface variant="transparent" padding="none" className="bg-surface-container/30 rounded-[32px] p-6 md:p-8 border border-border mt-8 mb-12 relative overflow-hidden w-full flex flex-col items-start justify-start">
      <h3 className="text-xl font-bold text-foreground mb-6">Contexto Institucional da Operação</h3>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Segmento */}
        <ExecutiveSurface padding="none" className="p-5 rounded-2xl shadow-sm flex flex-col items-start justify-start w-full">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               <Building2 size={18} />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70">Segmento de Atuação</span>
           </div>
           <span className="text-lg font-bold text-foreground">{context.segment}</span>
        </ExecutiveSurface>

        {/* Modelo de Negócio */}
        <ExecutiveSurface padding="none" className="p-5 rounded-2xl shadow-sm flex flex-col items-start justify-start w-full">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
               <Briefcase size={18} />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70">Modelo de Negócio</span>
           </div>
           <span className="text-lg font-bold text-foreground">{context.businessModel}</span>
        </ExecutiveSurface>

        {/* Maturidade */}
        <ExecutiveSurface padding="none" className="p-5 rounded-2xl shadow-sm flex flex-col items-start justify-start w-full">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
               <Compass size={18} />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70">Grau de Maturidade</span>
           </div>
           <span className="text-lg font-bold text-foreground">{context.stage}</span>
        </ExecutiveSurface>

        {/* Intensidade de Capital */}
        <ExecutiveSurface padding="none" className="p-5 rounded-2xl shadow-sm flex flex-col items-start justify-start w-full">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600">
               <Zap size={18} />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70">Intensidade de Capital</span>
           </div>
           <span className="text-lg font-bold text-foreground">{context.capitalIntensity}</span>
        </ExecutiveSurface>

      </div>
    </ExecutiveSurface>
  );
}
