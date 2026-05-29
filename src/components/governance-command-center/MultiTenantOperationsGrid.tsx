import React from 'react';
import { useCommandCenter } from '../../context/governance-command-center/GovernanceCommandCenterProvider';
import { useTenancy } from '../../context/TenancyProvider';

export const MultiTenantOperationsGrid: React.FC = () => {
  const { tenantSupervisionMap } = useCommandCenter();
  const { context } = useTenancy();

  // Verificar se o usuário possui a autorização de assessor ou administrador master
  const isAuthorized = context?.role === 'MASTER_ADMIN' || context?.role === 'ADVISOR';

  if (!isAuthorized) {
    return (
      <div className="p-6 bg-slate-950/70 border border-rose-500/20 rounded-xl space-y-3">
        <div className="flex justify-between items-center border-b border-slate-850 pb-2">
          <h4 className="text-slate-500 font-semibold tracking-wider uppercase text-xs font-mono">
            Multi-Tenant Supervision Grid
          </h4>
          <span className="text-[9px] font-mono text-rose-500 uppercase font-bold">
            ACCESS RESTRICTED
          </span>
        </div>
        <div className="p-5 bg-rose-950/10 border border-rose-500/20 rounded-lg text-center">
          <p className="text-slate-400 text-xs font-mono leading-relaxed">
            ⚠️ <span className="text-rose-400 font-bold">RESTRIÇÃO DE ACESSO</span>: A visualização agregada de múltiplos inquilinos é exclusiva para perfis fiduciários MASTER_ADMIN ou ADVISOR. Seu escopo atual ({context?.role || 'N/A'}) não possui essa prerrogativa.
          </p>
        </div>
      </div>
    );
  }

  if (!tenantSupervisionMap) {
    return (
      <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
        CARREGANDO MAPA DE OPERAÇÕES MULTI-TENANT...
      </div>
    );
  }

  const { activeTenantsCount, tenantStressMap, crossTenantRiskTrends } = tenantSupervisionMap;

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          Multi-Tenant Supervision Grid
        </h4>
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          {activeTenantsCount} ACTIVE TENANTS
        </span>
      </div>

      <div className="space-y-3">
        {Object.entries(tenantStressMap).map(([tId, stress]) => (
          <div key={tId} className="flex justify-between items-center p-3.5 bg-slate-900/40 border border-slate-850 rounded-lg hover:border-slate-800 transition-all font-mono text-xs">
            <span className="text-slate-350">Tenant ID: <span className="font-bold text-slate-200">{tId}</span></span>
            <div className="flex items-center gap-3">
              <span className="text-slate-450">Stress Index:</span>
              <span className={`font-bold px-2 py-0.5 rounded border text-[11px] ${
                stress > 60
                  ? 'text-rose-400 bg-rose-950/20 border-rose-500/20'
                  : stress > 30
                  ? 'text-amber-400 bg-amber-950/20 border-amber-500/20'
                  : 'text-emerald-400 bg-emerald-950/20 border-emerald-500/20'
              }`}>
                {stress}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3.5 bg-slate-900/30 border border-slate-850 rounded-xl space-y-2">
        <span className="text-[9px] font-mono text-slate-500 uppercase block">CROSS-TENANT RISK TRENDS</span>
        <ul className="list-disc list-inside text-[11px] text-slate-400 leading-relaxed space-y-1.5 font-sans">
          {crossTenantRiskTrends.map((trend, idx) => (
            <li key={idx} className="marker:text-slate-600">{trend}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
