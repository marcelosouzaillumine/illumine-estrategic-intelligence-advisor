import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { GovernanceReportingSection } from '../../services/FiduciaryRuntimeAdapter';
// src/components/institutional-reporting/GovernanceReportingSurface.tsx


export function GovernanceReportingSurface({ data }: { data: GovernanceReportingSection }) {
  const { translateLabel: t } = useLanguage();
  const isCompliant = data.complianceStatus === 'COMPLIANT';

  return (
    <div className={`border p-6 rounded-lg font-mono ${isCompliant ? 'bg-zinc-950 border-zinc-800' : 'bg-orange-950/20 border-orange-900/50'}`}>
      <h2 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <ShieldCheck size={14} /> Institutional Governance
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.compliance_status")}</span>
          <span className={`text-lg font-bold uppercase tracking-widest ${isCompliant ? 'text-emerald-400' : 'text-orange-400'}`}>
            {data.complianceStatus}
          </span>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mt-4 block mb-1">{t("panels.execution_integrity")}</span>
          <span className="text-xs text-zinc-300 font-bold uppercase tracking-widest">
            {data.executionIntegrity}
          </span>
        </div>

        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">{t("panels.active_governance_locks")}</span>
          {data.activeGovernanceLocks.length > 0 ? (
            <div className="space-y-2">
              {data.activeGovernanceLocks.map((lock, idx) => (
                <div key={idx} className="bg-rose-950/40 border border-rose-900/50 p-2 rounded flex items-center gap-2">
                  <Lock size={12} className="text-rose-500" />
                  <span className="text-[10px] text-rose-400 font-bold tracking-widest uppercase">{lock}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">NO ACTIVE LOCKS</span>
          )}
        </div>
      </div>
    </div>
  );
}
