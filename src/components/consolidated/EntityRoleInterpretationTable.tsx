import React from 'react';
import { Building2 } from 'lucide-react';
import { HoldingRoleAnalysis } from '../../services/FiduciaryRuntimeAdapter';

export function EntityRoleInterpretationTable({ roles }: { roles: HoldingRoleAnalysis[] }) {
  if (!roles || roles.length === 0) return null;

  return (
    <div className="bg-white rounded-[32px] p-8 border border-border shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
          <Building2 size={20} className="text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Interpretação por Entidade</h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Papel Institucional Inferido</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Entidade</th>
              <th className="py-3 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Papel Inferred</th>
              <th className="py-3 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Justificativa Runtime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roles.map((role, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="py-4 text-xs font-bold text-muted-foreground">{role.entityId}</td>
                <td className="py-4">
                  <span className="text-[9px] font-black uppercase bg-slate-100 text-muted-foreground px-2 py-1 rounded border border-border">
                    {role.inferredRole.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-4 text-xs font-medium text-muted-foreground max-w-xs">{role.justification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
