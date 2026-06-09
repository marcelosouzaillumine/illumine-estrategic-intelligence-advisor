import React from 'react';
import { Database, FileText, Activity, Layers } from 'lucide-react';

export const InstitutionalMemoryDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-lg">
          <Database size={24} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total de Registros</p>
          <span className="text-2xl font-black text-slate-200">0</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
        <div className="p-3 bg-sky-500/10 rounded-lg">
          <FileText size={24} className="text-sky-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total de Evidências</p>
          <span className="text-2xl font-black text-slate-200">0</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
        <div className="p-3 bg-amber-500/10 rounded-lg">
          <Activity size={24} className="text-amber-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recorrências</p>
          <span className="text-2xl font-black text-slate-200">0</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
        <div className="p-3 bg-indigo-500/10 rounded-lg">
          <Layers size={24} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Domínios Rastreados</p>
          <span className="text-2xl font-black text-slate-200">0</span>
        </div>
      </div>
    </div>
  );
};
