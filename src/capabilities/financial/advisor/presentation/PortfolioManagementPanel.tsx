import React from 'react';
import { UIOrganizationPortfolioItem } from '../../../../viewmodels/advisor/AdvisorWorkspaceViewModel';
import { Building2, Plus, ArrowRight } from 'lucide-react';

interface PortfolioManagementPanelProps {
  portfolio: UIOrganizationPortfolioItem[];
}

export const PortfolioManagementPanel: React.FC<PortfolioManagementPanelProps> = ({ portfolio }) => {
  return (
    <div className="bg-primary/40 border border-border rounded-2xl p-5 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
          <Building2 size={16} className="text-muted-foreground" /> Multi-Organization Management (Read-Only)
        </h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent text-accent text-sm font-bold rounded border border-accent transition-colors">
          <Plus size={14} /> Solucionar Nova Organização
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolio.map(org => (
          <div key={org.id} className="p-4 bg-primary border border-border rounded-xl hover:border-border transition-colors">
            <h4 className="text-sm font-bold text-muted-foreground">{org.name}</h4>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
              <span className="text-[10px] text-muted-foreground">Último acesso: {org.lastAccessedAt}</span>
              <button className="text-accent hover:text-accent">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
