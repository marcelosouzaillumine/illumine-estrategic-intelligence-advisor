import React from 'react';
import { cn } from '@/lib/utils';
import { Users, Presentation, LineChart } from 'lucide-react';

export function LeadershipLayer({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {/* Board Room Analysis */}
      <div className="relative group overflow-hidden rounded-2xl border border-white/5 bg-[#050506] hover:bg-white/[0.02] transition-colors p-8 flex flex-col justify-between aspect-video md:aspect-[4/3] lg:aspect-[4/3]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 mb-6 group-hover:scale-105 transition-transform">
            <Presentation size={24} className="text-slate-300" />
          </div>
          <h4 className="text-2xl font-bold text-white mb-3">Comitê Executivo</h4>
          <p className="text-base text-slate-400 leading-relaxed">Decisões estratégicas baseadas em simulações do Gêmeo Digital Institucional.</p>
        </div>
      </div>

      {/* Strategic Planning */}
      <div className="relative group overflow-hidden rounded-2xl border border-white/5 bg-[#050506] hover:bg-white/[0.02] transition-colors p-8 flex flex-col justify-between aspect-video md:aspect-[4/3] lg:aspect-[4/3]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 mb-6 group-hover:scale-105 transition-transform">
            <Users size={24} className="text-slate-300" />
          </div>
          <h4 className="text-2xl font-bold text-white mb-3">Conselho de Administração</h4>
          <p className="text-base text-slate-400 leading-relaxed">Supervisão e transparência total com rastreabilidade auditável de longo prazo.</p>
        </div>
      </div>

      {/* Data Driven Leadership */}
      <div className="relative group overflow-hidden rounded-2xl border border-white/5 bg-[#050506] hover:bg-white/[0.02] transition-colors p-8 flex flex-col justify-between aspect-video md:aspect-[4/3] lg:aspect-[4/3]">
        <div className="absolute inset-0 bg-gradient-to-bl from-white/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 mb-6 group-hover:scale-105 transition-transform">
            <LineChart size={24} className="text-slate-300" />
          </div>
          <h4 className="text-2xl font-bold text-white mb-3">Análise de Risco</h4>
          <p className="text-base text-slate-400 leading-relaxed">Modelos preditivos antecipando impactos no fluxo de caixa e valuation.</p>
        </div>
      </div>
    </div>
  );
}
