import React from 'react';
import { UIOrganizationPortfolioItem } from '../../viewmodels/advisor/AdvisorWorkspaceViewModel';
import { Briefcase, Activity, Target, ShieldAlert } from 'lucide-react';

interface ExecutiveAdvisorDashboardProps {
  portfolio: UIOrganizationPortfolioItem[];
}

export const ExecutiveAdvisorDashboard: React.FC<ExecutiveAdvisorDashboardProps> = ({ portfolio }) => {
  const totalOrgs = portfolio.length;
  const totalInvestigations = portfolio.reduce((acc, org) => acc + org.activeInvestigations, 0);
  const totalRisks = portfolio.reduce((acc, org) => acc + org.activeRisks, 0);
  const totalOpps = portfolio.reduce((acc, org) => acc + org.activeOpportunities, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Organizações */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">Empresas Monitoradas</span>
          <span className="text-h2 font-display font-black text-foreground tabular-nums">{totalOrgs}</span>
        </div>
        <Briefcase size={24} className="text-primary" />
      </div>

      {/* Investigações */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">Investigações Abertas</span>
          <span className="text-h2 font-display font-black text-sky-400 tabular-nums">{totalInvestigations}</span>
        </div>
        <Activity size={24} className="text-sky-400/50" />
      </div>

      {/* Riscos */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">Riscos Agregados</span>
          <span className="text-h2 font-display font-black text-rose-400 tabular-nums">{totalRisks}</span>
        </div>
        <ShieldAlert size={24} className="text-rose-400/50" />
      </div>

      {/* Oportunidades */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">Oportunidades</span>
          <span className="text-h2 font-display font-black text-emerald-400 tabular-nums">{totalOpps}</span>
        </div>
        <Target size={24} className="text-emerald-400/50" />
      </div>
    </div>
  );
};
