import React from 'react';
import { UIOrganizationPortfolioItem } from '../../../../viewmodels/advisor/AdvisorWorkspaceViewModel';
import { Briefcase, Activity, AlertTriangle, Search } from 'lucide-react';

interface OrganizationPortfolioPanelProps {
  portfolio: UIOrganizationPortfolioItem[];
  activeOrgId: string | null;
  onSelectOrganization: (orgId: string) => void;
}

export const OrganizationPortfolioPanel: React.FC<OrganizationPortfolioPanelProps> = ({
  portfolio,
  activeOrgId,
  onSelectOrganization
}) => {
  return (
    <div className="card-premium h-full">
      <h3 className="text-eyebrow uppercase tracking-widest mb-4 flex items-center gap-2">
        <Briefcase size={14} /> Carteira Ativa
      </h3>
      
      {portfolio.length === 0 ? (
        <p className="text-sm text-muted-foreground italic p-4 bg-surface-container rounded-lg">
          Nenhuma organização disponível no portfólio.
        </p>
      ) : (
        <div className="space-y-3">
          {portfolio.map(org => {
            const isActive = org.id === activeOrgId;
            return (
              <button
                key={org.id}
                onClick={() => onSelectOrganization(org.id)}
                className={`w-full text-left p-4 rounded-[20px] border transition-colors ${
                  isActive 
                    ? 'bg-primary border-primary' 
                    : 'bg-surface-container border-border hover:bg-surface-container-high'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`text-sm font-display font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                    {org.name}
                  </h4>
                  <span className="text-[9px] font-mono uppercase text-muted-foreground bg-surface-container-high px-2 py-0.5 rounded">
                    {org.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="flex flex-col items-center justify-center p-2 bg-background/50 rounded">
                    <Activity size={12} className="text-emerald-400 mb-1" />
                    <span className="text-[9px] text-muted-foreground uppercase">Estágio</span>
                    <span className="text-[10px] font-bold text-foreground mt-0.5 truncate w-full text-center tabular-nums">{org.governanceStage}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-background/50 rounded">
                    <AlertTriangle size={12} className="text-amber-400 mb-1" />
                    <span className="text-[9px] text-muted-foreground uppercase">Riscos</span>
                    <span className="text-[10px] font-bold text-foreground mt-0.5 tabular-nums">{org.activeRisks}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-background/50 rounded">
                    <Search size={12} className="text-sky-400 mb-1" />
                    <span className="text-[9px] text-muted-foreground uppercase">Invest.</span>
                    <span className="text-[10px] font-bold text-foreground mt-0.5 tabular-nums">{org.activeInvestigations}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
