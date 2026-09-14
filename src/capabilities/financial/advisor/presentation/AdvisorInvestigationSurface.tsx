import React from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { AdvisorNavigationEngine } from '../../../../core/advisor/AdvisorNavigationEngine';
import { useNavigate } from 'react-router-dom';

interface AdvisorInvestigationSurfaceProps {
  organizationId: string | null;
}

export const AdvisorInvestigationSurface: React.FC<AdvisorInvestigationSurfaceProps> = ({ organizationId }) => {
  const navigate = useNavigate();

  return (
    <div className="card-premium h-full flex flex-col">
      
      <div className="flex justify-between items-start">
        <h3 className="text-eyebrow uppercase tracking-widest flex items-center gap-2">
          <Search size={14} /> Investigações Abertas
        </h3>
      </div>

      {!organizationId ? (
        <p className="text-sm text-muted-foreground italic p-4 bg-surface-container rounded-lg text-center mt-4">
          Selecione uma organização para visualizar as investigações.
        </p>
      ) : (
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground italic">
            Navegue pelas anomalias persistidas no Knowledge Graph usando o ambiente de investigação corporativo.
          </p>

          <button 
            onClick={() => AdvisorNavigationEngine.navigateToInvestigation(navigate, 'SYSTEM', 'root')}
            className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high rounded-xl border border-border transition-colors"
          >
            <div className="text-left">
              <h5 className="text-sm font-display font-medium text-foreground">Board Investigation Workspace</h5>
              <p className="text-sm text-muted-foreground mt-1">Explorar Grafo Causal</p>
            </div>
            <ExternalLink size={16} className="text-muted-foreground" />
          </button>
        </div>
      )}

    </div>
  );
};
