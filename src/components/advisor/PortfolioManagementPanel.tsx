import React from 'react';
import { UIOrganizationPortfolioItem } from '../../viewmodels/advisor/AdvisorWorkspaceViewModel';
import { Building2, Plus, ArrowRight } from 'lucide-react';

interface PortfolioManagementPanelProps {
  portfolio: UIOrganizationPortfolioItem[];
}

export const PortfolioManagementPanel: React.FC<PortfolioManagementPanelProps> = ({ portfolio }) => {
  return (
    <div className="bg-primary/40 border border-slate-800 rounded-2xl p-5 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Building2 size={16} className="text-muted-foreground" /> Multi-Organization Management (Read-Only)
        </h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-bold rounded border border-indigo-500/20 transition-colors">
          <Plus size={14} /> Solucionar Nova Organização
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolio.map(org => (
          <div key={org.id} className="p-4 bg-primary border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
            <h4 className="text-sm font-bold text-muted-foreground">{org.name}</h4>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800">
              <span className="text-[10px] text-muted-foreground">Último acesso: {org.lastAccessedAt}</span>
              <button className="text-indigo-400 hover:text-indigo-300">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
