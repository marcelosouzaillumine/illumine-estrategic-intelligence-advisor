import React from 'react';
import { Building2 } from 'lucide-react';
import { HoldingRoleAnalysis } from '../../core/runtime/consolidated/advisory/advisoryTypes';

export function EntityRoleInterpretationTable({ roles }: { roles: HoldingRoleAnalysis[] }) {
  if (!roles || roles.length === 0) return null;

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
          <Building2 size={20} className="text-slate-700" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Interpretação por Entidade</h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Papel Institucional Inferido</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">Entidade</th>
              <th className="py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">Papel Inferred</th>
              <th className="py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">Justificativa Runtime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roles.map((role, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="py-4 text-xs font-bold text-slate-700">{role.entityId}</td>
                <td className="py-4">
                  <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                    {role.inferredRole.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-4 text-xs font-medium text-slate-500 max-w-xs">{role.justification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
