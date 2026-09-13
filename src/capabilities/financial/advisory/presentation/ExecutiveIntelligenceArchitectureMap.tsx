import React from 'react';
import { IntelligenceDomainState } from '../../../../intelligence/executive-operating-model/executive-operating-model.types';

interface ExecutiveIntelligenceArchitectureMapProps {
  domains: IntelligenceDomainState[];
}

export function ExecutiveIntelligenceArchitectureMap({ domains }: ExecutiveIntelligenceArchitectureMapProps) {
  
  const getStatusStyles = (status: IntelligenceDomainState['status']) => {
    switch (status) {
      case 'established':
        return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400';
      case 'developing':
        return 'border-amber-500/30 bg-amber-500/5 text-amber-400';
      case 'future':
        return 'border-white/5 bg-transparent text-slate-500';
      default:
        return 'border-white/5 bg-transparent text-slate-500';
    }
  };

  const getGlow = (status: IntelligenceDomainState['status']) => {
    if (status === 'established') return 'shadow-[0_0_15px_rgba(16,185,129,0.1)]';
    if (status === 'developing') return 'shadow-[0_0_15px_rgba(245,158,11,0.1)]';
    return '';
  };

  return (
    <div className="w-full relative py-12 flex flex-col items-center justify-center border-y border-white/5 bg-gradient-to-b from-[#0A0A0A]/0 via-[#0A0A0A]/50 to-[#0A0A0A]/0 mb-12">
      
      {/* Top Node: Executive Advisory */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="w-px h-8 bg-gradient-to-t from-blue-500/20 to-transparent mb-4" />
        <div className="px-6 py-2 rounded-full border border-blue-500/30 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center justify-center">
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-blue-400">
            Executive Advisory Governance™
                                </span>
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-blue-500/20 to-transparent mt-4" />
      </div>

      {/* Intelligence Layer Concept */}
      <div className="w-full max-w-4xl px-4 relative z-10">
        <div className="absolute inset-0 bg-white/5 rounded-3xl blur-2xl -z-10" />
        
        <div className="text-center mb-6">
          <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">
            Executive Governance Layer
                                </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {domains.map(domain => {
             const styles = getStatusStyles(domain.status);
             const glow = getGlow(domain.status);
             const name = domain.domain.charAt(0).toUpperCase() + domain.domain.slice(1) + ' Governance™';
             
             return (
               <div key={domain.domain} className={`p-5 rounded-2xl border transition-all duration-700 ease-out ${styles} ${glow} flex flex-col items-center text-center relative overflow-hidden group`}>
                 
                 {/* Internal Glow for active ones */}
                 {domain.status !== 'future' && (
                   <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
                 )}

                 <span className="text-xs font-semibold uppercase tracking-widest mb-3">
                   {name}
                 </span>

                 {domain.status === 'future' ? (
                   <div className="mt-auto">
                     <span className="text-[9px] uppercase tracking-widest text-slate-600 block mb-1">
                       Future Evolution Layer
                     </span>
                     <span className="text-[10px] text-slate-500">
                       Recommended Next Capability
                     </span>
                   </div>
                 ) : (
                   <div className="mt-auto">
                     <span className="text-[9px] uppercase tracking-widest text-slate-500 block mb-1">
                       {domain.status === 'established' ? 'Established Capability' : 'Developing Capability'}
                     </span>
                     <span className={`text-[10px] font-medium ${domain.status === 'established' ? 'text-emerald-300' : 'text-amber-300'}`}>
                       {domain.currentCapability}
                     </span>
                   </div>
                 )}
               </div>
             );
          })}
        </div>
      </div>

      {/* Base Node: Enterprise Data Foundation */}
      <div className="relative z-10 flex flex-col items-center mt-8">
        <div className="w-px h-8 bg-gradient-to-t from-transparent to-slate-500/20 mb-4" />
        <div className="text-center">
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-slate-600">
            Enterprise Data Foundation™
          </span>
        </div>
      </div>

      {/* Decorative organic background elements */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 -z-20 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 -z-20 pointer-events-none" />

    </div>
  );
}
