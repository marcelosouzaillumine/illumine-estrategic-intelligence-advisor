import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';

export function CriticalEmissionBlocker({ reason }: { reason: string }) {
  return (
    <div className="bg-rose-600 text-white rounded-[32px] p-10 border border-rose-700 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="w-20 h-20 bg-rose-500/50 rounded-full flex items-center justify-center mb-6 relative z-10 border border-rose-400">
        <Lock size={32} className="text-white" />
      </div>
      
      <h2 className="text-2xl font-black uppercase tracking-widest mb-3 relative z-10">Emissão Bloqueada</h2>
      <p className="text-rose-100 font-medium max-w-xl mx-auto relative z-10 mb-6">
        O Runtime de Governança Consolidada detectou uma violação de integridade crítica. A emissão de relatórios executivos foi suspensa para evitar contaminação fiduciária.
      </p>
      
      <div className="bg-black/20 p-4 rounded-xl border border-black/10 inline-flex items-center gap-3 relative z-10">
        <ShieldAlert size={16} className="text-rose-300" />
        <span className="text-sm font-bold text-white">{reason}</span>
      </div>
    </div>
  );
}
