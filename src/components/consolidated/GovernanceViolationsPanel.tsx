import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { RuntimeViolation } from '../../runtime/types';

export function GovernanceViolationsPanel({ violations }: { violations: RuntimeViolation[] }) {
  if (!violations || violations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm mt-8">
      <h3 className="text-sm font-black text-rose-700 uppercase tracking-widest mb-4 flex items-center gap-2">
        <AlertOctagon size={16} />
        Violações de Governança
      </h3>
      <div className="space-y-3">
        {violations.map((v, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-critical-soft border border-rose-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-200 text-rose-800">
                {v.severity}
              </span>
              <span className="text-xs font-bold text-muted-foreground">{v.rule}</span>
            </div>
            <p className="text-xs text-rose-600 font-medium">{v.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
